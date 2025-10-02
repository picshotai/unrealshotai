import { useState, useCallback, useRef } from "react";
import type {
  Annotation,
  AnnotationHistory,
  MaskStroke,
  Point,
  ToolType,
  DrawAnnotation,
  ArrowAnnotation,
  TextAnnotation,
  ImageAnnotation,
} from "@/types/photo-editor";
import { generateId } from "@/utils/photo-editor/id";

interface UseAnnotationsProps {
  maxHistorySize?: number;
}

export const useAnnotations = ({
  maxHistorySize = 50,
}: UseAnnotationsProps = {}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [maskStrokes, setMaskStrokes] = useState<MaskStroke[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // History management
  const [history, setHistory] = useState<AnnotationHistory[]>([
    { annotations: [], maskStrokes: [] },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Selection states
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | null
  >(null);

  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<
    "annotation" | "arrow-start" | "arrow-end" | null
  >(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0, timestamp: Date.now() });

  // Refs for drawing state
  const startPos = useRef<Point>({ x: 0, y: 0, timestamp: Date.now() });
  const currentMousePos = useRef<Point>({ x: 0, y: 0, timestamp: Date.now() });

  // Add to history
  const addToHistory = useCallback(
    (newAnnotations: Annotation[], newMaskStrokes: MaskStroke[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({
          annotations: [...newAnnotations],
          maskStrokes: [...newMaskStrokes],
        });

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          return newHistory;
        }

        return newHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, maxHistorySize - 1));
    },
    [historyIndex, maxHistorySize]
  );

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setAnnotations(state.annotations);
      setMaskStrokes(state.maskStrokes);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setAnnotations(state.annotations);
      setMaskStrokes(state.maskStrokes);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  // Clear all annotations
  const clearAll = useCallback(() => {
    setAnnotations([]);
    setMaskStrokes([]);
    setCurrentPath([]);
    setSelectedAnnotationId(null);
    addToHistory([], []);
  }, [addToHistory]);

  // Add draw annotation
  const addDrawAnnotation = useCallback(
    (path: Point[], color: string, thickness: number) => {
      if (path.length < 2) return;

      const annotation: DrawAnnotation = {
        id: generateId(),
        type: "draw",
        path,
        color,
        thickness,
        timestamp: Date.now(),
      };

      const newAnnotations = [...annotations, annotation];
      setAnnotations(newAnnotations);
      addToHistory(newAnnotations, maskStrokes);
    },
    [annotations, maskStrokes, addToHistory]
  );

  // Add arrow annotation
  const addArrowAnnotation = useCallback(
    (start: Point, end: Point, color: string, thickness: number) => {
      const annotation: ArrowAnnotation = {
        id: generateId(),
        type: "arrow",
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y,
        color,
        thickness,
        timestamp: Date.now(),
      };

      const newAnnotations = [...annotations, annotation];
      setAnnotations(newAnnotations);
      addToHistory(newAnnotations, maskStrokes);
    },
    [annotations, maskStrokes, addToHistory]
  );

  // Add text annotation
  const addTextAnnotation = useCallback(
    (x: number, y: number, text: string, color: string, fontSize: number) => {
      const annotation: TextAnnotation = {
        id: generateId(),
        type: "text",
        x,
        y,
        text,
        color,
        fontSize,
        timestamp: Date.now(),
      };

      const newAnnotations = [...annotations, annotation];
      setAnnotations(newAnnotations);
      addToHistory(newAnnotations, maskStrokes);
    },
    [annotations, maskStrokes, addToHistory]
  );

  // Add image annotation
  const addImageAnnotation = useCallback(
    (
      x: number,
      y: number,
      width: number,
      height: number,
      imageElement: HTMLImageElement,
      rotation: number = 0
    ) => {
      const annotation: ImageAnnotation = {
        id: generateId(),
        type: "image",
        x,
        y,
        width,
        height,
        rotation,
        imageElement,
        timestamp: Date.now(),
      };

      const newAnnotations = [...annotations, annotation];
      setAnnotations(newAnnotations);
      addToHistory(newAnnotations, maskStrokes);
    },
    [annotations, maskStrokes, addToHistory]
  );

  // Update text annotation
  const updateTextAnnotation = useCallback(
    (id: string, updates: Partial<TextAnnotation>) => {
      const newAnnotations = annotations.map((ann) =>
        ann.id === id && ann.type === "text" ? { ...ann, ...updates } : ann
      );
      setAnnotations(newAnnotations);
      addToHistory(newAnnotations, maskStrokes);
    },
    [annotations, maskStrokes, addToHistory]
  );

  // Delete annotation
  const deleteAnnotation = useCallback(
    (id: string) => {
      const newAnnotations = annotations.filter((ann) => ann.id !== id);
      setAnnotations(newAnnotations);
      setSelectedAnnotationId(null);
      addToHistory(newAnnotations, maskStrokes);
    },
    [annotations, maskStrokes, addToHistory]
  );

  // Add mask strokes
  const addMaskStrokes = useCallback(
    (strokes: MaskStroke[]) => {
      const newMaskStrokes = [...maskStrokes, ...strokes];
      setMaskStrokes(newMaskStrokes);
      addToHistory(annotations, newMaskStrokes);
    },
    [annotations, maskStrokes, addToHistory]
  );

  // Clear mask strokes
  const clearMaskStrokes = useCallback(() => {
    setMaskStrokes([]);
    addToHistory(annotations, []);
  }, [annotations, addToHistory]);

  // Start drawing
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setCurrentPath([point]);
    startPos.current = point;
    currentMousePos.current = point;
  }, []);

  // Continue drawing
  const continueDrawing = useCallback(
    (point: Point) => {
      if (!isDrawing) return;

      currentMousePos.current = point;

      if (activeTool === "draw" || activeTool === "mask") {
        setCurrentPath((prev) => [...prev, point]);
      }
    },
    [isDrawing, activeTool]
  );

  // End drawing
  const endDrawing = useCallback(
    (point: Point, color: string, thickness: number) => {
      if (!isDrawing) return;

      setIsDrawing(false);
      currentMousePos.current = point;

      if (activeTool === "draw" && currentPath.length > 1) {
        addDrawAnnotation(currentPath, color, thickness);
      } else if (activeTool === "arrow") {
        addArrowAnnotation(startPos.current, point, color, thickness);
      } else if (activeTool === "mask" && currentPath.length > 0) {
        const maskStroke: MaskStroke = {
          path: currentPath,
          brushSize: thickness,
        };
        addMaskStrokes([maskStroke]);
      }

      setCurrentPath([]);
    },
    [
      isDrawing,
      activeTool,
      currentPath,
      addDrawAnnotation,
      addArrowAnnotation,
      addMaskStrokes,
    ]
  );

  return {
    // State
    annotations,
    maskStrokes,
    activeTool,
    isDrawing,
    currentPath,
    selectedAnnotationId,
    isDragging,
    dragType,

    // History
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,

    // Drawing state
    startPos: startPos.current,
    currentMousePos: currentMousePos.current,

    // Actions
    setActiveTool,
    setSelectedAnnotationId,
    startDrawing,
    continueDrawing,
    endDrawing,

    // Annotation management
    addTextAnnotation,
    addImageAnnotation,
    updateTextAnnotation,
    deleteAnnotation,
    clearAll,

    // Mask management
    clearMaskStrokes,

    // History
    undo,
    redo,
  };
};
import { useRef, useEffect, useCallback } from "react";
import type {
  Annotation,
  MaskStroke,
  Point,
  ToolType,
  CanvasDimensions,
  DrawAnnotation,
  ArrowAnnotation,
  TextAnnotation,
  ImageAnnotation,
} from "@/types/photo-editor";
import { getCanvasCoordinates } from "@/utils/photo-editor/canvas";

interface UseCanvasProps {
  dimensions: CanvasDimensions;
  annotations: Annotation[];
  maskStrokes: MaskStroke[];
  currentPath: Point[];
  isDrawing: boolean;
  activeTool: ToolType;
  startPos: Point;
  currentMousePos: Point;
  selectedAnnotationId: string | null;
  isDragging: boolean;
  dragType: "annotation" | "arrow-start" | "arrow-end" | null;
  image?: HTMLImageElement;
  colors: {
    draw: string;
    arrow: string;
    text: string;
    mask: string;
  };
  sizes: {
    draw: number;
    arrow: number;
    text: number;
    mask: number;
  };
}

export const useCanvas = ({
  dimensions,
  annotations,
  maskStrokes,
  currentPath,
  isDrawing,
  activeTool,
  startPos,
  currentMousePos,
  selectedAnnotationId,
  isDragging,
  dragType,
  image,
  colors,
  sizes,
}: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw on canvas
  const drawOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image if available
    if (image) {
      ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);
    }

    // Draw annotations
    annotations.forEach((annotation) => {
      switch (annotation.type) {
        case "draw":
          drawDrawAnnotation(ctx, annotation as DrawAnnotation);
          break;
        case "arrow":
          drawArrowAnnotation(ctx, annotation as ArrowAnnotation);
          break;
        case "text":
          drawTextAnnotation(ctx, annotation as TextAnnotation);
          break;
        case "image":
          drawImageAnnotation(ctx, annotation as ImageAnnotation);
          break;
      }

      // Draw selection indicator
      if (annotation.id === selectedAnnotationId) {
        drawSelectionIndicator(ctx, annotation);
      }
    });

    // Draw current path for draw and mask tools
    if (isDrawing && (activeTool === "draw" || activeTool === "mask")) {
      drawCurrentPath(ctx, currentPath, activeTool, colors, sizes);
    }

    // Draw arrow preview
    if (isDrawing && activeTool === "arrow") {
      drawArrowPreview(ctx, startPos, currentMousePos, colors.arrow, sizes.arrow);
    }

    // Draw mask overlay
    drawMaskOverlay();
  }, [
    dimensions,
    annotations,
    currentPath,
    isDrawing,
    activeTool,
    startPos,
    currentMousePos,
    selectedAnnotationId,
    image,
    colors,
    sizes,
    maskStrokes,
  ]);

  // Draw draw annotation
  const drawDrawAnnotation = (ctx: CanvasRenderingContext2D, annotation: DrawAnnotation) => {
    if (annotation.path.length < 2) return;

    ctx.strokeStyle = annotation.color;
    ctx.lineWidth = annotation.thickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(annotation.path[0].x, annotation.path[0].y);

    for (let i = 1; i < annotation.path.length; i++) {
      ctx.lineTo(annotation.path[i].x, annotation.path[i].y);
    }

    ctx.stroke();
  };

  // Draw arrow annotation
  const drawArrowAnnotation = (ctx: CanvasRenderingContext2D, annotation: ArrowAnnotation) => {
    ctx.strokeStyle = annotation.color;
    ctx.fillStyle = annotation.color;
    ctx.lineWidth = annotation.thickness;
    ctx.lineCap = "round";

    // Draw line
    ctx.beginPath();
    ctx.moveTo(annotation.startX, annotation.startY);
    ctx.lineTo(annotation.endX, annotation.endY);
    ctx.stroke();

    // Draw arrowhead
    drawArrowhead(ctx, annotation.startX, annotation.startY, annotation.endX, annotation.endY, annotation.thickness);
  };

  // Draw text annotation
  const drawTextAnnotation = (ctx: CanvasRenderingContext2D, annotation: TextAnnotation) => {
    ctx.fillStyle = annotation.color;
    ctx.font = `${annotation.fontSize}px Arial`;
    ctx.textBaseline = "top";

    const lines = annotation.text.split("\n");
    lines.forEach((line, index) => {
      ctx.fillText(line, annotation.x, annotation.y + index * annotation.fontSize * 1.2);
    });
  };

  // Draw image annotation
  const drawImageAnnotation = (ctx: CanvasRenderingContext2D, annotation: ImageAnnotation) => {
    if (!annotation.imageElement) return;

    ctx.save();

    // Apply rotation if needed
    if (annotation.rotation !== 0) {
      const centerX = annotation.x + annotation.width / 2;
      const centerY = annotation.y + annotation.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((annotation.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    ctx.drawImage(
      annotation.imageElement,
      annotation.x,
      annotation.y,
      annotation.width,
      annotation.height
    );

    ctx.restore();
  };

  // Draw selection indicator
  const drawSelectionIndicator = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    let bounds: { x: number; y: number; width: number; height: number };

    switch (annotation.type) {
      case "draw":
        const drawAnn = annotation as DrawAnnotation;
        if (drawAnn.path.length === 0) return;
        
        const minX = Math.min(...drawAnn.path.map(p => p.x));
        const maxX = Math.max(...drawAnn.path.map(p => p.x));
        const minY = Math.min(...drawAnn.path.map(p => p.y));
        const maxY = Math.max(...drawAnn.path.map(p => p.y));
        
        bounds = {
          x: minX - 10,
          y: minY - 10,
          width: maxX - minX + 20,
          height: maxY - minY + 20,
        };
        break;

      case "arrow":
        const arrowAnn = annotation as ArrowAnnotation;
        const arrowMinX = Math.min(arrowAnn.startX, arrowAnn.endX);
        const arrowMaxX = Math.max(arrowAnn.startX, arrowAnn.endX);
        const arrowMinY = Math.min(arrowAnn.startY, arrowAnn.endY);
        const arrowMaxY = Math.max(arrowAnn.startY, arrowAnn.endY);
        
        bounds = {
          x: arrowMinX - 10,
          y: arrowMinY - 10,
          width: arrowMaxX - arrowMinX + 20,
          height: arrowMaxY - arrowMinY + 20,
        };
        break;

      case "text":
        const textAnn = annotation as TextAnnotation;
        const textWidth = ctx.measureText(textAnn.text).width;
        const textHeight = textAnn.fontSize * textAnn.text.split("\n").length * 1.2;
        
        bounds = {
          x: textAnn.x - 5,
          y: textAnn.y - 5,
          width: textWidth + 10,
          height: textHeight + 10,
        };
        break;

      case "image":
        const imageAnn = annotation as ImageAnnotation;
        bounds = {
          x: imageAnn.x - 5,
          y: imageAnn.y - 5,
          width: imageAnn.width + 10,
          height: imageAnn.height + 10,
        };
        break;

      default:
        return;
    }

    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.setLineDash([]);
  };

  // Draw current path
  const drawCurrentPath = (
    ctx: CanvasRenderingContext2D,
    path: Point[],
    tool: ToolType,
    colors: any,
    sizes: any
  ) => {
    if (path.length < 2) return;

    // For mask tool, we do not draw on the main canvas.
    // The mask overlay will render the live preview from currentPath.
    if (tool !== "draw") return;

    const color = colors.draw;
    const size = sizes.draw;

    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }

    ctx.stroke();
  };

  // Draw arrow preview
  const drawArrowPreview = (
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point,
    color: string,
    thickness: number
  ) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.7;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Draw arrowhead
    drawArrowhead(ctx, start.x, start.y, end.x, end.y, thickness);

    ctx.globalAlpha = 1;
  };

  // Draw arrowhead
  const drawArrowhead = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    thickness: number
  ) => {
    const headLength = Math.max(10, thickness * 2);
    const angle = Math.atan2(endY - startY, endX - startX);

    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  // Create and draw mask overlay
  const drawMaskOverlay = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    // Clear mask canvas
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Helper to draw a smooth stroke path
    const drawStrokePath = (path: Point[], lineWidth: number, strokeStyle: string) => {
      if (path.length < 2) return;
      maskCtx.strokeStyle = strokeStyle;
      maskCtx.lineWidth = lineWidth;
      maskCtx.lineCap = "round";
      maskCtx.lineJoin = "round";
      maskCtx.globalCompositeOperation = "source-over";

      maskCtx.beginPath();
      maskCtx.moveTo(path[0].x, path[0].y);

      // Quadratic smoothing using midpoints
      for (let i = 1; i < path.length - 1; i++) {
        const midX = (path[i].x + path[i + 1].x) / 2;
        const midY = (path[i].y + path[i + 1].y) / 2;
        maskCtx.quadraticCurveTo(path[i].x, path[i].y, midX, midY);
      }

      // Draw last segment
      const last = path[path.length - 1];
      maskCtx.lineTo(last.x, last.y);
      maskCtx.stroke();
    };

    // Draw committed mask strokes
    maskStrokes.forEach((stroke) => {
      drawStrokePath(stroke.path, stroke.brushSize, colors.mask);
    });

    // Draw live drawing path for mask tool (preview while drawing)
    if (isDrawing && activeTool === "mask" && currentPath.length > 0) {
      drawStrokePath(currentPath, sizes.mask, colors.mask);
    }
  };

  // Get canvas coordinates from event
  const getCanvasCoordinatesFromEvent = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      return getCanvasCoordinates(event, canvas);
    },
    []
  );

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (canvas) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
    }

    if (maskCanvas) {
      maskCanvas.width = dimensions.width;
      maskCanvas.height = dimensions.height;
    }
  }, [dimensions]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawOnCanvas();
  }, [drawOnCanvas]);

  return {
    canvasRef,
    maskCanvasRef,
    drawOnCanvas,
    getCanvasCoordinatesFromEvent,
  };
};
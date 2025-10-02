import React, { useEffect } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import type {
  Annotation,
  MaskStroke,
  Point,
  CanvasDimensions,
  ToolType,
} from "@/types/photo-editor";

interface AnnotationCanvasProps {
  dimensions: CanvasDimensions;
  annotations: Annotation[];
  maskStrokes: MaskStroke[];
  currentPath: Point[];
  isDrawing: boolean;
  activeTool: ToolType | null;
  startPos: Point;
  currentMousePos: Point;
  selectedAnnotationId: string | null;
  isDragging?: boolean;
  dragType?: "annotation" | "arrow-start" | "arrow-end" | null;
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
  onMouseDown?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove?: (event: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLCanvasElement>) => void;
  className?: string;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  dimensions,
  annotations,
  maskStrokes,
  currentPath,
  isDrawing,
  activeTool,
  startPos,
  currentMousePos,
  selectedAnnotationId,
  isDragging = false,
  dragType = null,
  image,
  colors,
  sizes,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  className,
}) => {
  const { canvasRef, maskCanvasRef, drawOnCanvas } = useCanvas({
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
  });

  // Trigger redraw when image changes
  useEffect(() => {
    drawOnCanvas();
  }, [image, drawOnCanvas]);

  return (
    <div className="relative">
      {/* Hidden mask canvas for mask operations */}
      <canvas
        ref={maskCanvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          touchAction: "none",
          objectFit: "contain",
          zIndex: 10,
        }}
      />

      {/* Main annotation canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`rounded-lg ${className}`}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          touchAction: "none",
          objectFit: "contain",
          backgroundColor: "#ffffff",
        }}
      />
    </div>
  );
};
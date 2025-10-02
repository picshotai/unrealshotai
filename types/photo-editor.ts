// Photo Editor Types consolidated into the project

export type ToolType = "draw" | "arrow" | "text" | "image" | "mask" | "prompt" | null;

export interface Point {
  x: number;
  y: number;
  timestamp: number;
}

export interface DrawAnnotation {
  id: string;
  type: "draw";
  path: Point[];
  color: string;
  thickness: number;
  timestamp: number;
}

export interface ArrowAnnotation {
  id: string;
  type: "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  thickness: number;
  timestamp: number;
}

export interface TextAnnotation {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  timestamp: number;
}

export interface ImageAnnotation {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  imageElement: HTMLImageElement;
  timestamp: number;
}

export type Annotation =
  | DrawAnnotation
  | ArrowAnnotation
  | TextAnnotation
  | ImageAnnotation;

export interface MaskStroke {
  path: Point[];
  brushSize: number;
}

export interface AnnotationHistory {
  annotations: Annotation[];
  maskStrokes: MaskStroke[];
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface AnnotationConfig {
  colors: {
    draw: string;
    arrow: string;
    text: string;
    mask: string;
  };
  defaultSizes: {
    drawThickness: number;
    arrowThickness: number;
    fontSize: number;
    brushSize: number;
  };
  canvas: {
    maxWidth: number;
    maxHeight: number;
    backgroundColor: string;
  };
}
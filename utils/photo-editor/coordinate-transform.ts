import type { Point, MaskStroke } from "@/types/photo-editor";

/**
 * Transform coordinates from display canvas to original image coordinates
 * This is crucial for maintaining accurate masking when images are displayed at fixed sizes
 */
export const transformCanvasToImageCoordinates = (
  canvasPoint: Point,
  displayDimensions: { width: number; height: number },
  originalDimensions: { width: number; height: number }
): Point => {
  // Calculate scale factors
  const scaleX = originalDimensions.width / displayDimensions.width;
  const scaleY = originalDimensions.height / displayDimensions.height;

  return {
    x: canvasPoint.x * scaleX,
    y: canvasPoint.y * scaleY,
    timestamp: canvasPoint.timestamp,
  };
};

/**
 * Transform mask strokes from display canvas to original image coordinates
 */
export const transformMaskStrokesToImageCoordinates = (
  maskStrokes: MaskStroke[],
  displayDimensions: { width: number; height: number },
  originalDimensions: { width: number; height: number }
): MaskStroke[] => {
  const scaleX = originalDimensions.width / displayDimensions.width;
  const scaleY = originalDimensions.height / displayDimensions.height;

  return maskStrokes.map(stroke => ({
    ...stroke,
    path: stroke.path.map(point => ({
      x: point.x * scaleX,
      y: point.y * scaleY,
      timestamp: point.timestamp,
    })),
  }));
};

/**
 * Transform coordinates from original image to display canvas coordinates
 * Used for displaying existing annotations correctly on the fixed-size canvas
 */
export const transformImageToCanvasCoordinates = (
  imagePoint: Point,
  displayDimensions: { width: number; height: number },
  originalDimensions: { width: number; height: number }
): Point => {
  // Calculate scale factors
  const scaleX = displayDimensions.width / originalDimensions.width;
  const scaleY = displayDimensions.height / originalDimensions.height;

  return {
    x: imagePoint.x * scaleX,
    y: imagePoint.y * scaleY,
    timestamp: imagePoint.timestamp,
  };
};
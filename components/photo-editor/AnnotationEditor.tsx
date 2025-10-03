"use client"
  import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
  import { Upload, Undo, Redo, Trash2, Download, Zap, Lasso, X, Plus, Minus } from "lucide-react";
  import { Button } from "@/components/ui/button";

  import { useAnnotations } from "@/hooks/useannotations";
  import type { APIClient } from "@/lib/photo-editor/client";
  import type {
    Annotation,
    TextAnnotation,
    ToolType,
    Point,
    CanvasDimensions,
    AnnotationConfig,
    MaskStroke,
  } from "@/types/photo-editor";
  import { AnnotationCanvas } from "./AnnotationCanvas";
  import { DrawingToolbar } from "./DrawingToolbar";
  import { PropertiesPanel } from "./PropertiesPanel";
  import { TextInputModal } from "./TextInputModal";
  import { PromptInputModal } from "./PromptInputModal";
  import { DottedCanvas } from "./DottedCanvas";
  import { transformMaskStrokesToImageCoordinates } from "@/utils/photo-editor/coordinate-transform";

  // Utility functions for image handling
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Ensure cross-origin loading is allowed to avoid tainting canvas
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      // Decide whether to proxy: avoid proxying data: and blob: URLs
      const isDataOrBlob = url.startsWith("data:") || url.startsWith("blob:");
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const isAlreadyProxied = url.startsWith("/api/proxy-image");
      const isAbsoluteHttp = /^https?:\/\//i.test(url);
      const isSameOriginAbs = origin && isAbsoluteHttp && url.startsWith(origin);
      const isRelative = !isAbsoluteHttp && !url.startsWith("data:") && !url.startsWith("blob:");
      if (isDataOrBlob || isAlreadyProxied || isSameOriginAbs || isRelative) {
        img.src = url;
      } else {
        // External absolute URL: route through same-origin proxy to prevent canvas tainting
        img.src = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      }
    });
  };

  const calculateCanvasDimensions = (
    imageWidth: number,
    imageHeight: number,
    maxWidth: number,
    maxHeight: number
  ) => {
    // Fixed display size - all images will be displayed at this size regardless of original dimensions
    const FIXED_DISPLAY_WIDTH = 800;
    const FIXED_DISPLAY_HEIGHT = 600;
    
    // Calculate the aspect ratio to maintain proportions within the fixed area
    const imageAspectRatio = imageWidth / imageHeight;
    const displayAspectRatio = FIXED_DISPLAY_WIDTH / FIXED_DISPLAY_HEIGHT;
    
    let displayWidth = FIXED_DISPLAY_WIDTH;
    let displayHeight = FIXED_DISPLAY_HEIGHT;
    
    // Fit the image within the fixed display area while maintaining aspect ratio
    if (imageAspectRatio > displayAspectRatio) {
      // Image is wider - fit to width
      displayHeight = FIXED_DISPLAY_WIDTH / imageAspectRatio;
    } else {
      // Image is taller - fit to height
      displayWidth = FIXED_DISPLAY_HEIGHT * imageAspectRatio;
    }
    
    return { 
      width: Math.round(displayWidth), 
      height: Math.round(displayHeight) 
    };
  };

  const canvasToDataURL = (canvas: HTMLCanvasElement): string => {
    return canvas.toDataURL('image/png');
  };

  // Reload an image via same-origin proxy if needed to avoid canvas tainting
  const ensureSafeImage = async (img: HTMLImageElement): Promise<HTMLImageElement> => {
    const src = img.src || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const isBlobOrData = src.startsWith("blob:") || src.startsWith("data:");
    const isProxied = src.startsWith("/api/proxy-image") || (origin && src.startsWith(`${origin}/api/proxy-image`));
    if (isBlobOrData || isProxied) {
      return img;
    }
    // Reload via proxy to ensure same-origin and set crossOrigin
    return await loadImageFromUrl(src);
  };

  interface AnnotationEditorProps {
    apiClient?: APIClient;
    config?: Partial<AnnotationConfig>;
    className?: string;
    onImageGenerated?: (imageUrl: string) => void;
    onError?: (error: string) => void;
  }

  const defaultConfig: AnnotationConfig = {
    colors: {
      draw: "#000000",
      arrow: "#ef4444",
      text: "#000000",
      mask: "#3b82f6",
    },
    defaultSizes: {
      drawThickness: 3,
      arrowThickness: 3,
      fontSize: 16,
      brushSize: 30,
    },
    canvas: {
      maxWidth: 1200,
      maxHeight: 800,
      backgroundColor: "#ffffff",
    },
  };

  export const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
    apiClient,
    config: userConfig = {},
    className,
    onImageGenerated,
    onError,
  }) => {
    const config = { ...defaultConfig, ...userConfig };
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Zoom state and controls (view-only scaling)
    const [zoom, setZoom] = useState(1);
    const MIN_ZOOM = 0.25;
    const MAX_ZOOM = 4;
    const stepZoom = 0.1;
    const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + stepZoom).toFixed(2)));
    const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - stepZoom).toFixed(2)));

    // State
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [colors, setColors] = useState(config.colors);
    const [sizes, setSizes] = useState(config.defaultSizes);
    const [isGenerating, setIsGenerating] = useState(false);

    // Canvas dragging state
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });

    // Modals
    const [showTextModal, setShowTextModal] = useState(false);
    const [showPromptModal, setShowPromptModal] = useState(false);
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const [editingTextId, setEditingTextId] = useState<string | null>(null);

    // Mask state
    const [maskPrompt, setMaskPrompt] = useState("");

    // Enhance settings state
    const [enhanceUpscaling, setEnhanceUpscaling] = useState<number>(2);
    const [enhanceFidelity, setEnhanceFidelity] = useState<number>(0.5);
    const [enhanceFaceUpscale, setEnhanceFaceUpscale] = useState<boolean>(true);
    // Image overlay
    const overlayImageInputRef = useRef<HTMLInputElement>(null);

    const hiddenTools = useMemo(() => ["draw", "text", "arrow", "image"] as ToolType[], []);

    // Annotations hook
    const {
      annotations,
      maskStrokes,
      activeTool,
      isDrawing,
      currentPath,
      selectedAnnotationId,
      isDragging,
      dragType,
      canUndo,
      canRedo,
      startPos,
      currentMousePos,
      setActiveTool,
      startDrawing,
      continueDrawing,
      endDrawing,
      addTextAnnotation,
      addImageAnnotation,
      updateTextAnnotation,
      clearAll,
      clearMaskStrokes,
      undo,
      redo,
    } = useAnnotations();

    // Handle image upload
    const handleImageUpload = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          const img = await loadImage(file);
          
          // Store original image dimensions for coordinate calculations
          setOriginalImageDimensions({ width: img.width, height: img.height });
          
          const newDimensions = calculateCanvasDimensions(
            img.width,
            img.height,
            config.canvas.maxWidth,
            config.canvas.maxHeight
          );

          setImage(img);
          setDimensions(newDimensions);
          setCanvasOffset({ x: 0, y: 0 }); // Reset canvas position
          clearAll();
        } catch (error) {
          onError?.("Failed to load image");
          console.error("Failed to load image:", error);
        }
      },
      [config.canvas, clearAll, onError]
    );

    // Handle overlay image upload
    const handleOverlayImageUpload = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          const img = await loadImage(file);

          // Calculate default size (30% of canvas size)
          const maxSize = Math.min(dimensions.width, dimensions.height) * 0.3;
          let width = img.width;
          let height = img.height;

          if (width > maxSize || height > maxSize) {
            const aspectRatio = width / height;
            if (width > height) {
              width = maxSize;
              height = maxSize / aspectRatio;
            } else {
              height = maxSize;
              width = maxSize * aspectRatio;
            }
          }

          // Position at center of canvas
          const x = (dimensions.width - width) / 2;
          const y = (dimensions.height - height) / 2;

          addImageAnnotation(x, y, width, height, img);
          setActiveTool(null); // Deselect tool after adding image
        } catch (error) {
          onError?.("Failed to load overlay image");
          console.error("Failed to load overlay image:", error);
        }
      },
      [dimensions, addImageAnnotation, setActiveTool, onError]
    );

    // Handle canvas mouse events
    const handleMouseDown = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);
        const point = { x, y, timestamp: Date.now() };

        // Handle tool-specific actions first
        if (activeTool === "text") {
          setEditingTextId(null);
          setTextPosition({ x, y });
          setShowTextModal(true);
          return;
        }

        if (activeTool === "image") {
          // Trigger image upload
          overlayImageInputRef.current?.click();
          return;
        }

        if (activeTool === "prompt") {
          // Open prompt modal
          setShowPromptModal(true);
          return;
        }

        // Check if no tool is selected or if spacebar is held - enable canvas dragging
        if (!activeTool || event.shiftKey) {
          setIsDraggingCanvas(true);
          setDragStart({ x: event.clientX, y: event.clientY });
          return;
        }

        // If no dragging started and we have a drawing tool, start drawing
        if (
          activeTool === "draw" ||
          activeTool === "arrow" ||
          activeTool === "mask"
        ) {
          startDrawing(point);
        }
      },
      [
        activeTool,
        annotations,
        selectedAnnotationId,
        startDrawing,
      ]
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);
        const point = { x, y, timestamp: Date.now() };

        // Handle canvas dragging
        if (isDraggingCanvas) {
          const deltaX = event.clientX - dragStart.x;
          const deltaY = event.clientY - dragStart.y;
          
          setCanvasOffset(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY
          }));
          
          setDragStart({ x: event.clientX, y: event.clientY });
          return;
        }

        if (isDrawing) {
          continueDrawing(point);
          return;
        }
      },
      [isDrawing, continueDrawing, isDraggingCanvas, dragStart]
    );

    const handleMouseUp = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        // End canvas dragging
        if (isDraggingCanvas) {
          setIsDraggingCanvas(false);
          return;
        }

        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);
        const point = { x, y, timestamp: Date.now() };

        if (isDrawing) {
          const color = colors[activeTool as keyof typeof colors] || "#000000";
          const thickness =
            activeTool === "draw"
              ? sizes.drawThickness
              : activeTool === "arrow"
              ? sizes.arrowThickness
              : activeTool === "mask"
              ? sizes.brushSize
              : 3;

          endDrawing(point, color, thickness);
          return;
        }
      },
      [isDrawing, activeTool, colors, sizes, endDrawing, isDraggingCanvas]
    );

    // Touch handlers for mobile
    const handleTouchStart = useCallback(
      (event: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        if (!touch) return;

        const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
        const point = { x, y, timestamp: Date.now() };

        event.preventDefault();

        // Handle tool-specific actions first
        if (activeTool === "text") {
          setEditingTextId(null);
          setTextPosition({ x, y });
          setShowTextModal(true);
          return;
        }

        if (activeTool === "image") {
          overlayImageInputRef.current?.click();
          return;
        }

        if (activeTool === "prompt") {
          setShowPromptModal(true);
          return;
        }

        // Drag canvas if no tool is selected
        if (!activeTool) {
          setIsDraggingCanvas(true);
          setDragStart({ x: touch.clientX, y: touch.clientY });
          return;
        }

        // Start drawing for supported tools
        if (activeTool === "draw" || activeTool === "arrow" || activeTool === "mask") {
          startDrawing(point);
        }
      },
      [activeTool, startDrawing]
    );

    const handleTouchMove = useCallback(
      (event: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        if (!touch) return;

        const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
        const point = { x, y, timestamp: Date.now() };

        event.preventDefault();

        // Handle canvas dragging
        if (isDraggingCanvas) {
          const deltaX = touch.clientX - dragStart.x;
          const deltaY = touch.clientY - dragStart.y;

          setCanvasOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
          setDragStart({ x: touch.clientX, y: touch.clientY });
          return;
        }

        if (isDrawing) {
          continueDrawing(point);
          return;
        }
      },
      [isDraggingCanvas, dragStart, isDrawing, continueDrawing]
    );

    const handleTouchEnd = useCallback(
      (event: React.TouchEvent<HTMLCanvasElement>) => {
        // End canvas dragging
        if (isDraggingCanvas) {
          setIsDraggingCanvas(false);
          return;
        }

        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const changedTouch = event.changedTouches[0];
        if (!changedTouch) return;

        const x = (changedTouch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (changedTouch.clientY - rect.top) * (canvas.height / rect.height);
        const point = { x, y, timestamp: Date.now() };

        event.preventDefault();

        if (isDrawing) {
          const color = colors[activeTool as keyof typeof colors] || "#000000";
          const thickness =
            activeTool === "draw"
              ? sizes.drawThickness
              : activeTool === "arrow"
              ? sizes.arrowThickness
              : activeTool === "mask"
              ? sizes.brushSize
              : 3;

          endDrawing(point, color, thickness);
          return;
        }
      },
      [isDraggingCanvas, isDrawing, activeTool, colors, sizes, endDrawing]
    );

    // Handle text submission
    const handleTextSubmit = useCallback(
      (text: string, color: string, fontSize: number) => {
        if (editingTextId) {
          // Update existing text
          updateTextAnnotation(editingTextId, { text, color, fontSize });
          setEditingTextId(null);
        } else {
          // Add new text
          addTextAnnotation(
            textPosition.x,
            textPosition.y,
            text,
            color,
            fontSize
          );
        }
        setShowTextModal(false);
      },
      [textPosition, addTextAnnotation, editingTextId, updateTextAnnotation]
    );

    // Open text modal immediately when text tool is selected
    React.useEffect(() => {
      if (activeTool === "text" && !showTextModal && !editingTextId) {
        // Set default position to center of canvas
        setTextPosition({
          x: dimensions.width / 2,
          y: dimensions.height / 2,
        });
        setShowTextModal(true);
      }
    }, [activeTool, showTextModal, editingTextId, dimensions]);

    // Open prompt modal immediately when prompt tool is selected
    React.useEffect(() => {
      if (activeTool === "prompt" && !showPromptModal) {
        setShowPromptModal(true);
      }
    }, [activeTool, showPromptModal]);

    // Handle color changes
    const handleColorChange = useCallback((tool: string, color: string) => {
      setColors((prev) => ({ ...prev, [tool]: color }));
    }, []);

    // Handle size changes
    const handleSizeChange = useCallback((property: string, size: number) => {
      setSizes((prev) => ({ ...prev, [property]: size }));
    }, []);

    // Handle download
    const handleDownload = useCallback(() => {
      // Create a temporary canvas to combine image and annotations
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = dimensions.width;
      tempCanvas.height = dimensions.height;

      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = config.canvas.backgroundColor;
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw image if exists
      if (image) {
        ctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
      }

      // The actual annotation drawing would be handled by the canvas component
      // For now, we'll just download the current state
      const dataUrl = canvasToDataURL(tempCanvas);
      const link = document.createElement("a");
      link.download = "annotated-image.png";
      link.href = dataUrl;
      link.click();
    }, [dimensions, image, config.canvas.backgroundColor]);

    // Handle AI generation
    const handleGenerate = useCallback(
      async (prompt: string) => {
        if (!apiClient || !image) {
          onError?.("API client not configured or no image loaded");
          return;
        }

        setIsGenerating(true);

        try {
          // Create canvas with original image dimensions for API
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = originalImageDimensions.width;
          tempCanvas.height = originalImageDimensions.height;

          const ctx = tempCanvas.getContext("2d");
          if (!ctx) throw new Error("Failed to get canvas context");

          // Draw image at original size (ensure safe image to avoid tainting)
          const safeImage = await ensureSafeImage(image as HTMLImageElement);
          ctx.drawImage(
            safeImage,
            0,
            0,
            originalImageDimensions.width,
            originalImageDimensions.height
          );

          // Transform mask strokes from display coords to original image coords
          const transformedMaskStrokes =
            maskStrokes.length > 0
              ? transformMaskStrokesToImageCoordinates(
                  maskStrokes,
                  dimensions,
                  originalImageDimensions
                )
              : undefined;

          // Draw a semi-transparent colored overlay over masked regions before sending to Gemini
          if (transformedMaskStrokes && transformedMaskStrokes.length > 0) {
            const maskCanvas = document.createElement("canvas");
            maskCanvas.width = originalImageDimensions.width;
            maskCanvas.height = originalImageDimensions.height;
            const mctx = maskCanvas.getContext("2d");
            if (!mctx) throw new Error("Failed to get canvas context");
            mctx.fillStyle = "white";
            mctx.globalCompositeOperation = "source-over";
            // Scale brush size to original image scale and render continuous paths
            const scaleX = originalImageDimensions.width / dimensions.width;
            const scaleY = originalImageDimensions.height / dimensions.height;
            const brushScale = Math.max(scaleX, scaleY);
            for (const stroke of transformedMaskStrokes) {
              const lineWidth = Math.max(2, Math.round(stroke.brushSize * brushScale));
              mctx.lineCap = "round";
              mctx.lineJoin = "round";
              mctx.strokeStyle = "white";
              mctx.lineWidth = lineWidth;
              const pts = stroke.path;
              if (pts.length > 0) {
                mctx.beginPath();
                mctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length; i++) {
                  mctx.lineTo(pts[i].x, pts[i].y);
                }
                mctx.stroke();
                // Cap ends to ensure solid coverage
                mctx.beginPath();
                mctx.arc(pts[0].x, pts[0].y, lineWidth / 2, 0, Math.PI * 2);
                mctx.fill();
                mctx.beginPath();
                mctx.arc(pts[pts.length - 1].x, pts[pts.length - 1].y, lineWidth / 2, 0, Math.PI * 2);
                mctx.fill();
              }
            }
            // Create colored overlay and clip by mask
            const overlayCanvas = document.createElement("canvas");
            overlayCanvas.width = maskCanvas.width;
            overlayCanvas.height = maskCanvas.height;
            const octx = overlayCanvas.getContext("2d");
            if (!octx) throw new Error("Failed to get canvas context");
            octx.globalAlpha = 0.12; // lighter overlay for better AI interpretation
            octx.fillStyle = colors.mask;
            octx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            octx.globalCompositeOperation = "destination-in";
            octx.drawImage(maskCanvas, 0, 0);
            // Composite overlay onto the base image
            ctx.drawImage(overlayCanvas, 0, 0);
          }
          const imageData = canvasToDataURL(tempCanvas);

          // Strengthen prompt if mask is present, but avoid mentioning overlay color
          const finalPrompt =
            transformedMaskStrokes && transformedMaskStrokes.length > 0
              ? `Please only modify the selected region; keep all other areas unchanged. ${prompt}`
              : prompt;

          const request = {
            imageData,
            prompt: finalPrompt,
            strength: 0.8,
            guidance: 7.5,
            steps: 20,
          };

          const response = await apiClient.generateImage(request);

          if (response.success && response.result) {
            // Load the generated image
            const generatedImg = await loadImageFromUrl(response.result.output);

            // If we have a mask, composite the generated image onto the original
            // only within the masked region to prevent unintended global changes.
            if (transformedMaskStrokes && transformedMaskStrokes.length > 0) {
              // Result canvas (final composited image)
              const resultCanvas = document.createElement("canvas");
              resultCanvas.width = originalImageDimensions.width;
              resultCanvas.height = originalImageDimensions.height;
              const rctx = resultCanvas.getContext("2d");
              if (!rctx) throw new Error("Failed to get canvas context");

              // Draw original base image
              rctx.drawImage(
                safeImage,
                0,
                0,
                resultCanvas.width,
                resultCanvas.height
              );

              // Generated layer (scaled to original size)
              const genCanvas = document.createElement("canvas");
              genCanvas.width = originalImageDimensions.width;
              genCanvas.height = originalImageDimensions.height;
              const gctx = genCanvas.getContext("2d");
              if (!gctx) throw new Error("Failed to get canvas context");
              gctx.drawImage(
                generatedImg,
                0,
                0,
                genCanvas.width,
                genCanvas.height
              );

              // Build a feathered mask to avoid hard outlines
              const maskCanvas = document.createElement("canvas");
              maskCanvas.width = originalImageDimensions.width;
              maskCanvas.height = originalImageDimensions.height;
              const mctx = maskCanvas.getContext("2d");
              if (!mctx) throw new Error("Failed to get canvas context");
              // Feather amount relative to brush size
              const featherPx = Math.max(2, Math.round((sizes.brushSize || 30) * 0.3));
              mctx.filter = `blur(${featherPx}px)`;
              mctx.fillStyle = "#000";
              mctx.globalAlpha = 1;
              for (const stroke of transformedMaskStrokes) {
                const radius = Math.max(1, stroke.brushSize / 2);
                for (const p of stroke.path) {
                  mctx.beginPath();
                  mctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                  mctx.fill();
                }
              }
              mctx.filter = "none"; // reset filter

              // Clip generated layer by the feathered mask
              gctx.globalCompositeOperation = "destination-in";
              gctx.drawImage(maskCanvas, 0, 0);

              // Composite masked generated layer onto the original
              rctx.drawImage(genCanvas, 0, 0);

              const compositedDataUrl = resultCanvas.toDataURL("image/png");
              onImageGenerated?.(compositedDataUrl);

              const compositedImg = await loadImageFromUrl(compositedDataUrl);
              setImage(compositedImg);
              setDimensions(
                calculateCanvasDimensions(
                  resultCanvas.width,
                  resultCanvas.height,
                  config.canvas.maxWidth,
                  config.canvas.maxHeight
                )
              );
            } else {
              // No mask: use the generated image as-is
              onImageGenerated?.(response.result.output);
              setOriginalImageDimensions({ width: generatedImg.width, height: generatedImg.height });
              const newDimensions = calculateCanvasDimensions(
                generatedImg.width,
                generatedImg.height,
                config.canvas.maxWidth,
                config.canvas.maxHeight
              );
              setImage(generatedImg);
              setDimensions(newDimensions);
            }

            clearMaskStrokes(); // Clear mask after generation
          } else {
            // Do not throw here; surface a clean error message via onError and return
            const fallbackMessage = response.error?.message || "Generation failed";
            const detailedMessage = response.error?.details
              ? `${fallbackMessage}: ${response.error.details}`
              : fallbackMessage;
            onError?.(detailedMessage);
            console.warn("Image generation did not return an image:", response.error);
            return;
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Generation failed";
          onError?.(errorMessage);
          console.warn("Generation failed:", error);
        } finally {
          setIsGenerating(false);
        }
      },
      [
        apiClient,
        image,
        dimensions,
        maskStrokes,
        onImageGenerated,
        onError,
        clearMaskStrokes,
        sizes,
      ]
    );

    // Enhance/Upscale current image via backend API
    const handleEnhance = useCallback(async () => {
      if (!apiClient || !image) {
        onError?.("API client not configured or no image loaded");
        return;
      }

      setIsGenerating(true);
      try {
        // Build a canvas sized to the original image to avoid scaled artifacts
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = originalImageDimensions.width;
        tempCanvas.height = originalImageDimensions.height;
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");

        // Fill background to avoid transparent artifacts
        ctx.fillStyle = config.canvas.backgroundColor;
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the base image (ensure safe image to avoid tainting)
        const safeImage = await ensureSafeImage(image as HTMLImageElement);
        ctx.drawImage(safeImage, 0, 0, tempCanvas.width, tempCanvas.height);

        const imageData = tempCanvas.toDataURL("image/png");

        const response = await apiClient.enhanceImage({
          imageData,
          fidelity: enhanceFidelity,
          upscaling: enhanceUpscaling,
          face_upscale: enhanceFaceUpscale,
        });

        if (response.success && response.result?.output) {
          const enhancedUrl = response.result.output;
          try {
            const newImg = await loadImageFromUrl(enhancedUrl);
            setOriginalImageDimensions({ width: newImg.width, height: newImg.height });
            const newDimensions = calculateCanvasDimensions(
              newImg.width,
              newImg.height,
              config.canvas.maxWidth,
              config.canvas.maxHeight
            );
            setImage(newImg);
            setDimensions(newDimensions);
            setCanvasOffset({ x: 0, y: 0 });
            clearAll();
            onImageGenerated?.(enhancedUrl);
          } catch (loadErr) {
            onError?.("Failed to load enhanced image");
            console.error("Failed to load enhanced image:", loadErr);
          }
        } else {
          const errMsg = response.error?.message || "Enhance failed";
          onError?.(errMsg);
          console.warn("Enhance failed:", response.error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Enhance failed";
        onError?.(errorMessage);
        console.warn("Enhance failed:", error);
      } finally {
        setIsGenerating(false);
      }
    }, [apiClient, image, originalImageDimensions, config.canvas.backgroundColor, config.canvas.maxWidth, config.canvas.maxHeight, enhanceFidelity, enhanceUpscaling, enhanceFaceUpscale, onImageGenerated, onError, clearAll, setImage, setDimensions, setCanvasOffset, setOriginalImageDimensions]);

    return (
      <div className={`flex flex-col h-full bg-white overflow-hidden ${className}`}>
        {/* Main Canvas Area - Full Width with Dotted Background */}
        <div className="flex-1 relative h-full flex flex-col">
          <DottedCanvas className="flex-1 w-full">
            <div className="w-full h-full flex items-center justify-center">
              {image ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Zoom Controls - Top Right */}
                  <div className="absolute top-4 right-4 z-[100] pointer-events-auto flex flex-col gap-2">
                    <button onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in"
                      className="cursor-pointer bg-white/90 border border-slate-200 rounded-md p-2 hover:bg-white disabled:opacity-50">
                      <Plus size={16} />
                    </button>
                    <button onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out"
                      className="cursor-pointer bg-white/90 border border-slate-200 rounded-md p-2 hover:bg-white disabled:opacity-50">
                      <Minus size={16} />
                    </button>
                  </div>

                  {/* Desktop Left Toolbar - vertical, aligned to canvas */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
                    <DrawingToolbar
                      activeTool={activeTool}
                      onToolSelect={setActiveTool}
                      isMaskToolActive={activeTool === "mask"}
                      isGenerating={isGenerating}
                      hideTools={hiddenTools}
                      orientation="vertical"
                    />
                  </div>

                  {/* Desktop Properties Panel - tool options */}
                  {image && activeTool && (activeTool === "draw" || activeTool === "mask" || activeTool === "arrow" || activeTool === "text") && (
                    <div className="absolute top-4 left-4 z-[100] pointer-events-auto">
                      <PropertiesPanel
                        activeTool={activeTool as ToolType}
                        colors={colors}
                        sizes={sizes}
                        onColorChange={handleColorChange}
                        onSizeChange={handleSizeChange}
                        compact
                        className="p-2"
                      />
                    </div>
                  )}
                  
                  {/* Outer wrapper for panning (not affected by scale) */}
                  <div
                    className="relative flex items-center justify-center transition-transform duration-200"
                    style={{
                      maxWidth: 'min(95vw, 1200px)',
                      maxHeight: 'min(calc(100vh - 100px), 800px)',
                      width: 'fit-content',
                      height: 'fit-content',
                      transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                      cursor: isDraggingCanvas ? 'grabbing' : (!activeTool ? 'grab' : 'default')
                    }}
                  >
                    {/* Inner wrapper for zoom scaling */}
                    <div
                      className="transition-transform duration-200 ease-linear will-change-transform"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                    >
                      <AnnotationCanvas
                        dimensions={dimensions}
                        annotations={annotations}
                        maskStrokes={maskStrokes}
                        currentPath={currentPath}
                        isDrawing={isDrawing}
                        activeTool={activeTool}
                        startPos={startPos}
                        currentMousePos={currentMousePos}
                        selectedAnnotationId={selectedAnnotationId}
                        isDragging={isDragging}
                        dragType={dragType}
                        image={image}
                        colors={colors}
                        sizes={{
                          draw: sizes.drawThickness,
                          arrow: sizes.arrowThickness,
                          text: sizes.fontSize,
                          mask: sizes.brushSize,
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="shadow-xl"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 rounded">
                 
                    
                    <div className="space-y-4 bg-white/50">
                      <div
                        className="border-input relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed p-4 transition-colors hover:bg-accent/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center cursor-pointer">
                          <div
                            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                            aria-hidden="true"
                          >
                            <Upload size={16} className="opacity-60" />
                          </div>
                          <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                          <p className="text-muted-foreground text-xs">
                            PNG, JPG or JPEG (max. 10MB)
                          </p>
                          <Button variant="outline" className="mt-4" type="button">
                            <Upload className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                            Select image
                          </Button>
                        </div>
                      </div>
                    </div>
                  
                </div>
              )}
            </div>
          </DottedCanvas>
        </div>

        {/* Bottom Toolbar - Main Actions */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-3">
            <div className="flex gap-3 items-center justify-center">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Upload</span>
              </button>

              {/* Undo/Redo */}
              <div className="flex gap-2">
                <button
                  onClick={undo}
                  disabled={!canUndo || isGenerating}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <Undo size={16} />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo || isGenerating}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <Redo size={16} />
                </button>
              </div>

              {/* Clear */}
              <button
                onClick={clearAll}
                disabled={isGenerating}
                className="cursor-pointer flex items-center gap-2 px-3 py-2.5 bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-red-700 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Trash2 size={16} />
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                disabled={!image || isGenerating}
                className="cursor-pointer flex items-center gap-2 px-3 py-2.5 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-green-700 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <Download size={16} />
              </button>

              {/* Generate/Edit Button */}
              <div className="rounded-lg p-[1px]">
                <button
                  onClick={() => {
                    if (activeTool === "enhance") {
                      if (apiClient) {
                        handleEnhance();
                      } else {
                        alert("Demo Mode: Would enhance/upscale the current image");
                      }
                      return;
                    }

                    if (
                      activeTool === "mask" &&
                      maskStrokes.length > 0 &&
                      maskPrompt.trim()
                    ) {
                      // Use mask prompt directly
                      if (apiClient) {
                        handleGenerate(maskPrompt);
                      } else {
                        // Demo mode - show what would happen
                        alert(
                          `Demo Mode: Would generate with mask prompt: "${maskPrompt}"`
                        );
                      }
                    } else {
                      if (apiClient) {
                        setShowPromptModal(true);
                      } else {
                        // Demo mode - show what would happen
                        alert(
                          "Demo Mode: Would open prompt modal for AI generation"
                        );
                      }
                    }
                  }}
                  disabled={
                    !image ||
                    isGenerating ||
                    (activeTool === "mask" &&
                      (maskStrokes.length === 0 || !maskPrompt.trim()))
                  }
                  className="cursor-pointer w-full font-bold py-2.5 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#ff6f00] text-white hover:bg-gray-500 text-blue-600 whitespace-nowrap text-sm"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">{activeTool === "enhance" ? "Enhancing..." : "Generating..."}</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      {activeTool === "enhance" ? "Enhance" : activeTool === "mask" ? "Edit Mask" : "Edit"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <input
          ref={overlayImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleOverlayImageUpload}
          className="hidden"
        />

        <TextInputModal
          isOpen={showTextModal}
          onClose={() => {
            setShowTextModal(false);
            setEditingTextId(null);
            setActiveTool(null);
          }}
          onSubmit={handleTextSubmit}
          initialText={
            editingTextId
              ? (annotations.find((a: Annotation) => a.id === editingTextId) as TextAnnotation)?.text || ""
              : ""
          }
          initialColor={
            editingTextId
              ? (annotations.find((a: Annotation) => a.id === editingTextId) as TextAnnotation)?.color || colors.text
              : colors.text
          }
          initialFontSize={
            editingTextId
              ? (annotations.find((a: Annotation) => a.id === editingTextId) as TextAnnotation)?.fontSize || sizes.fontSize
              : sizes.fontSize
          }
          isEditing={!!editingTextId}
        />

        <PromptInputModal
          isOpen={showPromptModal}
          onClose={() => {
            setShowPromptModal(false);
            setActiveTool(null);
          }}
          onSubmit={(prompt) => {
            if (apiClient) {
              handleGenerate(prompt);
            } else {
              alert(`Demo Mode: Would generate with prompt: "${prompt}"`);
              setShowPromptModal(false);
              setActiveTool(null);
            }
          }}
        />

      {/* Top Floating Toolbar - Drawing Tools */}
      {image && (
        <div className="fixed top-16 left-0 right-0 z-50 md:hidden px-4 pointer-events-none">
          <div className="flex justify-center items-center gap-2 pointer-events-auto">
            {/* PropertiesPanel removed from toolbar area to use floating top-left panel */}
            <DrawingToolbar
              activeTool={activeTool}
              onToolSelect={setActiveTool}
              isMaskToolActive={activeTool === "mask"}
              isGenerating={isGenerating}
              hideTools={hiddenTools}
              orientation="horizontal"
            />
          </div>
        </div>
      )}

      {/* Mobile Properties Panel - tool options */}
      {false && image && activeTool && (activeTool === "draw" || activeTool === "arrow" || activeTool === "text") && (
        <div className="fixed top-28 left-0 right-0 z-50 md:hidden px-4">
          <div className="flex justify-center">
            <PropertiesPanel
              activeTool={activeTool as ToolType}
              colors={colors}
              sizes={sizes}
              onColorChange={handleColorChange}
              onSizeChange={handleSizeChange}
            />
          </div>
        </div>
      )}
      {activeTool === "mask" && (
        <div className="fixed bottom-[13vh] left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-lg shadow-xs p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Lasso size={16} />
                <span className="font-medium">
                  {maskStrokes.length > 0
                    ? "Edit Selected Area"
                    : "Paint to Select Area"}
                </span>
              </div>
              

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={maskPrompt}
                  onChange={(e) => setMaskPrompt(e.target.value)}
                  placeholder={
                    maskStrokes.length > 0
                      ? "Describe how to change the selected area..."
                      : "First paint an area to select, then describe changes..."
                  }
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={maskStrokes.length === 0}
                  autoFocus
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      maskStrokes.length > 0 &&
                      maskPrompt.trim()
                    ) {
                      e.preventDefault();
                      if (apiClient) {
                        handleGenerate(maskPrompt);
                      } else {
                        // Demo mode - show what would happen
                        alert(
                          `Demo Mode: Would generate with mask prompt: "${maskPrompt}"`
                        );
                      }
                    }
                  }}
                />

                <div className="flex items-center gap-2">
                  {maskStrokes.length > 0 && (
                    <button
                      onClick={() => {
                        clearMaskStrokes();
                        setMaskPrompt("");
                      }}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveTool(null);
                      setMaskPrompt("");
                      clearMaskStrokes();
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  
  
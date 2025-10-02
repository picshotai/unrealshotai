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
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
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

    // Image overlay
    const overlayImageInputRef = useRef<HTMLInputElement>(null);

    const hiddenTools = useMemo(() => ["draw", "text", "arrow"] as ToolType[], []);

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

          // Draw image at original size for API
          ctx.drawImage(image, 0, 0, originalImageDimensions.width, originalImageDimensions.height);
          const imageData = canvasToDataURL(tempCanvas);

          // Transform mask strokes from display coordinates to original image coordinates
          const transformedMaskStrokes = maskStrokes.length > 0 
            ? transformMaskStrokesToImageCoordinates(
                maskStrokes, 
                dimensions, 
                originalImageDimensions
              )
            : undefined;

          const request = {
            imageData,
            maskData: transformedMaskStrokes,
            prompt,
            strength: 0.8,
            guidance: 7.5,
            steps: 20,
          };

          const response = await apiClient.generateImage(request);

          if (response.success && response.result) {
            onImageGenerated?.(response.result.output);

            // Load the generated image and update dimensions
            const generatedImg = await loadImageFromUrl(response.result.output);
            setOriginalImageDimensions({ width: generatedImg.width, height: generatedImg.height });
            
            const newDimensions = calculateCanvasDimensions(
              generatedImg.width,
              generatedImg.height,
              config.canvas.maxWidth,
              config.canvas.maxHeight
            );
            
            setImage(generatedImg);
            setDimensions(newDimensions);
            clearMaskStrokes(); // Clear mask after generation
          } else {
            throw new Error(response.error?.message || "Generation failed");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Generation failed";
          onError?.(errorMessage);
          console.error("Generation failed:", error);
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
      ]
    );

    return (
      <div className={`flex flex-col h-full bg-white overflow-hidden ${className}`}>
        {/* Main Canvas Area - Full Width with Dotted Background */}
        <div className="flex-1 relative h-full flex flex-col">
          <DottedCanvas className="flex-1 w-full">
            <div className="w-full h-full flex items-center justify-center">
              {image ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Zoom Controls - Top Right */}
                  <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                    <button onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in"
                      className="bg-white/90 border border-slate-200 rounded-md p-2 hover:bg-white disabled:opacity-50">
                      <Plus size={16} />
                    </button>
                    <button onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out"
                      className="bg-white/90 border border-slate-200 rounded-md p-2 hover:bg-white disabled:opacity-50">
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
                    <div className="absolute left-4 bottom-4 z-50 hidden md:block w-72">
                      <PropertiesPanel
                        activeTool={activeTool as ToolType}
                        colors={colors}
                        sizes={sizes}
                        onColorChange={handleColorChange}
                        onSizeChange={handleSizeChange}
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
                      <span className="hidden sm:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      {activeTool === "mask" ? "Edit Mask" : "Edit"}
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
        <div className="fixed top-16 left-0 right-0 z-50 md:hidden px-4">
          <div className="flex justify-center">
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
      {image && activeTool && (activeTool === "draw" || activeTool === "mask" || activeTool === "arrow" || activeTool === "text") && (
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
  
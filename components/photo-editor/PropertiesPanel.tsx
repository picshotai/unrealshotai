"use client"

import React, { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import type { ToolType } from "@/types/photo-editor";
import { Brush } from "lucide-react";

interface PropertiesPanelProps {
  activeTool: ToolType;
  colors: {
    draw: string;
    arrow: string;
    text: string;
    mask: string;
  };
  sizes: {
    drawThickness: number;
    arrowThickness: number;
    fontSize: number;
    brushSize: number;
  };
  onColorChange: (tool: string, color: string) => void;
  onSizeChange: (property: string, size: number) => void;
  className?: string;
  compact?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  activeTool,
  colors,
  sizes,
  onColorChange,
  onSizeChange,
  className,
  compact = false,
}) => {
  const [isBrushOpen, setIsBrushOpen] = useState(false);

  if (!activeTool) {
    return (
      <div
        className={`p-4 bg-white rounded-lg border border-gray-200 ${className}`}
      >
        <p className="text-sm text-gray-500 text-center">
          Select a tool to see properties
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-1"
    >


      {activeTool === "draw" && (
        <>
          <div className="space-y-2">
            <label className={`text-sm font-medium ${compact ? "hidden md:block" : ""}`}>Color</label>
            <ColorPicker
              value={colors.draw}
              onChange={(color) => onColorChange("draw", color)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Thickness: {sizes.drawThickness}</label>
            <Slider
              value={[sizes.drawThickness]}
              onValueChange={(value) => onSizeChange("drawThickness", value[0])}
              min={1}
              max={20}
              step={1}
              className={compact ? "w-32" : undefined}
            />
          </div>
        </>
      )}

      {activeTool === "arrow" && (
        <>
          <div className="space-y-2">
            <label className={`text-sm font-medium ${compact ? "hidden md:block" : ""}`}>Color</label>
            <ColorPicker
              value={colors.arrow}
              onChange={(color) => onColorChange("arrow", color)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Thickness: {sizes.arrowThickness}</label>
            <Slider
              value={[sizes.arrowThickness]}
              onValueChange={(value) => onSizeChange("arrowThickness", value[0])}
              min={1}
              max={20}
              step={1}
              className={compact ? "w-32" : undefined}
            />
          </div>
        </>
      )}

      {activeTool === "text" && (
        <>
          <div className="space-y-2">
            <label className={`text-sm font-medium ${compact ? "hidden md:block" : ""}`}>Color</label>
            <ColorPicker
              value={colors.text}
              onChange={(color) => onColorChange("text", color)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size: {sizes.fontSize}</label>
            <Slider
              value={[sizes.fontSize]}
              onValueChange={(value) => onSizeChange("fontSize", value[0])}
              min={12}
              max={72}
              step={1}
              className={compact ? "w-32" : undefined}
            />
          </div>
        </>
      )}

      {activeTool === "mask" && (
        <>
          <div className="space-y-1 pointer-events-auto">
            <ColorPicker
              value={colors.mask}
              onChange={(color) => onColorChange("mask", color)}
            />
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setIsBrushOpen((prev) => !prev)}
              className="cursor-pointer w-8 h-8 flex items-center gap-2 px-2 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
              aria-expanded={isBrushOpen}
              aria-controls="mask-brush-size-slider"
            >
              <Brush className="text-gray-700" />
            </button>
            {isBrushOpen && (
              <div id="mask-brush-size-slider" className="pt-1 flex justify-center bg-white rounded-md border border-gray-200 py-2">
                <Slider
                  value={[sizes.brushSize]}
                  onValueChange={(value) => onSizeChange("brushSize", value[0])}
                  min={10}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="!min-h-0 !h-16 !w-8"
                  style={{ minHeight: 0, height: 64, width: 32 }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {activeTool === "enhance" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Upscaling</label>
            <Slider
              value={[2]}
              onValueChange={() => { /* No-op UI placeholder; handled server-side */ }}
              min={1}
              max={4}
              step={1}
              className={compact ? "w-32" : undefined}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fidelity</label>
            <Slider
              value={[5]}
              onValueChange={() => { /* No-op UI placeholder */ }}
              min={1}
              max={10}
              step={1}
              className={compact ? "w-32" : undefined}
            />
          </div>
        </>
      )}
    </div>
  );
};
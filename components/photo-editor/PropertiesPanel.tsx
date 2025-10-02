import React from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import type { ToolType } from "@/types/photo-editor";

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
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  activeTool,
  colors,
  sizes,
  onColorChange,
  onSizeChange,
  className,
}) => {
  if (!activeTool) {
    return (
      <div
        className={`p-4 bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}
      >
        <p className="text-sm text-gray-500 text-center">
          Select a tool to see properties
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-700 capitalize">
        {activeTool} Properties
      </h3>

      {activeTool === "draw" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
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
            />
          </div>
        </>
      )}

      {activeTool === "arrow" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
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
            />
          </div>
        </>
      )}

      {activeTool === "text" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
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
            />
          </div>
        </>
      )}

      {activeTool === "mask" && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <ColorPicker
              value={colors.mask}
              onChange={(color) => onColorChange("mask", color)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Brush Size: {sizes.brushSize}</label>
            <Slider
              value={[sizes.brushSize]}
              onValueChange={(value) => onSizeChange("brushSize", value[0])}
              min={10}
              max={100}
              step={1}
            />
          </div>
        </>
      )}
    </div>
  );
};
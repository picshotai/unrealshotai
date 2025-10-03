"use client"
import React, { memo } from "react";
import {
  Pen,
  ArrowRight,
  Type,
  Image,
  Lasso,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { ToolButton } from "./ToolButton";
import type { ToolType } from "@/types/photo-editor";

interface DrawingToolbarProps {
  activeTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  className?: string;
  isMaskToolActive?: boolean;
  isGenerating?: boolean;
  hideTools?: ToolType[]; // Tools to hide from UI
  orientation?: "horizontal" | "vertical"; // explicit orientation control
}

const DrawingToolbarComponent: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolSelect,
  className,
  isMaskToolActive = false,
  isGenerating = false,
  hideTools = [],
  orientation,
}) => {
  const isToolDisabled = (tool: ToolType) => {
    if (isGenerating) return true;
    if (tool === "mask") return false; // Mask tool is never disabled by itself
    return isMaskToolActive; // Other tools are disabled when mask is active
  };

  const isToolHidden = (tool: ToolType) => hideTools.includes(tool);

  // Determine layout orientation
  const isHorizontal = orientation
    ? orientation === "horizontal"
    : className?.includes("flex-row");

  return (
    <div
      className={`flex ${isHorizontal ? "flex-row gap-3 items-center justify-center" : "flex-col gap-2"} p-2 bg-white/95 border border-slate-200 rounded-lg ${isHorizontal ? "" : "max-h-96 overflow-y-auto"} ${className || ""}`}
    >
      {/* Draw */}
      {!isToolHidden("draw") && (
        <ToolButton
          tool="draw"
          activeTool={activeTool}
          onSelect={isToolDisabled("draw") ? () => {} : onToolSelect}
          icon={<Pen size={18} />}
          label="Draw"
          disabled={isToolDisabled("draw")}
        />
      )}

      {/* Arrow */}
      {!isToolHidden("arrow") && (
        <ToolButton
          tool="arrow"
          activeTool={activeTool}
          onSelect={isToolDisabled("arrow") ? () => {} : onToolSelect}
          icon={<ArrowRight size={18} />}
          label="Arrow"
          disabled={isToolDisabled("arrow")}
        />
      )}

      {/* Text */}
      {!isToolHidden("text") && (
        <ToolButton
          tool="text"
          activeTool={activeTool}
          onSelect={isToolDisabled("text") ? () => {} : onToolSelect}
          icon={<Type size={18} />}
          label="Text"
          disabled={isToolDisabled("text")}
        />
      )}

      {/* Image */}
      {!isToolHidden("image") && (
        <ToolButton
          tool="image"
          activeTool={activeTool}
          onSelect={isToolDisabled("image") ? () => {} : onToolSelect}
          icon={<Image size={18} />}
          label="Image"
          disabled={isToolDisabled("image")}
        />
      )}

      {/* Mask */}
      {!isToolHidden("mask") && (
        <ToolButton
          tool="mask"
          activeTool={activeTool}
          onSelect={isToolDisabled("mask") ? () => {} : onToolSelect}
          icon={<Lasso size={18} />}
          label="Mask"
          disabled={isToolDisabled("mask")}
        />
      )}

      {/* Prompt */}
      {!isToolHidden("prompt") && (
        <ToolButton
          tool="prompt"
          activeTool={activeTool}
          onSelect={isToolDisabled("prompt") ? () => {} : onToolSelect}
          icon={<MessageSquare size={18} />}
          label="Prompt"
          disabled={isToolDisabled("prompt")}
        />
      )}

      {/* Enhance / Upscale */}
      {!isToolHidden("enhance") && (
        <ToolButton
          tool="enhance"
          activeTool={activeTool}
          onSelect={isToolDisabled("enhance") ? () => {} : onToolSelect}
          icon={<Sparkles size={18} />}
          label="Enhance"
          disabled={isToolDisabled("enhance")}
        />
      )}
    </div>
  );
};

export const DrawingToolbar = memo(DrawingToolbarComponent);
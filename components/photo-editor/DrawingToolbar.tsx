"use client"
import React, { memo } from "react";
import {
  Pen,
  ArrowRight,
  Type,
  Image,
  Lasso,
  MessageSquare,
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
}

const DrawingToolbarComponent: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolSelect,
  className,
  isMaskToolActive = false,
  isGenerating = false,
  hideTools = [],
}) => {
  const isToolDisabled = (tool: ToolType) => {
    if (isGenerating) return true;
    if (tool === "mask") return false; // Mask tool is never disabled by itself
    return isMaskToolActive; // Other tools are disabled when mask is active
  };

  const isToolHidden = (tool: ToolType) => hideTools.includes(tool);

  // Check if className includes "flex-row" to determine horizontal layout
  const isHorizontal = className?.includes("flex-row");

  return (
    <div
      className={`flex ${isHorizontal ? 'flex-row gap-3 items-center justify-center' : 'flex-col gap-2'} p-3 bg-white/95 border border-slate-200 rounded-xl ${isHorizontal ? '' : 'max-h-96 overflow-y-auto'} ${className}`}
    >
      {!isHorizontal}

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
    </div>
  );
};

export const DrawingToolbar = memo(DrawingToolbarComponent);
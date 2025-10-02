import React from "react";
import { Button } from "@/components/ui/button";
import type { ToolType } from "@/types/photo-editor";

interface ToolButtonProps {
  tool: ToolType;
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  tool,
  activeTool,
  onSelect,
  icon,
  label,
  disabled = false,
  className,
}) => {
  const isActive = activeTool === tool;
  
  return (
    <button
      disabled={disabled}
      onClick={() => onSelect(tool)}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      } ${className}`}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
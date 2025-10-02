"use client"
import React from "react";

interface DottedCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export const DottedCanvas: React.FC<DottedCanvasProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(circle, #cbd5e1 1px, transparent 1px),
          radial-gradient(circle, #e2e8f0 0.5px, transparent 0.5px)
        `,
        backgroundSize: '40px 40px, 10px 10px',
        backgroundPosition: '0 0, 0 0',
        backgroundColor: '#f8fafc',
      }}
    >
      {children}
    </div>
  );
};
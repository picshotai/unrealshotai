"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"

interface ImageCompareSliderProps {
  beforeImage: string
  afterImage: string
  labelPosition?: "top" | "bottom"
  className?: string
}

export const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({
  beforeImage,
  afterImage,
  labelPosition = "bottom",
  className = "",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }

  return (
    <div
      className={`relative aspect-square w-full ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => handleMouseMove(e.touches[0] as unknown as React.MouseEvent<HTMLDivElement>)}
    >
      {/* After image (background) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage || "/placeholder.svg"}
          alt="After enhancement"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Before image (slider) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image
          src={beforeImage || "/placeholder.svg"}
          alt="Before enhancement"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Slider line and handle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize" style={{ left: `${sliderPosition}%` }}>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Labels */}
      <div
        className={`absolute ${labelPosition === "top" ? "top-2" : "bottom-2"} left-2 bg-black/50 text-white px-2 py-1 text-sm rounded`}
      >
        Before
      </div>
      <div
        className={`absolute ${labelPosition === "top" ? "top-2" : "bottom-2"} right-2 bg-black/50 text-white px-2 py-1 text-sm rounded`}
      >
        After
      </div>
    </div>
  )
}


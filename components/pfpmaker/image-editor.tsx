"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"


export interface ImageTransform {
  zoom: number
  horizontalOffset: number
  verticalOffset: number
  rotation: number
}

interface ImageEditorProps {
  image: string | null
  onImageChange: (image: string | null) => void
  onTransformChange: (transform: ImageTransform) => void
  onDownload: () => void
  initialTransform: ImageTransform
}

export function ImageEditor({
  onTransformChange,
  initialTransform,
}: ImageEditorProps) {
  const [zoom, setZoom] = useState([initialTransform.zoom])
  const [horizontalOffset, setHorizontalOffset] = useState([initialTransform.horizontalOffset])
  const [verticalOffset, setVerticalOffset] = useState([initialTransform.verticalOffset])
  const [rotation, setRotation] = useState([initialTransform.rotation])

  // Initialize sliders with current transform values when tab is switched
  useEffect(() => {
    setZoom([initialTransform.zoom])
    setHorizontalOffset([initialTransform.horizontalOffset])
    setVerticalOffset([initialTransform.verticalOffset])
    setRotation([initialTransform.rotation])
  }, [initialTransform])

  const updateTransform = (newTransform: Partial<ImageTransform>) => {
    const transform: ImageTransform = {
      zoom: newTransform.zoom !== undefined ? newTransform.zoom : zoom[0],
      horizontalOffset:
        newTransform.horizontalOffset !== undefined ? newTransform.horizontalOffset : horizontalOffset[0],
      verticalOffset: newTransform.verticalOffset !== undefined ? newTransform.verticalOffset : verticalOffset[0],
      rotation: newTransform.rotation !== undefined ? newTransform.rotation : rotation[0],
    }
    onTransformChange(transform)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Zoom ({zoom[0].toFixed(2)}x)</Label>
        <Slider
          value={zoom}
          onValueChange={(value) => {
            setZoom(value)
            updateTransform({ zoom: value[0] })
          }}
          min={0.1}
          max={3}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Horizontal Offset ({horizontalOffset[0]}%)</Label>
        <Slider
          value={horizontalOffset}
          onValueChange={(value) => {
            setHorizontalOffset(value)
            updateTransform({ horizontalOffset: value[0] })
          }}
          min={-50}
          max={50}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Vertical Offset ({verticalOffset[0]}%)</Label>
        <Slider
          value={verticalOffset}
          onValueChange={(value) => {
            setVerticalOffset(value)
            updateTransform({ verticalOffset: value[0] })
          }}
          min={-50}
          max={50}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Rotation ({rotation[0]}°)</Label>
        <Slider
          value={rotation}
          onValueChange={(value) => {
            setRotation(value)
            updateTransform({ rotation: value[0] })
          }}
          min={-180}
          max={180}
          step={1}
        />
      </div>

    </div>
  )
}


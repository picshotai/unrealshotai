// components/pfpmaker/border-editor.tsx

"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface BorderEditorProps {
  onBorderChange: (border: {
    width: number
    color: string
    offset: number
    shape: "circle" | "square"
  }) => void
  initialBorder: {
    width: number
    color: string
    offset: number
    shape: "circle" | "square"
  }
}

export function BorderEditor({ onBorderChange, initialBorder }: BorderEditorProps) {
  const [borderWidth, setBorderWidth] = useState([initialBorder.width])
  const [borderColor, setBorderColor] = useState(initialBorder.color)
  const [borderOffset, setBorderOffset] = useState([initialBorder.offset])
  const [shape, setShape] = useState<"circle" | "square">(initialBorder.shape)

  useEffect(() => {
    setBorderWidth([initialBorder.width])
    setBorderColor(initialBorder.color)
    setBorderOffset([initialBorder.offset])
    setShape(initialBorder.shape)
  }, [initialBorder])

  const updateBorder = (updates: Partial<typeof initialBorder>) => {
    onBorderChange({
      width: updates.width !== undefined ? updates.width : borderWidth[0],
      color: updates.color || borderColor,
      offset: updates.offset !== undefined ? updates.offset : borderOffset[0],
      shape: updates.shape || shape,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Shape</Label>
        <Select
          value={shape}
          onValueChange={(value: "circle" | "square") => {
            setShape(value)
            updateBorder({ shape: value })
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="square">Square</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={borderColor}
            onChange={(e) => {
              setBorderColor(e.target.value)
              updateBorder({ color: e.target.value })
            }}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Width ({borderWidth[0]}px)</Label>
        <Slider
          value={borderWidth}
          onValueChange={(value) => {
            setBorderWidth(value)
            updateBorder({ width: value[0] })
          }}
          min={0}
          max={20}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Offset ({borderOffset[0]}px)</Label>
        <Slider
          value={borderOffset}
          onValueChange={(value) => {
            setBorderOffset(value)
            updateBorder({ offset: value[0] })
          }}
          min={0}
          max={20}
          step={1}
        />
      </div>
    </div>
  )
}


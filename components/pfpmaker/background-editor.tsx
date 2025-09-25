"use client"

import { useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PatternPicker } from "./pattern-picker"
import type { Pattern } from "@/lib/patterns"

type BackgroundType =
  | { type: "transparent" }
  | { type: "solid"; color: string; pattern: Pattern | null }
  | { type: "gradient"; from: string; to: string; angle: number; pattern: Pattern | null }

interface BackgroundEditorProps {
  onBackgroundChange: (background: BackgroundType) => void
  onApplyCustomBackgroundChange: (apply: boolean) => void
  image: string | null
  onImageChange: (image: string | null) => void
  initialBackground: BackgroundType
  applyCustomBackground: boolean
}

export function BackgroundEditor({
  onBackgroundChange,
  onApplyCustomBackgroundChange,
  image,
  onImageChange,
  initialBackground,
  applyCustomBackground,
}: BackgroundEditorProps) {
  const [style, setStyle] = useState<"gradient" | "solid">(initialBackground.type === "gradient" ? "gradient" : "solid")
  const [fromColor, setFromColor] = useState(
    initialBackground.type !== "transparent"
      ? initialBackground.type === "gradient"
        ? initialBackground.from
        : initialBackground.color
      : "rgba(76, 110, 245, 1)",
  )
  const [toColor, setToColor] = useState(
    initialBackground.type === "gradient" ? initialBackground.to : "rgba(121, 80, 242, 1)",
  )
  const [angle, setAngle] = useState([initialBackground.type === "gradient" ? initialBackground.angle : 90])
  const [pattern, setPattern] = useState<Pattern | null>(
    initialBackground.type !== "transparent" ? initialBackground.pattern : null,
  )
  const [isRemoving, setIsRemoving] = useState(false)
  const { toast } = useToast()

  const updateBackground = useCallback(() => {
    if (!applyCustomBackground) {
      onBackgroundChange({ type: "transparent" })
    } else if (style === "gradient") {
      onBackgroundChange({
        type: "gradient",
        from: fromColor,
        to: toColor,
        angle: angle[0],
        pattern,
      })
    } else {
      onBackgroundChange({
        type: "solid",
        color: fromColor,
        pattern,
      })
    }
  }, [applyCustomBackground, style, fromColor, toColor, angle, pattern, onBackgroundChange])

  useEffect(() => {
    updateBackground()
  }, [updateBackground])

  const handleRemoveBackground = async () => {
    if (!image) return

    setIsRemoving(true)
    try {
      const response = await fetch("/api/remove-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to remove background")
      }

      const { predictionId, usageCount } = await response.json()

      // Poll for the result
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`/api/remove-background?id=${predictionId}`)
        const statusData = await statusResponse.json()

        if (statusData.output) {
          clearInterval(pollInterval)
          onImageChange(statusData.output)
          toast({
            title: "Background removed",
            description: `The background has been successfully removed. You have ${3 - usageCount} uses left today.`,
          })
          setIsRemoving(false)
        } else if (statusData.error) {
          clearInterval(pollInterval)
          throw new Error(statusData.error)
        }
      }, 1000)
    } catch (error) {
      console.error("Error removing background:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove background. Please try again later.",
        variant: "destructive",
      })
      setIsRemoving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="apply-bg">Apply custom background</Label>
        <Switch
          id="apply-bg"
          checked={applyCustomBackground}
          onCheckedChange={(checked) => {
            onApplyCustomBackgroundChange(checked)
            updateBackground()
          }}
        />
      </div>
      <p className="text-sm text-gray-500">
        Toggle to apply a custom background color or gradient behind the image. To remove the image's own background,
        use "Remove background with AI" below.
      </p>

      <Button onClick={handleRemoveBackground} disabled={isRemoving || !image} className="w-full">
        {isRemoving ? "Removing background..." : "Remove background with AI"}
      </Button>

      {applyCustomBackground && (
        <>
          <div className="space-y-2">
            <Label>Style</Label>
            <RadioGroup
              value={style}
              onValueChange={(value: "gradient" | "solid") => {
                setStyle(value)
                updateBackground()
              }}
              className="grid grid-cols-2 gap-2"
            >
              <Label
                htmlFor="gradient"
                className={`flex items-center justify-center border rounded-md p-4 cursor-pointer transition-colors ${
                  style === "gradient" ? "bg-primary text-primary-foreground" : "bg-background"
                }`}
              >
                <RadioGroupItem value="gradient" id="gradient" className="sr-only" />
                Gradient
              </Label>
              <Label
                htmlFor="solid"
                className={`flex items-center justify-center border rounded-md p-4 cursor-pointer transition-colors ${
                  style === "solid" ? "bg-primary text-primary-foreground" : "bg-background"
                }`}
              >
                <RadioGroupItem value="solid" id="solid" className="sr-only" />
                Solid
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={fromColor}
                  onChange={(e) => {
                    setFromColor(e.target.value)
                    updateBackground()
                  }}
                  className="w-full"
                />
              </div>
            </div>

            {style === "gradient" && (
              <>
                <div className="space-y-2">
                  <Label>To</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={toColor}
                      onChange={(e) => {
                        setToColor(e.target.value)
                        updateBackground()
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Angle ({angle[0]}°)</Label>
                  <Slider
                    value={angle}
                    onValueChange={(value) => {
                      setAngle(value)
                      updateBackground()
                    }}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Pattern</Label>
              <PatternPicker
                value={pattern}
                onChange={(newPattern) => {
                  setPattern(newPattern)
                  updateBackground()
                }}
                baseColor={style === "gradient" ? fromColor : fromColor}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// app\profile-photo-maker\page.tsx

"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload } from "lucide-react"
import { ImageEditor, type ImageTransform } from "@/components/pfpmaker/image-editor"
import { BackgroundEditor } from "@/components/pfpmaker/background-editor"
import { BorderEditor } from "@/components/pfpmaker/border-editor"
import { Toaster } from "@/components/ui/toaster"
import type { Pattern } from "@/lib/patterns"
import SocialMediaPreview from "@/components/pfpmaker/social-media-preview"
import HeroSection from "@/components/pfpmaker/pfpcontent"
import EnhancedLandingPage from "@/components/pfpmaker/enhanced-landing-page"



type BackgroundType =
  | { type: "transparent" }
  | { type: "solid"; color: string; pattern: Pattern | null }
  | { type: "gradient"; from: string; to: string; angle: number; pattern: Pattern | null }

export default function ProfilePhotoMaker() {
  const hasPattern = (bg: BackgroundType): bg is Extract<BackgroundType, { pattern: Pattern | null }> => {
    return bg.type === "solid" || bg.type === "gradient"
  }

  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [modifiedImage, setModifiedImage] = useState<string | null>(null)
  const [applyCustomBackground, setApplyCustomBackground] = useState(false)
  const [background, setBackground] = useState<BackgroundType>({ type: "transparent" })
  const [border, setBorder] = useState({
    width: 4,
    color: "#CECECE",
    offset: 0,
    shape: "circle" as "circle" | "square",
  })
  const [transform, setTransform] = useState<ImageTransform>({
    zoom: 1,
    horizontalOffset: 0,
    verticalOffset: 0,
    rotation: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setOriginalImage(result)
        setModifiedImage(result)
        // Load image to get dimensions
        const img = new Image()
        img.onload = () => {
          const aspectRatio = img.width / img.height
          if (aspectRatio < 1) {
            // Portrait image
            setTransform({
              zoom: 1,
              horizontalOffset: 0,
              verticalOffset: 25, // Shift image down to show more of the top
              rotation: 0,
            })
          } else {
            setTransform({
              zoom: 1,
              horizontalOffset: 0,
              verticalOffset: 0,
              rotation: 0,
            })
          }
        }
        img.src = result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const applyTransformToCanvas = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!canvasRef.current || !originalImage) {
        resolve()
        return
      }

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve()
        return
      }

      // Set canvas dimensions
      canvas.width = 600
      canvas.height = 600

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const canvasSize = canvas.width
      const centerX = canvasSize / 2
      const centerY = canvasSize / 2
      const imageSize = canvasSize * 0.8 // 480 pixels for a 600px canvas
      const imageRadius = imageSize / 2

      // Calculate clipping area with offset
      const clippingRadius = imageRadius - border.offset
      const clippingSize = imageSize - 2 * border.offset

      // Load the image
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const baseScale = Math.max(clippingSize / img.width, clippingSize / img.height)
        const overallScale = baseScale * transform.zoom

        // Create a temporary canvas for background and pattern
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext("2d")

        if (!tempCtx) {
          resolve()
          return
        }

        // Function to draw the main canvas content
        const drawMainCanvas = () => {
          // Apply clipping to main canvas
          ctx.save()
          ctx.beginPath()
          if (border.shape === "circle") {
            ctx.arc(centerX, centerY, clippingRadius, 0, Math.PI * 2)
          } else {
            const x = (canvasSize - clippingSize) / 2
            const y = (canvasSize - clippingSize) / 2
            ctx.rect(x, y, clippingSize, clippingSize)
          }
          ctx.clip()

          // Draw background from temporary canvas
          if (applyCustomBackground) {
            ctx.drawImage(tempCanvas, 0, 0)
          }

          // Draw the image
          ctx.save()
          ctx.translate(centerX, centerY)
          ctx.rotate((transform.rotation * Math.PI) / 180)
          const offsetX = ((transform.horizontalOffset / 100) * clippingSize) / overallScale
          const offsetY = ((transform.verticalOffset / 100) * clippingSize) / overallScale
          ctx.translate(offsetX, offsetY)
          ctx.scale(overallScale, overallScale)

          ctx.drawImage(img, 0, 0, img.width, img.height, -img.width / 2, -img.height / 2, img.width, img.height)
          ctx.restore()

          // Restore clipping
          ctx.restore()

          // Draw border
          if (border.width > 0) {
            ctx.lineWidth = border.width
            ctx.strokeStyle = border.color
            ctx.beginPath()
            if (border.shape === "circle") {
              ctx.arc(centerX, centerY, imageRadius, 0, Math.PI * 2)
            } else {
              const x = (canvasSize - imageSize) / 2
              const y = (canvasSize - imageSize) / 2
              ctx.rect(x, y, imageSize, imageSize)
            }
            ctx.stroke()
          }

          resolve()
        }

        // Draw background and pattern
        if (applyCustomBackground) {
          // Apply background
          if (background.type === "solid") {
            tempCtx.fillStyle = background.color
            tempCtx.fillRect(0, 0, canvas.width, canvas.height)
          } else if (background.type === "gradient") {
            const rad = (background.angle * Math.PI) / 180
            const dx = Math.cos(rad)
            const dy = Math.sin(rad)
            const length = Math.hypot(canvas.width, canvas.height)
            const x0 = centerX - (dx * length) / 2
            const y0 = centerY - (dy * length) / 2
            const x1 = centerX + (dx * length) / 2
            const y1 = centerY + (dy * length) / 2
            const gradient = tempCtx.createLinearGradient(x0, y0, x1, x1)
            gradient.addColorStop(0, background.from)
            gradient.addColorStop(1, background.to)
            tempCtx.fillStyle = gradient
            tempCtx.fillRect(0, 0, canvas.width, canvas.height)
          }

          // Apply pattern if it exists
          if ((background.type === "solid" || background.type === "gradient") && background.pattern) {
            const patternImg = new Image()
            patternImg.crossOrigin = "anonymous"
            patternImg.onload = () => {
              // Create a separate canvas for the pattern
              const patternCanvas = document.createElement("canvas")
              patternCanvas.width = canvas.width
              patternCanvas.height = canvas.height
              const patternCtx = patternCanvas.getContext("2d")

              if (patternCtx) {
                // Create the pattern
                const pattern = patternCtx.createPattern(patternImg, "repeat")
                if (pattern) {
                  // Fill the pattern canvas with the pattern
                  patternCtx.fillStyle = pattern
                  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height)

                  // Apply the color to the pattern
                  patternCtx.globalCompositeOperation = "source-in"
                  patternCtx.fillStyle = background.pattern?.color || "#000000"
                  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height)

                  // Draw the colored pattern onto the main canvas
                  tempCtx.globalAlpha = 0.3
                  tempCtx.drawImage(patternCanvas, 0, 0)
                  tempCtx.globalAlpha = 1.0
                }
              }
              drawMainCanvas()
            }
            patternImg.src = background.pattern.svg
          } else {
            drawMainCanvas()
          }
        } else {
          drawMainCanvas()
        }
      }
      img.src = originalImage
    })
  }, [originalImage, transform, background, border, applyCustomBackground])

  const handleDownload = async () => {
    if (!canvasRef.current) return
    await applyTransformToCanvas()
    const dataUrl = canvasRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = "profile-photo.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    applyTransformToCanvas().then(() => {
      if (canvasRef.current) {
        setPreviewImageUrl(canvasRef.current.toDataURL("image/png"))
      }
    })
  }, [applyTransformToCanvas])

  const handleImageUpdate = (newImage: string | null) => {
    setOriginalImage(newImage)
    setModifiedImage(newImage)
  }
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative  py-24 checked-background mx-auto">
        {/* Main content area */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 py-8 px-4 ">
          {/* Left side - Image preview and controls */}
          <div className="flex-1 flex flex-col items-center gap-6 px-4 py-4 lg:px-0">
            {/* Canvas/Image preview area */}
            <div className="w-full max-w-[600px] aspect-square relative">
              {originalImage ? (
                <canvas ref={canvasRef} className="w-full h-full" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center bg-gray-100"
                  style={{
                    borderRadius: border.shape === "circle" ? "50%" : "0",
                  }}
                >
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Action buttons below image */}
            {originalImage ? (
              <div className="w-full max-w-[600px] flex mb-4 gap-3">
                <Button onClick={handleDownload} className="flex-1 px-4" size="lg">
                  Download
                </Button>
                <SocialMediaPreview imageUrl={previewImageUrl} />
                <Button
                  variant="outline"
                  onClick={() => {
                    setOriginalImage(null)
                    setModifiedImage(null)
                  }}
                  className="flex-1 px-4 bg-white"
                  size="lg"
                >
                  Reset
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <Button onClick={handleUploadClick} size="lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload photo
                </Button>
              </div>
            )}
          </div>

          {/* Right side - Editor panel */}
          <div className="w-full lg:w-[300px] lg:right-4 xl:right-8 2xl:right-12 lg:top-8">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <Tabs defaultValue="border">
                <TabsList className="w-full">
                  <TabsTrigger value="border" className="flex-1">
                    Border
                  </TabsTrigger>
                  <TabsTrigger value="headshot" className="flex-1">
                    Headshot
                  </TabsTrigger>
                  <TabsTrigger value="background" className="flex-1">
                    Background
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="border">
                    <BorderEditor onBorderChange={setBorder} initialBorder={border} />
                  </TabsContent>

                  <TabsContent value="headshot">
                    {originalImage ? (
                      <ImageEditor
                        image={originalImage}
                        onImageChange={setOriginalImage}
                        onTransformChange={setTransform}
                        onDownload={handleDownload}
                        initialTransform={transform}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">Upload a photo to start editing</div>
                    )}
                  </TabsContent>

                  <TabsContent value="background">
                    <BackgroundEditor
                      onBackgroundChange={setBackground}
                      onApplyCustomBackgroundChange={setApplyCustomBackground}
                      image={modifiedImage}
                      onImageChange={handleImageUpdate} // Changed from setModifiedImage
                      initialBackground={background}
                      applyCustomBackground={applyCustomBackground}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <HeroSection />
      <EnhancedLandingPage />
      <Toaster />
    </div>
  )
}


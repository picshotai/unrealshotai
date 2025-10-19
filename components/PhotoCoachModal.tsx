'use client'

import { useState, useRef } from 'react'
import { X, Check, Upload, Loader2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'next/navigation'
import { formatBytes } from '@/hooks/use-file-upload'

interface PhotoCoachModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface Step {
  id: number
  title: string
  subtitle?: string
  content: React.ReactNode
}

export default function PhotoCoachModal({ isOpen, onClose, onComplete }: PhotoCoachModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const { completeOnboarding, loading } = useUserStore()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Instant preview state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string>('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const styleOptions = [
    { key: 'professional', label: 'Professional', description: 'Clean, business-ready headshots' },
    { key: 'glamour', label: 'Glamour', description: 'Elegant and sophisticated portraits' },
    { key: 'creative', label: 'Creative', description: 'Artistic and unique styles' },
    { key: 'natural', label: 'Natural', description: 'Relaxed, colorful, natural looks' }
  ]

  const createWatermarkedImage = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img')
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) {
          reject(new Error('Canvas not available'))
          return
        }
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        // Set canvas size to match image
        canvas.width = img.width
        canvas.height = img.height

        // Draw the original image
        ctx.drawImage(img, 0, 0)

        // Load and draw site logo watermark with text
        const logo = document.createElement('img')
        logo.crossOrigin = 'anonymous'
        logo.onload = () => {
          const logoSize = Math.min(img.width, img.height) * 0.04 // 4% of image size
          const padding = 20
          const textPadding = 8
          const cornerRadius = 6
          
          // Calculate text dimensions
          const fontSize = logoSize * 0.9
          ctx.font = `600 ${fontSize}px Arial` // Semi-bold font
          const textMetrics = ctx.measureText('Unrealshot AI')
          const textWidth = textMetrics.width
          
          // Calculate total dimensions
          const totalWidth = logoSize + textPadding + textWidth
          const totalHeight = logoSize
          const bgPadding = 4
          
          // Position from bottom-right
          const x = img.width - totalWidth - padding - bgPadding
          const y = img.height - totalHeight - padding - bgPadding
          
          // Draw rounded rectangle background (similar to bg-white/80 p-1 rounded)
          const bgX = x - bgPadding
          const bgY = y - bgPadding
          const bgWidth = totalWidth + (bgPadding * 2)
          const bgHeight = totalHeight + (bgPadding * 2)
          
          // Create rounded rectangle path
          ctx.beginPath()
          ctx.moveTo(bgX + cornerRadius, bgY)
          ctx.lineTo(bgX + bgWidth - cornerRadius, bgY)
          ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + cornerRadius)
          ctx.lineTo(bgX + bgWidth, bgY + bgHeight - cornerRadius)
          ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - cornerRadius, bgY + bgHeight)
          ctx.lineTo(bgX + cornerRadius, bgY + bgHeight)
          ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - cornerRadius)
          ctx.lineTo(bgX, bgY + cornerRadius)
          ctx.quadraticCurveTo(bgX, bgY, bgX + cornerRadius, bgY)
          ctx.closePath()
          
          // Fill background with semi-transparent white
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fill()
          
          // Draw logo with slight opacity
          ctx.globalAlpha = 0.7
          ctx.drawImage(logo, x, y, logoSize, logoSize)
          
          // Draw text
          ctx.globalAlpha = 1.0
          ctx.fillStyle = '#000000'
          ctx.font = `600 ${fontSize}px Arial`
          ctx.textBaseline = 'middle'
          ctx.fillText('Unrealshot AI', x + logoSize + textPadding, y + logoSize / 2)

          // Convert to data URL
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        logo.onerror = () => {
          // If logo fails to load, just add text watermark with background
          const fontSize = Math.min(img.width, img.height) * 0.025
          const padding = 20
          const bgPadding = 8
          const cornerRadius = 6
          
          ctx.font = `600 ${fontSize}px Arial`
          const textMetrics = ctx.measureText('Unrealshot AI')
          const textWidth = textMetrics.width
          
          // Position and dimensions
          const x = img.width - textWidth - padding - bgPadding
          const y = img.height - fontSize - padding - bgPadding
          const bgWidth = textWidth + (bgPadding * 2)
          const bgHeight = fontSize + (bgPadding * 2)
          
          // Draw rounded background
          ctx.beginPath()
          ctx.moveTo(x - bgPadding + cornerRadius, y - bgPadding)
          ctx.lineTo(x - bgPadding + bgWidth - cornerRadius, y - bgPadding)
          ctx.quadraticCurveTo(x - bgPadding + bgWidth, y - bgPadding, x - bgPadding + bgWidth, y - bgPadding + cornerRadius)
          ctx.lineTo(x - bgPadding + bgWidth, y - bgPadding + bgHeight - cornerRadius)
          ctx.quadraticCurveTo(x - bgPadding + bgWidth, y - bgPadding + bgHeight, x - bgPadding + bgWidth - cornerRadius, y - bgPadding + bgHeight)
          ctx.lineTo(x - bgPadding + cornerRadius, y - bgPadding + bgHeight)
          ctx.quadraticCurveTo(x - bgPadding, y - bgPadding + bgHeight, x - bgPadding, y - bgPadding + bgHeight - cornerRadius)
          ctx.lineTo(x - bgPadding, y - bgPadding + cornerRadius)
          ctx.quadraticCurveTo(x - bgPadding, y - bgPadding, x - bgPadding + cornerRadius, y - bgPadding)
          ctx.closePath()
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fill()
          
          // Draw text
          ctx.fillStyle = '#000000'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText('Unrealshot AI', x, y + fontSize / 2)
          
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        logo.src = '/site-logo.png'
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageUrl
    })
  }

  const downloadImage = async () => {
    if (!generatedImage) return

    try {
      const watermarkedImage = await createWatermarkedImage(generatedImage)
      const link = document.createElement('a')
      link.download = `ai-preview-${Date.now()}.jpg`
      link.href = watermarkedImage
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1]) // Remove data:image/jpeg;base64, prefix
      }
      reader.onerror = error => reject(error)
    })
  }

  const generatePreview = async () => {
    if (selectedFiles.length === 0) {
      setPreviewError('Please select at least one image')
      return
    }

    setIsGenerating(true)
    setPreviewError(null)

    try {
      const imagesBase64 = await Promise.all(
        selectedFiles.map(file => convertToBase64(file))
      )

      const response = await fetch('/api/instant-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagesBase64,
          styleKey: selectedStyle
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate preview')
      }

      setGeneratedImage(data.image_url)
    } catch (error) {
      console.error('Preview generation error:', error)
      setPreviewError(error instanceof Error ? error.message : 'Failed to generate preview')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 2) {
      setPreviewError('Please select up to 2 images only')
      return
    }
    setSelectedFiles(files)
    setPreviewError(null)
  }

  const steps: Step[] = [
    {
      id: 0,
      title: "Welcome to Professional AI Photography",
      subtitle: "The quality of your AI photoshoot depends entirely on the photos you upload. Let's ensure you get stunning results.",
      content: (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Our AI will learn from every image you provide. Higher quality inputs result in more professional, realistic outputs that accurately represent your appearance.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">Upload clear, well-lit photos for optimal training</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">Show different angles and expressions</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">Avoid obstructions like sunglasses or hats</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "The Magic Number: 10 Images",
      subtitle: "Though we support minimum 5 images but we recommend uploading exactly 10 images to train the AI effectively and achieve professional results",
      content: (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/selfie2.jpg" alt="Face expressions" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">5</div>
              </div>
              <span className="text-xs text-gray-600">Face</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/vishnuselfie.jpg" alt="Half body" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">2</div>
              </div>
              <span className="text-xs text-gray-600">Half</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/you-man.jpg" alt="Left profile" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">1</div>
              </div>
              <span className="text-xs text-gray-600">Left</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/right-profile.jpg" alt="Right profile" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">1</div>
              </div>
              <span className="text-xs text-gray-600">Right</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/full-body.jpg" alt="Full body" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">1</div>
              </div>
              <span className="text-xs text-gray-600">Full</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">5 facial images with different expressions</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">2 half-body shots showing your upper body</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">1 left-side profile and 1 right-side profile</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">1 full-body image showing your entire physique</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Upload photos like these:",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/good-lighting.png" alt="Good lighting example" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">Good lighting</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/confident.jpg" alt="Clear background example" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">Clear background</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/selfie2.jpg" alt="Clear portrait" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">Clear portraits</span>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 3,
      title: "Avoid uploading photos like these:",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/groupphoto.webp" alt="Clear portrait" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">No Group Photos</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/nocaps.webp" alt="Clear portrait" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">NO caps or accessories</span>
            </div>
          </Card>
 
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/sillyface.webp" alt="Blurry shot example" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">No Silly Faces</span>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 4,
      title: "Get Your FREE AI Proof Shot OR skip to unlock full photoshoot",
      subtitle: "Upload 1-2 photos to see the real quality our AI delivers.",
      content: (
        <div className="mt-6 space-y-6">
          {/* Show generated image only when available */}
          {generatedImage ? (
            <div className="space-y-4">
            
              
              {/* Responsive image container with portrait 3:4 aspect ratio - made smaller for mobile */}
              <div className="relative w-full max-w-[200px] sm:max-w-xs mx-auto">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border shadow-sm bg-gray-100">
                  <img
                    src={generatedImage}
                    alt="Generated preview"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    style={{ 
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none'
                    }}
                  />
                  {/* Site logo watermark */}
                  <div className="absolute text-xs font-semibold bottom-2 right-2 flex items-center gap-1 bg-white/80 p-1 rounded pointer-events-none select-none">
                    <img
                      src="/site-logo.png"
                      alt="Watermark"
                      className="w-5 h-5 opacity-70 rounded select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    Unrealshot AI
                  </div>
                  {/* Invisible overlay to prevent right-click bypass */}
                  <div 
                    className="absolute inset-0 z-10"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    style={{ 
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download Preview
                </Button>
               
              </div>

              {/* Hidden canvas for watermark generation */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : isGenerating ? (
            /* Show loader when generating */
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">Generating your AI-version...</p>
                <p className="text-xs text-gray-600 mt-1">This may take a few moments</p>
              </div>
            </div>
          ) : (
            /* Show upload form when no image generated */
            <>
              {/* Upload Section - Only show if no files uploaded */}
              {selectedFiles.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    id="preview-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="preview-upload"
                    className="cursor-pointer"
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload 1-2 photos (max 10MB each)
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, or WEBP formats
                    </p>
                  </label>
                </div>
              )}

              {/* File List - Compact design like TrainModelZone */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Uploaded Photos ({selectedFiles.length}/2)</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFiles([])}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </Button>
                  </div>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-accent aspect-square shrink-0 rounded">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="size-10 rounded-[inherit] object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="truncate text-[13px] font-medium">
                            {file.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatBytes(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFiles = selectedFiles.filter((_, i) => i !== index)
                          setSelectedFiles(newFiles)
                        }}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Style Picker */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Choose a style:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {styleOptions.map((style) => (
                    <button
                      key={style.key}
                      onClick={() => setSelectedStyle(style.key)}
                      className={`p-2 text-left border rounded-lg transition-colors ${
                        selectedStyle === style.key
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-xs">{style.label}</div>
                      <div className="text-xs text-gray-500 leading-tight">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generatePreview}
                disabled={selectedFiles.length === 0}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
                size="sm"
              >
                Generate My Free Proof Shot
              </Button>

              {/* Error Display */}
              {previewError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{previewError}</p>
                </div>
              )}
            </>
          )}
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    // Redirect to buy-credits page immediately to avoid dashboard flash
    router.push('/buy-credits')
    
    // Call server-side completion in background
    await completeOnboarding()
    
    // Close modal and reset state
    onComplete()
    setCurrentStep(0)
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Fixed height to prevent scrolling */}
        <div className="p-4 flex-1 overflow-hidden">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            {currentStepData.subtitle && (
              <p className="text-sm text-gray-600 max-w-xl mx-auto">
                {currentStepData.subtitle}
              </p>
            )}
          </div>

          <div className="overflow-hidden">
            {currentStepData.content}
          </div>
         

          {/* Preview step confirmation - Removed checkbox dependency */}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 text-sm"
          >
            ← Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="px-6 bg-gray-900 hover:bg-gray-800 text-sm"
              >
                {currentStep === 4 ? 'Unlock Full 20-Photo Shoot →' : 'Next →'}
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading || isGenerating}
                className="px-6 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Completing...' : isGenerating ? 'Generating Image...' : 'Unlock Full 20-Photo Shoot'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Upload, X, AlertCircle, Download, CoinsIcon as Coin, Sparkles } from "lucide-react"
import { ImageCompareSlider } from "@/components/ImageCompareSlider"
import AnimatedLoader from "@/components/AnimatedLoader"
import { createClient } from '@/utils/supabase/client';
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]

export default function ImageEnhancer() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [freeTryUsed, setFreeTryUsed] = useState<boolean>(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const supabase = createClient(); // Use server client
  const searchParams = useSearchParams()

  // Fetch user data (credits and free try status)
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        window.location.href = "/login"
        return
      }

      const { data, error } = await supabase
        .from("credits")
        .select("credits")
        .eq("user_id", userData.user.id)
        .single()

        if (error) {
          // Check if the error is because no record exists (typically 'no rows returned')
          if (error.code === 'PGRST116' || error.message.includes('0 rows')) {
            // Set default values for new users
            setUserCredits(0)
            setFreeTryUsed(false)
          } else {
            // Handle other actual errors
            console.error("Error fetching user data:", error)
            setError("Unable to load user data. Please try again.")
          }
        } else {
          setUserCredits(data.credits || 0)
        }
      }
      fetchUserData()
    }, [supabase])

  // Handle image URL from query params
  const isValidImageUrl = useCallback((url: string) => {
    try {
      const parsedUrl = new URL(url)
      return (
        ["http:", "https:"].includes(parsedUrl.protocol) &&
        (parsedUrl.pathname.endsWith(".jpg") ||
         parsedUrl.pathname.endsWith(".jpeg") ||
         parsedUrl.pathname.endsWith(".png") ||
         parsedUrl.pathname.endsWith(".webp"))
      )
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    const imageUrl = searchParams.get("imageUrl")
    if (imageUrl && isValidImageUrl(imageUrl)) {
      const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
      setPreviewUrl(proxiedUrl)
      fetch(proxiedUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch image")
          return res.blob()
        })
        .then((blob) => {
          const file = new File([blob], "image.jpg", { type: blob.type })
          setFile(file)
        })
        .catch((err) => {
          console.error("Error fetching image:", err)
          setError("Error loading image from URL")
        })
    } else if (imageUrl) {
      setError("Invalid image URL provided.")
    }
  }, [searchParams, isValidImageUrl])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload a JPEG, PNG, or WebP image."
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    }
    return null
  }

  const handleFileChange = (selectedFile: File) => {
    const validationError = validateFile(selectedFile)
    if (validationError) {
      setError(validationError)
      return
    }
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setResultUrl(null)
    setError(null)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileChange(droppedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !previewUrl) {
      setError("Please select an image to enhance.")
      return
    }
    if (freeTryUsed && userCredits < 0.2) {
      setError("Insufficient credits. Please purchase more credits.")
      return
    }
    setIsProcessing(true)
    setError(null)
    setProcessingProgress(0)

    try {
      let base64data: string
      if (file) {
        base64data = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      } else {
        const response = await fetch(previewUrl!)
        if (!response.ok) throw new Error("Failed to fetch image")
        const blob = await response.blob()
        base64data = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
      }

      const response = await fetch("/api/enhance-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64data }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error enhancing image")

      setPredictionId(data.predictionId)
      if (freeTryUsed) {
        setUserCredits((prev) => prev - 0.2)
      } else {
        setFreeTryUsed(true)
      }
      checkPredictionStatus()
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Error processing image")
      setIsProcessing(false)
    }
  }

  const checkPredictionStatus = useCallback(
    async (retryCount = 0) => {
      if (!predictionId) return
      try {
        const response = await fetch(`/api/enhance-image?id=${predictionId}`)
        if (!response.ok) throw new Error("Failed to get prediction status")
        const data = await response.json()

        if (data.output) {
          setResultUrl(data.output)
          setIsProcessing(false)
          setPredictionId(null)
          setProcessingProgress(100)
          toast({ title: "Image Enhanced", description: "Your image has been successfully enhanced." })
        } else if (data.error) {
          throw new Error(data.error)
        } else {
          const progress = Math.min(90, retryCount * 10)
          setProcessingProgress(progress)
          const delay = Math.min(1000 * Math.pow(2, retryCount + 1), 30000)
          if (retryCount < 10) {
            setTimeout(() => checkPredictionStatus(retryCount + 1), delay)
          } else {
            throw new Error("Maximum retries reached. Please try again.")
          }
        }
      } catch (error) {
        console.error("Error:", error)
        setError(error instanceof Error ? error.message : "Error enhancing image")
        setIsProcessing(false)
        setPredictionId(null)
        setProcessingProgress(0)
      }
    },
    [predictionId, toast]
  )

  useEffect(() => {
    if (predictionId) checkPredictionStatus()
  }, [predictionId, checkPredictionStatus])

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setResultUrl(null)
    setError(null)
    setIsProcessing(false)
    setProcessingProgress(0)
    setPredictionId(null)
  }

  const handleDownload = async () => {
    if (resultUrl) {
      try {
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(resultUrl)}`)
        if (!response.ok) throw new Error("Failed to download image")
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "enhanced-image.png"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error downloading image:", error)
        setError("Error downloading enhanced image")
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="flex-1 border rounded-xl shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Enhance Your Image
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative border-2 border-dashed rounded-xl transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:bg-accent/50 hover:border-primary/50"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  accept={ALLOWED_FILE_TYPES.join(",")}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-4 py-10">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-foreground">Drag and drop your image here</p>
                    <p className="text-sm text-muted-foreground">or click to select from your device</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-xs text-muted-foreground">Supported formats: JPEG, PNG, WebP</p>
                    <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Select File
                  </Button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
                {freeTryUsed ? (
                  userCredits >= 0.2 ? (
                    <Button
                      type="submit"
                      disabled={isProcessing || (!file && !previewUrl)}
                      className="relative overflow-hidden group"
                    >
                      {isProcessing ? (
                        <>
                          <Coin className="mr-2 h-4 w-4" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Coin className="mr-2 h-4 w-4" />
                          Enhance (0.2 credits)
                        </>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={false}
                        animate={{ x: isProcessing ? "100%" : "-100%" }}
                        transition={{ duration: 1, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
                      />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => (window.location.href = "/buy-credits")}
                      variant="secondary"
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      <Coin className="mr-2 h-4 w-4" />
                      Buy Credits
                    </Button>
                  )
                ) : (
                  <Button
                    type="submit"
                    disabled={isProcessing || (!file && !previewUrl)}
                    className="relative overflow-hidden group bg-green-500 hover:bg-green-600"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Try for Free
                      </>
                    )}
                    <motion.div
                      className="absolute inset-0 bg-primary/10"
                      initial={false}
                      animate={{ x: isProcessing ? "100%" : "-100%" }}
                      transition={{ duration: 1, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
                    />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="flex-1 border rounded-xl shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <motion.div
              className="aspect-square w-full relative rounded-xl overflow-hidden bg-accent/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <AnimatedLoader />
                  <motion.p
                    className="mt-4 text-lg font-semibold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Enhancing your image...
                  </motion.p>
                  <motion.p
                    className="mt-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    This may take a few moments
                  </motion.p>
                </div>
              ) : resultUrl ? (
                <div className="relative w-full h-full">
                  <ImageCompareSlider
                    beforeImage={previewUrl!}
                    afterImage={`/api/proxy-image?url=${encodeURIComponent(resultUrl)}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/75"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ) : previewUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/50 hover:bg-background/75"
                    onClick={handleReset}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="p-6 rounded-full bg-background/50">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-lg font-medium text-muted-foreground">No image uploaded yet</p>
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
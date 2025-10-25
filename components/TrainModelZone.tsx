"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useFileUpload, formatBytes } from "@/hooks/use-file-upload"
import { type SubmitHandler, useForm } from "react-hook-form"
import { User, Image as ImageIcon, Upload, X, AlertCircle, Zap, CreditCard } from "lucide-react"
import type * as z from "zod"
import { fileUploadFormSchema } from "@/types/zod"
import { createClient } from '@/utils/supabase/client';
import { useCallback, useState, useEffect } from "react"
import { ImageInspector } from "./imageInspector"
import { ImageInspectionResult, aggregateCharacteristics } from "@/lib/imageInspection"

type FormInput = z.infer<typeof fileUploadFormSchema>

const dodopaymentIsConfigured = true // Always enabled for dodopayments

export default function TrainModelZone({ packSlug }: { packSlug: string }) {
  const [userCredits, setUserCredits] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [characteristics, setCharacteristics] = useState<(ImageInspectionResult & { fileId: string })[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient();

  const maxSizeMB = 10
  const maxSize = maxSizeMB * 1024 * 1024 // 10MB total
  const maxFiles = 12

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/png,image/jpeg,image/jpg",
    maxSize,
    multiple: true,
    maxFiles,
  })

  const form = useForm<FormInput>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues: {
      name: "",
      type: "man",
    },
  })

  const onSubmit: SubmitHandler<FormInput> = () => {
    trainModel()
  }

  // Handle file upload errors
  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast({
          title: "File Error",
          description: error,
          duration: 5000,
          variant: "destructive",
        })
      })
    }
  }, [errors, toast])

  useEffect(() => {
    const checkCredits = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error("Authentication error:", userError)
        return
      }

      const { data: credits, error: creditError } = await supabase
        .from("credits")
        .select("credits")
        .eq("user_id", user.id)
        .single()

      if (creditError) {
        console.error("Credit check error:", creditError)
        return
      }

      setUserCredits(credits?.credits ?? 0)
    }

    checkCredits()
  }, [supabase])

  const handleInspectionComplete = useCallback((result: ImageInspectionResult, fileId: string) => {
    setCharacteristics(prev => {
      // Remove any existing result for this file and add the new one
      const filtered = prev.filter(char => char.fileId !== fileId)
      return [...filtered, { ...result, fileId }]
    })
  }, [])

  const trainModel = useCallback(async () => {
    setIsLoading(true)

    try {
      // 1. Authentication check
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue",
        })
        return
      }

      // 2. Credit check
      if ((userCredits ?? 0) < 30) {
        toast({
          title: "Insufficient Credits",
          description: (
            <div className="flex flex-col gap-2">
              <p>You need at least 30 credits to train shoot packs model</p>
              <a href="/buy-credits">
                <Button size="sm" className="mt-2">
                  Upgrade to Train the Model
                </Button>
              </a>
            </div>
          ),
        })
        return
      }

      // 3. File count validation
      if (files.length < 4 || files.length > 10) {
        toast({
          title: "Invalid number of images",
          description: "Please upload 4 - 10 sample images.",
        })
        return
      }

      // 4. File uploads to R2
      const r2Keys: string[] = []
      for (const fileWithPreview of files) {
        // Handle both File and FileMetadata types
        const file = fileWithPreview.file instanceof File ? fileWithPreview.file : null
        if (!file) {
          toast({
            title: "File Error",
            description: "Invalid file type",
            variant: "destructive",
          })
          return
        }
        const formData = new FormData()
        formData.append("file", file)
        formData.append("filename", file.name)

        const res = await fetch("/astria/train-model/image-upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          toast({
            title: "Upload Failed",
            description: data?.error || "Could not upload image",
            variant: "destructive",
          })
          return
        }

        const { key } = await res.json()
        r2Keys.push(key)
      }

      // 5. Aggregate characteristics from image inspections
      const aggregatedCharacteristics = aggregateCharacteristics(
        characteristics.map(({ fileId, ...rest }) => rest)
      )

      // 6. Training request
       const response = await fetch("/astria/train-model", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           urls: r2Keys,
           name: form.getValues("name").trim(),
           type: form.getValues("type"),
           pack: packSlug,
           characteristics: aggregatedCharacteristics,
         }),
       })

      if (!response.ok) {
        const responseData = await response.json()
        const message = responseData.message || "Unknown error occurred"

        toast({
          title: "Training Failed",
          description: message.includes("Not enough credits") ? (
            <div className="flex flex-col gap-2">
              <p>{message}</p>
              <a href="/buy-credits">
                <Button size="sm" className="mt-2">
                  Get Credits
                </Button>
              </a>
            </div>
          ) : (
            message
          ),
        })
        return
      }

      // Success case
      toast({
        title: "Training Started!",
        description: "Your model is being trained. You'll receive an email when it's ready.",
      })
      router.push("/")
    } catch (error) {
      console.error("Training error:", error)
      toast({
        title: "Unexpected Error",
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }, [files, form, packSlug, router, supabase.auth, toast, userCredits, characteristics])

  // Handle file upload success
  useEffect(() => {
    if (files.length > 0) {
      toast({
        title: "Files added",
        description: `${files.length} file(s) selected`,
        duration: 3000,
      })
    }
  }, [files.length])

  const modelType = form.watch("type")
  const requiredCredits = 30
  const hasInsufficientCredits = userCredits < requiredCredits

  return (
    <div className="space-y-6">
      {/* Insufficient Credits Section - Replaces form when user doesn't have enough credits */}
      {hasInsufficientCredits && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Insufficient Credits</h2>
            <p className="text-gray-600">
              You need {requiredCredits} credits to train shoot packs model. You currently have {userCredits} credits.
            </p>
          </div>
          
          <div className="space-y-3 max-w-xs mx-auto">
            <Button 
              onClick={() => router.push('/buy-credits')}
              className="w-full py-2"
            >
              Get More Credits
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full py-2"
            >
              Go Back
            </Button>
          </div>
        </div>
      )}

      {/* Only show form if user has sufficient credits */}
      {!hasInsufficientCredits && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Two-column layout for larger screens */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Model Configuration Card */}
              <div className="bg-card border rounded-xl p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Model Configuration</h3>
                  <p className="text-sm text-muted-foreground">Set up your model details</p>
                </div>

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="group relative">
                        <Label 
                          htmlFor="model-name"
                          className="bg-card text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
                        >
                          Model Name
                        </Label>
                        <FormControl>
                          <Input 
                            {...field} 
                            id="model-name"
                            className="h-10" 
                            placeholder="Choose a unique name for your model" 
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-sm text-muted-foreground">Choose a descriptive name for your model</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Model Type Selector */}
                <div className="space-y-4">
                  <div className="group relative">
                    <Label className="bg-card text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium">
                      Model Type
                    </Label>
                    <div className="border rounded-lg p-3 bg-background">
                      <RadioGroup
                        value={modelType}
                        onValueChange={(value) => form.setValue("type", value)}
                        className="grid grid-cols-2 gap-2"
                      >
                        {/* Male Option */}
                        <div>
                          <RadioGroupItem value="man" id="man" className="peer sr-only" />
                          <Label
                            htmlFor="man"
                            className="flex flex-col items-center justify-center rounded-md border border-gray-200 p-3 hover:bg-gray-50 peer-data-[state=checked]:border-gray-400 peer-data-[state=checked]:bg-gray-100 cursor-pointer transition-all h-20"
                          >
                            <User className="mb-1 h-5 w-5" />
                            <span className="text-sm">Male</span>
                          </Label>
                        </div>

                        {/* Female Option */}
                        <div>
                          <RadioGroupItem value="woman" id="woman" className="peer sr-only" />
                          <Label
                            htmlFor="woman"
                            className="flex flex-col items-center justify-center rounded-md border border-gray-100 p-3 hover:bg-gray-50 peer-data-[state=checked]:border-gray-200 peer-data-[state=checked]:bg-gray-100 cursor-pointer transition-all h-20"
                          >
                            <User className="mb-1 h-5 w-5" />
                            <span className="text-sm">Female</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Button - Hidden on mobile, shown on desktop */}
              <div className="space-y-4 hidden md:block">
                <Button 
                  type="submit" 
                  className="w-full text-md" 
                  disabled={isLoading || files.length < 4 || files.length > 10 || userCredits < 30}
                  size="lg"
                >
                  {isLoading ? "Processing..." : userCredits < 30 ? "Upgrade to Train Model" : "Train Model"}
                  {dodopaymentIsConfigured && userCredits >= 30 && " (30 Credits)"}
                </Button>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Upload Card */}
              <div className="bg-card border rounded-xl p-4 space-y-4 mb-12">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Training Images</h3>
                  <p className="text-sm text-muted-foreground">Drag and drop your training images</p>
                </div>
                

                {/* File Upload Zone */}
                <div className="space-y-4">
            <div className="flex flex-col gap-2">
              {/* Drop area */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={files.length > 0 || undefined}
                className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
              >
                <input
                  {...getInputProps()}
                  className="sr-only"
                  aria-label="Upload image file"
                />
                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div
                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <ImageIcon className="size-4 opacity-60" />
                   </div>
                   <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
                   <p className="text-muted-foreground text-xs">
                     PNG, JPG or JPEG (max. {maxSizeMB}MB total)
                   </p>
                   <Button variant="outline" className="mt-4" onClick={openFileDialog}>
                     <Upload className="-ms-1 opacity-60" aria-hidden="true" />
                     Select images
                   </Button>
                </div>
              </div>

              {errors.length > 0 && (
                <div
                   className="text-destructive flex items-center gap-1 text-xs"
                   role="alert"
                 >
                   <AlertCircle className="size-3 shrink-0" />
                   <span>{errors[0]}</span>
                 </div>
              )}

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-accent aspect-square shrink-0 rounded">
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="size-10 rounded-[inherit] object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="truncate text-[13px] font-medium">
                            {file.file.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatBytes(file.file.size)}
                          </p>
                          <ImageInspector
                            file={file.file instanceof File ? file.file : new File([], file.file.name)}
                            type={form.getValues("type")}
                            onInspectionComplete={(result) => handleInspectionComplete(result, file.id)}
                          />
                        </div>
                      </div>

                      <Button
                         size="icon"
                         variant="ghost"
                         className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                         onClick={() => removeFile(file.id)}
                         aria-label="Remove file"
                       >
                         <X aria-hidden="true" />
                       </Button>
                    </div>
                  ))}

                  {/* Remove all files button */}
                  {files.length > 1 && (
                    <div>
                      <Button size="sm" variant="outline" onClick={clearFiles}>
                        Remove all files
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <p
                aria-live="polite"
                role="region"
                className="text-muted-foreground mt-2 text-center text-xs"
              >
                {files.length} of {maxFiles} images selected ∙ Max {maxSizeMB}MB total
              </p>
            </div>
          </div>
                </div>
            </div>
          </div>
          
          {/* Mobile Training Button - Fixed at bottom */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-50">
            <Button 
              type="submit" 
              className="w-full text-md" 
              disabled={isLoading || files.length < 4 || files.length > 10 || userCredits < 30}
              size="lg"
            >
              {isLoading ? "Processing..." : userCredits < 30 ? "Upgrade to Train Model" : "Train Model"}
              {dodopaymentIsConfigured && userCredits >= 30 && " (30 Credits)"}
            </Button>
          </div>
        </form>
      </Form>
      )}
    </div>
  )
}


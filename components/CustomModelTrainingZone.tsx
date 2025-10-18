"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useCallback, useState, useEffect } from "react"
import { useFileUpload, formatBytes } from "@/hooks/use-file-upload"
import { type SubmitHandler, useForm } from "react-hook-form"
import { User, Image as ImageIcon, Upload, X, AlertCircle, Clock, CreditCard } from "lucide-react"
import type * as z from "zod"
import { fileUploadFormSchema } from "@/types/zod"
import { upload } from "@vercel/blob/client"
import { createClient } from '@/utils/supabase/client';
import { creditManager } from '@/lib/credit-manager'
import type { Database } from "@/types/supabase"
import { useUserStore } from "@/stores/userStore"

type FormInput = z.infer<typeof fileUploadFormSchema>

const dodopaymentIsConfigured = true // Always enabled for dodopayments

export default function CustomModelTrainingZone() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient();
  const { profile } = useUserStore()
  
  // Use credit manager for proper state management
  const [userCredits, setUserCredits] = useState<number>(0)
  const [creditsLoading, setCreditsLoading] = useState<boolean>(true)

  const maxSizeMB = 15
  const maxSize = maxSizeMB * 1024 * 1024 // 15MB total
  const maxFiles = 20

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
      auto_extend: false,
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

  // Initialize credits using credit manager
  useEffect(() => {
    const initializeCredits = async () => {
      if (!profile?.user_id) {
        setCreditsLoading(false)
        return
      }

      try {
        // Initialize user with credit manager
        const initialBalance = await creditManager.initializeUser(profile.user_id)
        setUserCredits(initialBalance)
        setCreditsLoading(false)

        // Set up real-time listener for credit updates
        const unsubscribe = creditManager.onCreditUpdate((event) => {
          if (event.userId === profile.user_id) {
            setUserCredits(event.newBalance)
          }
        })

        return () => {
          unsubscribe()
        }
      } catch (error) {
        console.error('Error initializing credits:', error)
        setCreditsLoading(false)
      }
    }

    initializeCredits()
  }, [profile?.user_id])

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

      // 2. Credit check - Custom models require 20 credits (22 with auto-extend)
      if (hasInsufficientCredits) {
        toast({
          title: "Insufficient Credits",
          description: (
            <div className="flex flex-col gap-2">
              <p>You need at least {requiredCredits} credits to train this custom model</p>
              <a href="/buy-credits">
                <Button size="sm" className="mt-2">
                  Get Credits
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

      // 4. File uploads
      const blobUrls = []
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
        
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/astria/train-custom-model/image-upload",
        })
        blobUrls.push(blob.url)
      }

      // 5. Training request
      const response = await fetch("/astria/train-custom-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: blobUrls,
          name: form.getValues("name").trim(),
          type: form.getValues("type"),
          is_custom: true,
          auto_extend: form.getValues("auto_extend") || false,
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
      router.push("/dashboard")
    } catch (error) {
      console.error("Training error:", error)
      toast({
        title: "Unexpected Error",
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }, [files, form, router, supabase.auth, toast, userCredits])

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
  
  // Calculate required credits and insufficient status
  const requiredCredits = form.watch("auto_extend") ? 22 : 20
  const hasInsufficientCredits = !creditsLoading && userCredits < requiredCredits


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
       

          {/* Insufficient Credits Section - Replaces form when user doesn't have enough credits */}
          {hasInsufficientCredits && (
            <div className="bg-white border border-gray-200 rounded-xl text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">Insufficient Credits</h2>
                <p className="text-gray-600">
                  You need {requiredCredits} credits to train a custom model. You currently have {userCredits} credits.
                </p>
              </div>
              
              <div className="space-y-3 max-w-xs mx-auto">
                <Button 
                  onClick={() => router.push('/pricing')}
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
                      <p className="text-sm text-muted-foreground">Set up your custom model details</p>
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
                                placeholder="My Custom Model" 
                              />
                            </FormControl>
                          </div>
                          <FormDescription>Choose a descriptive name for your custom model</FormDescription>
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

                    {/* Auto Extend Toggle */}
                    <FormField
                      control={form.control}
                      name="auto_extend"
                      render={({ field }) => (
                        <FormItem>
                          <div className="group relative">
                            <Label className="bg-card text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium flex items-center gap-1">
                              Auto-extend Model
                            </Label>
                            <div className="border rounded-lg p-4 bg-background">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">Keep model active for 30 days</div>
                                  <div className="text-xs text-muted-foreground">
                                    Prevents automatic deletion (+2 credits)
                                  </div>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="cursor-pointer"
                                  />
                                </FormControl>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Training Button - Hidden on mobile, shown on desktop */}
                  <div className="space-y-4 hidden md:block">
                    <Button 
                      type="submit" 
                      className="w-full text-md" 
                      disabled={isLoading || files.length < 4 || files.length > 10}
                      size="lg"
                    >
                      {isLoading ? "Processing..." : "Train Custom Model"}
                      {dodopaymentIsConfigured && ` (${form.watch("auto_extend") ? "22" : "20"} Credits)`}
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
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-40">
            <Button 
              type="submit" 
              className="w-full text-md" 
              disabled={isLoading || files.length < 4 || files.length > 20}
              size="lg"
            >
              {isLoading ? "Processing..." : "Train Custom Model"}
              {dodopaymentIsConfigured && ` (${form.watch("auto_extend") ? "22" : "20"} Credits)`}
            </Button>
          </div>
        </form>
      </Form>
      )} {/* End of conditional form display */}
        </div>
        </div>
    </div>
  )
}


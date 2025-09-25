"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from '@/utils/supabase/client';
import type { Database } from "@/types/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, Download, CoinsIcon as Coin, Wand2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import AnimatedLoader from "./AnimatedLoader"
import BetaNotification from "./BetaNotification"

const imageGenerationFormSchema = z.object({
  modelId1: z.string().min(1, "Please select the first model"),
  modelId2: z.string().min(1, "Please select the second model"),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .refine((value) => value.trim().split(/\s+/).filter(Boolean).length >= 3, "Provide a more descriptive prompt"),
  width: z.number().int().min(8).max(1024).multipleOf(8),
  height: z.number().int().min(8).max(1024).multipleOf(8),
})

type FormInput = z.infer<typeof imageGenerationFormSchema>

const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="h-4 w-4 ml-1 text-gray-500" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default function MultiPersonImageGenerationForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [models, setModels] = useState<any[]>([])
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient();
  const formRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormInput>({
    resolver: zodResolver(imageGenerationFormSchema),
    defaultValues: {
      modelId1: "",
      modelId2: "",
      prompt: "",
      width: 768,
      height: 960,
    },
  })

  useEffect(() => {
    const fetchModels = async () => {
      const { data: fetchedModels, error } = await supabase
        .from("models")
        .select("id, name, type")
        .eq("status", "finished")

      if (error) {
        console.error("Error fetching models:", error)
        toast({
          title: "Error",
          description: "Failed to fetch models. Please try again.",
          variant: "destructive",
        })
      } else {
        setModels(fetchedModels || [])
      }
    }

    fetchModels()
  }, [supabase, toast])

  useEffect(() => {
    const fetchUserCredits = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error("Error fetching user:", userError)
        return
      }

      const { data, error } = await supabase.from("credits").select("credits").eq("user_id", userData.user?.id).single()

      if (error) {
        console.error("Error fetching user credits:", error)
      } else {
        setUserCredits(data?.credits || 0)
      }
    }

    fetchUserCredits()
  }, [supabase])

  const pollForGeneratedImage = async (promptId: string, modelId1: string, modelId2: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.error("User not found")
      return
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/check-multiimage-status?promptId=${promptId}&modelId=${modelId1}&userId=${user.id}&secondModelId=${modelId2}`,
        )

        if (!response.ok) {
          console.error("Error response from status check:", {
            status: response.status,
            statusText: response.statusText,
          })
          return // Continue polling on error
        }

        const result = await response.json()
        console.log("Status check result:", result)

        if (result.status === "succeeded" && result.imageUrls && result.imageUrls.length > 0) {
          setGeneratedImage(result.imageUrls[0])
          setIsLoading(false)
          clearInterval(pollInterval)
          toast({
            title: "Image Generated",
            description: "Your new image is now available.",
          })
          setUserCredits((prevCredits) => (prevCredits !== null ? prevCredits - 1 : null))
        } else if (result.status === "failed") {
          setIsLoading(false)
          clearInterval(pollInterval)
          toast({
            title: "Image Generation Failed",
            description: "The image generation process failed. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error checking image status:", error)
      }
    }, 5000)

    setTimeout(() => {
      clearInterval(pollInterval)
      if (isLoading) {
        setIsLoading(false)
        toast({
          title: "Image Generation Timeout",
          description: "The image generation is taking longer than expected. Please check back later.",
          variant: "destructive",
        })
      }
    }, 300000)
  }

  const enhancePrompt = async (currentPrompt: string) => {
    if (!currentPrompt) return

    setIsEnhancingPrompt(true)
    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to enhance prompt")
      }

      const data = await response.json()
      form.setValue("prompt", data.enhancedPrompt)
      toast({
        title: "Prompt Enhanced",
        description: "Your prompt has been enhanced.",
      })
    } catch (error) {
      console.error("Error enhancing prompt:", error)
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnhancingPrompt(false)
    }
  }

  const onSubmit = async (data: FormInput) => {
    if (userCredits === null || userCredits < 1) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits to generate an image.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setGeneratedImage(null)
    setGeneratedPrompt(null)

    try {
      const response = await fetch("/api/generate-multi-person-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate image")
      }

      const result = await response.json()
      console.log("Image generation result:", result)

      toast({
        title: "Image Generation Started",
        description: "Your image is being generated. It will appear here when ready.",
      })

      setGeneratedPrompt(data.prompt)
      pollForGeneratedImage(result.promptId, data.modelId1, data.modelId2)
    } catch (error) {
      console.error("Image generation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(generatedImage)}`)
        if (!response.ok) {
          throw new Error("Failed to download image")
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = "generated-image.jpg"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error("Error downloading image:", error)
        toast({
          title: "Download Failed",
          description: "Failed to download the image. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleReset = () => {
    form.reset({
      modelId1: "",
      modelId2: "",
      prompt: "",
      width: 768,
      height: 960,
    })
    setGeneratedImage(null)
    setGeneratedPrompt(null)
    setIsLoading(false)
  }

  const handleUsePrompt = (prompt: string) => {
    form.setValue("prompt", prompt)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Alert className="mb-6">
        <AlertTitle>Multi-Person Image Generation</AlertTitle>
        <AlertDescription>
          Select two models and describe a scene. The generated image will include both selected model's face in the
          scene you describe.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col lg:flex-row gap-8" ref={formRef}>
        <Card className="flex-1">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="modelId1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Select First Model <InfoTooltip content="Choose the first AI model for image generation" />
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select first model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id.toString()}>
                              {model.name} ({model.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modelId2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Select Second Model

 <InfoTooltip content="Choose the second AI model for image generation" />
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select second model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id.toString()}>
                              {model.name} ({model.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Prompt <InfoTooltip content="Describe the scene with both persons" />
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe the scene with both persons, e.g., 'Two people sitting in a cafe, one drinking coffee, the other reading a book'"
                            className="min-h-[100px] resize-none pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute bg-accent left-2 bottom-2"
                          onClick={() => enhancePrompt(field.value)}
                          disabled={isEnhancingPrompt || !field.value}
                        >
                          {isEnhancingPrompt ? <AnimatedLoader /> : <Wand2 className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormDescription>
                        Be specific about the details and poses of both persons in the scene
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          Width <InfoTooltip content="Image width (multiple of 8, max 1024)" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            min={8}
                            max={1024}
                            step={8}
                          />
                        </FormControl>
                        <FormDescription>Image width (multiple of 8)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          Height <InfoTooltip content="Image height (multiple of 8, max 1024)" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            min={8}
                            max={1024}
                            step={8}
                          />
                        </FormControl>
                        <FormDescription>Image height (multiple of 8)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isEnhancingPrompt || userCredits === null || userCredits < 1}
                  >
                    {isLoading ? (
                      <>
                        <Coin className="mr-2 h-4 w-4" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Coin className="mr-2 h-4 w-4" />
                        Generate (1 Credit)
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                <AnimatedLoader />
                <p className="mt-4 text-lg font-semibold text-gray-700">Generating your image...</p>
                <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
              </div>
            ) : generatedImage ? (
              <div className="space-y-4 relative">
                <img
                  src={generatedImage || "/placeholder.svg"}
                  alt="Generated image"
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-indigo-800 text-white hover:bg-indigo-700"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download image</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500">No image generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BetaNotification />
    </div>
  )
}
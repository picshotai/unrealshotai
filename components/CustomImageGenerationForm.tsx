"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from '@/utils/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Download, CoinsIcon as Coin, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, CircleDollarSign } from "lucide-react";
import AnimatedLoader from "./AnimatedLoader";

const imageGenerationFormSchema = z.object({
  modelId: z.string().min(1, "Please select a model"),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .refine(
      (value) => value.trim().split(/\s+/).filter(Boolean).length >= 3,
      "Provide a more descriptive prompt"
    )
    .refine(
      (value) => value.trim().split(/\s+/).filter(Boolean).length <= 300,
      "Prompt cannot exceed 300 words"
    ),
  width: z.number().int().min(8).max(1024).multipleOf(8),
  height: z.number().int().min(8).max(1024).multipleOf(8),
});

// Preset aspect ratios (all multiples of 8 and within current max 1024)
const ASPECT_RATIOS = [
  { key: "square", label: "Square", width: 768, height: 768 },
  { key: "portrait_3_4", label: "Portrait 3:4", width: 768, height: 1024 },
  { key: "portrait_9_16", label: "Portrait 9:16", width: 576, height: 1024 },
  { key: "landscape_4_3", label: "Landscape 4:3", width: 1024, height: 768 },
  // 16:9 kept within max width constraint -> 1024x576
  { key: "landscape_16_9", label: "Landscape 16:9", width: 1024, height: 576 },
] as const;
type FormInput = z.infer<typeof imageGenerationFormSchema>;

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
);

interface CustomImageGenerationFormProps {
  preSelectedModelId?: string;
}

export default function CustomImageGenerationForm({
  preSelectedModelId,
}: CustomImageGenerationFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [models, setModels] = useState<any[]>([]);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();
  // Track selected aspect ratio preset
  const [selectedAspect, setSelectedAspect] = useState<string | null>("portrait_3_4");

  const form = useForm<FormInput>({
    resolver: zodResolver(imageGenerationFormSchema),
    defaultValues: {
      modelId: preSelectedModelId || "",
      prompt: "",
      width: 768,
      height: 1024,
    },
  });

  // Helper to apply aspect ratio preset to width/height
  const handleAspectSelect = (key: string) => {
    const ratio = ASPECT_RATIOS.find((r) => r.key === key);
    if (ratio) {
      form.setValue("width", ratio.width, { shouldValidate: true });
      form.setValue("height", ratio.height, { shouldValidate: true });
      setSelectedAspect(key);
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      const { data: fetchedModels, error } = await supabase
        .from("models")
        .select(`
          *,
          samples (
            id,
            uri
          )
        `)
        .eq("status", "finished");

      if (error) {
        console.error("Error fetching models:", error);
        toast({
          title: "Error",
          description: "Failed to fetch models. Please try again.",
          variant: "destructive",
        });
      } else {
        setModels(fetchedModels || []);
      }
    };

    fetchModels();
  }, [supabase, toast]);

  useEffect(() => {
    const fetchUserCredits = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("credits")
        .select("credits")
        .eq("user_id", userData.user?.id)
        .single();

      if (error) {
        console.error("Error fetching user credits:", error);
      } else {
        setUserCredits(data?.credits || 0);
      }
    };

    fetchUserCredits();
  }, [supabase]);

  const pollForGeneratedImage = async (promptId: string, modelId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not found");
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/check-image-status?promptId=${promptId}&modelId=${modelId}&userId=${user.id}`
        );

        if (!response.ok) {
          console.error("Error response from status check:", {
            status: response.status,
            statusText: response.statusText,
          });
          return;
        }

        const result = await response.json();
        console.log("Status check result:", result);

        if (
          result.status === "succeeded" &&
          result.imageUrls &&
          result.imageUrls.length > 0
        ) {
          setGeneratedImage(result.imageUrls[0]);
          setIsLoading(false);
          clearInterval(pollInterval);
          toast({
            title: "Image Generated",
            description: "Your new image is now available.",
          });
          setUserCredits((prevCredits) =>
            prevCredits !== null ? prevCredits - 1 : null
          );
        } else if (result.status === "failed") {
          setIsLoading(false);
          clearInterval(pollInterval);
          toast({
            title: "Image Generation Failed",
            description:
              "The image generation process failed. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking image status:", error);
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(pollInterval);
      if (isLoading) {
        setIsLoading(false);
        toast({
          title: "Image Generation Timeout",
          description:
            "The image generation is taking longer than expected. Please check back later.",
          variant: "destructive",
        });
      }
    }, 300000);
  };

  const onSubmit = async (data: FormInput) => {
    if (userCredits === null || userCredits < 1) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits to generate an image.",
        variant: "destructive",
      });
      return;
    }

    const validationResult = imageGenerationFormSchema.safeParse(data);
    if (!validationResult.success) {
      toast({
        title: "Invalid Input",
        description: validationResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);
    setGeneratedPrompt(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const result = await response.json();
      console.log("Image generation result:", result);

      toast({
        title: "Image Generation Started",
        description:
          "Your image is being generated. It will appear here when ready.",
      });

      setGeneratedPrompt(data.prompt);
      pollForGeneratedImage(result.promptId, data.modelId);
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(
          `/api/proxy-image?url=${encodeURIComponent(generatedImage)}`
        );
        if (!response.ok) {
          throw new Error("Failed to download image");
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "generated-image.jpg";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error downloading image:", error);
        toast({
          title: "Download Failed",
          description: "Failed to download the image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleReset = () => {
    form.reset({
      modelId: preSelectedModelId || "",
      prompt: "",
      width: 768,
      height: 1024,
    });
    setGeneratedImage(null);
    setGeneratedPrompt(null);
    setIsLoading(false);
    setSelectedAspect("portrait_3_4");
  };

  useEffect(() => {
    if (preSelectedModelId) {
      form.setValue("modelId", preSelectedModelId);
    }
  }, [preSelectedModelId, form]);

  return (
    <div className="space-y-6">
      
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Two-column layout for larger screens */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Image Generation Configuration Card */}
              <div className="bg-card border rounded-xl p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Image Generation Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure your image generation parameters</p>
                </div>

                {/* Model Selection */}
                <FormField
                  control={form.control}
                  name="modelId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="group relative">
                        <Label 
                          htmlFor="model-select"
                          className="bg-card text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
                        >
                          Select Model
                        </Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger id="model-select" className="h-12 border rounded-lg">
                              <SelectValue placeholder="Choose a trained model to generate images" className="text-sm" />
                            </SelectTrigger>
                            <SelectContent className="max-w-[300px] w-full">
                              {models.map((model) => (
                                <SelectItem
                                  key={model.id}
                                  value={model.id.toString()}
                                  className="cursor-pointer max-w-full"
                                >
                                  <div className="flex items-center gap-2 py-1 min-w-0 w-full">
                                    {model.samples && model.samples[0]?.uri && (
                                      <div className="flex-shrink-0">
                                        <Image
                                          src={(model.samples[0].uri?.startsWith("users/"))
                                            ? `/api/img-proxy?key=${encodeURIComponent(model.samples[0].uri)}`
                                            : model.samples[0].uri}
                                          alt={model.name}
                                          width={20}
                                          height={20}
                                          className="rounded-sm object-cover w-5 h-5"
                                        />
                                      </div>
                                    )}
                                    <span className="truncate text-sm flex-1 min-w-0">{model.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prompt Field */}
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => {
                    const wordCount = field.value.trim().split(/\s+/).filter(Boolean).length;
                    const isOverLimit = wordCount > 300;
                    
                    return (
                      <FormItem>
                        <div className="group relative">
                          <Label htmlFor="prompt-input" className="bg-card text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium">
                            Prompt ({wordCount}/300 words)
                          </Label>
                          <div className={`border rounded-lg p-3 bg-background ${isOverLimit ? 'border-red-500' : ''}`}>
                            <FormControl>
                              <Textarea
                                {...field}
                                id="prompt-input"
                                placeholder="Describe the image you want to generate in detail"
                                className="h-[120px] resize-none bg-transparent border-0 outline-none focus-visible:ring-0 focus-visible:outline-none placeholder:text-sm"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const words = value.trim().split(/\s+/).filter(Boolean);
                                  
                                  // Prevent typing if word limit exceeded
                                  if (words.length <= 300) {
                                    field.onChange(value);
                                  } else {
                                    // Allow deletion but prevent adding more words
                                    const currentWords = field.value.trim().split(/\s+/).filter(Boolean);
                                    if (value.length < field.value.length) {
                                      field.onChange(value);
                                    }
                                  }
                                }}
                              />
                            </FormControl>
                          </div>
                        </div>
                        {isOverLimit && (
                          <span className="text-xs text-red-500 font-medium">
                            Exceeds limit by {wordCount - 300} words
                          </span>
                        )}
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Be specific about the details you want in the generated image
                          </p>
                          
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Dimensions */}
                <div className="space-y-4">
                  <div className="group relative">
                    <Label className="bg-card text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium">
                      Image Dimensions
                    </Label>
                    <div className="border rounded-lg p-3 bg-background">
                      {/* Aspect Ratio Presets */}
                      <div className="mb-3">
                        <FormItem>
                          <Select value={selectedAspect || ""} onValueChange={handleAspectSelect}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Choose an aspect ratio" />
                            </SelectTrigger>
                            <SelectContent>
                              {ASPECT_RATIOS.map((ar) => (
                                <SelectItem key={ar.key} value={ar.key} className="cursor-pointer">
                                  {ar.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            Selecting a preset automatically sets width and height.
                          </FormDescription>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generation Buttons - Hidden on mobile, shown on desktop */}
              <div className="space-y-4 hidden md:block">
                <div className="flex items-center justify-between gap-4">
                  <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      isLoading || userCredits === null || userCredits < 1
                    }
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Right Column - Generated Image Display */}
            <div className="space-y-6">
              {/* Generated Image Card */}
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-6 mb-12">
                


                {/* Image Display Area */}
                <div className="relative min-h-[400px] flex items-center justify-center rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 w-full">
                      <AnimatedLoader />
                      <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-black dark:text-white">
                          Creating your image...
                        </p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          This may take a few moments
                        </p>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative w-full group">
                      <img
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated image"
                        className="w-full h-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute top-4 right-4 bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700 opacity-100"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download image</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 w-full text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">No image generated yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Fill out the form and click Generate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Generation Buttons - Fixed at bottom */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-50">
            <div className="flex items-center justify-between gap-3 max-w-full">
              <Button type="button" variant="outline" onClick={handleReset} className="flex-shrink-0 px-4">
                Reset
              </Button>
              <Button
                type="submit"
                className="flex-1 min-w-0"
                disabled={
                  isLoading || userCredits === null || userCredits < 1
                }
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Generate Image (0.5<CircleDollarSign className="inline h-2 w-2 ml-1"/>)</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
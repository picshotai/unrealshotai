"use client";
import React from "react";
import dynamic from "next/dynamic";
import { createGeminiClient } from "@/lib/photo-editor/client";
import { toast } from "@/components/ui/use-toast";

// Dynamically import the heavy editor to avoid SSR issues
const AnnotationEditor = dynamic(
  () => import("@/components/photo-editor/AnnotationEditor").then(m => ({ default: m.AnnotationEditor })),
  { ssr: false }
);

export default function EditorClient() {
  const apiClient = React.useMemo(() => {
    return createGeminiClient();
  }, []);

  return (
    <div className="w-full h-full">
      <AnnotationEditor
        apiClient={apiClient}
        onError={(message) => {
          // Surface user-friendly error via toast instead of noisy console error
          toast({
            title: "Image generation error",
            description: typeof message === "string" ? message : "Something went wrong",
            variant: "destructive",
          });
        }}
        onImageGenerated={(url) => {
          // Optionally handle the generated image (e.g., preview or save)
          console.log("Generated output:", url);
        }}
        className="w-full h-full"
      />
    </div>
  );
}
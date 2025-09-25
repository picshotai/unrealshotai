"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/types/supabase"
import type { imageRow, modelRow, sampleRow } from "@/types/utils"
import { createBrowserClient } from "@supabase/ssr" // Updated import
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CustomImageGenerationForm from "../CustomImageGenerationForm"

export const revalidate = 0

type ClientSideModelProps = {
  serverModel: modelRow
  serverImages: imageRow[]
  samples: sampleRow[]
}

export default function ClientSideModel({ serverModel, serverImages, samples }: ClientSideModelProps) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )
  const [model, setModel] = useState<modelRow>(serverModel)
  const [images, setImages] = useState<imageRow[]>(serverImages)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel("realtime-model")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "models" }, (payload: { new: modelRow }) => {
        setModel(payload.new)
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "images" }, (payload: { new: imageRow }) => {
        if (payload.new.modelId === model.id) {
          setImages((prevImages) => [...prevImages, payload.new])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, model])

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading the image:", error)
    }
  }

  return (
    <div id="train-model-container" className="w-full h-full" style={{ marginBottom: "5em" }}>
      <div className="flex flex-col w-full mt-4 gap-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8">
          {samples && (
            <div className="flex w-full lg:w-1/2 flex-col gap-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Training Data</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {samples.map((sample, index) => (
                  <img
                    key={sample.id}
                    src={sample.uri || "/placeholder.svg"}
                    alt={`Training sample ${index + 1}`}
                    className="rounded-lg w-60 aspect-[2/3] object-cover shadow-md hover:shadow-xl transition-shadow duration-300"
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col w-full lg:w-1/2 rounded-lg">
            {model.status === "finished" && (
              <div className="flex flex-1 flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Results</h1>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {images.map((image) => (
                    <div key={image.id} className="relative group w-full">
                      <img
                        src={image.uri || "/placeholder.svg"}
                        alt={`Generated image ${image.id}`}
                        className="rounded-lg w-full aspect-[2/3] object-cover shadow-md hover:shadow-xl transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="mr-2"
                              onClick={() => setPreviewImage(image.uri)}
                            >
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <img src={previewImage || ""} alt="Preview" className="w-full h-auto rounded-lg" />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownload(image.uri, `generated-image-${image.id}.jpg`)}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {model.isCustom && <CustomImageGenerationForm />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
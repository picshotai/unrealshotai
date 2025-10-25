"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/types/supabase"
import type { imageRow, modelRow, sampleRow } from "@/types/utils"
import { createBrowserClient } from "@supabase/ssr" // Updated import
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CustomImageGenerationForm from "../CustomImageGenerationForm"
import { Eye, Download } from "lucide-react"
import FullImageOverlay from "../FullImageOverlay"

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
  // Replace previewImage with gallery-style overlay state
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null)
  const [isZipping, setIsZipping] = useState(false)

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
      a.setAttribute("download", fileName)
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading the image:", error)
    }
  }

  // Add Download All (zip) using client-side JSZip
  const handleDownloadAll = async () => {
    try {
      setIsZipping(true)
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      for (const image of images) {
        const uri = image.uri
        if (!uri) continue
        // Use proxy for http(s) URLs; keep direct for others
        const src = uri.startsWith("http")
          ? `/api/proxy-image?url=${encodeURIComponent(uri)}`
          : uri
        const res = await fetch(src)
        if (!res.ok) continue
        const blob = await res.blob()
        zip.file(`generated-image-${image.id}.jpg`, blob)
      }

      const content = await zip.generateAsync({ type: "blob" })
      const url = window.URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `model-${model.id}-images.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error preparing zip:", error)
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <div id="train-model-container" className="w-full h-full" style={{ marginBottom: "5em" }}>
      <div className="flex flex-col w-full mt-4 gap-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8">
          {/* Results column only */}
          <div className="flex flex-col w-full lg:w-1/2 rounded-lg">
            {model.status === "finished" && (
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your Photoshots</h2>
                  <Button variant="secondary" size="sm" onClick={handleDownloadAll} disabled={isZipping}>
                    {isZipping ? "Preparing..." : "Download All"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {images.map((image) => (
                    <div key={image.id} className="relative group w-full">
                      <img
                        src={image.uri ? `/api/proxy-image?url=${encodeURIComponent(image.uri)}` : "/placeholder.svg"}
                        alt={`Generated image ${image.id}`}
                        className="rounded-lg w-full aspect-[2/3] object-cover shadow-md hover:shadow-xl transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-transparent rounded-lg flex flex-col justify-between p-4">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-white hover:bg-white/20"
                            onClick={() => setFullImageUrl(image.uri || "")}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                        <div className="flex justify-end items-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-white hover:bg-white/20"
                            onClick={() => handleDownload(image.uri, `generated-image-${image.id}.jpg`)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
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
      {fullImageUrl && (
        <FullImageOverlay
          imageUrl={`/api/proxy-image?url=${encodeURIComponent(fullImageUrl)}`}
          onClose={() => setFullImageUrl(null)}
        />
      )}
    </div>
  )
}
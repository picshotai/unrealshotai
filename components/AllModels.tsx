"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ImageIcon, Clock, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import type { modelRowWithSamples } from "@/types/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import type React from "react" // Import React
import { useState, useEffect } from "react"

type ModelsTableProps = {
  models: modelRowWithSamples[]
}

// Helper function to calculate deletion date
const calculateDeletionDate = (createdAt: string, isCustom: boolean, autoExtend: boolean) => {
  const created = new Date(createdAt)
  const days = isCustom ? (autoExtend ? 30 : 14) : 14
  const deletionDate = new Date(created.getTime() + days * 24 * 60 * 60 * 1000)
  return deletionDate
}

// Helper function to format time remaining
const formatTimeRemaining = (deletionDate: Date) => {
  const now = new Date()
  const diff = deletionDate.getTime() - now.getTime()
  
  if (diff <= 0) return "Expired"
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

export default function ModelsTable({ models }: ModelsTableProps) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleRedirect = (id: number) => {
    router.push(`/models/${id}`)
  }

  const handleUseModel = (e: React.MouseEvent, modelId: number) => {
    e.stopPropagation() // Prevent card click event
    router.push(`/generate-image?modelId=${modelId}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {models?.map((model) => {
        const deletionDate = calculateDeletionDate(
          model.created_at, 
          model.is_custom || false, 
          model.auto_extend || false
        )
        const timeRemaining = formatTimeRemaining(deletionDate)
        const isExpiringSoon = deletionDate.getTime() - currentTime.getTime() < 3 * 24 * 60 * 60 * 1000 // 3 days
        
        return (
          <Card
            key={model.id}
            className="group overflow-hidden bg-gray-50 border-0 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 py-0"
            onClick={() => handleRedirect(model.id)}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              {model.samples[0]?.uri ? (
                <Image
                  src={(model.samples[0].uri?.startsWith("users/"))
                    ? `/api/img-proxy?key=${encodeURIComponent(model.samples[0].uri)}`
                    : (model.samples[0].uri || "/placeholder.svg")}
                  alt={`Featured image for ${model.name}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Model Info */}
                <div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{model.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="capitalize">{model.type}</span>
                    <span>•</span>
                    <span>{model.is_custom ? "Custom" : "Pack"}</span>
                    <span>•</span>
                    <span className={`flex items-center gap-1 ${
                      model.status === "processing" 
                        ? "text-amber-600" 
                        : model.status === "finished"
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }`}>
                      {model.status === "processing" && <Loader2 className="h-3 w-3 animate-spin" />}
                      <span className="capitalize">{model.status === "processing" ? "Training" : model.status}</span>
                    </span>
                    {model.auto_extend && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600">Auto-extend</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Deletion Timer Info */}
                {model.status === "finished" && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-md px-2 py-1">
                    <Calendar className="h-3 w-3" />
                    <span>Deletes in {timeRemaining}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  {/* Sample Images */}
                  <div className="flex items-center -space-x-1">
                    {model.samples.slice(0, 3).map((sample, index) => (
                      <div
                        key={index}
                        className="relative w-6 h-6 rounded-full ring-1 ring-white overflow-hidden"
                      >
                        <Image
                          src={(sample.uri?.startsWith("users/"))
                            ? `/api/img-proxy?key=${encodeURIComponent(sample.uri)}`
                            : (sample.uri || "/placeholder.svg")}
                          alt={`Sample ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                    ))}
                    {model.samples.length > 3 && (
                      <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 ring-1 ring-white">
                        <span className="text-xs font-medium text-gray-600">+{model.samples.length - 3}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Use Button */}
                  {model.status === "finished" && (
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-800 text-xs px-3 py-1 h-7"
                      onClick={(e) => handleUseModel(e, model.id)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Use
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


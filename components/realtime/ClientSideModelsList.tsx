"use client"

import { Button } from "@/components/ui/button"
import type { Database } from "@/types/supabase"
import type { modelRowWithSamples } from "@/types/utils"
import { createBrowserClient } from "@supabase/ssr" // Updated import
import Link from "next/link"
import { useEffect, useState } from "react"
import ModelsTable from "../ModelsTable"
import ClearModels from "../ClearModels"


export const revalidate = 0

type ClientSideModelsListProps = {
  serverModels: modelRowWithSamples[] | []
}



export default function ClientSideModelsList({ serverModels }: ClientSideModelsListProps) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )
  const [models, setModels] = useState<modelRowWithSamples[]>(serverModels)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const channel = supabase
      .channel("realtime-models")
      .on("postgres_changes", { event: "*", schema: "public", table: "models" }, async (payload: any) => {
        const samples = await supabase.from("samples").select("*").eq("modelId", payload.new.id)
        const newModel: modelRowWithSamples = {
          ...payload.new,
          samples: samples.data,
        }
        const dedupedModels = models.filter((model) => model.id !== payload.old?.id)
        setModels([...dedupedModels, newModel])
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, models])

  const handleDeleteModels = () => {
    setModels([])
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="w-full">
      {models && models.length > 0 && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Trained Models</h2>
              <p className="text-gray-600 mt-1">
                {models.length} model{models.length !== 1 ? 's' : ''} ready for photo generation
              </p>
            </div>
            <ClearModels onClear={handleDeleteModels} />
          </div>

          {/* Models Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ModelsTable models={models} />
          </div>
        </div>
      )}

      {models && models.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Create Your AI Model?</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Train your own AI model to generate professional headshots. It's fast, simple, and tailored just for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <Link href="/packs" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
              >
                Browse Packs
              </Button>
            </Link>
            <Link href="/models/train/custom" className="flex-1">
              <Button 
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
              >
                Train Custom Model
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
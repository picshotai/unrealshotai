import type { Metadata } from "next"
import { createClient } from '@/utils/supabase/server'; // Updated import from utilityimport { cookies } from "next/headers"
import ModelsTable from "@/components/AllModels"
import type { modelRowWithSamples } from "@/types/utils"
import { redirect } from "next/navigation"
import ClearModels from "@/components/ClearModels"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"



export const metadata: Metadata = {
  title: "Your Personal AI Photoshoot Setup - UnrealShot AI",
  description: "Set up your personal AI for professional headshots",
}

export const dynamic = "force-dynamic"

export default async function AllModelsPage() {
 const supabase = await createClient(); // Use the new utility function with await
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: models } = await (supabase).from("models")
    .select(`
      *,
      samples (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Transform the data to match our type expectations
  const transformedModels = models?.map(model => ({
    ...model,
    is_custom: model.type === "custom",
    samples: model.samples || []
  })) || []

  const sampleImages = [
    "/landing/landingphotowoman1.webp",
    "/landing/landingphotoman8.webp",
    "/landing/landingphotowoman9.webp",
    "/landing/landingphotoman10.webp",
    "/landing/landingphotoman2.webp",
    "/landing/landingphotowoman5.webp",
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        {transformedModels.length > 0 && <h1 className="text-3xl font-bold">Your Personal AI Photoshoot Setup</h1>}
        
        {transformedModels.length > 0 && <ClearModels />}
      </div>
      {transformedModels && transformedModels.length > 0 ? (
        <ModelsTable models={transformedModels as modelRowWithSamples[]} />
      ) : (
        <div className="text-center">
          <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
            {/* Visual strip for vibe */}
            <div className="mb-6">
              <div className="flex gap-2 rounded-xl border bg-white p-2 shadow-sm">
                {sampleImages.map((src, i) => (
                  <div key={i} className="relative w-[80px] h-[110px] overflow-hidden rounded-md">
                    <Image src={src} alt="Sample pack preview" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Personal AI Photoshoot Setup</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">Train a shoot pack model or train a custom model.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
              <Link href="/packs">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-5 border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                >
                  Browse Packs (Guaranteed Quality)
                </Button>
              </Link>
              <Link href="/models/train/custom">
                <Button 
                  size="lg"
                  className="px-5 bg-gray-900 text-white hover:bg-gray-800"
                >
                  Train Custom Look (Advanced)
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              <strong>All packs include your Personal AI Setup</strong>
              <span className="mx-1">•</span>
              <strong>Starts under $0.50/photo</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


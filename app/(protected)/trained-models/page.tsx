import type { Metadata } from "next"
import { createClient } from '@/utils/supabase/server'; // Updated import from utilityimport { cookies } from "next/headers"
import ModelsTable from "@/components/AllModels"
import type { modelRowWithSamples } from "@/types/utils"
import { redirect } from "next/navigation"
import ClearModels from "@/components/ClearModels"
import Link from "next/link"
import { Button } from "@/components/ui/button"



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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Personal AI Photoshoot Setup</h1>
        {transformedModels.length > 0 && <ClearModels />}
      </div>
      {transformedModels && transformedModels.length > 0 ? (
        <ModelsTable models={transformedModels as modelRowWithSamples[]} />
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready for Your Professional AI Headshots?</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Unlock your professional headshots by creating your private AI. To begin, select your style pack (recommended for quality) or train a custom model.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto mb-4">
            <Link href="/packs" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
              >
                Browse Packs (Guaranteed Quality)
              </Button>
            </Link>
            <Link href="/models/train/custom" className="flex-1">
              <Button 
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
              >
                Train Custom Look (Advanced)
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            <strong>Remember:</strong> All packs include your <strong>Personal AI Setup</strong> and <strong>start at less than $0.50 per photo.</strong>
          </p>
        </div>
      )}
    </div>
  )
}


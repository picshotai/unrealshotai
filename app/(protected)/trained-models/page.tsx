import type { Metadata } from "next"
import { createClient } from '@/utils/supabase/server'; // Updated import from utilityimport { cookies } from "next/headers"
import ModelsTable from "@/components/AllModels"
import type { modelRowWithSamples } from "@/types/utils"
import { redirect } from "next/navigation"


export const metadata: Metadata = {
  title: "All Models - UnrealShot AI",
  description: "View all your trained AI models",
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
    <div className="container mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold mb-6">All Trained Models</h1>
      {transformedModels && transformedModels.length > 0 ? (
        <ModelsTable models={transformedModels as modelRowWithSamples[]} />
      ) : (
        <p className="text-gray-600">You haven't trained any models yet.</p>
      )}
    </div>
  )
}


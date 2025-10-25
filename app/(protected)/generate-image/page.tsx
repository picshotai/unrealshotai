import CustomImageGenerationForm from "@/components/CustomImageGenerationForm"
import { createClient } from '@/utils/supabase/server'; // Updated import from utilityimport { cookies } from "next/headers"
import { redirect } from "next/navigation"
import NoModelsAvailable from "./NoModelsAvailable"

export default async function GenerateImagePage({ searchParams }: { searchParams: Promise<{ modelId?: string }> }) {
  const awaitedSearchParams = await searchParams;
  const supabase = await createClient(); // Use the new utility function with await
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: models } = await supabase.from("models").select("*").eq("user_id", user.id).eq("status", "finished")

  return (
    <div className="container mx-auto py-8">
      {models && models.length > 0 ? (
        <CustomImageGenerationForm preSelectedModelId={awaitedSearchParams.modelId} />
      ) : (
        <NoModelsAvailable />
      )}
    </div>
  )
}

import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideUserRoundSearch, WandSparklesIcon } from "lucide-react"
import Link from "next/link"
import ClientSideModelsList from "@/components/realtime/ClientSideModelsList"
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation"
import { commonPageMetadata } from '@/lib/seo'

export const metadata: Metadata = commonPageMetadata.dashboard()

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get real data for production
  const { data: models } = await supabase
    .from("models")
    .select(`*, samples (*)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: credits } = await supabase
    .from("credits")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  const modelCount = models?.length || 0
  const creditsBalance = credits?.credits || 0

  return (
    <div className="space-y-8">



      {/* Main Training Options - Clean Black & White */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Custom Model Training</CardTitle>
            <CardDescription className="text-gray-600">
              Upload your photos and train a personalized AI model to create photos using your own prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/models/train/custom">
              <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 border-0">
                                <WandSparklesIcon className="ml-2 h-4 w-4" />
                Start Custom Training
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-white  transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Pre-made Shoot Packs</CardTitle>
            <CardDescription className="text-gray-600">
              Choose from curated packs of professional AI Photoshoot models for different use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/packs">
              <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 border-0">
                                <LucideUserRoundSearch className="ml-2 h-4 w-4" />
                Browse Photoshoot Packs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      {/* Trained Models Section - Shows real models */}
      {modelCount > 0 && (
        <div className="space-y-4">
          <ClientSideModelsList serverModels={models || []} />
        </div>
      )}
      {/* Quick Actions - Clean Design */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Need Credits?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Purchase credits to train models and generate photos
            </p>
            <Link href="/buy-credits">
              <Button variant="outline" className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900">
                Buy Credits
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">View Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              See all your AI generated photos in your private gallery
            </p>
            <Link href="/gallery">
              <Button variant="outline" className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900">
                Open Gallery
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Generate Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Generate AI Photos using your trained models with custom prompts            </p>
            <Link href="/generate-image">
              <Button variant="outline" className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 hover:text-gray-900">
                Generate AI Photos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

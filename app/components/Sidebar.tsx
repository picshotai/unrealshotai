import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ImageIcon, Star, Gem } from 'lucide-react'
import Link from "next/link"

export default function Sidebar() {
  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-col bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-center text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Tired of Boring Photos?</h2>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6">
Unrealshot AI stands out by delivering photos that are uniquely you.
        </h3>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-6 h-6 text-indigo-600 flex-shrink-0" />
            <p className="text-gray-700">
              Capture 20 Stunning & High-Impact Professional Headshots
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Star className="w-6 h-6 text-indigo-600 flex-shrink-0" />
            <p className="text-gray-700">
Designed for those who want amazing photos, fast and without the tech overwhelm.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Gem className="w-6 h-6 text-indigo-600 flex-shrink-0" />
            <p className="text-gray-700">
Pick your outfits, backgrounds, and styles to match your vision with ease.
            </p>
          </div>
        </div>
        <Link href="/login">
        <Button className="w-full mt-8 rounded-md bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 px-8 text-base text-lg font-medium text-center">
          Create Your Headshots
        </Button>
          </Link>
      </CardContent>
    </Card>
  )
}

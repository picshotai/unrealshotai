"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImagePlus } from "lucide-react"
import { motion } from "framer-motion"

export default function NoModelsAvailable() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6 p-4 inline-block">
          <div
            className="mt-12">
            <ImagePlus className="w-24 h-24 text-gray-800" />
          </ div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">No Trained Models Available</h2>
        <p className="text-muted-foreground mb-6">
          To generate custom AI images, you need at least one trained model. Let's get started by creating your first
          custom model!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="default" className="font-semibold bg-primary text-white hover:text-gray-200 hover:from-indigo-600 hover:to-blue-600">
            <Link href="/models/train/custom">Train Custom Model</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


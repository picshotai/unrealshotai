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
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.8, duration: 1, type: "spring" }}
          >
            <ImagePlus className="w-24 h-24 text-indigo-800 animate-pulse" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">No Trained Models Available</h2>
        <p className="text-muted-foreground mb-6">
          To generate custom AI images, you need at least one trained model. Let's get started by creating your first
          custom model!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="default" className="font-semibold bg-gradient-to-r to-blue-500 from-indigo-700 text-white hover:text-gray-200 hover:from-indigo-600 hover:to-blue-600">
            <Link href="/models/train/custom">Train Custom Model</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-semibold">
            <Link href="/dashboard">Learn More</Link>
          </Button>
        </div>
        <div className="mt-8 p-4 bg-muted rounded-md text-left">
          <h3 className="text-lg font-semibold mb-2">Why train a custom model?</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Create unique, personalized AI-generated images</li>
            <li>• Have full control over the style and appearance of your generated images</li>
            <li>• Experiment with different styles and concepts for your AI art</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


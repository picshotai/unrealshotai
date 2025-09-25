"use client"

import { useState } from "react"
import Link from "next/link"
import { Camera, X } from "lucide-react"

export default function CustomPromptsBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-indigo-900 text-primary-foreground transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
            <p className="h-8 w-5 text-xl">🎉</p>  
              <h2 className="text-sm font-medium">Custom Prompts Now Live!</h2>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-primary-foreground hover:text-accent-foreground transition-colors duration-200"
              aria-label="Close banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-primary-foreground/90 max-w-[60%]">
              Now you can write your own prompt and generate your photos, your way!
            </p>
            <Link
              href="/generate-image"
              className="bg-background text-primary hover:text-accent-foreground px-3 py-1.5 rounded text-sm"
            >
              Generate Now
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <p className="h-8 w-5 text-xl">🎉</p>  
            <div>
              <h2 className="text-sm font-medium">Custom Prompts Now Live!</h2>
              <p className="text-xs text-primary-foreground/90 mt-1 max-w-md">
                Now you can write your own prompt and generate your photos, your way!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/generate-image"
              className="bg-background text-primary hover:text-accent-foreground px-3 py-1.5 rounded text-sm"
            >
              Generate Now
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="text-primary-foreground hover:text-accent-foreground transition-colors duration-200"
              aria-label="Close banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


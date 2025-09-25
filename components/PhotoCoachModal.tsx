'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { useUserStore } from '@/stores/userStore'

interface PhotoCoachModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

interface Step {
  id: number
  title: string
  subtitle?: string
  content: React.ReactNode
}

export default function PhotoCoachModal({ isOpen, onClose, onComplete }: PhotoCoachModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { completeOnboarding, loading } = useUserStore()

  const steps: Step[] = [
    {
      id: 0,
      title: "Welcome to Professional AI Photography",
      subtitle: "The quality of your AI photoshoot depends entirely on the photos you upload. Let's ensure you get stunning results.",
      content: (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Your AI model will learn from every image you provide. Higher quality inputs result in more professional, realistic outputs that accurately represent your appearance.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">Upload clear, well-lit photos for optimal training</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">Show different angles and expressions</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">Avoid obstructions like sunglasses or hats</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "The Magic Number: 10 Images",
      subtitle: "Though we support minimum 5 images but we recommend uploading exactly 10 images to train the AI effectively and achieve professional results",
      content: (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/selfie2.jpg" alt="Face expressions" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">5</div>
              </div>
              <span className="text-xs text-gray-600">Face</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/vishnuselfie.jpg" alt="Half body" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">2</div>
              </div>
              <span className="text-xs text-gray-600">Half</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/you-man.jpg" alt="Left profile" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">1</div>
              </div>
              <span className="text-xs text-gray-600">Left</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/right-profile.jpg" alt="Right profile" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">1</div>
              </div>
              <span className="text-xs text-gray-600">Right</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image src="/content/full-body.jpg" alt="Full body" fill className="object-cover" />
                <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded">1</div>
              </div>
              <span className="text-xs text-gray-600">Full</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">5 facial images with different expressions</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">2 half-body shots showing your upper body</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">1 left-side profile and 1 right-side profile</span>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-600">1 full-body image showing your entire physique</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Upload photos like these:",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <Card className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/good-lighting.png" alt="Good lighting example" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">Good lighting</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/clean-bg.jpg" alt="Clear background example" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">Clear background</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/selfie2.jpg" alt="Clear portrait" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">Clear portraits</span>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 3,
      title: "Avoid photos like these:",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <Card className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="relative aspect-square mb-2 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                Sunglasses
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">No sunglasses or hats</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="relative aspect-square mb-2 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                Group photo
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">No group photos</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg">
            <div className="relative aspect-square mb-2 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                Blurry
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">No blurry images</span>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 4,
      title: "Final Quality Guidelines",
      subtitle: "Professional standards for optimal results",
      content: (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>No Filters:</strong> Skip beauty filters, heavy makeup, and photo effects. Natural appearance trains the AI most effectively.
            </p>
        
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Clear Background:</strong> Use a clean, neutral background that won't distract from your features. Solid colors work best.
            </p>
          
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>No Accessories:</strong> Avoid hats, sunglasses, or anything that obscures your facial features or head shape.
            </p>
            <p className="text-sm text-gray-700 mb-3">
              For detailed instructions and additional examples, visit our comprehensive photo upload guide:
            </p>
            <Link 
              href="/profile-photo-maker" 
              className="inline-flex text-center items-center text-sm text-blue-600 hover:text-blue-800 underline"
              onClick={onClose}
            >
              View Complete Photo Upload Guide →
            </Link>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    // Call server-side completion
    await completeOnboarding()
    
    // Call the original onComplete callback
    onComplete()
    setCurrentStep(0)
    setIsConfirmed(false)
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Fixed height to prevent scrolling */}
        <div className="p-4 flex-1 overflow-hidden">
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            {currentStepData.subtitle && (
              <p className="text-sm text-gray-600 max-w-xl mx-auto">
                {currentStepData.subtitle}
              </p>
            )}
          </div>

          <div className="overflow-hidden">
            {currentStepData.content}
          </div>

          {/* Final step confirmation */}
          {currentStep === 4 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">
                  I understand that the quality of my uploads determines the quality of my results.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 text-sm"
          >
            ← Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="px-6 bg-gray-900 hover:bg-gray-800 text-sm"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isConfirmed || loading}
                className="px-6 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Completing...' : 'Start My Photoshoot'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
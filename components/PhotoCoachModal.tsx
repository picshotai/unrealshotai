'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'next/navigation'
import { BrainCircuit, ShieldCheck } from "lucide-react";

interface PhotoCoachModalProps {
  isOpen: boolean
  onComplete: () => void
}

interface Step {
  id: number
  title: string
  subtitle?: string
  content: React.ReactNode
}

export default function PhotoCoachModal({ isOpen, onComplete }: PhotoCoachModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const { completeOnboarding, loading } = useUserStore()
  const router = useRouter()

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
    try {
      await completeOnboarding()
      onComplete()
      // Redirect to buy-credits page immediately
      router.push('/buy-credits')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    }
  }

  const steps: Step[] = [
    {
      id: 0,
      title: "Welcome! Let's Get Your Personal AI Setup Ready",
      subtitle: "How Unrealshot AI Delivers Realism:",
      content: (
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
            <BrainCircuit className="h-8 w-8 flex-shrink-0 text-gray-500 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Your Personal AI Model</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Unlike simple filters, we build a dedicated AI model trained exclusively on your photos. This power-intensive process uses dedicated GPUs to ensure the highest realism and accuracy, capturing your unique likeness.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg bg-green-50 p-4 border border-green-200">
            <ShieldCheck className="h-8 w-8 flex-shrink-0 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-green-600">Our Quality & Performance Guarantee</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your investment is protected. We back every pack with a full money-back guarantee. If you're not satisfied with the quality and performance we promise, you are eligible for a refund.
              </p>
            </div>
          </div>
        </div>
      )
    },
   
    {
      id: 2,
      title: "See How Our AI Works",
      subtitle: "Watch a real user upload their photo and generate stunning AI results.",
      content: (
        <div className="space-y-6">
          {/* Demo Video Component */}
          <div className="flex justify-center items-center mt-2">
            <div 
              className="relative w-full max-w-lg border-[#ff6f00] border-4 h-[250px] sm:h-[300px] md:h-[350px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
              onClick={() => {
                const iframe = document.getElementById('demo-video-iframe') as HTMLIFrameElement;
                const thumbnail = document.getElementById('demo-video-thumbnail') as HTMLElement;
                if (iframe && thumbnail) {
                  iframe.classList.remove('opacity-0', 'pointer-events-none');
                  iframe.classList.add('opacity-100');
                  thumbnail.classList.add('opacity-0', 'pointer-events-none');
                }
              }}
            >
              {/* Custom Thumbnail Background */}
              <div id="demo-video-thumbnail" className="absolute inset-0 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6f00]/20 via-orange-100/50 to-[#ff6f00]/30">
                  <div className="w-full h-full bg-[url('/images/howtothumbnail.webp')] bg-cover bg-center opacity-80"></div>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-100 scale-[0.9] transition-all duration-200 ease-out rounded-2xl">
                  <div className="bg-[#ff6f00]/10 flex items-center justify-center rounded-full backdrop-blur-md size-20">
                    <div
                      className={`flex items-center justify-center bg-gradient-to-b from-primary/30 to-primary shadow-md rounded-full size-14 transition-all ease-out duration-200 relative group-hover:scale-[1.2] scale-100`}
                    >
                      <Play
                        className="size-6 text-white fill-white group-hover:scale-105 scale-100 transition-transform duration-200 ease-out"
                        style={{
                          filter:
                            "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hidden iframe that will be shown on click */}
              <iframe
                className="w-full h-full opacity-0 pointer-events-none transition-opacity duration-300"
                src="https://www.youtube.com/embed/UL357H91Gc0"
                title="AI Processing Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                id="demo-video-iframe"
              ></iframe>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Ready to create your own professional AI photoshoot? Upload 6-10 photos, train your model and get 20 stunning photos in 20 minutes.
            </p>
            
            
          </div>
        </div>
      )
    }
  ]

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
          
        </div>

        {/* Content - Made scrollable for small screens */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            {currentStepData.subtitle && (
              <p className="text-sm text-gray-600 max-w-xl mx-auto">
                {currentStepData.subtitle}
              </p>
            )}
          </div>

          <div className="min-h-0">
            {currentStepData.content}
          </div>
         

          {/* Preview step confirmation - Removed checkbox dependency */}
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
                disabled={loading}
                className="px-6 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                {loading ? 'Completing...' : 'Start Your AI Model Training'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useRef } from 'react'
import { X, Check, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'next/navigation'

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
      title: "Welcome to Professional AI Photography",
      subtitle: "The quality of your AI photoshoot depends entirely on the photos you upload. Let's ensure you get stunning results.",
      content: (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Our AI will learn from every image you provide. Higher quality inputs result in more professional, realistic outputs that accurately represent your appearance.
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
          <div className="space-y-2">
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
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
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
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/confident.jpg" alt="Clear background example" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">Clear background</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
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
      title: "Avoid uploading photos like these:",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/groupphoto.webp" alt="Clear portrait" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">No Group Photos</span>
            </div>
          </Card>
          
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/nocaps.webp" alt="Clear portrait" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">NO caps or accessories</span>
            </div>
          </Card>
 
          <Card className="p-3 bg-white border border-gray-200 rounded-lg gap-2">
            <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
              <Image src="/content/sillyface.webp" alt="Blurry shot example" fill className="object-cover" />
              <div className="absolute top-2 left-2 flex items-center justify-center bg-gray-800/80 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">No Silly Faces</span>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 4,
      title: "See How Our AI Works",
      subtitle: "Watch a real user upload their photo and generate stunning AI results.",
      content: (
        <div className="space-y-6">
          {/* Demo Video Component */}
          <div className="flex justify-center items-center">
            <div 
              className="relative w-full max-w-md border-[#ff6f00] border-4 h-[250px] sm:h-[300px] md:h-[350px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
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
                src="https://k3gonexouqnxegps.public.blob.vercel-storage.com/howtovideo.mp4"
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
              Ready to create your own professional AI photoshoot? Upload 6-10 photos and get 20 stunning results in minutes.
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
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
                {currentStep === 4 ? 'Unlock Full 20-Photo Shoot →' : 'Next →'}
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="px-6 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Completing...' : 'Unlock Full 20-Photo Shoot'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
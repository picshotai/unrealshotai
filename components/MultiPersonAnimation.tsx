"use client"

import type React from "react"
import Image from "next/image"
import { Sparkles, Users, Wand2, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Caveat } from "next/font/google"

// Import framer-motion properly
import { motion } from "framer-motion"

// Configure the Caveat font
const caveat = Caveat({
  subsets: ["latin"],
  weight: "500",
})

// Image arrays (replace with your actual image URLs)
const modelImages = [
  "/content/manoj.jpg",
  "/content/sumesh.webp",
  "/placeholder.svg?height=300&width=225",
  "/placeholder.svg?height=300&width=225",
]

const outputImages = [
  "/content/friendslaughing.jpg",
  "/content/action-shot.jpg",
  "/content/friendslaughing.jpg",
  "/placeholder.svg?height=500&width=400",
]

// Silhouette Animation Component
const SilhouetteAnimation: React.FC = () => {
  return (
    <>
      {/* Person silhouette 1 - left side */}
      <motion.div
        className="absolute left-4 top-1/2 transform -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: [0, 1, 0],
          x: [-20, 0, 20],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
      >
        <div className="w-6 h-12 bg-indigo-500/30 rounded-full backdrop-blur-sm border border-indigo-500/20" />
      </motion.div>

      {/* Person silhouette 2 - left side */}
      <motion.div
        className="absolute left-8 top-1/2 transform -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: [0, 1, 0],
          x: [-20, 0, 20],
          y: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
          times: [0, 0.5, 1],
        }}
      >
        <div className="w-6 h-12 bg-indigo-500/30 rounded-full backdrop-blur-sm border border-indigo-500/20" />
      </motion.div>

      {/* Combined silhouette - right side */}
      <motion.div
        className="absolute right-8 top-1/2 transform -translate-y-1/2"
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: [0, 1, 0],
          x: [20, 0, -20],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
      >
        <div className="w-12 h-14 bg-indigo-500/30 rounded-lg backdrop-blur-sm border border-indigo-500/20 flex items-center justify-center">
          <Users className="w-6 h-6 text-indigo-200/70" />
        </div>
      </motion.div>
    </>
  )
}

// Sparkle Effect Component
const SparkleEffect: React.FC = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: Math.random() * 3 + 2 + "px",
            height: Math.random() * 3 + 2 + "px",
            borderRadius: "50%",
            background: `rgba(${Math.floor(Math.random() * 50 + 99)}, ${Math.floor(Math.random() * 50 + 102)}, ${Math.floor(Math.random() * 50 + 241)}, ${Math.random() * 0.5 + 0.5})`,
            filter: "blur(0.5px)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 5,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  )
}

// Animation Component
const AnimationComponent: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main container for the animation */}
      <div className="relative w-full md:h-40 h-40 flex items-center justify-center">
        {/* Title */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
          <div className={`${caveat.className} text-lg text-indigo-300 font-bold`}>Multi-Person AI</div>
        </div>

        {/* Central visualization */}
        <div className="relative z-10 flex flex-col items-center">
          {/* AI processing visualization */}
          <div className="relative mb-2">
            <motion.div
              className="w-14 h-14 rounded-lg bg-indigo-600/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-indigo-500/30"
              animate={{
                boxShadow: [
                  "0 0 10px 0px rgba(99, 102, 241, 0.5)",
                  "0 0 20px 5px rgba(99, 102, 241, 0.7)",
                  "0 0 10px 0px rgba(99, 102, 241, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>

            {/* Magic wand animation */}
            <motion.div
              className="absolute -top-2 -right-2 text-indigo-200"
              animate={{
                rotate: [0, 15, 0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Wand2 className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Text label */}
          <motion.div
            className="text-xs text-indigo-300 font-medium bg-indigo-950/50 px-2 py-1 rounded-md border border-indigo-500/30"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            Combining Models
          </motion.div>
        </div>

        {/* Left side flow visualization */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3 h-1 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: "linear-gradient(90deg, rgba(99, 102, 241, 0) 0%, rgba(99, 102, 241, 0.8) 100%)",
            }}
            animate={{
              x: ["-100%", "0%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Right side flow visualization */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-1 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: "linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(99, 102, 241, 0) 100%)",
            }}
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Floating silhouettes */}
        <SilhouetteAnimation />

        {/* Floating sparkles */}
        <SparkleEffect />
      </div>
    </div>
  )
}

// Multi-Person AI Animation Component
export default function MultiPersonAIAnimation() {
  return (
    <section className="w-full bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Before/After Comparison */}
        <div className="relative">
          <div className="text-center mb-8">
            <p className="text-center text-lg  text-gray-200 mb-4">See the Multi-Person Magic</p>
            <h3 className="text-4xl md:text-6xl font-bold mb-6 text-center">
              Transform individual models into stunning scenes with natural interactions
            </h3>
          </div>

          <div className="relative">
            <div className="bg-gray-900/80 rounded-xl border border-indigo-500/20 p-4 md:p-6 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* Input Models - 4 columns */}
                <div className="md:col-span-4 grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-indigo-500/30">
                      <Image
                        src={modelImages[0] || "/placeholder.svg"}
                        alt="First person model"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">
                      1
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      Majnu's AI Model
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-indigo-500/30">
                      <Image
                        src={modelImages[1] || "/placeholder.svg"}
                        alt="Second person model"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">
                      2
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      Ranjha's AI Model
                    </div>
                  </div>
                </div>

                {/* Animation Section - 3 columns */}
                <div className="md:col-span-3 flex justify-center">
                  <AnimationComponent />
                </div>

                {/* Output - 4 columns */}
                <div className="md:col-span-4">
                  <div className="relative">
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden border-2 border-indigo-500/30 shadow-lg">
                      <Image
                        src={outputImages[0] || "/placeholder.svg"}
                        alt="AI generated multi-person scene"
                        fill
                        className="object-cover"
                      />
                      {/* Feature indicators */}
                      <div className="absolute top-1/4 left-1/4 w-6 h-6 rounded-full border-2 border-dashed border-green-400 animate-pulse">
                        <div className="absolute -top-8 -left-2 bg-green-900/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-green-200 whitespace-nowrap">
                          Person 1
                        </div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full border-2 border-dashed border-green-400 animate-pulse">
                        <div className="absolute -bottom-8 -right-2 bg-green-900/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-green-200 whitespace-nowrap">
                          Person 2
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-600 rounded-full px-2 py-1 flex items-center text-white text-xs font-bold border-2 border-gray-900">
                      <Sparkles className="w-3 h-3 mr-1" />
                      <span>NEW</span>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      Multi-Person Scene
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="flex items-center justify-center text-center p-3 rounded-lg bg-gray-800/40 border border-indigo-500/20">
                  <div>
                    <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-300">Natural Interactions</p>
                  </div>
                </div>
                <div className="flex items-center justify-center text-center p-3 rounded-lg bg-gray-800/40 border border-indigo-500/20">
                  <div>
                    <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-300">Consistent Lighting</p>
                  </div>
                </div>
                <div className="flex items-center justify-center text-center p-3 rounded-lg bg-gray-800/40 border border-indigo-500/20">
                  <div>
                    <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-300">Custom Scenes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-indigo-900/30"
            >
              Create AI Couple Photos Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-gray-400 mt-3">No photoshoot coordination needed</p>
          </div>
        </div>
      </div>
    
    </section>

  )
}


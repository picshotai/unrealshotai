"use client"

import Image from "next/image"
import { ArrowDown, Sparkles, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 16 unique image URLs (replace with your actual image URLs)
const inputImages = [
  "/images/demo1.jpg",
  "/images/demo2.jpg",
  "/images/demo3.jpg",
  "/images/demo4.jpg",
  "/images/demo5.jpg",
  "/images/demo6.jpg",
  "/images/demo7.jpg",
  "/images/demo8.jpg",
]

const outputImages = [
  "/images/aimodel1.jpg",
  "/images/aimodel2.jpg",
  "/images/aimodel3.jpg",
  "/images/aimodel4.jpg",
  "/content/ai-generated-user-image.jpg",
  "/images/aimodel6.jpg",
  "/images/aimodel7.jpg",
  "/images/aimodel8.jpg",
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)

  const steps = [
    {
      title: "1. Choose Pack & Upload Selfies",
      description:
        "Pick a style pack and upload 5+ clear selfies (front-facing, no accessories). Whether it’s solo or multi-person, we train a model that actually looks like you.",
      icon: "📸",
    },
    {
      title: "2. UnrealShot AI in Action",
      description:
        "No generic filters—our Photo AI analyzes every detail to create realistic photos that match your style, pose, and expression. You’re in full control with custom models and prompts.",
      icon: "⚙️",
    },
    {
      title: "3. Photoshoot Ready in 20 minutes",
      description:
        "Download stunning AI-generated photos that feel natural, not artificial. Perfect for dating, branding, professional images, or just cool pictures of you—without weird AI distortions.",
      icon: "✨",
    },
  ]

  return (
    <div className="relative text-gray-100 px-4 py-24 overflow-hidden">
  
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
            <Sparkles className="w-4 h-4 mr-2 text-black" />
            <span className="text-sm text-black font-medium">AI-Powered Photography</span>
          </Badge>

          <h2 className="text-4xl text-black md:text-6xl max-w-4xl mx-auto font-bold mb-6">
            How Unrealshot AI Photoshoot Generator Works
          </h2>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Create stunning professional AI powered photoshoots in just minutes with our easy 3-step process.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-10"
          >
            {/* Small Photos */}
            <div className="flex gap-3 justify-center">
              {inputImages.slice(0, 4).map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-20 h-20 relative rounded-xl overflow-hidden shadow-lg shadow-indigo-900/20 hover:shadow-indigo-700/30 transition-all duration-300"
                  onMouseEnter={() => setHoveredPhoto(i)}
                  onMouseLeave={() => setHoveredPhoto(null)}
                >
                  <Image
                    src={src || "/placeholder.svg?height=80&width=80"}
                    alt={`Input photo ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  <AnimatePresence>
                    {hoveredPhoto === i && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-bold">Selfie {i + 1}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="bg-indigo-500/20 p-3 rounded-full"
              >
                <ArrowDown className="w-6 h-6 text-indigo-400" />
              </motion.div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-5">
              {outputImages.slice(0, 4).map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group"
                >
                  <Card className="aspect-[3/4] relative rounded-xl overflow-hidden border-gray-800 bg-gray-800/50 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-700/30 transition-all duration-300">
                    <Image
                      src={src || "/placeholder.svg?height=300&width=225"}
                      alt={`AI Generated photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg flex items-center space-x-1.5 border border-indigo-500/30">
                      <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-sm" />
                      <span className="text-[10px] font-medium text-gray-200">AI Generated</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center Column */}
          <div className="space-y-6 text-center">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`relative group p-8 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeStep === index
                    ? "bg-gradient-to-br from-indigo-900/90 to-blue-900/90 border text-gray-200 border-indigo-500/30 shadow-lg shadow-indigo-900/20"
                    : "bg-gray-800 border border-gray-700/50 hover:border-indigo-500/20 hover:bg-gray-700"
                }`}
                onClick={() => setActiveStep(index)}
              >
               

                <div className="mb-4 text-3xl">{step.icon}</div>

                <h2 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-white">
                  {step.title.split(".")[1]}
                </h2>

                <p className="group-hover:text-gray-300 transition-colors duration-300">
                  {step.description}
                </p>

                {activeStep === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400"
                  >
                    
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-10"
          >
            {/* Small Photos */}
            <div className="flex gap-3 justify-center">
              {inputImages.slice(4, 8).map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-20 h-20 relative rounded-xl overflow-hidden shadow-lg shadow-blue-900/20 hover:shadow-blue-700/30 transition-all duration-300"
                  onMouseEnter={() => setHoveredPhoto(i + 4)}
                  onMouseLeave={() => setHoveredPhoto(null)}
                >
                  <Image
                    src={src || "/placeholder.svg?height=80&width=80"}
                    alt={`Input photo ${i + 5}`}
                    fill
                    className="object-cover"
                  />
                  <AnimatePresence>
                    {hoveredPhoto === i + 4 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-bold">Selfie {i + 5}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="bg-blue-500/20 p-3 rounded-full"
              >
                <ArrowDown className="w-6 h-6 text-blue-400" />
              </motion.div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-5">
              {outputImages.slice(4, 8).map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group"
                >
                  <Card className="aspect-[3/4] relative rounded-xl overflow-hidden border-gray-800 bg-gray-800/50 shadow-lg shadow-blue-900/20 hover:shadow-blue-700/30 transition-all duration-300">
                    <Image
                      src={src || "/placeholder.svg?height=300&width=225"}
                      alt={`AI Generated photo ${i + 5}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg flex items-center space-x-1.5 border border-blue-500/30">
                      <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-sm" />
                      <span className="text-[10px] font-medium text-gray-200">AI Generated</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

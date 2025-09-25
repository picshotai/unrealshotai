"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowDown, Sparkles, Users, Wand2, Download, CheckCircle2, ChevronRight, Wand } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Caveat } from "next/font/google"

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

// Multi-Person AI Animation Component
const MultiPersonAIAnimation: React.FC = () => {
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

export default function HowItWorksMultiPerson() {
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Refs for scroll animations
  const stepsRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const testimonialRef = useRef<HTMLDivElement>(null)

  const stepsInView = useInView(stepsRef, { once: true, amount: 0.2 })
  const comparisonInView = useInView(comparisonRef, {
    once: true,
    amount: 0.3,
  })
  const testimonialInView = useInView(testimonialRef, {
    once: true,
    amount: 0.3,
  })

  const stepsControls = useAnimation()
  const comparisonControls = useAnimation()
  const testimonialControls = useAnimation()

  useEffect(() => {
    setIsVisible(true)

    if (stepsInView) {
      stepsControls.start("visible")
    }

    if (comparisonInView) {
      comparisonControls.start("visible")
    }

    if (testimonialInView) {
      testimonialControls.start("visible")
    }
  }, [stepsInView, comparisonInView, testimonialInView, stepsControls, comparisonControls, testimonialControls])

  const steps = [
    {
      title: "Select Models & Describe the Scene",
      description:
        "Start by selecting two pre-trained models from your account. Then, describe the scene you want to generate in detail, including poses, expressions, and environment.",
      icon: <Users className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-600",
      benefits: [
        "Choose any two models you've trained",
        "Provide detailed scene descriptions",
        "Specify poses, expressions, and environment",
      ],
      cta: "Choose Your Models",
    },
    {
      title: "AI Processing in Action",
      description:
        "Our advanced AI blends both models into a realistic scene, mapping facial features accurately and ensuring natural positioning and interactions between the subjects.",
      icon: <Wand2 className="w-6 h-6" />,
      color: "from-indigo-600 to-blue-700",
      benefits: [
        "AI maps facial features accurately",
        "Ensures natural positioning & interactions",
        "Adjusts lighting and depth for realism",
      ],
      cta: "Try It Yourself",
    },
    {
      title: "Download & Share Your AI Image",
      description:
        "Once your image is generated, download it in high resolution instantly. Perfect for social media, creative projects, and professional presentations!",
      icon: <Download className="w-6 h-6" />,
      color: "from-indigo-700 to-blue-800",
      benefits: [
        "High-quality downloads",
        "Multiple size options available",
        "Ready for social media and creative projects",
      ],
      cta: "Create Your AI Version",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <div className="relative bg-black text-white px-4 py-24 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Glow effects */}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-gray-800/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-gray-800/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 border-gray-700 bg-gray-800/50 text-white">
            <Sparkles className="w-4 h-4 mr-2 text-white" />
            <span className="text-sm font-medium">AI-Powered Multi-Person Photography</span>
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl max-w-4xl mx-auto font-bold mb-6 tracking-tight">
            How Unrealshot AI's Multi-Person Feature Works
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Create stunning AI-generated images featuring two people in a single scene with just a few clicks.
          </p>

          {/* Quick action button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-indigo-900/30"
            >
              Get Your AI Photos Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-gray-500 mt-2">100% User Satisfaction</p>
          </motion.div>
        </div>

        {/* Interactive Process Visualization */}
        <div
          className="relative mb-8"
        >
          {/* Process Path */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 via-blue-600/50 to-indigo-700/50 transform -translate-x-1/2 rounded-full hidden md:block" />

          {/* Steps */}
          <div className="space-y-24 md:space-y-40 relative">
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="relative">
                {/* Floating annotation at the top */}
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
                  {/* Step Content - Alternating Layout */}
                  <div className={`order-2 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                    <div
                      className={`relative p-4 sm:p-8 rounded-xl transition-all duration-300 
    bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-indigo-500/20 
    hover:border-indigo-500/40 shadow-lg shadow-indigo-900/10 hover:shadow-indigo-700/20
    transform hover:-translate-y-1`}
                    >
                      {/* Step Number */}
                   

                      {/* Step Icon */}
                      <div
                        className={`inline-flex items-center justify-center p-3 mb-4 rounded-lg bg-gradient-to-br ${step.color} text-white`}
                      >
                        {step.icon}
                      </div>

                      <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>

                      <p className="text-gray-300">{step.description}</p>

                      {/* Benefits */}
                      <div className="mt-6 space-y-2">
                        {step.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-white flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Step CTA Button */}
                      <div className="mt-6">
                        <Link href="/" >
                        <Button
                          variant="outline"
                          className="border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-200"
                        >
                          {step.cta}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Step Visualization */}
                  <div className={`order-1 ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
                    {index === 0 && (
                      <div className="relative">
                        {/* Model Selection Visualization */}
                        <div className="space-y-6 mb-8">
                          {/* First Model Selection */}
                          <div className="p-4 rounded-xl border-2 border-indigo-500/30 bg-gray-800/50">
                            <div className="text-sm  mb-2 font-medium">Select First Model</div>
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-indigo-500/30">
                                <Image
                                  src={modelImages[0] || "/placeholder.svg"}
                                  alt="First model"
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 p-2 rounded bg-gray-900/50 border border-indigo-500/20">
                                <div className="text-xs text-gray-400">Selected Model</div>
                                <div className="text-sm font-medium text-white">Majnu </div>
                              </div>
                            </div>
                          </div>

                          {/* Second Model Selection */}
                          <div className="p-4 rounded-xl border-2 border-indigo-500/30 bg-gray-800/50">
                            <div className="text-sm mb-2 font-medium">Select Second Model</div>
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-indigo-500/30">
                                <Image
                                  src={modelImages[1] || "/placeholder.svg"}
                                  alt="Second model"
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 p-2 rounded bg-gray-900/50 border border-indigo-500/20">
                                <div className="text-xs text-gray-400">Selected Model</div>
                                <div className="text-sm font-medium text-white">Ranjha </div>
                              </div>
                            </div>
                          </div>

                          {/* Scene Description */}
                          <div className="p-4 rounded-xl border-2 border-indigo-500/30 bg-gray-800/50">
                            <div className="text-sm  mb-2 font-medium">Describe the Scene</div>
                            <div className="p-3 rounded bg-gray-900/70 border border-indigo-500/20 text-sm text-gray-300">
                              <div className="flex items-start">
                                <Wand className="w-4 h-4 mr-2 text-indigo-400 mt-0.5 flex-shrink-0" />
                                <p>
                                  A dynamic action shot of two man standing on a high-rise rooftop in a modern cityscape
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Selection Label */}
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full sm:w-auto">
                          <div className="bg-indigo-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-500/30 whitespace-nowrap mx-auto text-center">
                            <span className={`${caveat.className} text-lg text-white`}>
                              Your models & scene, ready for magic
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                 
{index === 1 && (
                      <div className="relative mb-8">
                        {/* AI Processing Visualization */}
                        <div className="relative p-4 sm:p-6 rounded-xl border-2 border-indigo-500/30 bg-gray-800/50 shadow-lg">
                          <div className="aspect-video relative rounded-lg overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-blue-900/80 flex items-center justify-center">
                              {/* Background grid effect */}
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />

                              {/* Scanning effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-transparent"
                                animate={{
                                  top: ["-100%", "100%"],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              />

                              {/* Floating particles */}
                              <div className="absolute inset-0 overflow-hidden">
                                {[...Array(15)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 rounded-full bg-indigo-300/60"
                                    style={{
                                      left: `${Math.random() * 100}%`,
                                      top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                      y: [0, -15, 0],
                                      x: [0, Math.random() * 10 - 5, 0],
                                      opacity: [0, 0.8, 0],
                                      scale: [0, 1, 0],
                                    }}
                                    transition={{
                                      duration: 2 + Math.random() * 2,
                                      repeat: Number.POSITIVE_INFINITY,
                                      delay: Math.random() * 2,
                                    }}
                                  />
                                ))}
                              </div>

                              {/* Data flow lines */}
                              <div className="absolute inset-0">
                                {[...Array(6)].map((_, i) => {
                                  const startX = Math.random() * 100
                                  const startY = Math.random() * 100
                                  const endX = Math.random() * 100
                                  const endY = Math.random() * 100

                                  return (
                                    <motion.div
                                      key={i}
                                      className="absolute h-px bg-gradient-to-r from-indigo-400/0 via-indigo-400/80 to-indigo-400/0"
                                      style={{
                                        top: `${startY}%`,
                                        left: `${startX}%`,
                                        width: "30%",
                                        transformOrigin: "left center",
                                      }}
                                      animate={{
                                        rotate: [0, Math.random() * 360],
                                        x: [0, 100],
                                        opacity: [0, 0.8, 0],
                                      }}
                                      transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: Math.random() * 3,
                                      }}
                                    />
                                  )
                                })}
                              </div>

                              {/* Central content */}
                              <div className="relative z-10 text-center px-4">
                                <motion.div
                                  animate={{
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                      "0 0 0 0 rgba(99, 102, 241, 0)",
                                      "0 0 20px 5px rgba(99, 102, 241, 0.5)",
                                      "0 0 0 0 rgba(99, 102, 241, 0)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                  }}
                                  className="w-16 h-16 mx-auto mb-4 rounded-lg bg-indigo-600/50 backdrop-blur-sm flex items-center justify-center"
                                >
                                  <Wand2 className="w-8 h-8 text-indigo-100" />
                                </motion.div>

                                <h4 className="text-xl font-bold text-white mb-2">AI Processing</h4>

                                {/* Pulsing dots */}
                                <div className="flex justify-center space-x-1 mb-4">
                                  {[1, 2, 3].map((dot) => (
                                    <motion.div
                                      key={dot}
                                      animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.4, 1, 0.4],
                                      }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: dot * 0.3,
                                      }}
                                      className="w-3 h-3 rounded-full bg-indigo-400"
                                    />
                                  ))}
                                </div>

                                {/* Progress bar with glow effect */}
                                <div className="w-64 max-w-full h-3 bg-gray-700/60 rounded-full overflow-hidden mx-auto relative">
                                  <motion.div
                                    animate={{ width: ["0%", "100%"] }}
                                    transition={{
                                      duration: 3,
                                      repeat: Number.POSITIVE_INFINITY,
                                    }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full relative"
                                  />
                                  <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "easeInOut",
                                    }}
                                    className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent"
                                  />
                                </div>

                                {/* Status text with typing effect */}
                                <div className="h-6 mt-4">
                                  <motion.p
                                    className="text-indigo-200 text-sm inline-block"
                                    animate={{ opacity: [0, 1] }}
                                    transition={{
                                      duration: 0.5,
                                      repeat: Number.POSITIVE_INFINITY,
                                      repeatType: "reverse",
                                      repeatDelay: 2.5,
                                    }}
                                  >
                                    Blending models, creating scene...
                                  </motion.p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Processing Details with subtle animations */}
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <motion.div
                              className="p-3 rounded-lg bg-gray-800/80 border border-indigo-500/20"
                              whileHover={{
                                borderColor: "rgba(99, 102, 241, 0.4)",
                                backgroundColor: "rgba(30, 30, 46, 0.9)",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="text-xs text-gray-400 mb-1">Face Recognition</div>
                              <div className="flex items-center">
                                <div className="text-sm font-medium ">Complete</div>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: 0 }}
                                  className="ml-2 text-green-400"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                </motion.div>
                              </div>
                            </motion.div>

                            <motion.div
                              className="p-3 rounded-lg bg-gray-800/80 border border-indigo-500/20"
                              whileHover={{
                                borderColor: "rgba(99, 102, 241, 0.4)",
                                backgroundColor: "rgba(30, 30, 46, 0.9)",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="text-xs text-gray-400 mb-1">Scene Composition</div>
                              <div className="flex items-center">
                                <div className="text-sm font-medium ">In Progress</div>
                                <div className="ml-2 flex space-x-0.5">
                                  {[1, 2, 3].map((dot) => (
                                    <motion.div
                                      key={dot}
                                      animate={{ opacity: [0.4, 1, 0.4] }}
                                      transition={{
                                        duration: 0.8,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: dot * 0.2,
                                      }}
                                      className="w-1 h-1 rounded-full bg-indigo-400"
                                    />
                                  ))}
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              className="p-3 rounded-lg bg-gray-800/80 border border-indigo-500/20"
                              whileHover={{
                                borderColor: "rgba(99, 102, 241, 0.4)",
                                backgroundColor: "rgba(30, 30, 46, 0.9)",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="text-xs text-gray-400 mb-1">Detail Enhancement</div>
                              <div className="text-sm font-medium">Pending</div>
                            </motion.div>

                            <motion.div
                              className="p-3 rounded-lg bg-gray-800/80 border border-indigo-500/20"
                              whileHover={{
                                borderColor: "rgba(99, 102, 241, 0.4)",
                                backgroundColor: "rgba(30, 30, 46, 0.9)",
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="text-xs text-gray-400 mb-1">Estimated Time</div>
                              <div className="flex items-center">
                                <motion.div
                                  animate={{ opacity: [1, 0.7, 1] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                  }}
                                  className="text-sm font-medium"
                                >
                                  ~1 minute
                                </motion.div>
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Processing Label */}
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full sm:w-auto">
                          <motion.div
                            className="bg-indigo-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-500/30 whitespace-nowrap mx-auto text-center"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(99, 102, 241, 0)",
                                "0 0 10px 2px rgba(99, 102, 241, 0.3)",
                                "0 0 0 0 rgba(99, 102, 241, 0)",
                              ],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            <span className={`${caveat.className} text-lg text-indigo-300`}>AI working its magic</span>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="relative mb-8">
                        {/* Results Visualization */}
                        <motion.div
                          className="group"
                        >
                          <div
                            className="relative rounded-xl overflow-hidden border-2 border-indigo-500/30 bg-gray-800/50 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-700/30 transition-all duration-300 transform hover:-translate-y-1"
                            style={{ aspectRatio: "4/3" }}
                          >
                            <Image
                              src={outputImages[1] || "/placeholder.svg"}
                              alt="AI Generated photo"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg flex items-center space-x-1.5 border border-indigo-500/30">
                              <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-sm" />
                              <span className="text-[10px] font-medium text-gray-200">Multi-Person AI</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Results Label */}
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full sm:w-auto">
                          <div className="bg-indigo-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-500/30 whitespace-nowrap mx-auto text-center">
                            <span className={`${caveat.className} text-lg text-indigo-300`}>
                              Majnu And Raja as Action Hero 
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connection Arrow (for mobile) */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8 md:hidden">
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="bg-indigo-500/20 p-3 rounded-full"
                    >
                      <ArrowDown className="w-6 h-6 text-indigo-400" />
                    </motion.div>
                  </div>
                )}

                {/* Connection Dot (for desktop) */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 hidden md:block"
                    style={{ top: "calc(100% + 4rem)" }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="w-4 h-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </div>
  )
}


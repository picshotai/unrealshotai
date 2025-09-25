"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Upload, Sparkles, Heart, Camera, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import PremiumComparison from "@/components/PremiumComparison"
import FourthSection from "@/components/fourth-section";
import PricingSection from "@/components/Content/CouplePricing";
import AICoupleShowcase from "@/components/Content/CoupleShowcase";
import FinalCTA from "@/components/final-cta";


const beforeAfterExamples = [
  {
    id: 1,
    title: "Romantic Terrace Party",
    maleImage: "/content/you-man.jpg",
    femaleImage: "/content/yours.jpg",
    resultImage: "/content/togetherselfie.jpg",
    description: "Transform ordinary selfies into a romantic sunset party",
    style: "Romantic",
  },
  {
    id: 2,
    title: "Lovely Couples",
    maleImage: "/content/you-man2.jpg",
    femaleImage: "/content/mariah-edwards.png",
    resultImage: "/content/togetherselfie2.jpg",
    description: "Create stunning couple photos without the expensive photoshoot",
    style: "Elegant",
  },
  {
    id: 3,
    title: "Chilling Life",
    maleImage: "/content/you-man3.jpg",
    femaleImage: "/content/yours3.jpg",
    resultImage: "/content/togetherselfie3.jpg",
    description: "Generate chill life photos in breathtaking natural landscapes",
    style: "Modern Casual",
  },
  {
    id: 4,
    title: "Warm Indoor Portraits",
    maleImage: "/content/ai-generated-user-image.jpg",
    femaleImage: "/content/ai-mariah.jpg",
    resultImage: "/content/togetherselfie4.jpg",
    description: "Capture the warmth of cozy indoor moments with this relaxed, modern couple portrait.",
    style: "Cozy Minimalist",
}

]

export default function AICoupleLanding() {
  const [currentExample, setCurrentExample] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentExample((prev) => (prev + 1) % beforeAfterExamples.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovered])

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % beforeAfterExamples.length)
  }

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + beforeAfterExamples.length) % beforeAfterExamples.length)
  }

  return (
    <div className="mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-24 ">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f108_1px,transparent_1px),linear-gradient(to_bottom,#6366f108_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Floating icons */}
          <div className="hidden lg:block">
            <motion.div 
              className="absolute top-20 left-[15%]"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Heart className="h-8 w-8 text-pink-400/40" />
            </motion.div>
            <motion.div 
              className="absolute top-40 right-[10%]"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            >
              <Camera className="h-10 w-10 text-indigo-400/40" />
            </motion.div>
            <motion.div 
              className="absolute bottom-20 left-[20%]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
            >
              <Sparkles className="h-6 w-6 text-amber-400/60" />
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-8">
          {/* Header Content */}
          <div className="text-center mb-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-indigo-700 mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">AI-Powered Couple Photos</span>
              </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold relative bg-gradient-to-r from-indigo-800 to-blue-700 bg-clip-text text-transparent"
            >
              Transform Your Selfies into <br className="hidden md:block" />
              <span className="text-black">
                Stunning Couple Photos
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8 mt-4 font-medium text-gray-700 md:text-xl"
            >
              Upload individual selfies and let our AI create professional couple portraits in any style or setting—no photoshoot needed.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/ai-multiperson-photo-generator">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-md px-4 py-2 h-auto text-lg"
                >
                  Create Your Couple Photos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Before & After Showcase */}
          <div 
            className="max-w-7xl mx-auto relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExample}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Mobile Layout */}
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={beforeAfterExamples[currentExample].maleImage || "/placeholder.svg"}
                        alt="Male selfie"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <span className="text-white text-sm font-medium p-2">His Photo</span>
                      </div>
                    </div>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={beforeAfterExamples[currentExample].femaleImage || "/placeholder.svg"}
                        alt="Female selfie"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <span className="text-white text-sm font-medium p-2">Her Photo</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={beforeAfterExamples[currentExample].resultImage || "/placeholder.svg"}
                      alt="AI generated couple photo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-3 w-full">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-bold">{beforeAfterExamples[currentExample].title}</h3>
                          <span className="bg-indigo-600/90 text-white text-xs px-2 py-1 rounded-full">
                            {beforeAfterExamples[currentExample].style}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">{beforeAfterExamples[currentExample].description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-12 gap-6 items-center">
                    {/* Left side - Male photo */}
                    <div className="col-span-3">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group">
                        <Image
                          src={beforeAfterExamples[currentExample].maleImage || "/placeholder.svg"}
                          alt="Male selfie"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-4 w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">His Photo</span>
                              <Upload className="h-4 w-4 text-white/80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center - Transformation arrows and AI magic */}
                    <div className="col-span-6 relative">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, 0, -5, 0]
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            className="absolute -inset-6 rounded-full bg-indigo-400/20 blur-xl"
                          />
                          <div className="bg-white rounded-full p-4 shadow-lg">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="h-8 w-8 text-indigo-600" />
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                        <Image
                          src={beforeAfterExamples[currentExample].resultImage || "/placeholder.svg"}
                          alt="AI generated couple photo"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                          <div className="p-6 w-full">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white text-xl font-bold">{beforeAfterExamples[currentExample].title}</h3>
                              <span className="bg-indigo-600/90 text-white px-3 py-1 rounded-full text-sm">
                                {beforeAfterExamples[currentExample].style}
                              </span>
                            </div>
                            <p className="text-white/90">{beforeAfterExamples[currentExample].description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Left arrow */}
                      <button 
                        onClick={prevExample}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Previous example"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Right arrow */}
                      <button 
                        onClick={nextExample}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Next example"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Right side - Female photo */}
                    <div className="col-span-3">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group">
                        <Image
                          src={beforeAfterExamples[currentExample].femaleImage || "/placeholder.svg"}
                          alt="Female selfie"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-4 w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">Her Photo</span>
                              <Upload className="h-4 w-4 text-white/80" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example navigation dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {beforeAfterExamples.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentExample(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentExample === index 
                          ? "bg-indigo-600 w-6" 
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
                      aria-label={`View example ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 ">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-900/50 px-4 py-2 text-indigo-300 mb-6"
            >
              <Camera className="h-4 w-4" />
              <span className="font-medium">How It Works</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl max-w-4xl mx-auto font-bold mb-6 tracking-tight">
              Create Stunning Couple Photos <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-400 to-blue-400 text-transparent bg-clip-text">
                In Any Style or Setting
              </span>
            </h2>
            
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Unrealshot AI lets you create stunning couple photos by training a model with both individuals' faces.
              Simply upload images, and generate photos in any setting or style using a custom prompt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 rounded-2xl p-6 border border-pink-800/30"
            >
              <div className="bg-pink-500/20 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                <Upload className="h-7 w-7 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Upload Your Selfies</h3>
              <p className="text-gray-300">Upload 4-10 clear, well-lit selfies of each person for best results.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-2xl p-6 border border-indigo-800/30"
            >
              <div className="bg-indigo-500/20 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                <Sparkles className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">AI Model Training</h3>
              <p className="text-gray-300">Our AI learns the facial features of both individuals to create realistic results.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-6 border border-purple-800/30"
            >
              <div className="bg-purple-500/20 p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                <Camera className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Generate Photos</h3>
              <p className="text-gray-300">Create stunning couple photos in any style or setting using custom prompts.</p>
            </motion.div>
          </div>
        </div>
        
      </section>
      <PremiumComparison />
      <PricingSection />
      <FourthSection />
      <AICoupleShowcase />
      <FinalCTA />
    </div>
  )
}

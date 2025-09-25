"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Star } from "lucide-react"

type UserData = {
  id: number
  name: string
  originalSelfie: string
  aiGeneratedPhotos: string[]
  review: string
  rating: number
}

const userData: UserData[] = [
  {
    id: 1,
    name: "Sumesh",
    originalSelfie: "/content/sumesh.webp",
    aiGeneratedPhotos: ["/content/ai-generated-sumesh.webp", "/content/ai-generated-sumesh2.webp", "/content/ai-generated-sumesh3.webp"],
    review:
      "I was refferd by my friend to unrealshot AI. And this AI tool does ti all what he said, really loved the accuracy, and the quality of the image is great.",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Sachin",
    originalSelfie: "/content/sachin.webp",
    aiGeneratedPhotos: ["/content/ai-generated-sachin1.webp", "/content/ai-generated-sachin2.webp", "/content/ai-generated-sachin3.webp"],
    review:
      "Hi, Harvansh. Your results were quite good compared to other AI Headshot generators. I have used two of the big names, but both were costly. Your platform is worth the money. Keep going.",
    rating: 5,
  },
  {
    id: 3,
    name: "Vishnu",
    originalSelfie: "/content/vishnu.webp",
    aiGeneratedPhotos: ["/content/ai-generated-vishnu.webp", "/content/ai-generated-vishnu2.webp", "/content/ai-generated-vishnu3.webp"],
    review:
      "I've tried a few photo generation platforms, but Unrealshot AI stands out. I got a glamorous look for my social media, and the quality was top-notch. Plus, it's one of the most affordable options I've found.",
    rating: 5,
  },
  {
    id: 4,
    name: "Manoj",
    originalSelfie: "/content/manoj.jpg",
    aiGeneratedPhotos: ["/content/manoj-ai-generated.jpg", "/content/manoj-ai-generated2.jpg", "/content/manoj-ai-generated3.jpg"],
    review: "What a wonderful platform for photo editing, really I like it. Thanks!",
    rating: 4.5,
  },
]

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : star - 0.5 <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

const UserShowcase: React.FC = () => {
  const [activeUserIndex, setActiveUserIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const activeUser = userData[activeUserIndex]

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const nextIndex = (prev + 1) % activeUser.aiGeneratedPhotos.length
      if (nextIndex === 0 && isAutoPlaying) {
        // Move to the next user when we've shown all images for the current user
        setActiveUserIndex((prevUser) => (prevUser + 1) % userData.length)
      }
      return nextIndex
    })
  }, [activeUser, isAutoPlaying])

  const handleUserClick = (index: number) => {
    setIsAutoPlaying(false)
    setActiveUserIndex(index)
    setCurrentImageIndex(0)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        nextImage()
      }, 3000) // Change image every 3 seconds
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, nextImage])

  return (
    <section className="relative w-full py-16 md:py-20 bg-black text-white isolate">
      {/* Add a stable stacking context */}
      <div className="relative z-[1]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-600/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Real User Transformations</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 mt-6 center">AI-Powered Makeovers See Your Transformation Side by Side</h2>


            <p className="text-gray-400 text-lg">
              See how our AI transforms everyday selfies into stunning professional photos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Selfies Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {userData.map((user, index) => (
                  <motion.button
                    key={user.id}
                    onClick={() => handleUserClick(index)}
                    className={`relative aspect-square rounded-xl md:rounded-2xl overflow-hidden group 
                      ${index === activeUserIndex ? "ring-2 ring-indigo-500" : ""}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={user.originalSelfie || "/placeholder.svg"}
                      alt={`${user.name}'s selfie`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority={index === 0} // Prioritize loading the first image
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/60 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= user.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : star - 0.5 <= user.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm line-clamp-3 mt-2">{user.review}</p>
                    </motion.div>
                  </motion.button>
                ))}
              </div>
  
            </div>

            {/* AI Generated Result */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[5/6] rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeUser.id}-${currentImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeUser.aiGeneratedPhotos[currentImageIndex] || "/placeholder.svg"}
                    alt={`${activeUser.name}'s AI generated photo`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Info Card */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 text-white">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">AI Generated</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                <div className="flex items-center justify-between">
                  <div className="text-base md:text-lg font-medium">{activeUser.name}'s Transformation</div>
                  <button
                    onClick={() => {
                      setIsAutoPlaying((prev) => !prev)
                      if (!isAutoPlaying) nextImage()
                    }}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 md:px-4 md:py-2 hover:bg-white/20 transition-colors"
                  >
                    <span className="text-sm md:text-base">{isAutoPlaying ? "Pause" : "Play"}</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="flex space-x-1 md:space-x-2 mt-3 md:mt-4">
                  {activeUser.aiGeneratedPhotos.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? "w-6 md:w-8 bg-indigo-500" : "w-3 md:w-4 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex text-center mx-auto mt-8 justify-center ">
                    <a href="/buy-credits" className="flex items-center text-white py-2 px-4 font-medium rounded text-lg shadow-lg bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 group">
                          Create Your AI Avatar Now
                          <Sparkles className="ml-2 group-hover:rotate-12 transition-transform duration-300" />
                        </a>
                  </div>

    </section>
  )
}

export default UserShowcase


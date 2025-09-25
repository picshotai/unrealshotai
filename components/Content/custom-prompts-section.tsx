"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Camera, ArrowRight, MousePointer, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-indigo-300/50 rounded-full"
    style={{ willChange: "transform" }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [-20, -40],
      x: Math.random() * 40 - 20,
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeOut",
    }}
  />
)

const PulsingRing = ({ delay = 0, scale = 1 }) => (
  <motion.div
    className="absolute rounded-full border border-indigo-400/20"
    style={{
      width: `${100 * scale}px`,
      height: `${100 * scale}px`,
    }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  />
)

const TypeWriter = ({ text, delay = 70, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    } else {
      onComplete?.()
    }
  }, [currentIndex, delay, text, onComplete])

  return <span>{displayText}</span>
}

const RippleEffect = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="absolute w-20 h-20 bg-indigo-400 rounded-full pointer-events-none"
    style={{ left: x - 40, top: y - 40 }}
    initial={{ scale: 0, opacity: 0.8 }}
    animate={{ scale: 5, opacity: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  />
)

export default function CustomPromptsSection() {
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [ripple, setRipple] = useState({ x: 0, y: 0, isVisible: false })
  const cursorControls = useAnimation()
  const pointerControls = useAnimation()

  const prompt = "Transform my photo into a cyberpunk character exploring a neon-lit cityscape at night..."

  const transformations = [
    {
      style: "original",
      description: "Original Photo",
      imageUrl: "/content/image2.webp",
    },
    {
      style: "transformed",
      description: "AI Generated Result",
      imageUrl: "/content/image2.webp",
    },
  ]

  useEffect(() => {
    if (isTypingComplete) {
      const animateCursor = async () => {
        await cursorControls.start({ opacity: 0, transition: { duration: 0.2 } })
        await pointerControls.start({ opacity: 1, scale: 1, transition: { duration: 0.3 } })
        await pointerControls.start({
          top: "calc(100% - 3rem)",
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        })

        const button = document.querySelector(".generate-button")
        if (button) {
          const buttonRect = button.getBoundingClientRect()
          const rippleX = buttonRect.left + buttonRect.width / 2
          const rippleY = buttonRect.top + buttonRect.height / 2
          setRipple({ x: rippleX, y: rippleY, isVisible: true })
        }

        await pointerControls.start({ scale: 0.6, transition: { duration: 0.1 } })
        await pointerControls.start({ scale: 1, transition: { duration: 0.1 } })
        await new Promise((resolve) => setTimeout(resolve, 800))
        setRipple({ x: 0, y: 0, isVisible: false })

        setShowImages(true)

        await pointerControls.start({
          opacity: 0,
          transition: { duration: 0.3 },
        })

        setIsTypingComplete(false)
        setIsRestarting(true)
        setTimeout(() => {
          setIsRestarting(false)
          setShowImages(false)
        }, 5000)
      }
      const animation = animateCursor()
      return () => {
        // Cleanup animations on unmount
        cursorControls.stop()
        pointerControls.stop()
      }
    }
  }, [isTypingComplete, cursorControls, pointerControls])

  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unleash Your Creativity with Custom Prompts
        </motion.h2>

        <div className="relative max-w-3xl mx-auto mb-12">
          {/* Main Card */}
          <motion.div
            className="relative aspect-[16/9] bg-white rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-indigo-300/5"
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 50%, rgba(165,180,252,0.05) 100%)",
                    "linear-gradient(135deg, rgba(165,180,252,0.05) 0%, transparent 50%, rgba(99,102,241,0.05) 100%)",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />

              {/* Floating Particles */}
              <div className="absolute left-1/4 top-1/3">
                {[...Array(3)].map((_, i) => (
                  <FloatingParticle key={i} delay={i * 0.6} />
                ))}
              </div>

              {/* Pulsing Rings */}
              <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
                {[...Array(3)].map((_, i) => (
                  <PulsingRing key={i} delay={i * 1} scale={1 + i * 0.3} />
                ))}
              </div>

              {/* Magic Sparkles */}
              <motion.div
                className="absolute right-12 top-1/3"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      rotate: `${i * 120}deg`,
                      transformOrigin: "center",
                    }}
                  >
                    <motion.div
                      className="w-1 h-1 bg-indigo-300 rounded-full"
                      style={{
                        x: 30,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Camera Icon */}
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            {/* Magic Wand Icon */}
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20"
              initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
              animate={{
                opacity: [1, 0.6, 1],
                scale: [1, 0.95, 1],
                rotate: -45,
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-indigo-300" />
              </div>
            </motion.div>

            {/* Prompt Area */}
            <motion.div
              className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-xl z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="relative bg-gray-100/50 backdrop-blur-sm rounded-xl px-6 py-4 text-gray-600">
                {!isRestarting && <TypeWriter text={prompt} onComplete={() => setIsTypingComplete(true)} />}
                <motion.div className="absolute right-0 top-0 h-full w-1 bg-primary" animate={cursorControls} />
              </div>
            </motion.div>

            {/* Generate Button */}
            {!showImages && (
              <div className="absolute left-1/2 bottom-6 -translate-x-1/2 z-20">
                <Button
                  size="sm"
                  variant="outline"
                  className="generate-button bg-black/90 text-white hover:bg-black relative overflow-hidden group border-none"
                >
                  See The Magic
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* Animated Cursor */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 z-50"
              initial={{ opacity: 0, scale: 0.8, top: "66.67%" }}
              animate={pointerControls}
            >
              <div className="relative">
                <MousePointer className="w-10 h-10 text-indigo-400 filter drop-shadow-lg" />
                <div className="absolute inset-0 bg-indigo-400 opacity-50 blur-md rounded-full" />
              </div>
            </motion.div>

            {/* Ripple Effect */}
            {ripple.isVisible && <RippleEffect x={ripple.x} y={ripple.y} />}

            {/* Image Grid */}
            {showImages && (
              <motion.div
                className="absolute inset-0 grid grid-cols-2 gap-4 p-6 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {transformations.map((transform, index) => (
                  <motion.div
                    key={transform.style}
                    className="relative h-full rounded-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.2,
                      },
                    }}
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={transform.imageUrl || "/placeholder.svg"}
                        alt={transform.description}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={true}
                      />
                    </div>

                    {/* Style Label */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <motion.p
                        className="text-white text-sm font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                      >
                        {transform.description}
                      </motion.p>
                    </div>

                    {/* Sparkle Icon */}
                    <motion.div
                      className="absolute top-2 right-2"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: index * 0.2 + 0.2,
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-indigo-300" />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-4 right-4 w-2 h-2 bg-indigo-300 rounded-full z-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-2 h-2 bg-primary rounded-full z-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-center text-muted-foreground max-w-xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Transform your ideas into stunning AI-generated images. Upload your photos, craft your custom prompt, and
            watch your vision come to life!
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button size="lg" className="bg-black text-white hover:bg-black/90">
              Try Custom Prompts Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { ArrowRight, CheckCircle, Clock, Camera, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Caveat } from "next/font/google"
import { cn } from "@/lib/utils"

// Configure the Caveat font
const caveat = Caveat({
  subsets: ["latin"],
  weight: "500",
})

// Feature data
const features = [
 
  {
    id: "prompt-control",
    title: "Full Prompt Control",
    icon: <Wand2 className="h-5 w-5" />,
    description:
      "Take full control of your photos. Describe the outfits, background, lighting, and every detail you want—Unrealshot AI brings your vision to life with precision.",
    benefit: "Complete creative freedom & customization",
    color: "from-fuchsia-500 to-purple-600",
    lightColor: "from-fuchsia-100 to-purple-100",
    darkColor: "from-fuchsia-900/40 to-purple-900/40",
    image: "/content/prompt-control.jpg",
    noteText: "You control every detail!",
    noteColor: "bg-fuchsia-400",
    highlightText: "Unlimited variations",
    badge: "Creative freedom",
    extraContent: [
      "Specify exact outfits, backgrounds, and styles",
      "Perfect for solo professional photos",
      "No random AI filters—your vision, your rules",
    ],
  },
  {
    id: "no-scams",
    title: "No AI Scams, Just Realism",
    icon: <Camera className="h-5 w-5" />,
    description:
      "Our AI creates photos that look genuinely human with natural details, lifelike textures, and authentic expressions. No weird artifacts or plastic skin, just real-looking results.",
    benefit: "Professional quality that passes the human test",
    color: "from-indigo-500 to-blue-600",
    lightColor: "from-indigo-100 to-blue-100",
    darkColor: "from-indigo-900/40 to-blue-900/40",
    image: "/content/no-scams.jpg",
    noteText: "No more weird AI faces!",
    noteColor: "bg-blue-400",
    highlightText: "Human-verified quality",
    badge: "Human-verified quality",
    extraContent: [
      "No distorted faces or fake-looking results",
      "AI that actually understands your features",
      "Designed for real, usable photos—not just AI gimmicks",
    ],
  },
]

export default function FeatureSection() {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 })
  }, [controls])

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold md:text-5xl text-gray-900">
            What Makes{" "}
            <span className="relative inline-block text-indigo-800">
              Unrealshot AI
              <span className="absolute bottom-2 left-0 h-3 w-full -z-10 bg-indigo-200"></span>
            </span>{" "}
            Stand Out?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Unrealshot AI creates realistic AI photos that truly match your features—no weird distortions or
            fake-looking results.{" "}
          </p>
        </motion.div>

        {/* Feature Cards - Each as a separate section */}
        <div className="space-y-24 ">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="relative"
            >
              {/* Feature note - Positioned absolutely relative to the container */}
              <div
                className={`${caveat.className} absolute ${
                  index % 2 === 0
                    ? "-right-4 md:-right-8 rotate-6" // 1st and 3rd cards: right side
                    : "-left-4 md:-left-8 -rotate-6" // 2nd and 4th cards: left side
                } -top-[30px] md:top-0 rounded-xl ${feature.noteColor} px-4 py-2 text-xl md:text-2xl text-gray-900 shadow-[0_8px_16px_rgba(0,0,0,0.1)] z-10 transform hover:scale-105 transition-transform duration-200`}
              >
                {feature.noteText}
              </div>

              {/* Main feature card */}
              <div
                className={cn(
                  "relative max-w-7xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-r p-[2px]",
                  `${feature.color}`,
                )}
              >
                {/* Background gradient accent */}
                <div
                  className={cn(
                    "absolute -right-20 -top-20 h-64 w-64 z-10 rounded-full opacity-20 blur-3xl",
                    `bg-gradient-to-r ${feature.color}`,
                  )}
                ></div>
                <div
                  className={cn(
                    "absolute -bottom-20 -left-20 h-64 w-64 z-10 rounded-full opacity-20 blur-3xl",
                    `bg-gradient-to-r ${feature.color}`,
                  )}
                ></div>
                <div className="relative rounded-[calc(2rem-2px)] h-full bg-gray-800 bg-white">
                  <div className="grid grid-cols-1 lg:grid-cols-2 pb-6 gap-8 p-4 md:p-8">
                    {["no-scams"].includes(feature.id) ? (
                      <>
                        {/* Right content (moved to left) - Visual demo */}
                        <div className="relative flex justify-center text-center rounded-2xl p-2 md:py-8 overflow-hidden bg-blue-50">

                          {feature.id === "no-scams" && (
                            <div className="w-full max-w-[320px] md:max-w-md">
                              <div className="relative rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 p-1 shadow-xl">
                                <div className="rounded-lg p-3 md:p-6 bg-white">
                                  <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <Camera className="h-4 w-4" />
                                      </div>
                                      <h4 className="font-semibold text-gray-900">No AI Scams</h4>
                                    </div>
                                    <div className="hidden sm:block rounded-full px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700">
                                      Human-verified quality
                                    </div>
                                  </div>

                                  <div className="mb-6 grid grid-cols-2 gap-4">
                                    <motion.div
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.3 }}
                                      className="space-y-2"
                                    >
                                      <div className="relative overflow-hidden rounded-lg">
                                        <Image
                                          src="/content/typical-headshot.webp"
                                          alt="Typical AI Photo"
                                          width={150}
                                          height={200}
                                          className="aspect-[3/4] w-full object-cover rounded-md"
                                        />
                                      </div>
                                      <div className="text-center text-sm font-medium text-red-500">
                                        Typical AI Photo
                                      </div>
                                      <div className="rounded-md px-2 py-1 text-center text-xs bg-red-100 text-red-700">
                                        Plastic skin, weird artifacts
                                      </div>
                                    </motion.div>

                                    <motion.div
                                      initial={{ opacity: 0, x: 10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.4 }}
                                      className="space-y-2"
                                    >
                                      <div className="relative overflow-hidden rounded-lg">
                                        <Image
                                          src="/content/unrealshot-headshot.jpg"
                                          alt="Unrealshot AI Photo"
                                          width={150}
                                          height={200}
                                          className="aspect-[3/4] w-full object-cover rounded-md"
                                        />
                                      </div>
                                      <div className="text-center text-sm font-medium text-green-500">
                                        Unrealshot AI
                                      </div>
                                      <div className="rounded-md px-2 py-1 text-center text-xs bg-green-100 text-green-700">
                                        Natural & Realistic Look
                                      </div>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Left content (moved to right) */}
                        <div className="flex flex-col p-2 space-y-8">
                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r",
                                  `${feature.color}`,
                                )}
                              >
                                {feature.icon}
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-700">
                                  {feature.badge}
                                </div>
                              </div>
                            </div>

                            <p className="text-lg text-gray-600">{feature.description}</p>

                            <div className="space-y-4">
                              {feature.extraContent.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div
                                    className={cn(
                                      "mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r text-white shadow-sm",
                                      feature.color,
                                    )}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </div>
                                  <p className="text-base text-gray-700">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Link href="/professional-headshot-ai" className="block">
                            <Button
                              className={cn(
                                "group w-full sm:w-auto relative overflow-hidden",
                                "bg-gradient-to-r text-white transition-all duration-300",
                                feature.color,
                                "hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:-translate-y-0.5",
                              )}
                            >
                              Try this feature
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Left content (unchanged) */}
                        <div className="flex flex-col p-2 space-y-8">
                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r",
                                  `${feature.color}`,
                                )}
                              >
                                {feature.icon}
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-700">
                                  {feature.badge}
                                </div>
                              </div>
                            </div>

                            <p className="text-lg text-gray-600">{feature.description}</p>

                            <div className="space-y-4">
                              {feature.extraContent.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div
                                    className={cn(
                                      "mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r text-white shadow-sm",
                                      feature.color,
                                    )}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </div>
                                  <p className="text-base text-gray-700">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Link
                            href={
                              feature.id === "prompt-control"
                                ? "/professional-headshot-ai"
                                : "/"
                            }
                            className="block"
                          >
                            <Button
                              className={cn(
                                "group w-full sm:w-auto relative overflow-hidden",
                                "bg-gradient-to-r text-white transition-all duration-300",
                                feature.color,
                                "hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:-translate-y-0.5",
                              )}
                            >
                              Try this feature
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Button>
                          </Link>
                        </div>

                        {/* Right content (unchanged) - Visual demo */}
                        <div className="relative flex justify-center text-center rounded-2xl p-2 md:py-8 overflow-hidden bg-purple-50">


                          {feature.id === "prompt-control" && (
                            <div className="w-full md:max-w-md">
                              <div className="relative rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 p-1 shadow-xl">
                                <div className="rounded-lg p-6 bg-white">
                                  <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
                                        <Wand2 className="h-4 w-4" />
                                      </div>
                                      <h4 className="font-semibold text-gray-900">Full Prompt Control</h4>
                                    </div>
                                    <div className="hidden sm:block rounded-full px-2 py-1 text-xs font-medium bg-fuchsia-100 text-fuchsia-700">
                                      Creative freedom
                                    </div>
                                  </div>

                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    <div className="mb-2 rounded-lg p-3 bg-gray-100">
                                      <div className="mb-1 text-xs font-medium text-gray-500">Your prompt:</div>
                                      <div className="text-sm text-gray-800">
                                        "Me in a professional business suit, standing in front of a modern office,
                                        natural lighting, professional headshot style"
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-center">
                                      <motion.div
                                        animate={{
                                          y: [0, -5, 0],
                                        }}
                                        transition={{
                                          duration: 1.5,
                                          repeat: Number.POSITIVE_INFINITY,
                                          repeatType: "loop",
                                        }}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600"
                                      >
                                        <ArrowRight className="h-4 w-4 rotate-90" />
                                      </motion.div>
                                    </div>
                                  </motion.div>

                                  {/* Updated to use two different images */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.6 }}
                                      className="space-y-1"
                                    >
                                      <div className="rounded-md overflow-hidden">
                                        <Image
                                          src={`/content/image9.webp`}
                                          alt="AI generated business portrait 1"
                                          width={150}
                                          height={200}
                                          className="w-full h-full object-cover bg-purple-100"
                                        />
                                      </div>
                                    </motion.div>

                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.7 }}
                                      className="space-y-1"
                                    >
                                      <div className="rounded-md overflow-hidden">
                                        <Image
                                          src={`/content/image2.webp`}
                                          alt="AI generated business portrait 2"
                                          width={150}
                                          height={200}
                                          className="w-full h-full object-cover bg-purple-100"
                                        />
                                      </div>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Feature highlight text - Positioned below the card */}
              <div
                className={cn(
                  "absolute bottom-0 right-8 transform translate-y-1/2",
                  "rounded-full px-6 py-2 text-sm font-medium",
                  "bg-gradient-to-r shadow-lg",
                  feature.color,
                  "text-white",
                )}
              >
                {feature.highlightText}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


"use client"

import type React from "react"
import { cn } from "@/lib/utils"
// We will select new, more appropriate icons for your features
import { Zap, Palette, Shield, Sparkles, SlidersHorizontal, FileText } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      title: "Hyper-Realistic Authenticity",
      description: "Our AI is trained to preserve your unique features, not replace them. The result is a stunningly realistic photo that actually looks like you.",
      icon: <Shield className="h-6 w-6" />,
      tags: ["Authentic", "Realistic Results"]
    },
    {
      title: "A Style for Every Profile",
      description: "Go beyond a single headshot. Get a diverse portfolio with styles for every platform, from corporate to creative, and everything in between.",
      icon: <Palette className="h-6 w-6" />,
      tags: ["Versatile", "Portfolio"]
    },
    {
      title: "Ready in Minutes, Not Weeks",
      description: "Skip the scheduling, travel, and awkward poses. Your entire professional photoshoot is generated and delivered in less time than a coffee break.",
      icon: <Zap className="h-6 w-6" />,
      tags: ["Instant", "On-Demand"]
    },
    {
      title: "Perfect Studio Quality",
      description: "Every image is generated with perfect lighting, composition, and detail, giving you the quality of a professional studio shoot without the hassle.",
      icon: <Sparkles className="h-6 w-6" />,
      tags: ["High-Resolution", "Pro-Grade"]
    },
    {
      title: "You Are The Art Director",
      description: "Take full control of your look. Generate countless options with different outfits, backgrounds, and styles until you find the perfect shots.",
      icon: <SlidersHorizontal className="h-6 w-6" />,
      tags: ["Creative Control", "Limitless Options"]
    },
    {
      title: "Full Commercial License",
      description: "Your photos are yours. Every image comes with a full commercial license for your business, your brand, or any project with complete peace of mind.",
      icon: <FileText className="h-6 w-6" />,
      tags: ["Ownership", "Royalty-Free"]
    },
  ]

  return (
    // --- AESTHETIC CHANGE: DARK MODE BACKGROUND ---
    <section id="features" className="px-4 py-20 bg-[#111111]">
      <div className="max-w-6xl mx-auto">
        {/* Header - Re-written for Unrealshot */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          
          <h2 className="text-white text-4xl sm:text-6xl max-w-4xl mx-auto font-bold leading-[1.1] mb-4 font-[var(--font-inter-tight)]">
            More Than a Headshot. <br />
            <span className="text-[#ff6f00]">An Entire Photoshoot.</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-tight mb-4 ">
            Unrealshot is a suite of powerful tools designed to give you complete creative control and stunning, authentic results.
          </p>
        </div>

        {/* Features Grid - The structure is the same, but the styles and content are new */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>

   
      </div>
    </section>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
  tags,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
  tags?: string[]
}) => {
  return (
    // --- AESTHETIC CHANGE: DARK MODE BORDERS AND COLORS ---
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-[rgba(255,255,255,0.1)]",
        (index === 0 || index === 3) && "lg:border-l",
        index < 3 && "lg:border-b",
      )}
    >
      {/* --- AESTHETIC CHANGE: DARK MODE GRADIENT --- */}
      {index < 3 && ( <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none" /> )}
      {index >= 3 && ( <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none" /> )}
      
      <div className="mb-4 relative z-10 px-10 text-gray-400">{icon}</div>
      <div className="text-xl font-bold mb-2 relative z-10 px-10">
        {/* --- AESTHETIC CHANGE: ORANGE ACCENT ON HOVER --- */}
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-600 group-hover/feature:bg-[#ff6f00] transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-md text-gray-300 max-w-xs relative z-10 px-10 mb-3">{description}</p>
      {tags && (
        <div className="flex flex-wrap gap-2 relative z-10 px-10">
           {/* --- AESTHETIC CHANGE: DARK MODE TAGS --- */}
          {tags.map((tag, tagIndex) => (
            <span key={tagIndex} className="px-2 py-1 text-xs rounded bg-black/30 text-gray-300 border border-[rgba(255,255,255,0.1)]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Camera, Linkedin, Instagram, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"


export default function HeadshotPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const features = [
    "Professional quality in minutes",
    "Multiple styles and backgrounds",
    "Perfect for LinkedIn & social media",
    "No professional camera needed",
  ]

  return (
<div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden isolate">
        {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>

      {/* Glow effects - more subtle and positioned strategically */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]"></div>

      {/* Hero Section */}
      <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 text-sm mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
            <span>AI-Powered Headshot Technology</span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-teal-200 leading-tight"
          >
            Professional AI Headshots in Minutes
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your photos into stunning professional headshots with our AI technology. Perfect for corporate,
            realtor, or actor portfolios.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 text-base font-medium text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-800/30 transition-all duration-300">
                <span className="flex items-center">
                  Create Your Headshots Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
       
          </motion.div>

          {/* Feature list */}
          <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-300 bg-slate-800/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/50"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero image showcase */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeIn}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-violet-600/20 rounded-2xl blur-xl opacity-70 transform -rotate-1"></div>
          <div className="relative p-1 rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-violet-600/30 shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-50"></div>
            <div className="bg-slate-900/90 rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Before/After comparison */}
              <div className="relative col-span-1 aspect-[3/4] rounded-lg overflow-hidden border border-slate-700/50 shadow-lg">
                <div className="absolute top-2 left-2 bg-slate-800/90 px-2 py-1 rounded-md text-xs font-medium text-slate-300 z-10">
                  Before
                </div>
                <Image
                  src="/content/vishnu.webp"
                  alt="Original photo before AI enhancement"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-700/50 shadow-lg group">
                  <div className="absolute top-2 left-2 bg-emerald-800/90 px-2 py-1 rounded-md text-xs font-medium text-emerald-100 z-10">
                    Professional
                  </div>
                  <Image
                    src="/content/headshot01.webp"
                    alt="AI Generated Professional Headshot"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-sm text-white font-medium">Corporate Style</span>
                  </div>
                </div>

                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-700/50 shadow-lg group">
                  <div className="absolute top-2 left-2 bg-violet-800/90 px-2 py-1 rounded-md text-xs font-medium text-violet-100 z-10">
                    Creative
                  </div>
                  <Image
                    src="/content/ai-christmas-photo11.jpg"
                    alt="AI Generated Creative Headshot"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-sm text-white font-medium">Modern Style</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-6 right-8 bg-slate-800/90 px-4 py-2 rounded-full shadow-lg border border-emerald-500/30 backdrop-blur-sm">
            <span className="text-sm font-medium text-white flex items-center">
              <Camera className="w-4 h-4 mr-2 text-emerald-400" />
              AI Generated Results
            </span>
          </div>
        </motion.div>
      </header>

      {/* LinkedIn Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div variants={staggerContainer}>
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-300 text-sm mb-6"
            >
              <Linkedin className="w-4 h-4 mr-2 text-blue-400" />
              <span>LinkedIn Optimization</span>
            </motion.div>

            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-sky-300 leading-tight"
            >
              Stand Out on LinkedIn with Professional AI Headshots
            </motion.h2>

            <motion.p variants={fadeIn} className="text-slate-300 mb-6 text-lg leading-relaxed">
              Make a powerful first impression with a professional LinkedIn headshot. Our AI technology creates
              polished, natural-looking portraits that help you appear confident and approachable to recruiters and
              connections.
            </motion.p>

            <motion.ul variants={fadeIn} className="space-y-3 mb-8">
              {[
                "7x more profile views",
                "40% higher response rate",
                "Perfect for job seekers",
                "Ideal for professionals",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeIn}>
              <Link href="/dashboard">
                <Button className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-6 text-base font-medium text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-800/30 transition-all duration-300">
                  <span className="flex items-center">
                    Generate LinkedIn Headshot
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-sky-600/20 rounded-2xl blur-xl opacity-70 transform rotate-2"></div>
            <div className="relative rounded-2xl bg-gradient-to-r from-blue-600/30 to-sky-600/30 p-1 shadow-2xl shadow-blue-900/20">
              <div className="bg-slate-900/90 rounded-xl p-6 overflow-hidden">
                {/* LinkedIn mockup */}
                <div className="rounded-lg border border-slate-700 overflow-hidden shadow-lg">
                  <div className="bg-slate-800 p-3 flex items-center gap-3 border-b border-slate-700">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">LinkedIn</span>
                  </div>
                  <div className="bg-slate-900">
                    {/* Profile header */}
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-sky-600"></div>
                    <div className="px-4 pb-4 relative">
                      <div className="absolute -top-12 left-4 w-24 h-24 rounded-full border-4 border-slate-900 overflow-hidden shadow-lg">
                        <Image
                          src="/content/linkedin.jpg"
                          alt="LinkedIn Profile Example"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="pt-14 pb-2">
                        <h3 className="text-lg font-bold text-white">Alex Morgan</h3>
                        <p className="text-sm text-slate-400">Marketing Director | Brand Strategist | Speaker</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">Connect</div>
                        <div className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full">
                          Message
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-300">JD</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-slate-300">Jane Doe</span>
                        <span className="text-slate-500"> liked your profile</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-300">TS</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-slate-300">Tech Solutions</span>
                        <span className="text-slate-500"> viewed your profile</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats overlay */}
            <div className="absolute -bottom-6 -right-6 bg-slate-800/90 px-4 py-2 rounded-lg shadow-lg border border-blue-500/30 backdrop-blur-sm">
              <span className="text-sm font-medium text-blue-300">300% more profile views</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Media Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
        <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-700/50 to-transparent"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div variants={fadeIn} className="relative order-2 md:order-1">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-xl opacity-70 transform -rotate-2"></div>
            <div className="relative rounded-2xl bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 p-1 shadow-2xl shadow-violet-900/20">
              <div className="bg-slate-900/90 rounded-xl p-6 grid grid-cols-2 gap-4">
                {/* Social media mockups */}
                <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 shadow-lg group">
                  <Image
                    src="/content/influencer4.webp"
                    alt="Instagram Profile"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Instagram className="w-4 h-4 text-pink-400" />
                      <span className="text-xs font-medium text-white">@britney.jane</span>
                    </div>
                    <div className="text-xs text-slate-300">22.2k likes • 420 comments</div>
                  </div>
                </div>

                <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 shadow-lg group">
                  <Image
                    src="/content/headshot01.webp"
                    alt="Twitter Profile"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-xs font-medium text-white">@alex_morgan</span>
                    </div>
                    <div className="text-xs text-slate-300">3.4k likes • 128 replies</div>
                  </div>
                </div>

                <div className="col-span-2 relative aspect-[2/1] rounded-lg overflow-hidden border border-slate-700 shadow-lg group">
                  <Image
                    src="/content/together1.jpg"
                    alt="Social Media Banner"
                    width={600}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex flex-col justify-end p-3">
                  <div className="text-sm font-medium text-white">AI-Crafted Couple Portraits</div>
                  <div className="text-xs text-slate-300">Unified style for timeless memories</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-6 left-6 bg-slate-800/90 px-4 py-2 rounded-full shadow-lg border border-violet-500/30 backdrop-blur-sm">
              <span className="text-sm font-medium text-violet-300 flex items-center">
                <Instagram className="w-4 h-4 mr-2" />
                Social Media Ready
              </span>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} className="order-1 md:order-2">
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-violet-950/50 border border-violet-800/50 text-violet-300 text-sm mb-6"
            >
              <Instagram className="w-4 h-4 mr-2 text-violet-400" />
              <span>Social Media Enhancement</span>
            </motion.div>

            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 leading-tight"
            >
              Elevate Your Social Media Presence
            </motion.h2>

            <motion.p variants={fadeIn} className="text-slate-300 mb-6 text-lg leading-relaxed">
              Create a consistent, professional image across all your social platforms. Our AI generates high-quality
              headshots that help you build a cohesive personal brand and increase engagement with your audience.
            </motion.p>

            <motion.ul variants={fadeIn} className="space-y-3 mb-8">
              {[
                "Instagram-optimized portraits",
                "Twitter/X profile pictures",
                "YouTube thumbnails",
                "Consistent cross-platform branding",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeIn}>
              <Link href="/">
                <Button className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 text-base font-medium text-white shadow-lg shadow-violet-900/20 hover:shadow-violet-800/30 transition-all duration-300">
                  <span className="flex items-center">
                    Create Social Media Kit
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>



      {/* Subtle floating particles - more refined */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animation: `floatParticle${i} ${Math.random() * 15 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>     
    </div>
    
  )
  
}



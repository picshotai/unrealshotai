"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import DocumentationSection from "@/components/demo-landing/documentation-section"
import TestimonialsSection from "@/components/demo-landing/testimonials-section"
import FAQSection from "@/components/demo-landing/faq-section"
import PricingSection from "@/components/demo-landing/pricing-section"
import CTASection from "@/components/demo-landing/cta-section"
import FooterSection from "@/components/demo-landing/footer-section"
import PhotoTransformationDemo from "@/components/demo-landing/photo-transformation-demo"

// Reusable Badge Component
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3)
          }
          return 0
        }
        return prev + 2 // 2% every 100ms = 5 seconds total
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return
    setActiveCard(index)
    setProgress(0)
  }

  const getDashboardContent = () => {
    switch (activeCard) {
      case 0:
        return <div className="text-[#828387] text-sm">Customer Subscription Status and Details</div>
      case 1:
        return <div className="text-[#828387] text-sm">Analytics Dashboard - Real-time Insights</div>
      case 2:
        return <div className="text-[#828387] text-sm">Data Visualization - Charts and Metrics</div>
      default:
        return <div className="text-[#828387] text-sm">Customer Subscription Status and Details</div>
    }
  }

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Navigation */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <div className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      Brillance
                    </div>
                  </div>
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 flex justify-start items-start hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        Products
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        Pricing
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans">
                        Docs
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
                  <div className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center">
                    <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
                      Log in
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] pb-12 sm:pb-16 md:pb-20 lg:pb-24 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              {/* Hero Content Container */}
              <div className="w-full max-w-[1000px] flex flex-col justify-center items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16">
                {/* Badge */}
                <div className="flex justify-center">
                  <div className="px-2 py-1 bg-white/80 backdrop-blur-sm border border-[rgba(55,50,47,0.12)] rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[#37322F] text-xs font-medium">AI-Powered Photo Generation</span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="text-center space-y-4 sm:space-y-6">
                  <h1 className="text-[#1a1a1a] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] sm:leading-[0.95] font-serif">
                    AI Photoshoots
                    <br />
                    <span className="text-[#37322F]/70">That Look Like Real You</span>
                  </h1>
                  <p className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                    Transform your selfies into studio-quality headshots with AI precision.
                    <span className="block">Perfect for LinkedIn, resumes, and professional profiles.</span>
                  </p>
                </div>

                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <button className="group relative px-8 py-4 bg-[#1a1a1a] text-white rounded-full font-semibold text-lg hover:bg-[#2a2a2a] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <span className="relative z-10">Start Your Photoshoot</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-4 text-[#37322F] font-semibold text-lg hover:text-[#1a1a1a] transition-colors duration-200">
                    <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                        <path
                          d="M1 1.5L11 7L1 12.5V1.5Z"
                          fill="#37322F"
                          stroke="#37322F"
                          strokeWidth="1"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    Watch Demo
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex flex-col items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full border-2 border-white shadow-sm"
                        ></div>
                      ))}
                    </div>
                    <div className="text-[#37322F]/80 text-sm font-medium ml-2">
                      <span className="font-bold text-[#1a1a1a]">50,000+</span> professionals transformed
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center gap-8 sm:gap-12 opacity-60">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1a1a1a]">4.9★</div>
                      <div className="text-xs text-[#37322F]/60">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1a1a1a]">2M+</div>
                      <div className="text-xs text-[#37322F]/60">Photos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1a1a1a]">30s</div>
                      <div className="text-xs text-[#37322F]/60">Average</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Transformation Demo - Moved closer */}
              <div className="w-full max-w-[960px] mt-16 sm:mt-20 md:mt-24 lg:mt-28 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center relative z-5">
                <PhotoTransformationDemo />
              </div>

              {/* Background Pattern - Adjusted positioning */}
              <div className="absolute top-[180px] sm:top-[200px] md:top-[220px] lg:top-[240px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
                <img
                  src="/mask-group-pattern.svg"
                  alt=""
                  className="w-[800px] sm:w-[1200px] md:w-[1600px] lg:w-[2000px] h-auto opacity-20 sm:opacity-25 md:opacity-30 mix-blend-multiply"
                  style={{
                    filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
                  }}
                />
              </div>
            </div>

            <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start">
              <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                {/* Left decorative pattern */}
                <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
                <FeatureCard
                  title="Corporate Headshots"
                  description="Professional business portraits perfect for LinkedIn, company websites, and corporate materials."
                  isActive={activeCard === 0}
                  progress={activeCard === 0 ? progress : 0}
                  onClick={() => handleCardClick(0)}
                />
                <FeatureCard
                  title="Creative Styles"
                  description="Artistic and unique photo styles including vintage, cyberpunk, and fantasy themes."
                  isActive={activeCard === 1}
                  progress={activeCard === 1 ? progress : 0}
                  onClick={() => handleCardClick(1)}
                />
                <FeatureCard
                  title="Social Media Ready"
                  description="Optimized photos for all your social platforms with perfect sizing and quality."
                  isActive={activeCard === 2}
                  progress={activeCard === 2 ? progress : 0}
                  onClick={() => handleCardClick(2)}
                />
              </div>

              <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                {/* Right decorative pattern */}
                <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Results Showcase - Matching Site Design */}
            <div className="w-full flex flex-col justify-center items-center gap-2">
              {/* Header Section */}
              <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                <div className="w-full max-w-[586px] px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
                  {/* AI Results Badge */}
                  <Badge
                    icon={
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6 1L7.5 4.5L11 4.5L8.25 6.75L9.5 10.5L6 8L2.5 10.5L3.75 6.75L1 4.5L4.5 4.5L6 1Z"
                          stroke="#37322F"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    text="AI Results"
                  />

                  {/* Title */}
                  <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                    See the transformation quality
                  </div>

                  {/* Description */}
                  <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
                    Real AI-generated results from actual user photos.
                    <br />
                    Professional quality without the studio cost.
                  </div>
                </div>
              </div>

              {/* Results Showcase */}
              <div className="self-stretch border-b border-t border-[rgba(55,50,47,0.12)] flex justify-center items-center">
                <div className="flex justify-center items-start w-full">
                  {/* Left Decorative Pattern */}
                  <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
                    <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Main Results Container */}
                  <div className="flex-1 py-16 md:py-20 px-6 md:px-12 flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-16">
                    {/* Original Photos - Small Grid */}
                    <div className="flex flex-col items-center gap-6">
                      <div className="text-[#605A57] text-sm font-medium font-sans text-center">
                        Your casual selfies
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-[rgba(55,50,47,0.12)]">
                          <img
                            src="/casual-selfie-photo.jpg"
                            alt="Original casual selfie"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-[rgba(55,50,47,0.12)]">
                          <img
                            src="/casual-portrait-photo.jpg"
                            alt="Original casual portrait"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-[rgba(55,50,47,0.12)]">
                          <img
                            src="/social-media-selfie.jpg"
                            alt="Original social media selfie"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-[rgba(55,50,47,0.12)]">
                          <img
                            src="/casual-selfie-photo.jpg"
                            alt="Original casual photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center text-[#605A57] rotate-90 lg:rotate-0">
                      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <path
                          d="M2 12C2 12 8 6 20 12C32 18 38 12 38 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M34 8L38 12L34 16"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* AI Generated Result - Large and Prominent */}
                    <div className="flex flex-col items-center gap-6">
                      <div className="text-[#605A57] text-sm font-medium font-sans text-center">
                        AI-generated professional photo
                      </div>
                      <div className="relative">
                        <div className="w-64 h-80 md:w-72 md:h-96 rounded-xl overflow-hidden border border-[rgba(55,50,47,0.12)] shadow-[0px_4px_12px_rgba(55,50,47,0.08)]">
                          <img
                            src="/professional-corporate-headshot-business-suit.jpg"
                            alt="AI generated professional headshot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Quality Badge */}
                        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm border border-[rgba(55,50,47,0.12)] rounded-full">
                          <div className="text-[#37322F] text-xs font-medium font-sans">AI Generated</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Decorative Pattern */}
                  <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
                    <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation Section */}
            <DocumentationSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Pricing Section */}
            <PricingSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* CTA Section */}
            <CTASection />

            {/* Footer Section */}
            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}

// FeatureCard component definition inline to fix import error
function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
        isActive
          ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
          : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
          <div
            className="h-full bg-[#322D2B] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Caveat } from 'next/font/google';
import VideoModal from "@/components/VideoModal";

// Configure the Caveat font
const caveat = Caveat({
  subsets: ['latin'],
  weight: '500',
});

// Using your actual image paths from the original component
const images = [
  { src: "/landing/glamour/1.jpg", alt: "AI Glamour Photoshoot: Creative portrait with styled outfit | Unrealshot AI" },
  { src: "/landing/glamour/2.jpg", alt: "AI Glamour Photoshoot: Glamour look with soft studio lighting | Unrealshot AI" },
  { src: "/landing/glamour/3.jpg", alt: "AI Glamour Photoshoot: Editorial pose with dramatic shadows | Unrealshot AI" },
  { src: "/landing/glamour/4.jpg", alt: "AI Glamour Photoshoot: Outdoor scene with natural light | Unrealshot AI" },
  { src: "/landing/glamour/5.jpg", alt: "AI Glamour Photoshoot: Fashion-inspired portrait, bold colors | Unrealshot AI" },
  { src: "/landing/glamour/6.jpg", alt: "AI Glamour Photoshoot: Classic look against textured backdrop | Unrealshot AI" },
  { src: "/landing/glamour/7.jpg", alt: "AI Glamour Photoshoot: Candid pose, lifestyle feel | Unrealshot AI" },
  { src: "/landing/glamour/8.jpg", alt: "AI Glamour Photoshoot: Minimalist studio setup, clean lines | Unrealshot AI" },
  { src: "/landing/glamour/9.jpg", alt: "AI Glamour Photoshoot: Artistic composition with unique framing | Unrealshot AI" },
  { src: "/landing/glamour/10.jpg", alt: "AI Glamour Photoshoot: Vintage-inspired portrait aesthetics | Unrealshot AI" },
  { src: "/landing/glamour/11.jpg", alt: "AI Glamour Photoshoot: Creative portrait with styled outfit | Unrealshot AI" },
  { src: "/landing/glamour/12.jpg", alt: "AI Glamour Photoshoot: Glamour look with soft studio lighting | Unrealshot AI" },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mx-auto pb-12 overflow-hidden min-h-screen bg-black">
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-2 -pt-8"
        style={{
          backgroundImage: `url('/bg-pattern.svg')`,
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto'
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/bg-image.webp')`,
        }}
      />

      <div className="px-4 pt-[150px] max-w-6xl mx-auto text-center flex flex-col justify-center">
        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
             <div className="bg-white inline-block p-[2px] rounded">
              <div className="flex items-center">
                <div className="bg-black text-white text-xs px-2 py-1 rounded leading-[1.2]">
                  +70 Shoots This Week
                </div>
                <span className="text-black text-sm px-1 mx-1">
                  Join Them
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl max-w-4xl mx-auto font-bold leading-[1.1] mb-4 font-[var(--font-inter-tight)]">
              <span className="text-white">
                AI Glamour Photoshoot Generator
              </span>
              <span className="text-[#ff6f00] ml-2">
                – Selfies to Model-Quality Portraits
              </span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
Unleash your inner celebrity. Get stunning, high-fashion glamour shots without a team of stylists. Perfect for when you need to look and feel absolutely incredible.            </p>
          </div>
          <div className="flex  sm:flex-row gap-2 justify-center items-center w-full relative">
            
            <Link href="/dashboard">
              <Button
                className="text-sm sm:text-md py-5 sm:py-6 group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer pr-12"
              >
                Create Your Glamour Shoot
                <div className="bg-white rounded-sm p-2 sm:p-3 absolute right-1 top-1/2 -translate-y-1/2">
                  <img
                    src="/arrow.svg"
                    alt="arrow-right"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Button>
            </Link>
            <Link href="#">
              <Button
                className="text-sm sm:text-md py-5 sm:py-6 group relative bg-white hover:bg-white/90 text-black rounded-md overflow-hidden cursor-pointer pr-12"
                onClick={(e) => {
                  e.preventDefault();
                  setIsVideoModalOpen(true);
                }}
              >
                Watch Demo
                <div className="bg-[#ff6f00] text-white rounded-sm p-2 sm:p-3 absolute right-1 top-1/2 -translate-y-1/2">
                  <Play className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img
                  src="/content/sachin.webp"
                  alt="User profile photo"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/content/sumesh.webp"
                  alt="User profile photo"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/content/manoj.jpg"
                  alt="User profile photo"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/content/emma-thopmson.jpg"
                  alt="User profile photo"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1.2k</span>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-md">Trusted by 1200+ Worldwide</p>
          </div>
        </div>
      </div>

      {/* Slider Section with Right-to-Left Animation */}
      <div className="w-full pt-4 sm:pt-12 overflow-hidden">
        <div className="hidden md:flex w-full">
          <div className="flex animate-slide-rtl">
            {/* Duplicate images for seamless loop */}
            {[...images, ...images].map((image, index) => (
                 <div
                   key={index}
                   className="min-w-[200px] p-2 relative flex-shrink-0"
                   style={{ padding: "0 10px" }}
                 >
                   <div className="relative w-[200px] h-[280px]">
                     <Image
                       src={image.src}
                       alt={image.alt}
                       fill
                       className="rounded-lg object-cover"
                       style={{ objectPosition: 'center' }}
                     />
 <div className="absolute bottom-2 left-2 flex items-center gap-[1.5px]">
      <Image
        src="/site-logo.png"
        alt="Unrealshot AI Logo"
        width={24}
        height={24}
        className="w-6 h-6 rounded"
      />
    </div>
                   </div>
                 </div>
               ))}
          </div>
        </div>

        {/* Mobile Image Slider - Infinite loop with no gaps */}
        <div className="block md:hidden w-full overflow-hidden">
          <div 
            className="flex animate-slide-rtl-mobile"
            style={{
              width: `${images.length * 2 * 220}px` // Double width for seamless loop
            }}
          >
            {/* First set of images */}
            {images.map((image, index) => (
              <div
                key={`first-${index}`}
                className="w-[200px] p-2 relative flex-shrink-0"
              >
                <div className="relative w-full h-full max-w-[200px] mx-auto aspect-[3/4]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="rounded-lg object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                   <div className="absolute bottom-2 right-2 flex items-center gap-[1px] bg-white/80 rounded text-[10px]">
      <Image
        src="/site-logo.png"
        alt="Unrealshot AI Logo"
        width={16}
        height={16}
        className="w-4 h-4 rounded"
      /><span className="px-1 py-0.5">
                    AI
                  </span>
    </div>
                </div>
              </div>
            ))}
            {/* Second set of images for seamless loop */}
            {images.map((image, index) => (
              <div
                key={`second-${index}`}
                className="w-[200px] p-2 relative flex-shrink-0"
              >
                <div className="relative w-full h-full max-w-[200px] mx-auto aspect-[3/4]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="rounded-lg object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                   <div className="absolute bottom-2 right-2 flex items-center gap-[1px] bg-white/80 rounded text-[10px]">
      <Image
        src="/site-logo.png"
        alt="Unrealshot AI Logo"
        width={16}
        height={16}
        className="w-4 h-4 rounded"
      /><span className="px-1 py-0.5">
                    AI
                  </span>
    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-slide-rtl {
          animation: slide-rtl 60s linear infinite;
        }
        
        .animate-slide-rtl-mobile {
          animation: slide-rtl-mobile 38s linear infinite;
        }
        
        @keyframes slide-rtl-mobile {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      
      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://k3gonexouqnxegps.public.blob.vercel-storage.com/howtovideo.mp4"
        title="How It Works - AI Photo Generation Demo"
      />
    </section>
  )
}
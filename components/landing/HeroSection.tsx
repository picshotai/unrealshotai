"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

// Using your actual image paths from the original component
const images = [
  { src: "/landing/landingphoto1.jpg", alt: "AI-generated Photoshoot - Unrealshot AI" },
  { src: "/landing/landingphoto2.jpg", alt: "AI-generated headshot 2 - Unrealshot AI" },
  { src: "/landing/landingphoto3.jpg", alt: "AI glamour photoshoot of beautiful lady Maria - Unrealshot AI" },
  { src: "/landing/landingphoto4.jpg", alt: "AI-generated headshot 4 - Unrealshot AI" },
  { src: "/landing/landingphoto5.jpg", alt: "AI-generated headshot 5 - Unrealshot AI" },
  { src: "/landing/landingphoto6.jpg", alt: "AI-generated headshot 6 - Unrealshot AI" },
  { src: "/landing/landingphoto7.jpg", alt: "AI-generated headshot 7 - Unrealshot AI" },
  { src: "/landing/landingphoto9.jpg", alt: "AI-generated headshot 9 - Unrealshot AI" },
  { src: "/landing/landingphoto10.jpg", alt: "AI-generated headshot 10 - Unrealshot AI" },
  { src: "/landing/landingphoto11.jpg", alt: "AI-generated headshot 11 - Unrealshot AI" },
  { src: "/landing/landingphoto12.jpg", alt: "AI Social Media profile picture of a man - Unrealshot AI" },
  { src: "/landing/landingphoto13.jpg", alt: "AI-generated headshot 12 - Unrealshot AI" },
  { src: "/landing/landingphoto14.jpg", alt: "AI-generated stylish photoshoot of a man - Unrealshot AI" },
  { src: "/landing/landingphoto15.jpg", alt: "AI realtor headshot of Mr. adward from california - Unrealshot AI" },
  { src: "/landing/landingphoto16.jpg", alt: "AI MD Doctor Headshot of Dr. James H. - Unrealshot AI" },
   { src: "/landing/landingphoto8.jpg", alt: "AI-generated headshot 8 - Unrealshot AI" },
 { src: "/landing/landingphoto17.jpg", alt: "AI-generated headshot 17 - Unrealshot AI" },
  { src: "/landing/landingphoto18.jpg", alt: "AI-generated headshot 18 - Unrealshot AI" },
  { src: "/landing/landingphoto19.jpg", alt: "AI-generated headshot 19 - Unrealshot AI" },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mx-auto pb-12 overflow-hidden min-h-screen">
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

      <div className="px-4 pt-[150px] pb-12 max-w-6xl mx-auto text-center flex flex-col justify-center">
        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
            <div className="bg-white inline-block p-[2px] rounded">
              <div className="flex items-center">
                <div className="bg-black text-white text-xs px-2 py-1 rounded leading-[1.2]">
                  Limited time offer ends in
                </div>
                <span className="text-black text-sm px-1 mx-1">
                  Time's up
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl max-w-4xl mx-auto font-bold leading-[1.1] mb-4 font-[var(--font-inter-tight)]">
              <span className="text-white">
                AI Photoshoots That Actually
              </span>
              <span className="text-[#ff6f00] ml-2">
                Look Like You
              </span>
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
Transform your casual photos into a professional-grade photoshoot that captures you at your absolute best. Get an entire portfolio of authentic, flattering images for every profile, from the boardroom to the bar.            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full relative">
            
            <Link href="/dashboard">
              <Button
                className="text-md py-6 group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer pr-12"
              >
                Start Your Photoshoot
                <div className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2">
                  <img
                    src="/arrow.svg"
                    alt="arrow-right"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Button>
            </Link>
            <Link href="https://github.com/AINotSoSmart/dodostarter">
              <Button
                className="text-md py-6 group relative bg-white hover:bg-white/90 text-black rounded-md overflow-hidden cursor-pointer pr-12"
              >
                Watch Demo
                <div className="bg-[#ff6f00] text-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2">
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
            <p className="text-gray-400 font-medium">Trusted by 1200+ Worldwide</p>
          </div>
        </div>
      </div>

      {/* Slider Section with Right-to-Left Animation */}
      <div className="w-full overflow-hidden">
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

        <div className="block md:hidden relative w-full h-[28rem] p-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full p-4 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="rounded-lg object-cover"
                  style={{ objectPosition: 'center' }}
                />
                <span className="absolute bottom-6 right-6 bg-white/80 px-2 py-1 text-xs rounded-full">
                  AI GENERATED
                </span>
              </div>
            </div>
          ))}
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
      `}</style>
    </section>
  )
}

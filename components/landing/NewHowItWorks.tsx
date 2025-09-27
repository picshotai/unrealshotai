"use client"

import Image from "next/image"
import { UploadCloud, Cpu, Sparkles } from "lucide-react"

// Using your specific image requests
const womanInputImages = ["/images/demo1.jpg", "/images/demo2.jpg", "/images/demo3.jpg", "/images/demo4.jpg"];
const manInputImages = ["/images/demo5.jpg", "/images/demo6.jpg", "/images/demo7.jpg", "/images/demo8.jpg"];

// Create array of all 16 unique output images
const allOutputImages = [
  "/images/aimodel1.jpg",
  "/images/aimodel2.jpg", 
  "/images/aimodel3.jpg",
  "/images/aimodel4.jpg",
  "/images/aimodel5.jpg",
  "/images/aimodel6.jpg",
  "/images/aimodel7.jpg",
  "/images/aimodel8.jpg",
  "/images/aimodel9.jpg",
  "/images/aimodel10.jpg", 
  "/images/aimodel11.jpg",
  "/images/aimodel12.jpg",
  "/images/aimodel13.jpg",
  "/images/aimodel14.jpg",
  "/images/aimodel15.jpg",
  "/images/aimodel16.jpg",
];

// --- THE DEFINITIVE, REBUILT VISUAL FOR STEP 2 ---
const AIModelVisual_Final = () => {
    const themeVars = {
        "--aiv-line-color": "#DCD9D6",
        "--aiv-pulse-color": "#ff6f00",
        "--aiv-core-bg": "#FFFFFF",
        "--aiv-core-border": "#EAE8E6",
        "--aiv-core-icon": "#605A57",
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
            <svg width="100%" height="100%" viewBox="0 0 300 150" style={themeVars as React.CSSProperties}>
                {/* The "Fixed Gray Lines" - The static structure */}
                <path id="path1" d="M 50 75 H 130" fill="none" stroke="var(--aiv-line-color)" strokeWidth="2" />
                <path id="path2" d="M 170 75 H 250" fill="none" stroke="var(--aiv-line-color)" strokeWidth="2" />
                <path id="path3" d="M 150 55 V 20" fill="none" stroke="var(--aiv-line-color)" strokeWidth="2" />
                <path id="path4" d="M 150 95 V 130" fill="none" stroke="var(--aiv-line-color)" strokeWidth="2" />

                {/* The "Lightning" Pulses - Orange circles that move along the paths */}
                <circle r="4" fill="var(--aiv-pulse-color)">
                    <animateMotion dur="3s" begin="0s" repeatCount="indefinite" path="M 50 75 H 130" />
                </circle>
                <circle r="4" fill="var(--aiv-pulse-color)">
                    <animateMotion dur="3s" begin="0.5s" repeatCount="indefinite" path="M 170 75 H 250" />
                </circle>
                <circle r="4" fill="var(--aiv-pulse-color)">
                    <animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M 150 55 V 20" />
                </circle>
                 <circle r="4" fill="var(--aiv-pulse-color)">
                    <animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M 150 95 V 130" />
                </circle>

                {/* The Central AI Core */}
                <g>
                    <circle cx="150" cy="75" r="25" fill="var(--aiv-core-bg)" stroke="var(--aiv-core-border)" strokeWidth="2" />
                    <Cpu size={28} color="var(--aiv-core-icon)" x="136" y="61" />
                </g>

                 {/* Input/Output Nodes */}
                <circle cx="50" cy="75" r="8" fill="var(--aiv-core-bg)" stroke="var(--aiv-line-color)" strokeWidth="1" />
                <circle cx="250" cy="75" r="8" fill="var(--aiv-core-bg)" stroke="var(--aiv-line-color)" strokeWidth="1" />
                <circle cx="150" cy="20" r="8" fill="var(--aiv-core-bg)" stroke="var(--aiv-line-color)" strokeWidth="1" />
                <circle cx="150" cy="130" r="8" fill="var(--aiv-core-bg)" stroke="var(--aiv-line-color)" strokeWidth="1" />
            </svg>
        </div>
    )
}


export default function HowItWorksShowcase() {
  const styles = `
    .step-section { opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s ease-out forwards; }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
  `

  return (
    <section className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#F7F5F3]">
      <style>{styles}</style>
      <div className="px-4 max-w-4xl mx-auto">
        {/* Header (Unchanged) */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl max-w-4xl mx-auto font-bold leading-tight mb-4 font-[var(--font-inter-tight)] text-gray-900">
            Your Professional Photoshoot in <span className="text-[#ff6f00]">3 Simple Steps.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our process is designed to be effortless, transparent, and deliver stunning results every time.
          </p>
        </div>

        {/* The Linear, Step-by-Step Flow */}
        <div className="flex flex-col items-center">

          {/* --- STEP 1: UPLOAD --- (Unchanged) */}
          <div className="step-section w-full flex flex-col items-center text-center" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="bg-[#ff6f00]/10 p-2 rounded-full text-[#ff6f00]"><UploadCloud size={24} /></div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">1. Upload Your Selfies</h3>
            </div>
            <p className="mt-4 text-md text-gray-600 max-w-lg">Start by providing clear photos. Our AI learns from a diverse set of your images to ensure an authentic result.</p>
            <div className="w-full max-w-xl flex flex-col md:flex-row gap-4 mt-8">
              <div className="w-full grid grid-cols-2 gap-4">
                {womanInputImages.map((src, i) => (
                  <div key={i} className="aspect-square relative rounded-lg overflow-hidden shadow-md border border-gray-200"><Image src={src} alt={`Woman selfie ${i + 1}`} layout="fill" className="object-cover" /></div>
                ))}
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                {manInputImages.map((src, i) => (
                  <div key={i} className="aspect-square relative rounded-lg overflow-hidden shadow-md border border-gray-200"><Image src={src} alt={`Man selfie ${i + 1}`} layout="fill" className="object-cover" /></div>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow Connector (Unchanged) */}
          <div className="step-section my-12 h-24 w-px bg-gray-300" style={{ animationDelay: '0.4s' }}></div>

          {/* --- STEP 2: AI MAGIC --- (NOW WITH THE DEFINITIVE VISUAL) */}
          <div className="step-section w-full flex flex-col items-center text-center" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="bg-[#ff6f00]/10 p-2 rounded-full text-[#ff6f00]"><Cpu size={24} /></div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">2. AI Builds Your Model</h3>
            </div>
            <p className="mt-4 text-md text-gray-600 max-w-lg">This isn't a filter—it's a generative engine. Our system analyzes your features to create a hyper-realistic model trained exclusively on you.</p>
            <div className="w-full max-w-md h-48 mt-8">
              <AIModelVisual_Final />
            </div>
          </div>

          {/* Arrow Connector (Unchanged) */}
          <div className="step-section my-12 h-24 w-px bg-gray-300" style={{ animationDelay: '0.8s' }}></div>
          
          {/* --- STEP 3: GET RESULTS --- FULL WIDTH WITH GRADIENT OVERLAY */}
          <div className="step-section w-full flex flex-col items-center text-center" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="bg-[#ff6f00]/10 p-2 rounded-full text-[#ff6f00]"><Sparkles size={24} /></div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">3. Receive Your Photoshoot</h3>
            </div>
            <p className="mt-4 text-md text-gray-600 max-w-lg mb-12">Get a diverse portfolio of studio-quality images in minutes, ready for any platform, from the boardroom to the bar.</p>
          </div>

        </div>
      </div>

      {/* Full Width Image Gallery with Subtle Bottom Gradient */}
      <div className="relative w-full mt-8">
        {/* 16 Unique Images Grid - Full Width */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 sm:gap-2">
            {allOutputImages.map((src, i) => (
              <div key={i} className="aspect-[3/4] relative overflow-hidden">
                <Image 
                  src={src} 
                  alt={`AI Generated photo ${i + 1}`} 
                  layout="fill" 
                  className="object-cover" 
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-[8px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                  AI
                </div>
                {/* Individual image gradient overlay - only at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
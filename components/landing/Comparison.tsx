import React from 'react';
import { ArrowRight, Star, Camera, Sparkles, Clock } from 'lucide-react';

// Trustpilot Rating Component
const TrustpilotRating = () => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={20} fill="#00B67A" stroke="#00B67A" />
      ))}
    </div>
    <span className="ml-2 text-[#00B67A] font-bold">Trusted by Thousands</span>
  </div>
);

export default function PremiumComparison() {
  return (
    <section className="relative mx-auto py-16 sm:py-24 overflow-hidden bg-[#F7F5F3]">
      {/* Hero Section */}
      <div className="px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <TrustpilotRating />
          <h2 className="text-4xl sm:text-5xl md:text-6xl max-w-4xl mx-auto font-bold leading-tight mb-4 font-[var(--font-inter-tight)] text-gray-900">
            From Casual Selfies to <span className="text-[#ff6f00]">Professional AI Photos</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Cut Costs and Save Time with UnrealShot AI. Create Stunning AI-Generated Photos Quickly.
          </p>
        </div>
      </div>

      {/* Main Comparison Section */}
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* AI Process */}
          <div className="space-y-12">
            <div>
              <h3 className="text-xl sm:text-3xl font-bold mb-4 flex items-center gap-3" style={{ color: '#ff6f00' }}>
                <Sparkles className="text-[#ff6f00]" />
                Unrealshot AI Process
              </h3>
              <p className="text-gray-600">
                A streamlined, efficient process that delivers professional results in under an hour
              </p>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="z-0 absolute left-8 top-8 bottom-0 w-px bg-gradient-to-b from-[#ff6f00] to-transparent" />
                <div className="relative flex gap-8 group">
                  <div className="z-1 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6f00]/20 to-orange-400/20 flex items-center justify-center flex-shrink-0 border border-[#ff6f00]/20">
                    <span className="text-xl font-bold text-[#ff6f00]">01</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold mb-2">Upload Your Photos</h3>
                    <p className="text-gray-600 mb-2">2 minutes</p>
                    <p className="text-gray-500">
                      Choose from your existing photo library or snap some new selfies right away.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="z-0 absolute left-8 top-8 bottom-0 w-px bg-gradient-to-b from-[#ff6f00] to-transparent" />
                <div className="relative flex gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6f00]/20 to-orange-400/20 flex items-center justify-center flex-shrink-0 border border-[#ff6f00]/20 z-1">
                    <span className="text-xl font-bold text-[#ff6f00]">02</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                    <p className="text-gray-600 mb-2">30-60 minutes</p>
                    <p className="text-gray-500">
                      Our AI uses your photos to create professional, high-quality images with photogenic perfection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="relative flex gap-8 group">
                  <div className="z-1 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6f00]/20 to-orange-400/20 flex items-center justify-center flex-shrink-0 border border-[#ff6f00]/20">
                    <span className="text-xl font-bold text-[#ff6f00]">03</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold mb-2">Download & Shine</h3>
                    <p className="text-gray-600 mb-2">2 minutes</p>
                    <p className="text-gray-500">
                      Download your AI-generated photo and enjoy a stunning, professional-quality image.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#ff6f00]/10 to-orange-400/10 rounded-2xl p-6 border border-[#ff6f00]/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-[#ff6f00] mb-1">TOTAL TIME</h4>
                  <p className="text-2xl font-bold text-gray-900">~20 Minutes</p>
                </div>
                <ArrowRight className="text-[#ff6f00]" />
              </div>
            </div>
          </div>

          {/* Studio Process */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-bold sm:text-3xl mb-4 flex items-center gap-3" style={{ color: '#6b7280' }}>
                <Camera className="text-gray-600" />
                Traditional Studio Process
              </h2>
              <p className="text-gray-600">
                The conventional approach requiring multiple steps and coordination
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
              {[
                "Contact a photographer and wait for a reply",
                "Decide on a date and time you're both available",
                "Find the right clothing & Drive to the photo studio",
                "Pose & Pick your favorite shots",
                "Wait for the photographer to edit",
                "Update your professional profiles"
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-300">
                    <span className="text-sm font-medium text-gray-600">{(index + 1).toString().padStart(2, '0')}</span>
                  </div>
                  <p className="text-gray-600">{step}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">TOTAL TIME</h4>
                  <p className="text-2xl font-bold text-gray-900">1-2 weeks</p>
                </div>
                <Clock className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

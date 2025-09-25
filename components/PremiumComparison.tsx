// components/PremiumComparison.tsx
import React from 'react';
import { ArrowRight, Star, Camera, Sparkles, Clock } from 'lucide-react';

// Trustpilot Rating Component
const TrustpilotRating = () => (
  <div className="flex items-center justify-center mb-4">
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
   
    <section className="min-h-screen py-12 bg-gradient-to-b from-white-100 to-gray ">
       {/* Full-width Testimonial Slider */}
      {/* Hero Section */}
      <div className="relative overflow-hidden ">
        <div className="max-w-7xl mx-auto py-4 px-8 pb-12">
        <TrustpilotRating />
        <h2 className="text-4xl text-center md:text-6xl font-bold text-navy-900 mb-6">
          From Casual Selfies to <span className="block text-indigo-800">
              Professional AI Photos
            </span>
        </h2>

        <p className="text-lg text-gray-800 text-center max-w-3xl mx-auto">
        Cut Costs and Save Time with UnrealShot AI—Create Stunning AI-Generated Photos Quickly
        </p>
        </div>
      </div>

      {/* Main Comparison Section */}
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* AI Process */}
          <div className="space-y-12">
            <div>
              <h3 className="text-xl sm:text-3xl text-indigo-800 font-bold mb-4 flex items-center gap-3">
                <Sparkles className="text-indigo-600" />
                Unrealshot AI Process
              </h3>
              <p className="text-gray-600">
                A streamlined, efficient process that delivers professional results in under an hour
              </p>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute left-8 top-8 bottom-0 w-px bg-gray-100" />
                <div className="relative flex gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-semibold text-indigo-600">01</span>
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
                <div className="absolute left-8 top-8 bottom-0 w-px bg-gray-100" />
                <div className="relative flex gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-semibold text-indigo-600">02</span>
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
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-semibold text-indigo-600">03</span>
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

            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-indigo-600 mb-1">TOTAL TIME</h4>
                  <p className="text-2xl font-semibold">~1 hour</p>
                </div>
                <ArrowRight className="text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Studio Process */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-bold sm:text-3xl mb-4 flex items-center gap-3">
                <Camera className="text-gray-600" />
                Traditional Studio Process
              </h2>
              <p className="text-gray-600">
                The conventional approach requiring multiple steps and coordination
              </p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8">
              {[
                "Contact a photographer and wait for a reply",
                "Decide on a date and time you're both available",
                "Find the right clothing & Drive to the photo studio",
                "Pose & Pick your favorite shots",
                "Wait for the photographer to edit",
                "Update your professional profiles"
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">{(index + 1).toString().padStart(2, '0')}</span>
                  </div>
                  <p className="text-gray-600">{step}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">TOTAL TIME</h4>
                  <p className="text-2xl font-semibold">1-2 weeks</p>
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

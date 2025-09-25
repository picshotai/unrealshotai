import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkle, Users } from "lucide-react"

export default function PricingSection() {
  return (
    <div className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

      {/* Floating elements */}
      <div className="absolute top-20 left-[10%] w-24 h-24 bg-indigo-600/10 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute bottom-20 right-[10%] w-32 h-32 bg-blue-600/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-indigo-900/40 backdrop-blur-sm rounded-full px-4 py-2 border border-indigo-400/30 mb-6">
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-medium">Perfect for Couples & Friends</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Stunning Couple Photos
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 text-transparent bg-clip-text">
              Without the Photoshoot
            </span>
          </h2>

          <p className="text-gray-300 text-lg max-w-xl">
            Why spend hundreds on professional photoshoots when you can create magical moments together with our AI?
            Transform your everyday selfies into breathtaking couple portraits.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-indigo-900/40 p-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">100% Satisfaction Promise</h3>
                <p className="text-gray-400">
                  Not thrilled with your couple photos? We'll refund you—no questions asked!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-indigo-900/40 p-1 rounded-full">
                <Sparkle className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Unlimited Style Options</h3>
                <p className="text-gray-400">
                  From romantic beach sunsets to fantasy worlds—create memories in any setting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Pricing Card */}
        <div className="relative">
          {/* Floating Offer Badge */}
          <div className="absolute -top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              LIMITED TIME OFFER
            </div>
          </div>

          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur-sm opacity-50" />
          <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-indigo-400" />
              <h2 className="font-semibold text-xl">Couple & Multi-Person AI Photos</h2>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Create Memories Together</h3>

              <p className="text-gray-300">
                Traditional couple photoshoots cost <span className="line-through text-gray-500">$200-500</span> and
                hours of your time. Our AI creates the same magic in minutes!
              </p>

              {/* Pricing */}
              <div className="space-y-4 bg-black/30 p-6 rounded-xl border border-gray-800">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">$15</span>
                      <span className="text-xl text-gray-400">or</span>
                      <span className="text-4xl font-bold text-white">₹1,250</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">/20 Photos</span>
                      <span className="text-sm text-gray-500 line-through">$49/₹3,999</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-2">
                    ✨ <span className="font-medium">Perfect for couples, friends & family</span>
                  </p>

                  <ul className="space-y-2 mt-4">
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="text-indigo-400">✓</div>
                      <span>20 high-quality AI couple photos</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="text-indigo-400">✓</div>
                      <span>Multiple styles & settings</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="text-indigo-400">✓</div>
                      <span>Delivered in 60 minutes</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <div className="text-indigo-400">✓</div>
                      <span>Custom prompt options</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/create"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl py-4 px-6 flex items-center justify-center gap-2 group transition-all duration-200 shadow-lg shadow-indigo-900/30"
              >
                <span className="font-semibold">Create Your Couple Photos Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-sm text-gray-400">No subscription • One-time payment • Instant delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto text-center bg-gray-900/50 p-6 rounded-xl border border-gray-800">
        
        <p className="text-gray-400">
          Your AI couple photos delivered in 60 minutes – Create memories without the hassle!
        </p>
      </div>
    </div>
  )
}


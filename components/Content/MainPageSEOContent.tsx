"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function MainPageContent() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="py-12 bg-gradient-to-b from-white to-indigo-50/50">
      {/* Decorative Background */} 
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-[40rem] left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:left-[calc(50%-30rem)] sm:top-[calc(20%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-indigo-200 to-indigo-50 opacity-20"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4  text-center max-w-7xl mx-auto relative">
      <h2 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 text-center">Bring Your Photos to Life<span className="block mt-2 text-indigo-800"> With AI-Generated Avatars</span></h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        With AI-powered photoshoots, you can create professional-grade profile pictures, social media avatars, or creative portraits—all without a camera or photographer.
        </p>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow border border-indigo-100 overflow-hidden">
          <div className="p-4">
            <article className="prose prose-indigo max-w-none">

            <div className={`space-y-6 ${!isExpanded ? "line-clamp-[8]" : ""}`}>
        <p>
        Your profile picture is often the first thing people notice about you online. Studies show that profiles with a professional photo get
         {"21x more views"} and {"36x more connection requests"} on LinkedIn. At Unrealshot AI, we believe your photo should feel like you—authentic, clear, and uniquely yours.
         Whether you're a CEO, a gamer, or just someone who wants to put their best face forward, our AI{" "}
          <Link href="/professional-headshot-ai" className="text-indigo-600 hover:underline">
          creates avatars
          </Link>
          , that truly reflect your personality. Forget the blurry selfies and cookie-cutter images—get a photo that's real and all about you.
        </p>

        <blockquote className="border-l-4 border-indigo-500 pl-4 italic">
          "In a swipe-first world, your profile photo isn't optional—it's your opening line."
        </blockquote>

        <h2 className="text-2xl font-bold text-indigo-800">
  The Future of AI Photoshoots: Unlimited Styles, Zero Studios
</h2>
<p>
  With Unrealshot AI, making a great profile photo is simple. Upload 10–20 of your photos, and our AI learns what makes you unique—so you can effortlessly switch between a polished headshot, a creative portrait, or a casual snap.
</p>
<p>
  Whether you need a refined look for work or something relaxed for your social profiles, change your background, lighting, and outfits with just a click. Even a festive AI Christmas photoshoot for your holiday cards is all set up in seconds.
</p>
<p className="font-semibold">
  Case Study: A freelance designer refreshed her portfolio with AI-generated images that truly captured her style—landing 12 new client projects.
</p>


        <h2 className="text-2xl font-bold text-indigo-800">AI for Professionals: Elevate Your Brand in Seconds</h2>
        <p>
          First impressions are currency. For corporate teams, Unrealshot AI delivers{" "}
          {"consistent, high-quality headshots"} at scale—no scheduling nightmares or $500/photographer fees.{" "}
          <Link href="/ai-doctor-headshots" className="text-indigo-600 hover:underline">
            Doctors using AI headshots
          </Link>{" "}
          report increased patient trust, while real estate agents using polished AI photos see{" "}
          {"73% higher client engagement"}. Even{" "}
          <Link href="/ai-lawyer-headshots" className="text-indigo-600 hover:underline">
            lawyers benefit from AI headshots
          </Link>
          , projecting professionalism and approachability. Freelancers on Upwork experience a{" "}
          {"40% boost in hire rates"}. Even remote teams benefit: sync backgrounds and lighting globally to unify your
          brand's visual voice.
        </p>

        <p className="font-semibold">
          Pro Tip: Match your headshot's tone to your industry—sharp suits for finance, creative backdrops for artists.
        </p>

        <h2 className="text-2xl font-bold text-indigo-800">AI Portraits & Creative Shoots: Beyond the Basics</h2>
        <p>
          Break free from bland headshots. Unrealshot AI transforms you into a noir detective, a cyberpunk hero, or a
          Renaissance muse. Actors swap headshots for casting calls in minutes, models build diverse editorial
          portfolios with{" "}
          <Link href="/ai-glamour-photoshoot" className="text-indigo-600 hover:underline">
            AI glamour photoshoots
          </Link>
          , and cosplayers morph into fantasy characters—no makeup or props required.
        </p>

        <p className="font-semibold">
          Why It Works: Casting directors review 500+ submissions daily. Stand out with AI-enhanced versatility.
        </p>

        <h2 className="text-2xl font-bold text-indigo-800">AI for Businesses: Marketing Magic, Minus the Budget</h2>
        <p>
          E-commerce brands using AI-generated product images see {"30% faster sales cycles"}, while startups cut photo
          shoot costs by 90%. Unrealshot AI turns basic snapshots into ad-ready visuals: crisp product shots, branded
          team photos, and thumbnails that crush click-through rates. Even bloggers thrive—pair articles with AI-crafted
          graphics that pop on Pinterest and Instagram. For those looking to boost their social media presence, our{" "}
          <Link href="/ai-influencer-generator" className="text-indigo-600 hover:underline">
            AI influencer generator
          </Link>{" "}
          can help create stunning content that resonates with your audience.
        </p>

        <blockquote className="border-l-4 border-indigo-500 pl-4 italic">
          "Our Shopify store's conversion rate doubled after switching to AI product photos." —E-commerce Founder
        </blockquote>

        <h2 className="text-2xl font-bold text-indigo-800">
          AI-Generated Kids & Family Portraits: No Tears, All Smiles
        </h2>
        <p>
          Forget bribing toddlers with candy for the "perfect" school photo. Unrealshot AI rescues blurry candids,
          turning bedhead chaos into yearbook-ready portraits. Fix lighting, replace cluttered backgrounds, and even
          tweak outfits—ideal for modeling portfolios, holiday cards, or grandma's fridge art.
        </p>

        <p className="font-semibold">
          Parent Hack: Mix AI edits with candid shots for authentic yet polished family albums.
        </p>

        <h2 className="text-2xl font-bold text-indigo-800">AI for Fun: Become a Cartoon, Elf, or Retro Icon</h2>
        <p>
          Why settle for reality? Craft anime avatars for Twitch, morph into a Viking warrior for D&D, or reimagine your
          selfie in 8-bit pixel art. Unrealshot AI's fantasy filters and retro styles let you experiment wildly—perfect
          for gamers, cosplayers, or anyone craving a digital alter ego.
        </p>

        <p className="font-semibold">
          Trend Alert: 78% of Gen Z gamers use AI avatars to stand out in virtual communities.
        </p>

        <h2 className="text-2xl font-bold text-indigo-800">Try Unrealshot AI—Your 24/7 Photographer</h2>
        <p>
          Your perfect headshot is seconds away. Train your AI model, choose from 1,000+ styles (corporate, cinematic,
          whimsical), and download studio-quality results. No subscriptions. No waiting. Just {"instant branding magic"}
          .
        </p>

        <p className="font-bold text-lg">
          Why Wait? Join 2,000+ users who've ditched traditional photoshoots.{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            {"Start creating now—your future profile photo is already here."}
          </Link>
        </p>
      </div>
              {/* Toggle Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 group flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                {isExpanded ? (
                  <>
                    Show Less
                    <ChevronUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                ) : (
                  <>
                    Show More
                    <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </article>
          </div>

          {/* Stats Section */}
          <div className="border-t border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white p-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-800 mb-1">21x</div>
                <div className="text-sm ">More Profile Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-800 mb-1">36x</div>
                <div className="text-sm ">More Messages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-800 mb-1">73%</div>
                <div className="text-sm ">Higher Trust Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-800 mb-1">85%</div>
                <div className="text-sm ">Casting Decisions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


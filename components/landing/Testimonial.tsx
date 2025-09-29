"use client"

import type React from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  avatar: string
  rating: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatar, rating }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-sm border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:border-[rgba(255,255,255,0.2)] transition-all duration-300">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-600"
            }`}
          />
        ))}
      </div>
      <blockquote className="text-gray-300 mb-4 text-sm leading-relaxed">
        "{quote}"
      </blockquote>
      <div className="flex items-center">
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="h-10 w-10 rounded-full object-cover mr-3"
        />
        <div>
          <h4 className="font-semibold text-white text-sm">{name}</h4>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialSection() {
  const testimonials: TestimonialCardProps[] = [
    {
      quote: "I got my perfect Instagram profile photo in just 40 minutes. The quality is amazing!",
      name: "Sachin Singh",
      role: "Influencer",
      avatar: "/content/sachin.webp",
      rating: 5,
    },
    {
      quote: "The transformation is unbelievable. My LinkedIn profile looks so professional now!",
      name: "Mariah Edwards",
      role: "Marketing Director",
      avatar: "/content/mariah-edwards.png",
      rating: 5,
    },
    {
      quote: "I've tried many AI photo tools, but Unrealshot AI gives the most natural-looking results.",
      name: "Sumesh",
      role: "Tech Enthusiast",
      avatar: "/content/sumesh.webp",
      rating: 5,
    },
    {
      quote: "Being a model, having standout photos is everything. After using this AI tool, my portfolio photos look more polished and professional!",
      name: "Emma Thompson",
      role: "Model",
      avatar: "/content/emma-thopmson.jpg",
      rating: 5,
    },
    {
      quote: "The customer service is as impressive as the AI. They helped me choose the perfect style.",
      name: "Manoj",
      role: "Photographer",
      avatar: "/content/manoj.jpg",
      rating: 5,
    },
    {
      quote: "Our entire team uses Unrealshot AI for our corporate headshots. Consistent quality every time!",
      name: "Shrey Singh",
      role: "HR Manager",
      avatar: "/images/demo2.jpg",
      rating: 5,
    },
  ]

  return (
    <section className="relative py-20 bg-[#111111]">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-[#ff6f00] mb-4">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-medium">Customer Stories</span>
          </div>
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Real Results from{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Real People</span>
              <span className="absolute left-0 right-0 bottom-0 h-[30%] bg-[#ff6f00] -z-10"></span>
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-300">
            Don't just take our word for it. See what our users are saying about their transformative experiences.
          </p>
        </div>

        {/* Testimonials Grid with Blur Overlay */}
        <div className="relative">
          {/* Blur overlay gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#111111] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111111] to-transparent z-10 pointer-events-none"></div>
          
          {/* Testimonials Container */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
              {/* First Row */}
              <div className="space-y-6">
                <TestimonialCard {...testimonials[0]} />
                <TestimonialCard {...testimonials[1]} />
              </div>
              <div className="space-y-6">
                <TestimonialCard {...testimonials[2]} />
                <TestimonialCard {...testimonials[3]} />
              </div>
              <div className="space-y-6">
                <TestimonialCard {...testimonials[4]} />
                <TestimonialCard {...testimonials[5]} />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Join thousands of satisfied customers
          </h3>
          <Link href="/ai-glamour-photoshoot" className="inline-block">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded shadow-lg text-white px-8 py-3 text-lg transition-colors duration-200"
            >
              Transform Your Photos Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

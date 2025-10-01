'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const heroImages = [
  '/images/professional-headshots/hero-1.webp',
  '/images/professional-headshots/hero-2.webp',
  '/images/professional-headshots/hero-3.webp',
  '/images/professional-headshots/hero-4.webp',
  '/images/professional-headshots/hero-5.webp',
  '/images/professional-headshots/hero-6.webp',
];

export function HeroSection() {
  return (
    <section className="w-full bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              AI Professional Headshots for Your Career
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
              Elevate your personal brand with stunning, AI-generated
              headshots. Perfect for LinkedIn, resumes, and corporate profiles.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-[#ff6f00] hover:bg-[#ff8c00] text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <Link href="/start-photoshoot">
                  Get Your Headshots Now <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg font-bold shadow-lg transition-transform transform hover:scale-105"
              >
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Studio-quality results without the hassle. Fast, easy, and
              affordable.
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-3">
            {heroImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <Image
                  src={src}
                  alt={`Professional Headshot ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 30vw, 15vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
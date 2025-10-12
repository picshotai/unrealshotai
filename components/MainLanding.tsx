"use client";

import MobileUIMockup from "@/components/mobile-ui-mockup"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FourthSection from "@/components/Testimonial";
import FloatingText from "./floating-text";
import FeaturesSection from "@/components/testimonial-section";



export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cardData = [
    {
      title: "MD Doctor Headshots",
      description:
        "Present yourself with the trust and authority of a medical professional, perfect for medical profiles or practice websites.",
      image: "/content/doctor1.webp",
      url: "/ai-doctor-headshots",
    },
    {
      title: "Social Media AI Photos",
      description:
        "Make your profile pop with creative, eye-catching images that show off your personality and style.",
      image: "/content/socialimage.jpg",
      url: "/login",
    },
    {
      title: "AI Glamour Photos",
      description:
        "Unleash your inner star with stunning glamour photos that highlight your confidence and elegance.",
      image: "/content/glamour3.webp",
      url: "/ai-glamour-photoshoot",
    },
    {
      title: "Corporate Headshots",
      description:
        "Make a strong impression with corporate headshots that reflect your professionalism, ideal for company websites or business cards.",
      image: "/content/corporate1.jpg",
      url: "/login",
    },
    {
      title: "Professional Headshots",
      description:
        "Create a polished, professional image for LinkedIn or your resume, making a strong first impression in any industry.",
      image: "/content/professional1.jpg",
      url: "/professional-headshot-ai",
    },
    {
      title: "Christmas Photoshoot",
      description:
        "Embrace the holiday spirit with festive photos that capture the joy and warmth of the season, perfect for family cards or social media.",
      image: "/content/christmas1.jpg",
      url: "/ai-christmas-photoshoot",
    },
    {
      title: "Cardboard Meme AI Photos",
      description:
        "Bring humor to life with creative and quirky cardboard meme-style photos for a fun twist.",
      image: "/content/cardboard1.jpg",
      url: "/login",
    },
    {
      title: "Lawyer Headshots",
      description:
        "Project confidence and professionalism with sharp, approachable lawyer headshots that leave a lasting impression on clients and colleagues.",
      image: "/content/lawyer5.webp",
      url: "/ai-lawyer-headshots",
    },
  ];


  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      image:
        "/content/doctor1.webp",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Product Manager",
      image:
        "/content/doctor1.webp",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Data Scientist",
      image:
        "/content/doctor1.webp",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "UX Designer",
      image:
        "/content/doctor1.webp",
    },
    {
      id: 5,
      name: "Tyler Durden",
      designation: "Soap Developer",
      image:
        "/content/doctor1.webp",
    },
    {
      id: 6,
      name: "Dora",
      designation: "The Explorer",
      image:
        "/content/doctor1.webp",
    },
  ];

  return (
    
    <div className="w-full ">
      <section className="relative  p-4 pt-32 sm:pt-28 sm:p-6 min-h-screen flex items-center">
  {/* White Grid with Dots Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(51,65,85,0.4) 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px, 20px 20px, 20px 20px",
      backgroundPosition: "0 0, 0 0, 0 0",
    }}
  />
     
      <div className="mx-auto  max-w-7xl w-full">
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 py-12 lg:py-2 items-center">
      {/* Left Column */}
      <div className="flex flex-col justify-center space-y-6">

        <div className="space-y-4">
          <div className="relative mb-2 mt-10">
    
            <FloatingText
              text="No plastic skin"
              position="right"
              isVisible={isVisible}
            />


            <h1 className="relative text-center mt-12 mb-8 text-[2.4rem]  leading-[1.2] font-bold tracking-tight text-gray-900 md:text-left md:text-5xl lg:text-6xl">
          
              <span className="relative">

                <span className="relative bg-gradient-to-r from-indigo-800 to-blue-700 bg-clip-text text-transparent">
                  AI Photoshoots
                </span> 
                
              </span>{" "}
              <span className="relative">
                That Look Like {" "}
                <span className="relative inline-block">
                  
                  <span className="relative z-10">Real You</span>
                  <span className="absolute left-0 right-0 bottom-0 h-[30%] bg-indigo-200 -z-10"></span>
                </span>
              </span>
            </h1>

          </div>
          {/* Supporting line */}
          <p className="text-lg text-center md:text-left mt-0 font-medium text-gray-700 md:text-xl">
            <span className="text-red-500 line-through">Stop paying</span>{" "}
            for fake-looking  <span className="underline">AI photos</span>.
          </p>

          {/* Additional context */}
          <div className="relative text-center md:text-left">
            <h3 className="text-gray-700 italic">
            Get professional photoshoots from your selfies in 20 minutes. Any style. Any background. Looks actually human.
            </h3>
          </div>
        </div>

        {/* Bullet points */}
        <div className="mb-10 flex flex-col space-y-2">
          <div className="flex items-center">
            <span className="flex h-6 w-6 items-center mr-2 justify-center rounded bg-indigo-100 text-indigo-600">
              ✓
            </span>
            <span className="text-sm md:text-lg text-gray-800">
              No overpriced AI scams Anymore, just real results
            </span>
          </div>
          <div className="flex items-center">
            <span className="flex h-6 w-6 items-center mr-2 justify-center rounded bg-indigo-100 text-indigo-600">
              ✓
            </span>
            <span className="text-sm md:text-lg text-gray-800">
              Fast Model Training , full prompt control.
            </span>
          </div>
          <div className="flex items-center">
            <span className="flex h-6 w-6 items-center mr-2 justify-center rounded bg-indigo-100 text-indigo-600">
              ✓
            </span>
            <span className="text-sm  md:text-lg text-gray-800">
              No wasting of money, every photo counts.
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row  md:items-center gap-6">
          <Link href="/login">
          <Button className="group h-12 w-full md:w-auto rounded-md bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 px-8 text-base text-lg font-medium text-center">
          Start Your AI Photoshoot
            <Sparkles className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          </Link>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="text-xs text-gray-500">Starting at only</div>
            <div className="flex items-baseline">
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-indigo-600">
                  ₹880
                </span>
                <span className="ml-1 text-sm text-gray-600">or</span>
                <span className="ml-1 text-xl font-bold text-indigo-600">
                  $9.99
                </span>
              </div>
              <span className="ml-1 text-sm text-gray-600">
                / 20 Photos
              </span>
            </div>
            <div className="text-sm text-gray-400">
              <span className="line-through">₹1999 / $23</span>
            </div>
          </div>
        </div>
                {/* Trusted Users Section
                <div className="mt-8">
          <div className="text-center text-sm text-gray-500 mb-2">
            Trusted by industry leaders
          </div>
      
          <AnimatedTooltip items={people} className="mx-auto" />
        </div> */}
      </div>


      {/* Right Column */}
      <MobileUIMockup />
          </div>

  </div>
      </section>

      <section className="bg-black py-12 min-h-screen">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col items-center max-w-4xl mb-4 mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-6">
            Turn Your Casual Selfies Into Stunning AI-Generated Photos
            </h2>
            <p className="text-lg text-white max-w-3xl mx-auto max-w-[600px]">
              No expensive photographers or studios—just your selfies and our AI
              for incredible results
            </p>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/content/training5.jpg"
                  alt="Selfie 1"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/content/training6.jpg"
                  alt="Selfie 2"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/content/training7.jpg"
                  alt="Selfie 3"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/content/training8.jpg"
                  alt="Selfie 4"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                src="/content/arrow.png"
                alt="Arrow pointing to AI generated photo"
                width={300}
                height={100}
                className="text-white transform md:transform-none rotate-90 md:rotate-0 transition-transform duration-300 w-[120px] h-[80px] md:w-[300px] md:h-[100px]"
              />
            </div>

            <div className="relative w-full max-w-xl aspect-[3/4] rounded-3xl overflow-hidden">
              <Image
                src="/content/real-user.jpg"
                alt="AI Generated professional photo"
                width={600}
                height={800}
                className="w-full h-full object-cover"
              /> 
              <div className="absolute left-1/3 bottom-4 bg-indigo-700 text-white text-sm font-medium px-3 py-1 rounded-full">
              Real AI Output – No Retouching
                          </div>
              <div className="absolute top-4 right-4 bg-indigo-700 text-white text-sm font-medium px-3 py-1 rounded-full">
                AI GENERATED
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="min-h-screen bg-black">
        <div className="py-20 min-h-screen">
          <div className="max-w-7xl mx-auto px-4">
            {/* Title Section */}
            <div className="mb-16 max-w-4xl">
              <h2 className="text-4xl md:text-6xl text-white font-bold mb-6">
                <span className="text-gray-100 font-normal text-xl mb-4 block">
                  Choose From 10+ AI Photo Styles
                </span>
                Explore the Curated Packs Library of Our AI Photo Maker
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-16">
              {cardData.map((card, index) => (
                <Card
                  key={index}
                  className="bg-black rounded-[15px] overflow-hidden border border-gray-700 shadow-md transition-all duration-300 hover:border-indigo-500 hover:border-2"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-black rounded-bl-[32px] z-10" />
                      <Link href={card.url}>
                        <Image
                          src={card.image}
                          alt={`${card.title} example`}
                          width={400}
                          height={300}
                          className="w-full object-cover rounded-t-[18px]"
                        />
                      </Link>
                      <Link href={card.url}>
                        <Button
                          size="icon"
                          className="absolute top-3 right-3 rounded-full bg-indigo-500/80 hover:bg-indigo-600/80 transition-colors duration-300 z-20"
                        >
                          <ArrowUpRight className="h-5 w-5 text-white" />
                        </Button>
                      </Link>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="max-w-2xl mb-4 md:mb-0">
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                UnrealShot AI turns your selfies into professional AI photoshoots.{" "}
                  <span className="text-indigo-400 font-semibold">
                  Upload your photos, choose a style pack, enter a prompt,{" "}  
                  </span> 
                   and get photos that feel real, not AI-generated.
                </p>
              </div>
              <p className="text-gray-300 italic text-sm md:transform md:rotate-6 md:w-48 sm:text-center sm:w-auto">
                If you're not happy, we will refund your full money
              </p>
            </div>
          </div>
        </div>
      </section>

      <FourthSection />
      <FeaturesSection/>
    

    </div>
  );
}

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Palette, Eye, Share2, Download, Camera, Zap, ChevronDown, Check, ArrowRight } from "lucide-react"
import {
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  FacebookIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/pfpmaker/social-icons"

export default function EnhancedLandingPage() {
  return (
    <div className="min-h-screen">
      <FeaturesSection />
      <WhyUseSection />
      <AIEnhancementSection />
      <HowItWorksSection />
      <SocialMediaSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}

function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features at Your Fingertips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              icon: <Edit className="w-8 h-8 text-indigo-400" />,
              title: "Advanced Editing",
              description: "Precision tools for the perfect crop and adjustments",
            },
            {
              icon: <Palette className="w-8 h-8 text-indigo-400" />,
              title: "AI Background Removal",
              description: "Instantly remove and replace backgrounds",
            },
            {
              icon: <Zap className="w-8 h-8 text-indigo-400" />,
              title: "One-Click Enhancements",
              description: "Automatic improvements for stunning results",
            },
            {
              icon: <Share2 className="w-8 h-8 text-indigo-400" />,
              title: "Multi-Platform Optimization",
              description: "Perfect sizes for all social media",
            },
            {
              icon: <Eye className="w-8 h-8 text-indigo-400" />,
              title: "Real-Time Preview",
              description: "See changes as you make them",
            },
            {
              icon: <Download className="w-8 h-8 text-indigo-400" />,
              title: "High-Quality Export",
              description: "Download in various formats and sizes",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg border border-gray-700"
            >
              <div className="flex-shrink-0 mr-4">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyUseSection() {
  return (
<section className="py-20 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Use Our Free Profile Picture Maker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-full flex items-center  justify-center">
              <Image
                src="/content/profile-photo6.webp"
                alt="Profile Picture Examples"
                width={500}
                height={500}
                className="rounded-lg shadow-lg w-full border border-blue-500 max-w-md mx-auto"
              />
            </div>
            <div className="space-y-8">
              <p className="text-xl">
                Creating a high-quality profile picture shouldn't be a hassle. Our free profile picture maker is
                designed to give you complete control over your images without needing any design skills.
              </p>
              <ul className="space-y-4">
                {[
                  "AI-Powered Editing – Smart tools for effortless adjustments",
                  "No Watermarks, No Hidden Fees – 100% free to use",
                  "Instant Download – High-quality images for all platforms",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-6 h-6 text-indigo-800 mr-2 flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg font-semibold text-indigo-800">
                Whether you need a pfp maker AI tool for social media or a profile picture maker free, this tool ensures
                your photo stands out.
              </p>
            </div>
 
          </div>
        </div>
      </div>
    </section>
  )
}

function AIEnhancementSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Why a Good Profile Picture Matters</h2>
              <p className="text-xl mb-8">
                A great profile picture isn't just about looking good—it impacts your online presence.
              </p>
              <ul className="space-y-6">
                {[
                  {
                    title: "First Impressions Matter",
                    description: "A sharp profile photo maker boosts credibility.",
                  },
                  {
                    title: "Brand Identity",
                    description: "Consistent visuals across platforms strengthen your personal brand.",
                  },
                  {
                    title: "More Engagement",
                    description: "People are more likely to interact with a polished pfp.",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-2xl mr-4">📌</span>
                    <div>
                      <h3 className="font-semibold text-lg ">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-lg font-medium text-gray-400">
                Use our pfp profile picture maker online free to make every first impression count.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative z-10 transform border border-indigo-500 rounded-lg ">
                <Image
                  src="/content/profile-photo6.png"
                  alt="Professional profile pictures example"
                  width={700}
                  height={500}
                  className="rounded-lg hover:scale-105 transition-transform duration-300 shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-indigo-500 rounded-lg blur-3xl opacity-10"></div>
            </div>
          </div>
        </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">How to Create a Stunning Profile Picture in Seconds</h2>
        <p className="text-xl text-center mb-16 max-w-3xl mx-auto">
          Using our AI profile picture generator free, you can create a professional pfp in three simple steps:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Camera className="w-12 h-12 text-indigo-800" />,
              title: "1️⃣ Upload Your Photo",
              description: "Select an image from your device.",
            },
            {
              icon: <Edit className="w-12 h-12 text-indigo-800" />,
              title: "2️⃣ Customize It",
              description: "Adjust the size, background, borders, and more.",
            },
            {
              icon: <Download className="w-12 h-12 text-indigo-800" />,
              title: "3️⃣ Download & Use",
              description: "Save the final image and upload it to your profile.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-lg font-semibold text-indigo-800">
          No complex software needed—just a few clicks and your pfp profile picture maker online free is ready to go!
        </p>
      </div>
    </section>
  )
}

function SocialMediaSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Optimized for Every Platform</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {[
            { icon: <InstagramIcon className="w-12 h-12" />, name: "Instagram" },
            { icon: <TwitterIcon className="w-12 h-12" />, name: "Twitter" },
            { icon: <LinkedInIcon className="w-12 h-12" />, name: "LinkedIn" },
            { icon: <FacebookIcon className="w-12 h-12" />, name: "Facebook" },
            { icon: <TikTokIcon className="w-12 h-12" />, name: "TikTok" },
            { icon: <YouTubeIcon className="w-12 h-12" />, name: "YouTube" },
          ].map((platform, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg flex items-center justify-center mb-4 mx-auto border border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105">
                {platform.icon}
              </div>
              <p className="font-semibold">{platform.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
    const faqs = [
      {
        question: "Is this profile picture maker by unrealshot ai free?",
        answer: "Yes, our free profile picture maker is 100% free with no hidden costs.",
      },
      {
        question: "How can I remove the background from my profile picture?",
        answer:
          "Use our tool's AI-powered background removal feature: upload your photo and select the background removal option to automatically eliminate the original background.",
      },
      {
        question: "What image formats are supported?",
        answer: "You can upload JPG, PNG, and WebP files.",
      },
      {
        question: "Can I use the created images for commercial purposes?",
        answer: "All images you create with our tool are yours to use as you wish, including for commercial purposes.",
      },
      {
        question: "Is my data safe and private?",
        answer:
          "We take your privacy seriously. Your photos are processed securely and are not stored on our servers.",
      },
      {
        question: "How many profile pictures can I create wiht Unrelashot AI?",
        answer: "There's no limit! Create as many profile pictures as you need, all for free.",
      },
      {
        question: "Why does my profile picture appear blurry?",
        answer:
          "Blurriness often results from low-resolution images or incorrect dimensions. Upload photos that meet or exceed the platform's recommended sizes to ensure clarity.",
      },

      {
        question: "Where can I use the profile pictures created with this tool?",
        answer:
          "Our generated profile pictures are suitable for various platforms, including social media (Facebook, Instagram, Twitter, LinkedIn), professional documents (resumes, business cards), communication apps (WhatsApp, email signatures), and gaming profiles.",
      },
      {
        question: "How often should I update my profile picture?",
        answer:
          "It's advisable to update your profile picture at least once a year or during significant life events to keep your online presence current.",
      },
      {
        question: "Is it safe to upload my photo to this tool?",
        answer:
          "Yes, your privacy is important to us. Our tool processes images directly in your browser, ensuring your photos are not stored or transmitted to servers.",
      },
      {
        question: "Do I need to create an account to use this profile photo maker?",
        answer: "No account creation is necessary. You can create and download your profile picture without signing up.",
      },
      {
        question: "Are there any costs associated with using this profile picture maker?",
        answer: "Our profile picture maker is completely free to use, with no hidden fees or watermarks.",
      },
      {
        question: "Can I edit my profile picture after downloading it?",
        answer:
          "Yes, you can re-upload the image to our tool or use other image editing software for further adjustments.",
      },
    ]
  
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false)
  
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg font-semibold">{question}</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
          />
        </button>
        <div
          className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
          }`}
        >
          <p className="text-gray-600">{answer}</p>
        </div>
      </div>
    )
  }
function CTASection() {
  return (
    <section className="py-20 border-b border-gray-700 bg-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Create Your Perfect Profile Picture with Unrealshot AI?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of users who have enhanced their online presence with our free PFP maker . Start creating now
          and see the difference!
        </p>
        <Link href="/profile-photo-maker">
        <Button
          size="lg"
          className="bg-indigo-800 text-white hover:bg-indigo-900 px-8 py-3 rounded-md text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Get Started for Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        </Link>
      </div>
    </section>
  )
}


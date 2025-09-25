import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-12 relative mb-16 flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-200 rounded-full blur-[100px] opacity-30" />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold relative">
  Free AI Profile Picture Maker
  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 leading-snug">
    Create Stunning Profile Photos Online
  </span>
</h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your selfies into professional profile photos in seconds using our free AI profile picture generator
          </p>
          {/* Upload Section with Floating Elements */}
          <div className="relative inline-block">
            <Button
              size="lg"
              className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium px-8 py-3 rounded-md relative z-10 flex items-center"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Your Photo
            </Button>

            {/* Arrows Container */}
            <div className="arrows-container absolute inset-0 flex justify-center items-center h-36 z-20">
              {/* Click Arrow (Left) */}
              <div className="arrow-left w-120 h-full relative">
                <span className="arrow-label-click absolute -top-2 left-4 bg-purple-700 text-white text-xs  rounded-sm shadow-md transform rotate-15">
                  Upload
                </span>
                <svg
                  width="150"
                  height="80"
                  viewBox="0 0 150 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="arrow-antickw2 absolute top-30 left-0 text-gray-500"
                >
                  <path
                    d="M20 40 Q 80 20 140 40"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="5"
                  />
                  <path d="M140 40 L 130 35 M 140 40 L 135 45" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              {/* And Get Arrow (Right) */}
              <div className="arrow-right w-120 h-full relative">
                <span className="arrow-label-get absolute -top-2 right-4 bg-purple-700 text-white text-xs px-2 py-1 rounded-sm shadow-md transform -rotate-15 ">
                  and create
                </span>
                <svg
                  width="150"
                  height="80"
                  viewBox="0 0 150 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="arrow-ckw absolute top-30 right-0 text-gray-500"
                >
                  <path
                    d="M20 40 Q 80 20 140 40"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="5"
                  />
                  <path d="M140 40 L 130 35 M 140 40 L 135 45" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative mt-24">
          {/* Decorative elements */}
          <div className="absolute inset-0 grid grid-cols-[repeat(auto-fit,minmax(20px,1fr))] gap-1 opacity-5">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-400 rounded-sm" />
            ))}
          </div>

          {/* Process Flow */}
          <div className="relative image-grid z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-16">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white shadow-lg flex items-center justify-center -mt-50px">
              <Image
                src="/content/user-profile.jpg"
                alt="Original"
                width={112}
                height={112}
                className="rounded-lg w-20 h-20 md:w-28 md:h-28 object-cover"
              />
            </div>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            <div className="flex -space-x-6 md:-space-x-4">
              {[
                { bg: "bg-blue-100", src: "/content/profile-photo2.webp" },
                { bg: "bg-pink-100", src: "/content/profile-photo3.webp" },
                { bg: "bg-yellow-100", src: "/content/profile-photo4.webp" },
                { bg: "bg-indigo-100", src: "/content/profile-photo1.webp" },
              ].map((image, i) => (
                <div
                  key={i}
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${image.bg} flex items-center justify-center border-2 border-white shadow-lg transform transition-transform hover:scale-105 hover:z-10`}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={`Style ${i + 1}`}
                    width={112}
                    height={112}
                    className="rounded-full w-20 h-20 md:w-28 md:h-28 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}


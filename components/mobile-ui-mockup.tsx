"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MapPin,
  Briefcase,
  Calendar,
  Award,
  MoreHorizontal,
  X,
} from "lucide-react"
import Image from "next/image"

export default function MobileUIMockup() {
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const tabs = ["LinkedIn", "Dating", "Instagram"]

  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      {/* Phone Frame with gradient border */}
      <div className="relative rounded-[46px] p-[3px] bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="relative bg-black rounded-[44px] overflow-hidden h-[700px]">
          {/* Status Bar */}
          <div className="relative bg-black px-8 py-3 flex justify-between items-center">
            <span className="text-white text-sm font-medium">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg className="text-white" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 20.5C7 20.5 2.73 16.39 1 11C2.73 5.61 7 1.5 12 1.5C17 1.5 21.27 5.61 23 11C21.27 16.39 17 20.5 12 20.5ZM12 3.5C8.24 3.5 4.83 6.61 3.18 11C4.83 15.39 8.24 18.5 12 18.5C15.76 18.5 19.17 15.39 20.82 11C19.17 6.61 15.76 3.5 12 3.5Z"
                />
                <path
                  fill="currentColor"
                  d="M12 15C9.24 15 7 12.76 7 10C7 7.24 9.24 5 12 5C14.76 5 17 7.24 17 10C17 12.76 14.76 15 12 15ZM12 7C10.34 7 9 8.34 9 10C9 11.66 10.34 13 12 13C13.66 13 15 11.66 15 10C15 8.34 13.66 7 12 7Z"
                />
              </svg>
              <svg className="text-white" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33Z"
                />
                <rect fill="currentColor" x="9" y="6" width="6" height="12" />
              </svg>
              <svg className="text-white" width="18" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M1 9L2 22H22L23 9M1 9L12 2L23 9M1 9L12 16L23 9" />
              </svg>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 py-3.5 text-sm font-medium relative ${
                    activeTab === index ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {tab}
                  {activeTab === index && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="relative h-full bg-gray-50 overflow-auto">
            {/* LinkedIn Tab */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 overflow-auto ${activeTab === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="h-32 bg-indigo-600 relative overflow-hidden">
                {/* Particles in banner */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-10 w-6 h-6 rounded-full bg-white/10"></div>
                  <div className="absolute top-16 left-20 w-4 h-4 rounded-full bg-white/20"></div>
                  <div className="absolute top-8 left-40 w-8 h-8 rounded-full bg-white/10"></div>
                  <div className="absolute top-20 left-60 w-3 h-3 rounded-full bg-white/15"></div>
                  <div className="absolute top-6 right-10 w-5 h-5 rounded-full bg-white/10"></div>
                  <div className="absolute top-18 right-30 w-7 h-7 rounded-full bg-white/20"></div>
                  <div className="absolute top-4 right-50 w-4 h-4 rounded-sm rotate-45 bg-white/10"></div>
                  <div className="absolute top-24 right-80 w-6 h-6 rounded-md bg-white/15"></div>
                </div>
              </div>
              <div className="relative px-4 pb-4">
                <div className="absolute -top-16 left-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100">
                    <Image
                      src="/content/linkedin.jpg"
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="pt-20">
                  <h2 className="text-xl font-semibold text-gray-900">James Clark</h2>
                  <p className="text-sm text-gray-600">Founder & CEO at TechNova | YC W22</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> San Francisco Bay Area • 2,500+ connections
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button className="px-6 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-full">
                      Message
                    </button>
                    <button className="px-6 py-1.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-full">
                      Connect
                    </button>
                  </div>

                  {/* About Section */}
                  <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-900">About</h3>
                    <p className="mt-2 text-sm text-gray-600">
                    Serial entrepreneur with a passion for solving real-world problems through technology. Founded TechNova in 2022, 
  raised $4.2M seed round, and always believes in leveraging cutting-edge AI tools for maximum impact. Even this headshot 
  was generated using Unrealshot AI—a fast and <strong>realistic photoshoot generator</strong> that delivers studio-quality photos, 
  perfect for professionals with a packed schedule.
                    </p>
                  </div>

              
                </div>
              </div>
            </div>

            {/* Dating Tab */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 1 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="h-full bg-gradient-to-b from-gray-50 to-gray-100 px-4">
                {/* Tinder-style header */}
                <div className="flex justify-between items-center p-4">
                  <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="#FF4458"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C12 22 20 16 20 9.5C20 5.91 16.41 3 12 3C7.59 3 4 5.91 4 9.5C4 16 12 22 12 22Z"
                        fill="#FF4458"
                      />
                      <path
                        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                        stroke="#FF4458"
                        strokeWidth="2"
                      />
                      <path d="M12 4V2" stroke="#FF4458" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 22V20" stroke="#FF4458" strokeWidth="2" strokeLinecap="round" />
                      <path d="M20 12H22" stroke="#FF4458" strokeWidth="2" strokeLinecap="round" />
                      <path d="M2 12H4" stroke="#FF4458" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Card Stack with Tinder styling */}
                <div className="relative h-[460px] w-full px-2">
                  {/* Main card */}
                  <div className="absolute inset-0 bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 ease-out">
                    <div className="relative h-[360px] bg-gray-200">
                      <Image src="/content/jesica-profile.jpg" alt="Dating Profile" fill className="object-cover" />

                      {/* Gradient overlay for text readability */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                        <div className="flex items-end">
                          <div>
                            <h3 className="text-white text-3xl font-bold">Jessica, 28</h3>
                            <p className="text-white/90 flex items-center text-sm mt-1">
                              <MapPin className="w-4 h-4 mr-1" /> 5 miles away
                            </p>
                          </div>
                          <div className="ml-auto bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 22C12 22 20 16 20 9.5C20 5.91 16.41 3 12 3C7.59 3 4 5.91 4 9.5C4 16 12 22 12 22Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Photo indicator dots */}
                      <div className="absolute top-3 left-0 right-0 flex justify-center gap-1">
                        <div className="w-8 h-1 rounded-full bg-white opacity-100"></div>
                        <div className="w-8 h-1 rounded-full bg-white opacity-40"></div>
                        <div className="w-8 h-1 rounded-full bg-white opacity-40"></div>
                        <div className="w-8 h-1 rounded-full bg-white opacity-40"></div>
                      </div>
                    </div>

                    {/* Profile info section */}
                    <div className="p-3">
                      <div className="flex items-center mb-1">
                        <Briefcase className="w-4 h-4 text-gray-500 mr-2" />
                        <p className="text-sm text-gray-700">Dreamer, explorer, coffee lover</p>
                      </div>
                      <div className="flex items-center mb-1">
                        <Award className="w-4 h-4 text-gray-500 mr-2" />
                        <p className="text-sm text-gray-700">Loves exploring new cities</p>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        Coffee enthusiast, hiking lover, and always looking for the next adventure. Let's explore the
                        city together!
                      </p>
            
                    </div>
                  </div>
                </div>

                {/* Tinder-style action buttons */}
                <div className="flex justify-center gap-4 mt-3 pb-3">
                  <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100 transform transition-transform hover:scale-110">
                    <X className="w-7 h-7 text-[#FE3C72]" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] shadow-lg flex items-center justify-center transform transition-transform hover:scale-110">
                    <Heart className="w-7 h-7 text-white" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-100 transform transition-transform hover:scale-110">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="#1E9BF0"
                        stroke="#1E9BF0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Instagram Tab */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 overflow-auto ${activeTab === 2 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="flex items-center px-4 py-3 border-b">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="/content/glamour7.webp"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">chris_creative</p>
                  <p className="text-xs text-gray-500">New York, NY</p>
                </div>
                <button className="ml-auto">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="relative aspect-square bg-gray-100">
                <Image src="/content/glamour7.webp" alt="Post" fill className="object-cover" />
              </div>

              {/* Instagram Action Bar */}
              <div className="px-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button>
                      <Heart className="w-6 h-6 text-gray-900" />
                    </button>
                    <button>
                      <MessageCircle className="w-6 h-6 text-gray-900" />
                    </button>
                    <button>
                      <Send className="w-6 h-6 text-gray-900" />
                    </button>
                  </div>
                  <button>
                    <Bookmark className="w-6 h-6 text-gray-900" />
                  </button>
                </div>

                {/* Likes */}
                <p className="mt-2 text-sm font-semibold">1,234 likes</p>

                {/* Caption */}
                <div className="mt-1">
                  <p className="text-sm">
                    <span className="font-semibold">chris_creative</span> Exploring the city today and found this
                    amazing view!
                    <span className="text-blue-500"> #unrealshotai #photography #urban</span>
                  </p>
                </div>

                {/* View all comments */}
                <button className="mt-1 text-sm text-gray-500">View all 87 comments</button>

              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


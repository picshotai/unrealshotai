"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingText from "./floating-text";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="checked-background relative bg-gradient-to-br from-indigo-50 to-blue-50 p-4 pt-32 sm:pt-28 sm:p-6 min-h-screen flex items-center overflow-x-hidden">
      <div className="mx-auto max-w-7xl w-full">
        <AnimatedBackground />
        <div className="grid gap-6 lg:gap-12 lg:grid-cols-2 py-12 lg:py-2 items-center">
          {/* Left Column */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="relative mb-2 mt-10">
                <FloatingText text="No plastic skin" position="right" isVisible={isVisible} />
                <h1 className="relative text-center mt-12 mb-8 text-[1.8rem] sm:text-[2.4rem] leading-[1.2] font-bold tracking-tight text-gray-900 md:text-left md:text-5xl lg:text-6xl">
                  <span className="relative">
                    <span className="relative bg-gradient-to-r from-indigo-800 to-blue-700 bg-clip-text text-transparent">
                      Realistic AI Photos
                    </span>
                  </span>{" "}
                  <span className="relative">
                    —Now for You &{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10">Your Loved Ones!</span>
                      <span className="absolute left-0 right-0 bottom-0 h-[30%] bg-indigo-200 -z-10"></span>
                    </span>
                  </span>
                </h1>
              </div>

              {/* Supporting line */}
              <p className="text-xl text-center md:text-left mt-0 font-medium text-gray-700 md:text-2xl">
                Look natural in AI-generated photos—
                <span className="relative inline-block italic">
                  <span className="text-blue-700">solo or with friends</span>
                  <span className="absolute bottom-0 left-0 w-full border-b-2 border-dashed border-indigo-500"></span>
                </span>
                .
              </p>

              {/* Additional context */}
              <div className="relative text-center md:text-left">
                <h3 className="text-gray-700 italic">No plastic skin. No weird AI distortions.</h3>
              </div>
            </div>

            {/* Bullet points */}
            <div className="mb-10 flex flex-col space-y-2">
              <div className="flex items-center">
                <span className="flex h-6 w-6 items-center mr-2 justify-center rounded bg-indigo-100 text-indigo-600">
                  ✓
                </span>
                <span className="text-sm md:text-lg text-gray-800">No overpriced AI scams—just real results.</span>
              </div>
              <div className="flex items-center">
                <span className="flex h-6 w-6 items-center mr-2 justify-center rounded bg-indigo-100 text-indigo-600">
                  ✓
                </span>
                <span className="text-sm md:text-lg text-gray-800">
                  Couple or Family photos with full prompt control.
                </span>
              </div>
              <div className="flex items-center">
                <span className="flex h-6 w-6 items-center mr-2 justify-center rounded bg-indigo-100 text-indigo-600">
                  ✓
                </span>
                <span className="text-sm md:text-lg text-gray-800">Every photo counts—no wasted shots.</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
              <Link href="/dashboard">
                <Button className="group h-12 w-full md:w-auto rounded-md bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 px-8 text-base text-lg font-medium text-white text-center">
                  Try Multi-Person AI Photos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="text-xs text-gray-500">Starting at only</div>
                <div className="flex items-baseline">
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-indigo-600">₹1312</span>
                    <span className="ml-1 text-sm text-gray-600">or</span>
                    <span className="ml-1 text-xl font-bold text-indigo-600">$15</span>
                  </div>
                  <span className="ml-1 text-sm text-gray-600">/ 20 Photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Optimized and more creative */}
          <div className="relative w-full max-w-[32rem] mx-auto px-2 sm:px-0">
            {/* Top small images with floating text */}
            <div className="flex justify-center gap-4 sm:gap-6 mb-8">
              <div className="relative transform transition-transform hover:scale-105 duration-300">
                <div className="relative rounded-xl bg-gradient-to-r from-indigo-900 to-blue-700 p-1 shadow-lg hover:shadow-indigo-200/50">
                  <Image
                    src="/content/yours.jpg"
                    alt="You"
                    width={120} // Explicit width
                    height={150} // Explicit height
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <span
                    className="font-light text-lg sm:text-xl text-indigo-600 text-shadow"
                    style={{
                      fontFamily: "Caveat, cursive",
                    }}
                  >
                    You
                  </span>
                </div>
              </div>
              <div className="relative transform transition-transform hover:scale-105 duration-300">
                <div className="relative rounded-xl bg-gradient-to-r from-indigo-900 to-blue-700 p-1 shadow-lg hover:shadow-indigo-200/50">
                  <Image
                    src="/content/you-man.jpg"
                    alt="Yours"
                    width={120} // Explicit width
                    height={120} // Explicit height
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <span
                    className="font-light text-lg sm:text-xl text-indigo-600 text-shadow"
                    style={{
                      fontFamily: "Caveat, cursive",
                    }}
                  >
                    Yours
                  </span>
                </div>
              </div>
            </div>

            {/* Arrows pointing to the bottom image - Fixed with opposite rotations */}
            <div className="flex justify-between px-4 sm:px-16 mb-4 mt-4">
              {/* Left arrow - rotated one way */}
              <svg className="w-12 h-16 sm:w-16 sm:h-20 mt-2 mb-2 fill-indigo-600 transition-transform hover:translate-y-1 duration-300" style={{ transform: "rotate(30deg)" }} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M60.9866 102.011C75.5791 112.188 92.2457 119.614 108.76 118.142C114.825 117.601 120.44 115.34 126.202 113.089C126.708 112.891 126.959 112.318 126.761 111.813C126.564 111.307 125.991 111.055 125.486 111.253C119.899 113.436 114.463 115.655 108.587 116.178C92.3221 117.629 75.9409 110.146 61.6177 100.05C61.6659 99.904 61.7161 99.7581 61.7664 99.6122C62.8717 96.4058 62.1703 91.7303 60.3636 86.8178C57.7429 79.686 52.8573 72.0229 48.4641 67.7902C46.4383 65.8366 44.4768 64.6098 42.8751 64.3519C41.5406 64.1357 40.3951 64.5004 39.5108 65.5345C38.7833 66.3888 38.3673 67.4776 38.2447 68.7539C38.0819 70.4574 38.4477 72.5256 39.2174 74.7761C42.0652 83.1034 50.4316 94.0615 54.9675 97.5779C56.3884 98.6797 57.8334 99.7607 59.3045 100.818C59.0111 101.74 58.7277 102.621 58.38 103.433C57.8696 104.626 57.2244 105.663 56.1352 106.411C54.1255 107.791 51.7158 108.026 49.2519 107.666C45.3068 107.093 41.2271 105.009 38.2186 103.222C21.2968 93.1733 12.9424 75.7346 8.44871 58.2386C3.90274 40.5446 3.30786 22.7699 1.96336 12.2859C1.89302 11.7467 1.39863 11.3638 0.860028 11.4341C0.321425 11.5018 -0.0604183 11.9968 0.00791197 12.5359C1.36045 23.0773 1.9714 40.9432 6.53948 58.7283C11.1598 76.7114 19.8197 94.5877 37.2137 104.918C40.4152 106.817 44.7703 109.005 48.9685 109.617C51.9369 110.047 54.8289 109.698 57.2486 108.036C58.6594 107.067 59.5316 105.749 60.1908 104.21C60.4862 103.519 60.7394 102.78 60.9866 102.011ZM59.9436 98.8516C60.8761 95.976 60.1144 91.8475 58.5147 87.4976C55.9965 80.6445 51.3179 73.2757 47.0975 69.2071C45.6827 67.8449 44.3382 66.8577 43.1504 66.4487C42.2923 66.1518 41.5426 66.1883 41.0101 66.8134C40.3971 67.5323 40.166 68.5143 40.176 69.6604C40.1861 70.981 40.5217 72.5048 41.0824 74.1405C43.8136 82.1266 51.8243 92.6498 56.1734 96.0203C57.4113 96.9788 58.6694 97.9244 59.9436 98.8516Z"></path>
  <path fillRule="evenodd" clipRule="evenodd" d="M127.814 110.052C127.747 110.502 127.522 111.075 127.263 111.677C126.678 113.039 125.846 114.493 125.476 115.196C125.225 115.678 125.41 116.274 125.892 116.527C126.375 116.78 126.97 116.592 127.223 116.11C127.673 115.251 128.774 113.323 129.365 111.727C129.669 110.906 129.832 110.151 129.799 109.606C129.765 109.072 129.548 108.713 129.239 108.458C128.913 108.189 128.409 108.03 127.735 108.051C126.996 108.075 125.941 108.309 124.781 108.395C123.808 108.468 122.745 108.437 121.779 107.952C121.292 107.707 120.699 107.903 120.456 108.39C120.213 108.874 120.408 109.468 120.894 109.71C122.707 110.622 124.765 110.424 126.391 110.19C126.875 110.119 127.476 110.073 127.814 110.052Z"></path>
</svg>


              {/* Right arrow - rotated the opposite way */}
              <svg className="w-12 h-16 sm:w-16 sm:h-20 mt-2 mb-2 fill-indigo-600 transition-transform hover:translate-y-1 duration-300" style={{ transform: "rotate(-30deg) scaleX(-1)" }} viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M60.9866 102.011C75.5791 112.188 92.2457 119.614 108.76 118.142C114.825 117.601 120.44 115.34 126.202 113.089C126.708 112.891 126.959 112.318 126.761 111.813C126.564 111.307 125.991 111.055 125.486 111.253C119.899 113.436 114.463 115.655 108.587 116.178C92.3221 117.629 75.9409 110.146 61.6177 100.05C61.6659 99.904 61.7161 99.7581 61.7664 99.6122C62.8717 96.4058 62.1703 91.7303 60.3636 86.8178C57.7429 79.686 52.8573 72.0229 48.4641 67.7902C46.4383 65.8366 44.4768 64.6098 42.8751 64.3519C41.5406 64.1357 40.3951 64.5004 39.5108 65.5345C38.7833 66.3888 38.3673 67.4776 38.2447 68.7539C38.0819 70.4574 38.4477 72.5256 39.2174 74.7761C42.0652 83.1034 50.4316 94.0615 54.9675 97.5779C56.3884 98.6797 57.8334 99.7607 59.3045 100.818C59.0111 101.74 58.7277 102.621 58.38 103.433C57.8696 104.626 57.2244 105.663 56.1352 106.411C54.1255 107.791 51.7158 108.026 49.2519 107.666C45.3068 107.093 41.2271 105.009 38.2186 103.222C21.2968 93.1733 12.9424 75.7346 8.44871 58.2386C3.90274 40.5446 3.30786 22.7699 1.96336 12.2859C1.89302 11.7467 1.39863 11.3638 0.860028 11.4341C0.321425 11.5018 -0.0604183 11.9968 0.00791197 12.5359C1.36045 23.0773 1.9714 40.9432 6.53948 58.7283C11.1598 76.7114 19.8197 94.5877 37.2137 104.918C40.4152 106.817 44.7703 109.005 48.9685 109.617C51.9369 110.047 54.8289 109.698 57.2486 108.036C58.6594 107.067 59.5316 105.749 60.1908 104.21C60.4862 103.519 60.7394 102.78 60.9866 102.011ZM59.9436 98.8516C60.8761 95.976 60.1144 91.8475 58.5147 87.4976C55.9965 80.6445 51.3179 73.2757 47.0975 69.2071C45.6827 67.8449 44.3382 66.8577 43.1504 66.4487C42.2923 66.1518 41.5426 66.1883 41.0101 66.8134C40.3971 67.5323 40.166 68.5143 40.176 69.6604C40.1861 70.981 40.5217 72.5048 41.0824 74.1405C43.8136 82.1266 51.8243 92.6498 56.1734 96.0203C57.4113 96.9788 58.6694 97.9244 59.9436 98.8516Z"></path>
  <path fillRule="evenodd" clipRule="evenodd" d="M127.814 110.052C127.747 110.502 127.522 111.075 127.263 111.677C126.678 113.039 125.846 114.493 125.476 115.196C125.225 115.678 125.41 116.274 125.892 116.527C126.375 116.78 126.97 116.592 127.223 116.11C127.673 115.251 128.774 113.323 129.365 111.727C129.669 110.906 129.832 110.151 129.799 109.606C129.765 109.072 129.548 108.713 129.239 108.458C128.913 108.189 128.409 108.03 127.735 108.051C126.996 108.075 125.941 108.309 124.781 108.395C123.808 108.468 122.745 108.437 121.779 107.952C121.292 107.707 120.699 107.903 120.456 108.39C120.213 108.874 120.408 109.468 120.894 109.71C122.707 110.622 124.765 110.424 126.391 110.19C126.875 110.119 127.476 110.073 127.814 110.052Z"></path>
</svg>

            </div>

            {/* Bottom landscape image - Enhanced with animations and effects */}
            <div className="relative mt-6 transform transition-all hover:scale-[1.02] duration-500 group">
              <div className="relative p-2 rounded-xl bg-gradient-to-r from-indigo-900 to-blue-700 shadow-xl hover:shadow-indigo-300/50 transition-all duration-500">
                <Image
                  src="/content/both-together.jpg"
                  alt="You both Together"
                  width={600} // Explicit width
                  height={300} // Explicit height
                  className="rounded-xl w-full h-auto"
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-max">
                  <div className="bg-gradient-to-r from-indigo-800 to-blue-700 px-6 py-2 rounded-full shadow-lg border border-indigo-900/20">
                    <span className="text-base font-medium text-white">You both, Together</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Added decorative elements with pulse animation */}
          </div>
        </div>
      </div>
    </section>
  );
}


import Image from 'next/image'

export default function ShowCase() {
  return (
 <section className="bg-black py-12 min-h-screen">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col items-center max-w-4xl mb-4 mx-auto text-center">
            <h2 className="text-4xl sm:text-6xl max-w-4xl mx-auto font-bold leading-[1.1] mb-4 font-[var(--font-inter-tight)]">
              <span className="text-white">
                Turn Your Casual Selfies Into Stunning
              </span>
              <span className="text-[#ff6f00] ml-2">
                AI-Generated Photos
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Our AI doesn't just apply a filter. It learns your unique features from your selfies and then generates brand new, hyper-realistic photos in any style you can imagine. This is the magic of generative AI.
            </p>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <div className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/content/training5.jpg"
                  alt="Selfie 1"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/content/training6.jpg"
                  alt="Selfie 2"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/content/training7.jpg"
                  alt="Selfie 3"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
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

            <div className="relative w-full max-w-xl aspect-[3/4] rounded-lg overflow-hidden">
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
  )
}
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Expand, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useInView } from "react-intersection-observer"

// Sample gallery data
const galleryImages = [
  {
    id: 1,
    title: "Sunset Romance",
    description: "A romantic moment at sunset, warm and intimate.",
    image: "/content/romantic-sunset.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Urban Adventure",
    description: "A couple exploring vibrant city streets.",
    image: "/content/urban-vibe.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Party Time",
    description: "A lively celebration with energy and smiles.",
    image: "/content/party-time.jpg",
    featured: true,
  },
  {
    id: 4,
    title: "Cafe Date",
    description: "A cozy coffee date with casual vibes.",
    image: "/content/caffee-date.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Formal Evening",
    description: "Elegantly dressed for a special evening.",
    image: "/content/formal-evening.jpg",
    featured: true,
  },
  {
    id: 6,
    title: "Park Picnic",
    description: "A laid-back picnic in the greenery.",
    image: "/content/togetherselfie2.jpg",
    featured: false,
  },
  {
    id: 7,
    title: "Wedding Vibe",
    description: "A joyful wedding moment, classic and timeless.",
    image: "/content/wedding-vibe.jpg",
    featured: true,
  },
  {
    id: 8,
    title: "Romantic Night",
    description: "A dreamy night, dancing under the stars.",
    image: "/content/romantic-night.jpg",
    featured: false,
  },
]


export default function PhotoGallery() {
  const [viewingImage, setViewingImage] = useState<null | (typeof galleryImages)[0]>(null)
  const [isHovering, setIsHovering] = useState<number | null>(null)



  return (
    <div className="dark min-h-screen bg-gradient-to-b from-background to-background/80">
      {/*  Section with Featured Image Carousel */}
    

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl mx-auto font-bold mb-6 text-white"> Create Captivating Moments with Unrealshot AI</h2>
            <p className="text-gray-300 text-lg"> A curated collection of extraordinary ai couple photographs that tell stories</p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {galleryImages.map((image, i) => {
              return (
                <GalleryItem
                  key={image.id}
                  image={image}
                  i={i}
                  setViewingImage={setViewingImage}
                  isHovering={isHovering}
                  setIsHovering={setIsHovering}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {viewingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setViewingImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={viewingImage.image || "/placeholder.svg"}
                alt={viewingImage.title}
                className="w-full h-full object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/70 text-white rounded-full hover:bg-black/90"
                onClick={() => setViewingImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-2">{viewingImage.title}</h2>
                <p className="text-white/90">{viewingImage.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GalleryItem({
  image,
  i,
  setViewingImage,
  isHovering,
  setIsHovering,
}: {
  image: (typeof galleryImages)[0]
  i: number
  setViewingImage: Function
  isHovering: number | null
  setIsHovering: Function
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cardVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <motion.div
      ref={ref}
      key={image.id}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovering(image.id)}
      onMouseLeave={() => setIsHovering(null)}
    >
      <Card className="overflow-hidden h-full flex flex-col bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-purple-500/50 transition-all duration-300 shadow-md hover:shadow-purple-900/20 hover:shadow-lg">
        <div className="relative overflow-hidden aspect-[7/9]">
          <img
            src={image.image || "/placeholder.svg"}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{
              transform: isHovering === image.id ? "scale(1.1)" : "scale(1)",
            }}
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 transition-opacity duration-300 z-10"
            style={{
              opacity: isHovering === image.id ? 1 : 0
            }}
            onClick={() => setViewingImage(image)}
          >
            <Expand className="h-4 w-4" />
          </Button>
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300"
            style={{
              opacity: isHovering === image.id ? 1 : 0
            }}
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium text-lg mb-1 text-white">{image.title}</h3>
          <p className="text-sm text-gray-400">{image.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

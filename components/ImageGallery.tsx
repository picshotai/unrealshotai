"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, Eye, Trash2, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FullImageOverlay from "./FullImageOverlay"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
import { ImagePlaceholder } from "./ImagePlaceholder"

interface Image {
  id: number
  image_url: string
  promptId: string
  user_id: string
  isLoading?: boolean
  created_at: string
  source: "prompts" | "images"
}

export default function ImageGallery() {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{ id: number; promptId: string; source: string } | null>(null)
  const [expiredImagesCount, setExpiredImagesCount] = useState<number>(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchImages() {
      try {
        setIsLoading(true)

        // Read cache for immediate UX
        const CACHE_KEY = "userImages"
        const cachedData = localStorage.getItem(CACHE_KEY)
        const cachedImages: Image[] = cachedData ? JSON.parse(cachedData) : []
        if (cachedImages.length > 0) {
          setImages(cachedImages.map((img) => ({ ...img, isLoading: true })))
        }

        // Fetch latest images
        const resp = await fetch("/api/download")
        if (!resp.ok) {
          // Treat auth/billing-related statuses as an expected empty gallery state
          if (resp.status === 401 || resp.status === 403 || resp.status === 402) {
            setImages([])
            return
          }

          // Otherwise fall back to cache and notify gently
          if (cachedImages.length > 0) {
            setImages(cachedImages.map((img) => ({ ...img, isLoading: true })))
          }
          toast({
            title: "Gallery temporarily unavailable",
            description: "We couldn’t refresh your images. Showing any cached items.",
          })
          return
        }

        const data = await resp.json()

        const promptImages: Image[] = (data?.prompts || []).map((p: any) => ({
          id: p.id,
          image_url: p.output,
          promptId: String(p.id),
          user_id: p.user_id,
          created_at: p.created_at,
          source: "prompts",
          isLoading: true,
        }))

        const galleryImages: Image[] = (data?.images || []).map((img: any) => ({
          id: img.id,
          image_url: img.image_url,
          promptId: String(img.promptId),
          user_id: img.user_id,
          created_at: img.created_at,
          source: "images",
          isLoading: true,
        }))

        // Merge with cache and sort by created_at desc
        const mergedMap = new Map<number, Image>()
        for (const img of [...promptImages, ...galleryImages, ...cachedImages]) {
          mergedMap.set(img.id, img)
        }
        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        setImages(merged)
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged))
      } catch (error) {
        console.error("Failed to fetch images:", error)
        // Fall back to cache if available and notify
        const cachedData = localStorage.getItem("userImages")
        if (cachedData) {
          const cachedImages: Image[] = JSON.parse(cachedData)
          setImages(cachedImages.map((img) => ({ ...img, isLoading: true })))
        }
        toast({
          title: "Network error",
          description: "Couldn’t load your gallery right now. Showing any cached items.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [router, toast])

  useEffect(() => {
    if (expiredImagesCount > 0) {
      toast({
        title: "Expired Images Removed",
        description: `${expiredImagesCount} image${expiredImagesCount > 1 ? "s" : ""} expired and been removed from your gallery.`,
      })
      setExpiredImagesCount(0)
    }
  }, [expiredImagesCount, toast])

  const handleImageLoad = (id: number) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, isLoading: false } : img)))
  }

  const handleImageError = async (image: Image) => {
    try {
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(image.image_url)}`)
      if (response.status === 404) {
        const deleteResponse = await fetch(`/api/delete-image?id=${image.id}&promptId=${image.promptId}&source=${image.source}`, {
          method: "DELETE",
        })
        const result = await deleteResponse.json()

        if (!deleteResponse.ok || result.error) {
          console.error("Error deleting expired image from Supabase:", result.error || "Unknown error")
          toast({
            title: "Error",
            description: "Failed to clean up expired image from database. Please try again.",
          })
          return
        }

        toast({
          title: "Expired Image Removed",
          description: `Successfully deleted expired image with id: ${image.id} from Supabase`,
        })
        setImages((prevImages) => prevImages.filter((img) => img.id !== image.id))
        updateCacheAfterDelete(image.id)
        setExpiredImagesCount((count) => count + 1)
      } else {
        toast({
          title: "Image Unavailable",
          description: "Image is no longer available. It has been removed from the gallery.",
        })
        setImages((prevImages) => prevImages.filter((img) => img.id !== image.id))
        updateCacheAfterDelete(image.id)
      }
    } catch (error) {
      console.error("Error checking image availability:", error)
      toast({
        title: "Error",
        description: "Failed to check image availability. Please try again.",
      })
    }
  }

  const handleDownload = async (imageUrl: string, promptId: string) => {
    try {
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}&download=true`)
      if (!response.ok) throw new Error("Failed to download image")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `generated-image-${promptId.slice(0, 20)}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
      })
    }
  }

  const handleViewFullImage = (imageUrl: string) => {
    setFullImageUrl(imageUrl)
  }

  const handleDeleteClick = (id: number, promptId: string, source: string) => {
    setImageToDelete({ id, promptId, source })
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return

    setDeletingImageId(imageToDelete.id)
    try {
      const response = await fetch(`/api/delete-image?id=${imageToDelete.id}&promptId=${imageToDelete.promptId}&source=${imageToDelete.source}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to delete image")
      }

      toast({
        title: "Image Deleted",
        description: "The image has been removed from your gallery.",
      })
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id))
      updateCacheAfterDelete(imageToDelete.id)
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
      })
    } finally {
      setDeletingImageId(null)
      setShowDeleteDialog(false)
      setImageToDelete(null)
    }
  }

  const updateCacheAfterDelete = (id: number) => {
    const cachedData = localStorage.getItem("userImages")
    if (cachedData) {
      const cachedImages: Image[] = JSON.parse(cachedData)
      const updatedCache = cachedImages.filter((img) => img.id !== id)
      localStorage.setItem("userImages", JSON.stringify(updatedCache))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="mx-auto max-w-3xl text-center py-12 px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold">Ready for Your Stunning AI Headshots?</h2>
    
    <p className="mt-2 text-muted-foreground">
        You haven't generated any photos yet. Your professional AI photoshoots will appear right here.
    </p>

    <div className="mt-6 flex items-center justify-center gap-4">
      <div className="w-[105px] h-[130px] rounded-md overflow-hidden shadow-sm">
        <img src="/landing/demo-gallery.webp" alt="Before example" className="w-full object-fit" />
        <p className="mt-1 text-xs text-muted-foreground">Before</p>
      </div>
      <div className="w-[105px] h-[130px] rounded-md overflow-hidden shadow-sm">
        <img src="/landing/black-swan1.webp" alt="After example" className="w-full object-fit" />
        <p className="mt-1 text-xs text-muted-foreground">After</p>
      </div>
    </div>

    <div className="mt-8">
      <Button asChild size="lg" className="px-6">
        <Link href="/packs">Get My AI Photoshoot Now</Link>
      </Button>
      <p className="mt-3 text-sm text-muted-foreground">
        Packs start at just $9.99 for 20 photos — that’s less than $0.50 each!
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Backed by our Quality & Performance Guarantee.</p>
    </div>
</div>
    )
  }

  return (
    <>
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images
          .filter((image) => image.image_url)
          .map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="break-inside-avoid relative group"
            >
              <>
                {image.isLoading && <ImagePlaceholder />}
                <img
                  src={`/api/proxy-image?url=${encodeURIComponent(image.image_url)}`}
                  alt="Generated image"
                  className={`w-full h-auto rounded-lg ${image.isLoading ? "hidden" : ""}`}
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image)}
                />
                <div className="absolute inset-0 bg-transparent rounded-lg flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleViewFullImage(image.image_url)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </div>
                  <div className="flex justify-between items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleDeleteClick(image.id, image.promptId, image.source)}
                      disabled={deletingImageId === image.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deletingImageId === image.id ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleDownload(image.image_url, image.promptId)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </div>
              </>
            </motion.div>
          ))}
      </div>
      {fullImageUrl && (
        <FullImageOverlay
          imageUrl={`/api/proxy-image?url=${encodeURIComponent(fullImageUrl)}`}
          onClose={() => setFullImageUrl(null)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
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
  id: number;
  image_url: string;
  promptId: string;
  user_id: string;
  isLoading?: boolean;
  created_at: string;
  source: "prompts" | "images";
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
    const fetchImages = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem("userImages")
        const lastFetched = localStorage.getItem("lastFetched")
        let cachedImages: Image[] = cachedData ? JSON.parse(cachedData) : []

        // Fetch new images since last fetch
        const url = lastFetched
          ? `/api/get-user-images?since=${encodeURIComponent(lastFetched)}`
          : "/api/get-user-images"
        const response = await fetch(url)

        if (response.status === 401) {
          router.push("/login")
          return
        }
        if (!response.ok) {
          throw new Error("Failed to fetch images")
        }

        const data = await response.json()
        const newImages = data.images.map((img: Image) => ({ ...img, isLoading: true }))

        // Merge new images with cached ones, avoiding duplicates, and sort by created_at
        const updatedImages = [
          ...newImages,
          ...cachedImages.filter(
            (cachedImg) => !newImages.some((newImg: Image) => newImg.id === cachedImg.id)
          ),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setImages(updatedImages)

        // Update cache
        localStorage.setItem("userImages", JSON.stringify(updatedImages))
        localStorage.setItem("lastFetched", new Date().toISOString())
      } catch (error) {
        console.error("Error fetching images:", error)
        toast({
          title: "Error",
          description: "Failed to fetch images. Please try again.",
          variant: "destructive",
        })
        // Fall back to cached images if fetch fails
        const cachedData = localStorage.getItem("userImages")
        if (cachedData) {
          setImages(JSON.parse(cachedData).map((img: Image) => ({ ...img, isLoading: true })))
        }
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
        description: `${expiredImagesCount} image${expiredImagesCount > 1 ? "s" : ""} ha${expiredImagesCount > 1 ? "ve" : "s"} expired and been removed from your gallery.`,
        variant: "default",
      })
      setExpiredImagesCount(0) // Reset count after showing toast
    }
  }, [expiredImagesCount, toast])

  const handleImageLoad = (id: number) => {
    setImages((prevImages) => prevImages.map((img) => (img.id === id ? { ...img, isLoading: false } : img)))
  }

  const handleImageError = async (image: Image) => {
    try {
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(image.image_url)}`)
      if (response.status === 404) {
        console.log(`Image not found (404), deleting image with id: ${image.id}, promptId: ${image.promptId}, source: ${image.source}`)
        const deleteResponse = await fetch(`/api/delete-image?id=${image.id}&promptId=${image.promptId}&source=${image.source}`, {
          method: "DELETE",
        })
        const result = await deleteResponse.json()

        console.log("Delete response for expired image:", result)

        if (!deleteResponse.ok || result.error) {
          console.error("Error deleting expired image from Supabase:", result.error || "Unknown error")
          toast({
            title: "Error",
            description: "Failed to clean up expired image from database. Please try again.",
            variant: "destructive",
          })
          return // Do not remove from state/cache if deletion fails
        }

        console.log(`Successfully deleted expired image with id: ${image.id} from Supabase`)
        setImages((prevImages) => prevImages.filter((img) => img.id !== image.id))
        updateCacheAfterDelete(image.id)
        setExpiredImagesCount((count) => count + 1)
      } else {
        console.log("Image unavailable for another reason, removing from gallery")
        setImages((prevImages) => prevImages.filter((img) => img.id !== image.id))
        updateCacheAfterDelete(image.id)
      }
    } catch (error) {
      console.error("Error checking image availability:", error)
      toast({
        title: "Error",
        description: "Failed to check image availability. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (imageUrl: string, promptId: string) => {
    try {
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}&download=true`)
      if (!response.ok) {
        throw new Error("Failed to download image")
      }
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
        variant: "destructive",
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

      console.log("Delete response for manual deletion:", result)

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to delete image")
      }

      setImages((prevImages) => prevImages.filter((img) => img.id !== imageToDelete.id))
      updateCacheAfterDelete(imageToDelete.id)
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
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
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground mb-4">No images found in your gallery.</p>
        <Button asChild>
          <Link href="/generate-image">
            <Camera className="h-4 w-4 mr-2" />
            Generate an Image
          </Link>
        </Button>
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
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-4">
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
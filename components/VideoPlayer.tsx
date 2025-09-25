"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  url: string
  title?: string
  description?: string
  poster?: string
}

export default function VideoPlayer({ url, title, description, poster }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(value[0])
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 2000)
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)
      const handleLoadedData = () => setIsLoaded(true)
      const handleEnded = () => {
        setIsPlaying(false)
        setShowControls(true)
      }

      video.addEventListener("play", handlePlay)
      video.addEventListener("pause", handlePause)
      video.addEventListener("loadeddata", handleLoadedData)
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("ended", handleEnded)

      return () => {
        video.removeEventListener("play", handlePlay)
        video.removeEventListener("pause", handlePause)
        video.removeEventListener("loadeddata", handleLoadedData)
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("ended", handleEnded)
      }
    }
  }, []) // Removed videoRef.current as a dependency

  return (
    <div className="w-full rounded-xl overflow-hidden bg-card shadow-lg">
      <div
        ref={containerRef}
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(true)}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="w-16 h-16 rounded-full bg-primary/20 p-2 animate-pulse">
              <div className="w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={url}
          poster={poster}
          className="w-full aspect-video object-cover bg-black"
          playsInline
          preload="metadata"
          onClick={togglePlay}
        />

        {/* Video Controls */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0",
            "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
          )}
        >
          {/* Progress Bar */}
          <div className="px-4 py-0">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="cursor-pointer"
            />
          </div>

          <div className="p-4 flex items-center gap-2">
            {/* Play/Pause Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            {/* Replay Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white"
              onClick={handleReplay}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            {/* Time Display */}
            {videoRef.current && (
              <span className="text-white text-sm">
                {formatTime(videoRef.current.currentTime)} / {formatTime(videoRef.current.duration || 0)}
              </span>
            )}

            <div className="flex-1" />

            {/* Volume Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 hover:text-white"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Big Play Button Overlay */}
        {!isPlaying && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            <div className="rounded-full bg-primary/20 p-4 backdrop-blur-sm transition-transform hover:scale-110">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      {(title || description) && (
        <div className="p-6 space-y-3">
          {title && <h3 className="text-xl font-semibold tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
        </div>
      )}
    </div>
  )
}


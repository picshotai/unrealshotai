"use client"

import PhotoCoachModal from "@/components/PhotoCoachModal"
import { useUserStore } from "@/stores/userStore"
import { useEffect, useRef, useState } from "react"

export default function PhotoCoachWrapper() {
  const { profile, loading } = useUserStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const hasOpened = useRef(false)

  // Auto-open the modal when user first enters dashboard and hasn't completed onboarding
  useEffect(() => {
    if (!loading && profile && !profile.has_completed_onboarding && !hasOpened.current) {
      hasOpened.current = true
      setIsModalOpen(true)
    }
  }, [profile, loading])

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const handleComplete = () => {
    setIsModalOpen(false)
    // The server-side completion is handled in PhotoCoachModal
  }

  // Don't render if still loading or user has completed onboarding
  if (loading || !profile || profile.has_completed_onboarding || !isModalOpen) {
    return null
  }

  return (
    <PhotoCoachModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  )
}
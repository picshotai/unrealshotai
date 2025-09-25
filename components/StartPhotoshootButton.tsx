'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PhotoCoachModal from '@/components/PhotoCoachModal'
import { usePhotoCoach } from '@/hooks/use-photo-coach'

interface StartPhotoshootButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  href?: string
}

export default function StartPhotoshootButton({ 
  children, 
  className, 
  variant = 'default',
  size = 'default',
  href = '/login'
}: StartPhotoshootButtonProps) {
  const { hasCompletedOnboarding, isModalOpen, openPhotoCoach, closePhotoCoach, completePhotoCoach } = usePhotoCoach()

  const handleClick = (e: React.MouseEvent) => {
    if (!hasCompletedOnboarding) {
      e.preventDefault()
      openPhotoCoach()
    }
    // If they've completed onboarding, let the Link handle navigation
  }

  return (
    <>
      <Link 
        href={href}
        onClick={handleClick}
        className={className}
      >
        <Button variant={variant} size={size}>
          {children}
        </Button>
      </Link>

      <PhotoCoachModal
        isOpen={isModalOpen}
        onClose={closePhotoCoach}
        onComplete={completePhotoCoach}
      />
    </>
  )
}
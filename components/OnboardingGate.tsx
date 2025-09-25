'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import PhotoCoachWrapper from '@/components/dashboard/PhotoCoachWrapper'

interface OnboardingGateProps {
  children: React.ReactNode
}

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const { profile, loading, fetchProfile } = useUserStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Always fetch profile on mount to ensure we have latest data
    console.log('OnboardingGate: Fetching profile...')
    fetchProfile()
  }, [])

  // Debug logging
  useEffect(() => {
    console.log('OnboardingGate: Profile state:', { profile, loading, isClient })
  }, [profile, loading, isClient])

  // Show loading state while fetching initial data
  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If no profile exists, we need to create one
  if (!profile) {
    // This shouldn't happen with the trigger, but let's handle it gracefully
    console.log('No profile found, user may need to re-login')
    return <>{children}</>
  }

  // If user exists but hasn't completed onboarding, show the modal
  if (profile && !profile.has_completed_onboarding) {
    return (
      <div className="min-h-screen bg-background">
        <PhotoCoachWrapper />
      </div>
    )
  }

  // If user exists and has completed onboarding, show the dashboard
  return <>{children}</>
}
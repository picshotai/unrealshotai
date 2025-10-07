'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, LogIn } from 'lucide-react'
import Link from 'next/link'

import type { Metadata } from "next"
import { StructuredData } from "@/components/seo/StructuredData"

export const metadata: Metadata = {
  title: "Error - UnrealShot AI",
  description: "Oops! Something went wrong. Please try again or go home.",
}

const errorPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Error - UnrealShot AI",
  "description": "Oops! Something went wrong. Please try again or go home.",
  "url": "https://www.unrealshot.com/error",
}

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  
  // Generic error messages to avoid exposing sensitive information
  const getErrorMessage = (message: string | null) => {
    if (!message) {
      return 'An unexpected error occurred. Please try again.'
    }
    
    // Map specific error types to generic messages
    if (message.includes('rate limit') || message.includes('Too many')) {
      return 'Too many attempts. Please wait before trying again.'
    }
    
    if (message.includes('auth') || message.includes('login') || message.includes('sign')) {
      return 'Authentication failed. Please try signing in again.'
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return 'Connection error. Please check your internet and try again.'
    }
    
    // Default generic message for any other errors
    return 'Something went wrong. Please try again or contact support.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <StructuredData data={errorPageSchema} />
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage(message)}
        </p>
        
        <div className="space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full" variant="default">
              <LogIn className="h-4 w-4 mr-2" />
              Try Signing In Again
            </Button>
          </Link>
          
          <Link href="/" className="block">
            <Button className="w-full" variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}
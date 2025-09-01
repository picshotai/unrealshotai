import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { authRateLimit, getClientIP, checkRateLimit } from '@/utils/rate-limit'
import { isRateLimitingEnabled } from '@/config/security'

export async function GET(request: NextRequest) {
  // Apply rate limiting only if enabled
  if (isRateLimitingEnabled()) {
    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(clientIP, authRateLimit)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() || '0',
          }
        }
      )
    }
  }
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        // Log error for debugging without exposing details
        console.error('Auth exchange failed:', error.code || 'UNKNOWN_ERROR')
        return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
      }
      
      if (data?.user) {
        // Log successful auth without user details
        console.log('Authentication successful')
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error('No user data returned after exchange')
        return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
      }
    } catch (err) {
      console.error('Auth exchange error:', err instanceof Error ? err.message : 'Unknown error')
      return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
    }
  }

  // Return generic error for missing code
  return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}
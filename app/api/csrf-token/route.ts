import { NextRequest, NextResponse } from 'next/server'
import { getClientCSRFToken } from '@/utils/csrf'

export async function GET(request: NextRequest) {
  try {
    const token = await getClientCSRFToken()
    
    return NextResponse.json(
      { token },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to generate CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate security token' },
      { status: 500 }
    )
  }
}
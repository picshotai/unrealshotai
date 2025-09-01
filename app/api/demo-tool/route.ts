import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { validateCSRFToken } from '@/utils/csrf'
import { checkRateLimit, apiRateLimit, getClientIP } from '@/utils/rate-limit'
import { isRateLimitingEnabled } from '@/config/security'

// Demo data for the tool
const DEMO_DATA = [
  { id: 1, name: 'Secure User Management', status: 'active', lastUpdated: '2024-01-15' },
  { id: 2, name: 'Payment Processing', status: 'pending', lastUpdated: '2024-01-14' },
  { id: 3, name: 'Data Analytics', status: 'active', lastUpdated: '2024-01-13' },
  { id: 4, name: 'Email Notifications', status: 'inactive', lastUpdated: '2024-01-12' },
  { id: 5, name: 'File Storage', status: 'active', lastUpdated: '2024-01-11' },
]



/**
 * GET /api/demo-tool
 * Demonstrates a secure API endpoint with authentication and rate limiting
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authentication Check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Rate Limiting (if enabled)
    if (isRateLimitingEnabled()) {
      const clientIP = getClientIP(request)
      const rateLimitResult = await checkRateLimit(`demo-tool:${user.id}:${clientIP}`, apiRateLimit)
      
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 60
          },
          { 
            status: 429,
            headers: {
              'Retry-After': rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString() : '60',
              'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '100',
              'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
              'X-RateLimit-Reset': rateLimitResult.reset ? new Date(rateLimitResult.reset).toISOString() : new Date(Date.now() + 60000).toISOString(),
            }
          }
        )
      }
    }

    // 3. Business Logic - Fetch demo data
    const searchQuery = request.nextUrl.searchParams.get('search')
    const statusFilter = request.nextUrl.searchParams.get('status')
    
    let filteredData = [...DEMO_DATA]
    
    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filteredData = filteredData.filter(item => item.status === statusFilter)
    }

    // Transform data to match frontend interface
    const transformedData = filteredData.map(item => ({
      id: item.id.toString(),
      title: item.name,
      description: `Status: ${item.status}`,
      created_at: item.lastUpdated
    }))

    // 4. Success Response with Security Headers
    return NextResponse.json(
      {
        success: true,
        data: transformedData,
        meta: {
          total: filteredData.length,
          user: {
            id: user.id,
            email: user.email,
          },
          timestamp: new Date().toISOString(),
          securityFeatures: {
            authenticated: true,
            rateLimited: isRateLimitingEnabled(),
            csrfProtected: 'N/A for GET requests',
          }
        }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      }
    )
  } catch (error) {
    console.error('Demo tool API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/demo-tool
 * Demonstrates a secure API endpoint with CSRF protection, authentication, and rate limiting
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication Check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Rate Limiting (if enabled)
    if (isRateLimitingEnabled()) {
      const clientIP = getClientIP(request)
      const rateLimitResult = await checkRateLimit(`demo-tool-post:${user.id}:${clientIP}`, apiRateLimit)
      
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 60
          },
          { status: 429 }
        )
      }
    }

    // 3. Parse Request Body
    const body = await request.json()
    const { csrfToken, action, itemId, data: itemData } = body

    // 4. CSRF Protection
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing' },
        { status: 400 }
      )
    }

    const isValidCSRF = await validateCSRFToken(csrfToken)
    if (!isValidCSRF) {
      return NextResponse.json(
        { error: 'Security validation failed. Please refresh the page and try again.' },
        { status: 403 }
      )
    }

    // 5. Input Validation
    if (!action || !['create', 'update', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action specified' },
        { status: 400 }
      )
    }

    // 6. Business Logic - Simulate operations
    let result
    switch (action) {
      case 'create':
        if (!itemData?.title) {
          return NextResponse.json(
            { error: 'Item title is required' },
            { status: 400 }
          )
        }
        const newItem = {
          id: Date.now().toString(),
          title: itemData.title,
          description: itemData.description || '',
          created_at: new Date().toISOString(),
          createdBy: user.email,
        }
        result = newItem
        break
        
      case 'update':
        if (!itemId) {
          return NextResponse.json(
            { error: 'Item ID is required for update' },
            { status: 400 }
          )
        }
        result = {
          id: itemId,
          ...itemData,
          lastUpdated: new Date().toISOString().split('T')[0],
          updatedBy: user.email,
        }
        break
        
      case 'delete':
        if (!itemId) {
          return NextResponse.json(
            { error: 'Item ID is required for deletion' },
            { status: 400 }
          )
        }
        result = {
          id: itemId,
          deleted: true,
          deletedBy: user.email,
          deletedAt: new Date().toISOString(),
        }
        break
    }

    // 7. Success Response
    return NextResponse.json(
      {
        success: true,
        action,
        result,
        meta: {
          user: {
            id: user.id,
            email: user.email,
          },
          timestamp: new Date().toISOString(),
          securityFeatures: {
            authenticated: true,
            csrfProtected: true,
            rateLimited: isRateLimitingEnabled(),
          }
        }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      }
    )
  } catch (error) {
    console.error('Demo tool POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/demo-tool
 * Alternative update endpoint demonstrating different HTTP methods
 */
export async function PUT(request: NextRequest) {
  // Redirect to POST with update action for simplicity
  const body = await request.json()
  const modifiedBody = { ...body, action: 'update' }
  
  const modifiedRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(modifiedBody),
  })
  
  return POST(modifiedRequest)
}

/**
 * DELETE /api/demo-tool
 * Demonstrates secure DELETE endpoint
 */
export async function DELETE(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get('id')
  const csrfToken = request.headers.get('x-csrf-token')
  
  if (!itemId) {
    return NextResponse.json(
      { error: 'Item ID is required' },
      { status: 400 }
    )
  }
  
  const modifiedBody = {
    action: 'delete',
    itemId: parseInt(itemId),
    csrfToken,
  }
  
  const modifiedRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(modifiedBody),
  })
  
  return POST(modifiedRequest)
}
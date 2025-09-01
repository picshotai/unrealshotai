# Demo Tool Security Implementation

This document explains the comprehensive security features implemented in the Demo Tool, which serves as a reference implementation for secure API development in this boilerplate.

## Overview

The Demo Tool (`/demo-tool`) demonstrates how to build secure, production-ready API endpoints with multiple layers of protection. It showcases best practices for authentication, CSRF protection, and rate limiting.

## Security Features Implemented

### 1. Authentication

**Implementation**: Server-side session validation using Supabase Auth

```typescript
// In API route
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()

if (error || !user) {
  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  )
}
```

**Benefits**:
- Prevents unauthorized access to sensitive operations
- Validates session tokens on every request
- Automatic session management through Supabase

### 2. CSRF Protection

**Implementation**: Token-based CSRF validation for state-changing operations

```typescript
// In POST endpoint
const formData = await request.formData()
const csrfValidation = await requireCSRFToken(formData)

if (!csrfValidation.success) {
  return NextResponse.json(
    { error: 'Security validation failed. Please refresh the page and try again.' },
    { status: 403 }
  )
}
```

**Frontend Integration**:
```tsx
// In React component
<CSRFProvider>
  <form onSubmit={handleSubmit}>
    <CSRFInput /> {/* Automatically adds CSRF token */}
    {/* Other form fields */}
  </form>
</CSRFProvider>
```

**Benefits**:
- Prevents Cross-Site Request Forgery attacks
- Validates that requests originate from your application
- Seamless integration with React forms

### 3. Rate Limiting

**Implementation**: Configurable rate limiting using Upstash Redis

```typescript
// Rate limiting check
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
```

**Benefits**:
- Prevents API abuse and DoS attacks
- Configurable limits per endpoint
- Proper HTTP headers for client handling
- User-specific rate limiting

## API Endpoints

### GET `/api/demo-tool`

**Security Layers**:
1. ✅ Authentication required
2. ✅ Rate limiting (100 requests per 15 minutes)
3. ❌ CSRF protection (not needed for GET requests)

**Purpose**: Retrieve demo items for authenticated users

### POST `/api/demo-tool`

**Security Layers**:
1. ✅ Authentication required
2. ✅ CSRF protection
3. ✅ Rate limiting (100 requests per 15 minutes)

**Purpose**: Create, update, or delete demo items

**Supported Actions**:
- `create`: Add new demo item
- `update`: Modify existing item
- `delete`: Remove item

## Frontend Security Features

### 1. Protected Route

The demo tool page is located in `/app/(protected)/demo-tool/page.tsx`, ensuring it's only accessible to authenticated users.

### 2. CSRF Integration

The component uses `CSRFProvider` and `CSRFInput` for seamless CSRF protection:

```tsx
<CSRFProvider>
  <form onSubmit={handleSubmit}>
    <CSRFInput /> {/* Automatically handles token */}
    {/* Form fields */}
  </form>
</CSRFProvider>
```

### 3. Rate Limit Display

The UI shows current rate limit status to users:

```tsx
{rateLimitInfo.limit && (
  <Card>
    <CardHeader>
      <CardTitle>Rate Limit Status</CardTitle>
    </CardHeader>
    <CardContent>
      <div>Limit: {rateLimitInfo.limit} requests</div>
      <div>Remaining: {rateLimitInfo.remaining}</div>
      <div>Resets in: {formatResetTime(rateLimitInfo.reset)}</div>
    </CardContent>
  </Card>
)}
```

### 4. Error Handling

Comprehensive error handling for security failures:

```tsx
if (response.status === 429) {
  setError(`Rate limit exceeded. Please try again in ${result.retryAfter || 60} seconds.`)
} else if (response.status === 403) {
  setError('Security validation failed. Please refresh the page and try again.')
} else {
  setError(result.error || 'An error occurred')
}
```

## Configuration

### Rate Limiting

Rate limits are configured in `/config/security.ts`:

```typescript
export const getRateLimitConfig = () => ({
  api: {
    requests: 100,
    window: '15 m', // 15 minutes
  },
  auth: {
    requests: 10,
    window: '15 m',
  },
})
```

### CSRF Settings

CSRF tokens are automatically managed with secure defaults:
- HttpOnly cookies for server validation
- Client-accessible cookies for form submission
- Automatic token refresh
- Secure cookie settings in production

## Best Practices Demonstrated

1. **Defense in Depth**: Multiple security layers working together
2. **Fail Secure**: Default to denying access when security checks fail
3. **User Experience**: Security doesn't compromise usability
4. **Monitoring**: Rate limit headers for client-side handling
5. **Error Messages**: Informative but not revealing sensitive information
6. **Type Safety**: Full TypeScript support for all security functions

## Usage in Your Application

To implement similar security in your own endpoints:

1. **Copy the API structure** from `/app/api/demo-tool/route.ts`
2. **Use the security utilities**:
   - `requireCSRFToken()` for CSRF protection
   - `checkRateLimit()` for rate limiting
   - `createClient()` for authentication
3. **Wrap forms** with `CSRFProvider` and add `CSRFInput`
4. **Handle errors** appropriately in your UI
5. **Configure rate limits** in `/config/security.ts`

## Testing Security

To verify the security implementation:

1. **Authentication**: Try accessing `/api/demo-tool` without logging in
2. **CSRF**: Submit forms without CSRF tokens
3. **Rate Limiting**: Make rapid requests to trigger limits
4. **Error Handling**: Verify appropriate error messages

This demo tool serves as a complete reference for implementing secure APIs in your Next.js applications.
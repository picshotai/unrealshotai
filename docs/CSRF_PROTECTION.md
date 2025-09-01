# CSRF Protection Documentation

This documentation explains how to implement Cross-Site Request Forgery (CSRF) protection for forms and input components throughout your application.

## Overview

The CSRF protection system consists of:
- **Server-side token generation and validation**
- **Client-side token management via React Context**
- **Reusable components for easy integration**

## Quick Start

For any new form that submits to a server action, follow these 3 simple steps:

### 1. Wrap Your Page/Component with CSRFProvider

```tsx
import { CSRFProvider } from '@/components/csrf-provider'

export default function YourPage() {
  return (
    <CSRFProvider>
      {/* Your page content */}
      <YourForm />
    </CSRFProvider>
  )
}
```

### 2. Add CSRFInput to Your Form

```tsx
import { CSRFInput } from '@/components/csrf-provider'

function YourForm() {
  return (
    <form action={yourServerAction}>
      <CSRFInput /> {/* This adds the hidden CSRF token field */}
      
      {/* Your other form fields */}
      <input type="email" name="email" required />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 3. Validate CSRF Token in Your Server Action

```tsx
'use server'

import { requireCSRFToken } from '@/utils/csrf'

export async function yourServerAction(formData: FormData) {
  // Validate CSRF token first
  const isValidCSRF = await requireCSRFToken(formData)
  if (!isValidCSRF) {
    return { error: 'Security validation failed. Please refresh the page and try again.' }
  }
  
  // Your server action logic here
  const email = formData.get('email') as string
  // ... rest of your logic
}
```

## Advanced Usage

### Using CSRF Hook for Custom Components

If you need more control over CSRF token handling:

```tsx
import { useCSRF } from '@/components/csrf-provider'

function CustomFormComponent() {
  const { token, refreshToken } = useCSRF()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      await refreshToken()
      return
    }
    
    // Use token in your custom submission logic
    const formData = new FormData()
    formData.append('csrf-token', token)
    // ... add other fields
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  )
}
```

### Multiple Forms on Same Page

You can use multiple forms within the same CSRFProvider:

```tsx
<CSRFProvider>
  <ContactForm />
  <NewsletterForm />
  <FeedbackForm />
</CSRFProvider>
```

Each form just needs to include `<CSRFInput />` and validate the token in its server action.

## Server Action Examples

### Basic Form Handler

```tsx
'use server'

import { requireCSRFToken } from '@/utils/csrf'

export async function handleContactForm(formData: FormData) {
  // Always validate CSRF first
  const isValidCSRF = await requireCSRFToken(formData)
  if (!isValidCSRF) {
    return { error: 'Security validation failed. Please refresh the page and try again.' }
  }
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string
  
  // Your business logic here
  try {
    // Save to database, send email, etc.
    return { success: 'Message sent successfully!' }
  } catch (error) {
    return { error: 'Failed to send message. Please try again.' }
  }
}
```

### With useFormState Hook

```tsx
'use client'

import { useFormState } from 'react-dom'
import { CSRFProvider, CSRFInput } from '@/components/csrf-provider'
import { handleContactForm } from './actions'

function ContactForm() {
  const [state, formAction] = useFormState(handleContactForm, null)
  
  return (
    <CSRFProvider>
      <form action={formAction}>
        <CSRFInput />
        
        <input type="text" name="name" required />
        <input type="email" name="email" required />
        <textarea name="message" required></textarea>
        
        {state?.error && <p className="error">{state.error}</p>}
        {state?.success && <p className="success">{state.success}</p>}
        
        <button type="submit">Send Message</button>
      </form>
    </CSRFProvider>
  )
}
```

## API Reference

### Components

#### `<CSRFProvider>`
Provides CSRF token context to child components.

**Props:** 
- `children: React.ReactNode` - Child components that need CSRF protection

#### `<CSRFInput>`
Renders a hidden input field with the current CSRF token.

**Props:** None

**Renders:** `<input type="hidden" name="csrf-token" value="{token}" />`

### Hooks

#### `useCSRF()`
Returns CSRF token and refresh function.

**Returns:**
```tsx
{
  token: string | null,      // Current CSRF token
  refreshToken: () => Promise<void>  // Function to refresh token
}
```

### Server Utilities

#### `requireCSRFToken(formData: FormData): Promise<boolean>`
Validates CSRF token from form submission.

**Parameters:**
- `formData: FormData` - Form data containing 'csrf-token' field

**Returns:** `Promise<boolean>` - True if token is valid, false otherwise

#### `getClientCSRFToken(): Promise<string>`
Generates a new CSRF token for client use.

**Returns:** `Promise<string>` - New CSRF token

## Security Best Practices

### 1. Always Validate First
```tsx
export async function serverAction(formData: FormData) {
  // ✅ CSRF validation should be the first thing you do
  const isValidCSRF = await requireCSRFToken(formData)
  if (!isValidCSRF) {
    return { error: 'Security validation failed. Please refresh the page and try again.' }
  }
  
  // ✅ Then proceed with your logic
}
```

### 2. Use Consistent Error Messages
```tsx
// ✅ Use the standard error message for consistency
if (!isValidCSRF) {
  return { error: 'Security validation failed. Please refresh the page and try again.' }
}

// ❌ Don't create custom CSRF error messages
if (!isValidCSRF) {
  return { error: 'Invalid token' } // Too revealing
}
```

### 3. Handle All Form Submissions
```tsx
// ✅ Protect ALL server actions that modify data
export async function createPost(formData: FormData) {
  const isValidCSRF = await requireCSRFToken(formData)
  // ...
}

export async function updateProfile(formData: FormData) {
  const isValidCSRF = await requireCSRFToken(formData)
  // ...
}

export async function deleteItem(formData: FormData) {
  const isValidCSRF = await requireCSRFToken(formData)
  // ...
}
```

## Common Patterns

### Modal Forms
```tsx
function EditProfileModal() {
  return (
    <Dialog>
      <DialogContent>
        <CSRFProvider>
          <form action={updateProfile}>
            <CSRFInput />
            {/* form fields */}
          </form>
        </CSRFProvider>
      </DialogContent>
    </Dialog>
  )
}
```

### Multi-Step Forms
```tsx
function MultiStepForm() {
  return (
    <CSRFProvider>
      {step === 1 && <StepOne />}
      {step === 2 && <StepTwo />}
      {step === 3 && (
        <form action={submitFinalForm}>
          <CSRFInput />
          {/* final step fields */}
        </form>
      )}
    </CSRFProvider>
  )
}
```

### Dynamic Forms
```tsx
function DynamicForm({ fields }: { fields: FormField[] }) {
  return (
    <CSRFProvider>
      <form action={handleDynamicForm}>
        <CSRFInput />
        {fields.map(field => (
          <input key={field.name} {...field} />
        ))}
        <button type="submit">Submit</button>
      </form>
    </CSRFProvider>
  )
}
```

## Troubleshooting

### "Security validation failed" Error

**Possible causes:**
1. Missing `<CSRFInput />` in form
2. Form not wrapped with `<CSRFProvider>`
3. Server action not calling `requireCSRFToken()`
4. Token expired (tokens are valid for 1 hour)

**Solution:** Ensure all 3 steps are implemented correctly.

### Token Not Available

**Symptoms:** `useCSRF()` returns `null` token

**Solutions:**
1. Ensure component is wrapped with `<CSRFProvider>`
2. Call `refreshToken()` to get a new token
3. Check browser console for network errors

### Multiple CSRFProviders

**Issue:** Nested CSRFProviders can cause conflicts

**Solution:** Use one CSRFProvider per page/route, not per form

```tsx
// ✅ Good: One provider for the page
<CSRFProvider>
  <Form1 />
  <Form2 />
</CSRFProvider>

// ❌ Bad: Multiple providers
<CSRFProvider>
  <Form1 />
</CSRFProvider>
<CSRFProvider>
  <Form2 />
</CSRFProvider>
```

## Migration Guide

To add CSRF protection to existing forms:

1. **Identify all server actions** that modify data
2. **Add CSRF validation** to each server action
3. **Wrap pages** with CSRFProvider
4. **Add CSRFInput** to each form
5. **Test thoroughly** to ensure no forms are broken

## Performance Considerations

- CSRF tokens are cached for 1 hour
- Token generation is lightweight (cryptographic hash)
- CSRFProvider uses React Context, so re-renders are minimal
- Tokens are automatically refreshed when needed

## Conclusion

CSRF protection is now easy to implement across your entire application. Just remember the 3-step process:
1. Wrap with CSRFProvider
2. Add CSRFInput to forms
3. Validate with requireCSRFToken in server actions

This ensures your application is protected against CSRF attacks while maintaining a smooth user experience.
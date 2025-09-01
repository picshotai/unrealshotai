# CSRF Protection - Quick Reference

## 🚀 3-Step Implementation

### 1. Wrap with Provider
```tsx
import { CSRFProvider } from '@/components/csrf-provider'

<CSRFProvider>
  <YourForm />
</CSRFProvider>
```

### 2. Add to Form
```tsx
import { CSRFInput } from '@/components/csrf-provider'

<form action={serverAction}>
  <CSRFInput />
  {/* other fields */}
</form>
```

### 3. Validate in Server Action
```tsx
'use server'
import { requireCSRFToken } from '@/utils/csrf'

export async function serverAction(formData: FormData) {
  const isValidCSRF = await requireCSRFToken(formData)
  if (!isValidCSRF) {
    return { error: 'Security validation failed. Please refresh the page and try again.' }
  }
  // ... your logic
}
```

## 📋 Checklist

- [ ] Page wrapped with `<CSRFProvider>`
- [ ] Form contains `<CSRFInput />`
- [ ] Server action calls `requireCSRFToken(formData)`
- [ ] Error handling for failed validation
- [ ] Tested form submission

## 🔧 Common Imports

```tsx
// Client-side
import { CSRFProvider, CSRFInput, useCSRF } from '@/components/csrf-provider'

// Server-side
import { requireCSRFToken } from '@/utils/csrf'
```

## ⚠️ Common Mistakes

❌ **Missing CSRFInput**
```tsx
<form action={serverAction}>
  <input type="email" name="email" />
  {/* Missing <CSRFInput /> */}
</form>
```

✅ **Correct**
```tsx
<form action={serverAction}>
  <CSRFInput />
  <input type="email" name="email" />
</form>
```

❌ **No Provider Wrapper**
```tsx
function Page() {
  return <FormWithCSRFInput /> // Missing CSRFProvider
}
```

✅ **Correct**
```tsx
function Page() {
  return (
    <CSRFProvider>
      <FormWithCSRFInput />
    </CSRFProvider>
  )
}
```

❌ **No Server Validation**
```tsx
export async function serverAction(formData: FormData) {
  // Missing CSRF validation
  const email = formData.get('email')
  // ... process form
}
```

✅ **Correct**
```tsx
export async function serverAction(formData: FormData) {
  const isValidCSRF = await requireCSRFToken(formData)
  if (!isValidCSRF) {
    return { error: 'Security validation failed. Please refresh the page and try again.' }
  }
  const email = formData.get('email')
  // ... process form
}
```

## 🎯 Use Cases

| Form Type | Implementation |
|-----------|----------------|
| Contact Form | Standard 3-step process |
| Login Form | Already implemented |
| Registration | Standard 3-step process |
| Profile Update | Standard 3-step process |
| File Upload | Standard 3-step process |
| Settings | Standard 3-step process |
| Comments | Standard 3-step process |
| Newsletter | Standard 3-step process |

## 🔍 Debugging

**"Security validation failed" error?**
1. Check browser dev tools → Network tab
2. Verify CSRF token in form data
3. Ensure server action calls `requireCSRFToken()`
4. Refresh page to get new token

**Token is null?**
1. Verify `<CSRFProvider>` wrapper
2. Check browser console for errors
3. Try calling `refreshToken()` manually

## 📖 Full Documentation

See [CSRF_PROTECTION.md](./CSRF_PROTECTION.md) for complete documentation with examples and advanced usage.
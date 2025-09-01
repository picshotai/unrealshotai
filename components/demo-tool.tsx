'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Shield, Database, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

import { CSRFProvider, useCSRF } from '@/components/csrf-provider'

interface DemoItem {
  id: string
  title: string
  description: string
  created_at: string
}

interface ApiResponse {
  success: boolean
  data?: DemoItem[]
  message?: string
  error?: string
  retryAfter?: number
  result?: DemoItem
  action?: string
}

function DemoToolContent() {
  const [items, setItems] = useState<DemoItem[]>([])  
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    limit?: string
    remaining?: string
    reset?: string
  }>({})
  
  // Get CSRF token at component level
  const { token: csrfToken } = useCSRF()

  // Load items from localStorage on component mount
  useEffect(() => {
    loadItems()
  }, [])

  // Load items from localStorage
  const loadItemsFromStorage = (): DemoItem[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('demo-tool-items')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading items from localStorage:', error)
      return []
    }
  }

  // Save items to localStorage
  const saveItemsToStorage = (items: DemoItem[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('demo-tool-items', JSON.stringify(items))
    } catch (error) {
      console.error('Error saving items to localStorage:', error)
    }
  }

  const loadItems = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }
    setError(null)
    
    try {
      // Load items from localStorage instead of API
      const localItems = loadItemsFromStorage()
      setItems(localItems)
      if (localItems.length > 0) {
        setSuccess(`Found ${localItems.length} items`)
      }
    } catch (err) {
      console.error('Error loading items:', err)
      setError('Error loading items from storage')
    } finally {
      setRefreshing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all fields')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Create new item with unique ID
      const newItem: DemoItem = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        created_at: new Date().toISOString()
      }

      // Get existing items and add the new one
      const existingItems = loadItemsFromStorage()
      const updatedItems = [newItem, ...existingItems] // Add to beginning for newest first
      
      // Save to localStorage
      saveItemsToStorage(updatedItems)
      
      // Update state
      setItems(updatedItems)
      
      // Store the newly created item ID for highlighting
      setNewlyCreatedId(newItem.id)
      
      // Clear the highlight after 5 seconds
      setTimeout(() => {
        setNewlyCreatedId(null)
      }, 5000)
      
      // Clear form
      setFormData({ title: '', description: '' })
      
      // Show success message with item title and updated count
      setSuccess(`"${newItem.title}" created successfully! Found ${updatedItems.length} items`)
      
      // Scroll to the items section after a brief delay
      setTimeout(() => {
        const itemsSection = document.getElementById('demo-items-section')
        if (itemsSection) {
          itemsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
    } catch (err) {
      console.error('Error creating item:', err)
      setError('Error creating item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatResetTime = (resetTime?: string) => {
    if (!resetTime) return 'Unknown'
    const resetDate = new Date(resetTime)
    const now = new Date()
    const diffMs = resetDate.getTime() - now.getTime()
    const diffMinutes = Math.ceil(diffMs / (1000 * 60))
    return diffMinutes > 0 ? `${diffMinutes} minutes` : 'Now'
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">Secure API Demo Tool</h1>
          <Badge variant="secondary">Example</Badge>
        </div>
        
        <p className="text-muted-foreground">
          This tool demonstrates how to implement secure API routes with authentication, CSRF protection, and rate limiting.
          Perfect for understanding security best practices in your Next.js applications.
        </p>

        {/* Security Features Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Features Implemented</span>
            </CardTitle>
            <CardDescription>
              This API route includes multiple layers of security protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Authentication Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">CSRF Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Rate Limiting</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limit Status */}
        {rateLimitInfo.limit && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Rate Limit Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Limit:</span> {rateLimitInfo.limit} requests
                </div>
                <div>
                  <span className="font-medium">Remaining:</span> {rateLimitInfo.remaining}
                </div>
                <div>
                  <span className="font-medium">Resets in:</span> {formatResetTime(rateLimitInfo.reset)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create New Item Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Item</CardTitle>
            <CardDescription>
              This form demonstrates secure POST requests with CSRF protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CSRF token is now handled via useCSRF hook */}
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter item title"
                  required
                  disabled={submitting}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter item description"
                  required
                  disabled={submitting}
                  rows={3}
                  className="w-full min-h-[100px]"
                />
              </div>
              
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Item'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Success/Error Messages */}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Items List */}
        <Card id="demo-items-section">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Demo Items</span>
              </div>
              <Button onClick={() => loadItems(true)} disabled={refreshing} variant="outline" size="sm">
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Items retrieved via secure GET endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No items found. Create your first item above!
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    {items.length} item{items.length !== 1 ? 's' : ''} found
                  </p>
                  {newlyCreatedId && (
                    <Badge variant="secondary" className="animate-pulse">
                      ✨ New item added!
                    </Badge>
                  )}
                </div>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`border rounded-lg p-4 transition-all duration-500 ${
                      item.id === newlyCreatedId 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md' 
                        : 'hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {formatDate(item.created_at)}
                        </p>
                      </div>
                      {item.id === newlyCreatedId && (
                        <Badge variant="outline" className="ml-2 text-green-600 border-green-500">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
            <CardDescription>
              Key points for developers using this boilerplate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Authentication:</strong> All endpoints verify user session via Supabase</p>
              <p><strong>CSRF Protection:</strong> POST requests require valid CSRF tokens</p>
              <p><strong>Rate Limiting:</strong> Configurable limits prevent abuse (if enabled)</p>
              <p><strong>Error Handling:</strong> Comprehensive error responses with appropriate HTTP status codes</p>
              <p><strong>Type Safety:</strong> Full TypeScript support with proper interfaces</p>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default function DemoTool() {
  return (
    <CSRFProvider>
      <DemoToolContent />
    </CSRFProvider>
  )
}
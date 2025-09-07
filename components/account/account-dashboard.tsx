'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  User as UserIcon, 
  History,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
// Removed complex credit transaction service dependency

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  credits: number
  created_at: string
  completed_at?: string
  pricing_plan: {
    name: string
    price: number
  }
}

interface AccountDashboardProps {
  user: User
  payments: Payment[]
  currentCredits: number
  totalCreditsPurchased: number
}

interface UsageStats {
  totalSpent: number
  thisMonth: number
  lastMonth: number
  topFeatures: Array<{ feature: string; credits: number }>
}

export function AccountDashboard({ user, payments, currentCredits, totalCreditsPurchased }: AccountDashboardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user.user_metadata?.full_name || '')
  // Simplified to use payment data instead of complex transactions
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  useEffect(() => {
    // Calculate basic usage statistics from payment data
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    
    const completedPayments = payments.filter(p => p.status === 'completed')
    const totalSpent = totalCreditsPurchased - currentCredits
    
    const thisMonthSpent = completedPayments
      .filter(p => new Date(p.created_at) >= thisMonth)
      .reduce((sum, p) => sum + p.credits, 0)
    
    const lastMonthSpent = completedPayments
      .filter(p => {
        const date = new Date(p.created_at)
        return date >= lastMonth && date < thisMonth
      })
      .reduce((sum, p) => sum + p.credits, 0)
    
    setUsageStats({
      totalSpent,
      thisMonth: thisMonthSpent,
      lastMonth: lastMonthSpent,
      topFeatures: [] // Simplified - no feature tracking
    })
    
    setLoading(false)
  }, [payments, currentCredits, totalCreditsPurchased])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2 cursor-pointer">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center gap-2 cursor-pointer">
            <CreditCard className="h-4 w-4" />
            Credits
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2 cursor-pointer">
            <Activity className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Manage your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">
                    {user.user_metadata?.full_name || 'User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Member since {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email || ''} disabled />
                </div>
                
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Credits Overview
              </CardTitle>
              <CardDescription>
                Manage your credits and view usage analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold text-primary">{currentCredits.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Purchased</p>
                    <p className="text-2xl font-bold">{totalCreditsPurchased.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-orange-600">{usageStats?.thisMonth.toLocaleString() || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-red-600">{usageStats?.totalSpent.toLocaleString() || 0}</p>
                  </div>
                </div>
                
                {usageStats && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Monthly Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">This Month</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{usageStats.thisMonth.toLocaleString()}</span>
                              {usageStats.thisMonth > usageStats.lastMonth ? (
                                <TrendingUp className="h-4 w-4 text-red-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last Month</span>
                            <span className="text-muted-foreground">{usageStats.lastMonth.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Usage Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Credits Remaining</span>
                            <span className="font-medium text-green-600">{currentCredits.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Credits Used</span>
                            <span className="font-medium text-orange-600">{usageStats?.totalSpent.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Total Purchased</span>
                            <span className="font-medium">{totalCreditsPurchased.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div className="flex justify-center pt-4">
                  <Button asChild>
                    <Link href="/buy-credits">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buy More Credits
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Credit Purchases
              </CardTitle>
              <CardDescription>
                View your credit purchase history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.slice(0, 20).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'failed' ? 'destructive' : 'secondary'}>
                            {payment.status}
                          </Badge>
                          <span className="text-sm font-medium">{payment.pricing_plan.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(payment.amount, payment.currency)} for {payment.credits.toLocaleString()} credits
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-medium text-green-600">
                          +{payment.credits.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {payments.length > 20 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing 20 of {payments.length} purchases
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Transactions</h3>
                  <p className="text-muted-foreground">
                    Your credit transaction history will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>



      </Tabs>
    </div>
  )
}
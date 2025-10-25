'use client'


import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User as UserIcon, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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




  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }



  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            See your personal information and account settings
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

      {/* Credit Purchases */}
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
    </div>
  )
}
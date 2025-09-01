import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { creditService } from '@/lib/credits'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, ArrowRight, Home, Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { RefreshButton } from './RefreshButton'

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    session_id?: string
    amount?: string
    credits?: string
    plan_name?: string
  }>
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get current credit balance
  const { balance, error } = await creditService.getUserCredits(user.id)
  
  if (error) {
    console.error('Error fetching credits:', error)
  }

  // Await search params before accessing properties
  const params = await searchParams
  
  // Extract payment details from search params
  const sessionId = params.session_id
  const amount = params.amount ? parseFloat(params.amount) : 0
  const credits = params.credits ? parseInt(params.credits) : 0
  const planName = params.plan_name || 'Credit Package'

  // Fetch actual payment details from database if session_id is provided
  let paymentDetails = null
  let paymentStatus = 'pending'
  
  if (sessionId) {
    try {
      const { data: payment, error: paymentError } = await supabase
        .from('dodo_payments')
        .select(`
          *,
          dodo_pricing_plans (
            name,
            credits,
            price
          )
        `)
        .eq('dodo_payment_id', sessionId)
        .single()

      if (!paymentError && payment) {
        paymentDetails = payment
        paymentStatus = payment.status
      }
    } catch (error) {
      console.error('Error fetching payment details:', error)
    }
  }

  // Use database details if available, otherwise fall back to URL parameters
  const displayAmount = paymentDetails?.amount || amount
  const displayCredits = paymentDetails?.credits || credits
  const displayPlanName = paymentDetails?.dodo_pricing_plans?.name || planName
  const isPaymentCompleted = paymentStatus === 'completed'

  // Format currency
  const formatPrice = (price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const formatCredits = (credits: number): string => {
    return credits.toLocaleString()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className={`rounded-full p-3 ${
            isPaymentCompleted ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {isPaymentCompleted ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            )}
          </div>
        </div>
        <h1 className={`text-3xl font-bold mb-2 ${
          isPaymentCompleted ? 'text-green-600' : 'text-yellow-600'
        }`}>
          {isPaymentCompleted ? 'Payment Successful!' : 'Payment Processing'}
        </h1>
        <p className="text-muted-foreground">
          {isPaymentCompleted 
            ? 'Thank you for your purchase. Your credits have been added to your account.'
            : 'Your payment is being processed. Credits will be added to your account shortly.'
          }
        </p>
      </div>

      {/* Transaction Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Transaction Details</span>
          </CardTitle>
          <CardDescription>
            {isPaymentCompleted ? 'Transaction completed successfully' : 'Transaction is being processed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Package</p>
              <p className="font-semibold">{displayPlanName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-semibold">{formatPrice(displayAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits {isPaymentCompleted ? 'Added' : 'To Add'}</p>
              <p className="font-semibold">{formatCredits(displayCredits)} credits</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="font-semibold text-green-600">{formatCredits(balance)} credits</p>
            </div>
          </div>
          
          {sessionId && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{sessionId}</p>
            </div>
          )}
          
          {paymentDetails?.created_at && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Transaction Date</p>
              <p className="text-sm">
                {new Date(paymentDetails.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={isPaymentCompleted ? 'default' : 'secondary'} className={
              isPaymentCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }>
              {isPaymentCompleted ? 'Completed' : 'Processing'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Credit Balance Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Credit Balance</CardTitle>
          <CardDescription>
            You now have {formatCredits(balance)} credits available to use across all platform features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-100 p-2">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Credits Added Successfully</p>
                <p className="text-sm text-green-600">+{formatCredits(credits)} credits</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>
            Start using your credits with our powerful AI tools and features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/example-tool">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold">Try AI Generator</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Generate AI content using your credits
                </p>
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start space-y-2">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span className="font-semibold">Go to Dashboard</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  View your account and usage statistics
                </p>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isPaymentCompleted ? (
          <>
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Link href="/example-tool">
              <Button variant="outline" className="w-full sm:w-auto">
                Start Using Credits
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <RefreshButton 
              variant="outline" 
              className="w-full sm:w-auto"
            />
          </>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-8 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your purchase or need assistance, 
            please don't hesitate to contact our support team.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link href="/account" className="text-primary hover:underline">
              View Account
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/buy-credits" className="text-primary hover:underline">
              Buy More Credits
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
// Utility functions moved inline to avoid server import issues
function formatPrice(price: number | string, currency: string = 'USD'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numPrice);
}

function formatCredits(credits: number): string {
  return new Intl.NumberFormat('en-US').format(credits);
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';

type PricingPlan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  credits: number;
  currency: string;
  creditsPerDollar: number;
  isPopular?: boolean;
};

export default function BuyCreditsPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        // Check if user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/sign-in?redirect=/buy-credits');
          return;
        }
        setUser(user);

        // Load pricing plans
        const response = await fetch('/api/pricing-plans?withValue=true');
        if (!response.ok) {
          throw new Error('Failed to fetch pricing plans');
        }
        const { plans: plansData } = await response.json();
        setPlans(plansData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router, supabase.auth]);

  const handlePurchase = async (plan: PricingPlan) => {
    if (!user) {
      router.push('/sign-in?redirect=/buy-credits');
      return;
    }

    setProcessingPlan(plan.id);

    try {
      // Create checkout session
      const response = await fetch('/api/dodopayments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pricing_plan_id: plan.id,
          user_id: user.id,
          success_url: `${window.location.origin}/account?purchase=success`,
          cancel_url: `${window.location.origin}/buy-credits?purchase=cancelled`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkout_url } = await response.json();
      
      if (checkout_url) {
        // Redirect to DodoPayments checkout
        window.location.href = checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Buy Credits</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Purchase credits to unlock premium features and enhance your experience. 
          Credits never expire and can be used across all platform features.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No pricing plans available</h3>
          <p className="text-muted-foreground">Please check back later or contact support.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}>
              {plan.isPopular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price, plan.currency)}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {formatCredits(plan.credits)} credits
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Credits per dollar:</span>
                    <span className="font-medium">{plan.creditsPerDollar.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per credit:</span>
                    <span className="font-medium">
                      {formatPrice(plan.price / plan.credits, plan.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase(plan)}
                  disabled={processingPlan === plan.id}
                  variant={plan.isPopular ? 'default' : 'outline'}
                >
                  {processingPlan === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Buy Credits
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Why Buy Credits?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Never Expire</h4>
              <p className="text-muted-foreground">Your credits never expire and remain in your account indefinitely.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Flexible Usage</h4>
              <p className="text-muted-foreground">Use credits for any premium feature across the platform.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Secure Payment</h4>
              <p className="text-muted-foreground">Safe and secure payment processing with instant credit delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
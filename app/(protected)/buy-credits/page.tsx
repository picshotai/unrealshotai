import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star } from 'lucide-react';
import DodoCheckoutButton from '@/components/dodopayments/DodoCheckoutButton';
import { pricingPlanService } from '@/lib/pricing-plans';

// Utility functions
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

export default async function BuyCreditsPage() {
  // Server-side authentication check
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login?redirect=/buy-credits');
  }

  // Server-side data fetching - no loading states needed
  let plans: PricingPlan[] = [];
  try {
    const plansData = await pricingPlanService.getPlansWithValue();
    plans = plansData.map((plan, index) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: parseFloat(plan.price.toString()),
      credits: plan.credits,
      currency: plan.currency,
      creditsPerDollar: plan.creditsPerDollar,
      isPopular: index === 1 // Make second plan popular
    }));
  } catch (error) {
    console.error('Error loading pricing plans:', error);
    // Handle error gracefully - could redirect to error page or show empty state
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
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
                <DodoCheckoutButton
                  planId={plan.id}
                  userId={user?.id || ''}
                  amount={plan.price}
                  credits={plan.credits}
                  className="w-full border border-input bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Buy {formatCredits(plan.credits)} Credits
                </DodoCheckoutButton>
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
import { Metadata } from 'next'
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Star, Check } from 'lucide-react';
import DodoCheckoutButton from '@/components/dodopayments/DodoCheckoutButton';
import { pricingPlanService } from '@/lib/pricing-plans';
import { commonPageMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateProductSchema } from '@/lib/seo'

export const metadata: Metadata = commonPageMetadata.buyCredits()

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

// Normalize plan names to avoid casing/spacing mismatches
function normalizePlanName(name: string) {
  return name.trim().toLowerCase();
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

  // Plan feature bullets (aligned with pricing cards)
  const starterFeatures = [
    '20 AI-generated photos',
    '1 model training included',
    '20 unique styles & backgrounds',
    '20 different outfits',
    'Full commercial license',
    '30 credits included'
  ];

  const proFeatures = [
    '80 AI-generated photos',
    '1 model training included',
    '80 unique styles & backgrounds',
    '80 different outfits',
    'Priority processing',
    'Premium customer support',
    '60 credits included'
  ];

  // Use normalized keys so minor plan name differences don't break mapping
  const featuresByPlanName: Record<string, string[]> = {
    starter: starterFeatures,
    pro: proFeatures,
  };

  return (
    <>
      {plans.length > 0 && (
        <StructuredData
          data={JSON.parse(generateProductSchema({
            name: 'Credit Packages',
            description: 'Purchase credits to unlock premium features',
            price: plans[0]?.price || 0,
            currency: plans[0]?.currency || 'USD',
            features: ['Premium Features', 'Extended Usage Limits', 'Priority Support']
          }))}
        />
      )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
              
              <CardContent className="pb-2">
                <ul className="space-y-2 text-sm">
                  {(featuresByPlanName[normalizePlanName(plan.name)] || []).map((feature, idx) => (
                    <li key={`${plan.id}-${idx}`} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#111827]" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <DodoCheckoutButton
                  planId={plan.id}
                  userId={user?.id || ''}
                  amount={plan.price}
                  credits={plan.credits}
                  planName={plan.name}
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
    </>
  );
}
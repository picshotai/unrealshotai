import { Metadata } from 'next'
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Removed Alert in favor of a site-consistent muted card banner
import { CreditCard, Star, Check } from 'lucide-react';
import DodoCheckoutButton from '@/components/dodopayments/DodoCheckoutButton';
import { pricingPlanService } from '@/lib/pricing-plans';
import { commonPageMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateProductSchema } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'
import FeedbackForm from "@/components/FeedbackForm"
import { ShineBorder } from "@/components/ui/shine-border";

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

function getDisplayName(name: string) {
  const n = normalizePlanName(name);
  if (n === 'basic pack' || n === 'starter') {
    return 'Starter Pack';
  }
  if (n === 'premium pack' || n === 'pro') {
    return 'Premium Pack (Advanced)';
  }
  return name;
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
    '20 High-Res AI Photos',
    '100% Quality & Performance Guarantee',
    '1 AI Model Training Included',
    '20 Unique Styles & Backgrounds',
    'Full Commercial License Included'
  ];

  const proFeatures = [
    'Up to 80 AI Photos',
    '1 AI Model Training Included',
    '80 Unique Styles & Backgrounds',
    'Priority processing',
    'Full Commercial License Included',
    'Premium customer support'
  ];

  // Use normalized keys so minor plan name differences don't break mapping
  const featuresByPlanName: Record<string, string[]> = {
    starter: starterFeatures,
    pro: proFeatures,
    // Map current Supabase plan names (as shown in UI)
    'basic pack': starterFeatures,
    'premium pack': proFeatures,
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
      <div className="mx-auto mb-6 max-w-3xl">
        <div className="relative rounded-lg border border-primary/10 bg-muted/30 p-4 text-left md:text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Exclusive Offer</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Hey friend, use code
            <Badge variant="outline" className="mx-2 font-mono">WELCOME</Badge>
            to get <span className="font-semibold text-primary">10% off</span> your first pack!
            <span className="ml-1">Limited time for new users.</span>
          </p>
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} />
        </div>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Get Your Professional AI Photoshoot</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your selfies into studio-quality headshots. Photos are guaranteed and credits never expire.
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
            <Card key={plan.id} className={`relative ${plan.isPopular ? '' : ''}`}>
              {plan.isPopular && <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}/>}
              {(() => {
                const normalized = normalizePlanName(plan.name);
                const showRecommended = normalized === 'basic pack' || normalized === 'starter';
                const showBestValue = plan.isPopular && !showRecommended;
                return (showRecommended || showBestValue) ? (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    {showRecommended ? 'Recommended' : 'Best Value'}
                  </Badge>
                ) : null;
              })()}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{getDisplayName(plan.name)}</CardTitle>
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price, plan.currency)}
                  </div>
                  {(() => {
                    const normalized = normalizePlanName(plan.name);
                    if (normalized === 'basic pack' || normalized === 'starter') {
                      return (
                        <div className="text-sm text-muted-foreground">Less than $0.50 per photo</div>
                      );
                    }
                    return null;
                  })()}
                </div>
                </CardHeader>
              
              <CardContent className="pb-2">
                <ul className="space-y-2 text-sm">
                  {(() => {
                    const normalized = normalizePlanName(plan.name);
                    const featureList =
                      featuresByPlanName[normalized] ||
                      // Fallback by credits if name mapping changes
                      (plan.credits <= 30 ? starterFeatures : proFeatures);
                    return featureList.map((feature, idx) => (
                      <li key={`${plan.id}-${idx}`} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#111827]" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ));
                  })()}
                </ul>
              </CardContent
              >
              
              <CardFooter>
                <DodoCheckoutButton
                  planId={plan.id}
                  userId={user?.id || ''}
                  amount={plan.price}
                  credits={plan.credits}
                  planName={plan.name}
                  className="w-full border border-input bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  {(() => {
                    const normalized = normalizePlanName(plan.name);
                    if (normalized === 'basic pack' || normalized === 'starter') {
                      return 'Buy Basic Pack';
                    }
                    if (normalized === 'premium pack' || normalized === 'pro') {
                      return 'Buy Premium Pack';
                    }
                    return 'Buy Pack';
                  })()}
                </DodoCheckoutButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

     

      {/* Universal Guarantee */}
      <div className="mt-10 max-w-3xl mx-auto text-left">
        <div className="rounded-lg border bg-muted/30 p-4">
          <h4 className="text-base font-semibold mb-2">🔒 Our Universal Guarantee</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li> <span className='font-semibold text-primary/90'>1. Quality Guarantee (Shoot Packs)</span>: We guarantee professional quality on all photos generated using our pre-made Shoot Packs. If 30% of the photos quality is not satisfactory, we offer re-creation and if 50% of the photos quality is not satisfactory, we offer a full refund, <span className='font-semibold underline'>no questions asked.</span></li>
            <li> <span className='font-semibold text-primary/90'>2. Performance Guarantee (All Packs)</span>: We guarantee that your photos will be delivered and your AI Model will train successfully from your selfies. If the technology fails, you get a refund.</li>
          </ul>
          <p className="text-xs text-red-500 mt-2">Note: The quality of photos generated using Custom Prompts is the user's responsibility as the Image quality depends entirely on your prompt writing skill.</p>
        </div>
      </div>

      <p className="text-center  text-gray-600 text-base leading-relaxed mt-8">
     Payments are processed securely with 
     <Link href="https://dodopayments.com" className="text-[#ff6f00] font-medium">
      <Image src="/dodo-logo.png" alt="dodopayments" width={96} height={96} className="inline-block ml-1 bg-black" />
     </Link>
    </p>
      </div>
      <FeedbackForm userId={user.id} />
    </>
  );
}
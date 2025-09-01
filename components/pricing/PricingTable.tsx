'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import DodoCheckoutButton from '@/components/dodopayments/DodoCheckoutButton';
// CouponInput removed
import { createClient } from '@/utils/supabase/client';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  currency: string;
  dodo_product_id: string;
  is_active: boolean;
  metadata?: {
    features?: string[];
  };
  popular?: boolean;
}

interface PricingTableProps {
  user: User;
}

// Plans will be fetched from database

export function PricingTable({ user }: PricingTableProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Affiliate tracking removed

  useEffect(() => {
    async function fetchPlans() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('dodo_pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (data && !error) {
        const formattedPlans = data.map((plan, index) => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: parseFloat(plan.price),
          credits: plan.credits,
          currency: plan.currency,
          dodo_product_id: plan.dodo_product_id,
          is_active: plan.is_active,
          metadata: plan.metadata,
          popular: index === 1 // Make second plan popular
        }));
        setPlans(formattedPlans);
      }
      setLoading(false);
    }

    fetchPlans();
  }, []);

  // Coupon functionality removed

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground mb-8">
          One-time payment plans for AI-generated professional headshots
        </p>
        
        {/* Coupon input removed */}
      </div>

      {loading ? (
        <div className="text-center">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.credits} AI Credits
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {plan.metadata?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <DodoCheckoutButton
                planId={plan.id}
                userId={user.id}
                amount={plan.price}
                credits={plan.credits}
                className="w-full"
              >
                <Button className="w-full" size="lg">
                  Get {plan.credits} Credits
                </Button>
              </DodoCheckoutButton>
            </CardFooter>
          </Card>
          ))}
        </div>
      )}
      
      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground">
          All payments are processed securely. Credits never expire.
        </p>
      </div>
    </div>
  );
}
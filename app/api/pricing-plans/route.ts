import { NextRequest, NextResponse } from 'next/server';
import { pricingPlanService } from '@/lib/pricing-plans';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withValue = searchParams.get('withValue') === 'true';
    
    let plans;
    if (withValue) {
      plans = await pricingPlanService.getPlansWithValue();
    } else {
      plans = await pricingPlanService.getActivePlans();
    }
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    );
  }
}
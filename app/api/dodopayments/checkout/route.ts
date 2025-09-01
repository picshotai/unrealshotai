import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import DodoPayments from 'dodopayments';

// Fetch pricing plans from database
async function getPricingPlan(planId: string, supabase: any) {
  const { data: plan, error } = await supabase
    .from('dodo_pricing_plans')
    .select('*')
    .eq('id', planId)
    .eq('is_active', true)
    .single();

  if (error || !plan) {
    throw new Error('Invalid plan ID or plan not found');
  }

  return {
    id: plan.id,
    name: plan.name,
    price: parseFloat(plan.price),
    credits: plan.credits,
    productId: plan.dodo_product_id,
    currency: plan.currency
  };
}

// Coupon and affiliate features removed

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  try {
    const { planId, userId, returnUrl } = await request.json();

    if (!planId || !userId) {
      return NextResponse.json({ message: "Missing required details" }, { status: 400 });
    }

    // Fetch plan from database
    const plan = await getPricingPlan(planId, supabase);
    if (!plan) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
    }

    // Use original plan price
    const finalPrice = plan.price;

    // Initialize DodoPayments client
    const apiKey = process.env.DODO_API_KEY;
    const environment = process.env.DODO_ENVIRONMENT || 'test';
    const baseURL = environment === 'production' 
      ? 'https://live.dodopayments.com' 
      : 'https://test.dodopayments.com';
    
    console.log('DodoPayments config:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      environment,
      baseURL
    });
    
    if (!apiKey) {
      return NextResponse.json({ 
        message: "DodoPayments API key is not configured" 
      }, { status: 500 });
    }
    
    const client = new DodoPayments({
      bearerToken: apiKey,
      baseURL: baseURL
    });

    // Create checkout session with DodoPayments SDK
    let checkoutSession;
    try {
      checkoutSession = await client.checkoutSessions.create({
        allowed_payment_method_types: ["credit", "debit"],
        confirm: false, // Set to false since we're not providing customer details
        customization: {
          show_on_demand_tag: true,
          show_order_details: true,
          theme: "light"
        },
        feature_flags: {
          allow_currency_selection: false,
          allow_discount_code: true,
          allow_phone_number_collection: false,
          allow_tax_id: false
        },
        metadata: {
          user_id: userId,
          pricing_plan_id: planId,
          credits: plan.credits.toString()
        },
        product_cart: [
          {
            product_id: plan.productId,
            quantity: 1,
            amount: Math.round(finalPrice * 100) // Convert to cents
          }
        ],
        return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        show_saved_payment_methods: true
      });
    } catch (dodoError: any) {
      console.error('DodoPayments SDK error:', {
        message: dodoError?.message,
        status: dodoError?.status,
        headers: dodoError?.headers,
        error: dodoError?.error,
        stack: dodoError?.stack
      });
      
      // Return more specific error information
      const errorMessage = dodoError?.status === 401 
        ? "Authentication failed - please check your DodoPayments API key"
        : "Failed to create checkout session";
        
      return NextResponse.json({ 
        message: errorMessage, 
        error: dodoError instanceof Error ? dodoError.message : 'Unknown error',
        status: dodoError?.status || 500
      }, { status: dodoError?.status || 500 });
    }

    // Store the checkout session in our database for tracking
    const { error: insertError } = await supabase
      .from('dodo_payments')
      .insert({
        dodo_payment_id: checkoutSession.session_id,
        dodo_checkout_session_id: checkoutSession.session_id,
        user_id: userId,
        amount: finalPrice,
        currency: 'USD',
        status: 'pending',
        pricing_plan_id: planId,
        credits: plan.credits,
        metadata: {
          user_id: userId,
          pricing_plan_id: planId,
          credits: plan.credits.toString(),
          checkout_session_id: checkoutSession.session_id
        }
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Continue anyway, as the checkout session was created successfully
    }

    return NextResponse.json({
      success: true,
      session_id: checkoutSession.session_id,
      checkout_url: checkoutSession.checkout_url,
      amount: finalPrice,
      credits: plan.credits
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve checkout session status
export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ message: "Session ID required" }, { status: 400 });
  }

  try {
    // Get session status from our database
    const { data: payment, error } = await supabase
      .from('dodo_payments')
      .select('*')
      .eq('dodo_payment_id', sessionId)
      .single();

    if (error) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json({
      session_id: payment.dodo_payment_id,  
      status: payment.status,
      amount: payment.amount,
      credits: payment.credits,
      created_at: payment.created_at
    });

  } catch (error) {
    console.error('Get checkout session error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import crypto from "crypto";

// Webhook event types we care about
const RELEVANT_EVENTS = [
  'payment.succeeded',
  'payment.failed',
  'checkout_session.completed',
  'checkout_session.expired'
];

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  
  try {
    const body = await request.text();
    
    // Get webhook headers as per Standard Webhooks spec
    const webhookId = request.headers.get('webhook-id');
    const webhookSignature = request.headers.get('webhook-signature');
    const webhookTimestamp = request.headers.get('webhook-timestamp');
    
    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return NextResponse.json({ message: "Missing webhook headers" }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      return NextResponse.json({ message: "Webhook secret not configured" }, { status: 500 });
    }

    // Verify webhook signature using Standard Webhooks approach
    const isValid = verifyWebhookSignature(webhookId, webhookTimestamp, body, webhookSignature, webhookSecret);
    
    if (!isValid && process.env.DODO_ENVIRONMENT !== 'test') {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook payload
    const event = JSON.parse(body);
    
    // Log the webhook event
    const eventId = event.id || crypto.randomUUID();
    
    const { error: logError } = await supabase
      .from('dodo_webhook_events')
      .insert({
        dodo_event_id: eventId,
        event_type: event.type,
        data: event,
        processed: false
      });

    if (logError) {
      return NextResponse.json({ message: "Failed to log webhook event" }, { status: 500 });
    }

    // Only process relevant events
    if (!RELEVANT_EVENTS.includes(event.type)) {
      return NextResponse.json({ message: "Event type not handled" }, { status: 200 });
    }

    // Process the event based on type
    let processingError = null;
    try {
      switch (event.type) {
        case 'payment.succeeded':
        case 'checkout_session.completed':
          await handlePaymentCompleted(event, supabase);
          break;
          
        case 'payment.failed':
        case 'checkout_session.expired':
          await handlePaymentFailed(event, supabase);
          break;
          
        default:
          break;
      }
    } catch (error) {
      processingError = error;
    }

    // Mark webhook as processed (or failed)
    const updateData: any = {
      processed: processingError === null,
      processed_at: new Date().toISOString()
    };
    
    if (processingError) {
      updateData.error_message = processingError instanceof Error ? processingError.message : String(processingError);
      updateData.retry_count = 1; // Initial retry count
    }

    await supabase
      .from('dodo_webhook_events')
      .update(updateData)
      .eq('dodo_event_id', eventId);

    if (processingError) {
      return NextResponse.json({ message: "Webhook processing failed", error: updateData.error_message }, { status: 500 });
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCompleted(event: any, supabase: any) {
  try {
    const paymentData = event.data;
    const sessionId = paymentData.payment_id || paymentData.session_id || paymentData.id;
    const metadata = paymentData.metadata || {};
    
    // Get payment record from our database
    
    // First try to find by payment_id
    let { data: payment, error: paymentError } = await supabase
      .from('dodo_payments')
      .select('*')
      .eq('dodo_payment_id', sessionId)
      .single();

    // If not found by payment_id, try to find by checkout session ID
    if (paymentError && paymentError.code === 'PGRST116') {
      // Extract session ID from payment_link if available
      const paymentLink = paymentData.payment_link;
      if (paymentLink) {
        const sessionIdMatch = paymentLink.match(/\/([a-zA-Z0-9]+)$/);
        if (sessionIdMatch) {
          const checkoutSessionId = sessionIdMatch[1];
          
          const { data: paymentBySession, error: sessionError } = await supabase
            .from('dodo_payments')
            .select('*')
            .eq('dodo_checkout_session_id', checkoutSessionId)
            .single();
            
          if (!sessionError) {
            payment = paymentBySession;
            paymentError = null;
          }
        }
      }
    }
    
    // If still not found, try to find by metadata (user_id + pricing_plan_id)
    if (paymentError && paymentError.code === 'PGRST116' && metadata.user_id && metadata.pricing_plan_id) {
      
      const { data: paymentByMetadata, error: metadataError } = await supabase
        .from('dodo_payments')
        .select('*')
        .eq('user_id', metadata.user_id)
        .eq('pricing_plan_id', metadata.pricing_plan_id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!metadataError) {
        payment = paymentByMetadata;
        paymentError = null;
        
        // Update the payment record with the actual payment_id
        await supabase
          .from('dodo_payments')
          .update({ dodo_payment_id: sessionId })
          .eq('id', payment.id);
      }
    }

    if (paymentError) {
      return;
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('dodo_payments')
      .update({ 
        status: 'completed'
      })
      .eq('dodo_payment_id', sessionId);
      
    if (updateError) {
      throw updateError;
    }

    // Create subscription record
    const userId = payment.user_id;
    const pricingPlanId = payment.pricing_plan_id;
    const creditsToAdd = payment.credits;

    // Create subscription in dodo_subscriptions table
    
    const { data: subscription, error: subscriptionError } = await supabase
      .from('dodo_subscriptions')
      .insert({
        user_id: userId,
        dodo_subscription_id: sessionId, // Using session_id as subscription identifier
        pricing_plan_id: pricingPlanId,
        status: 'active',
        metadata: {
          payment_session_id: sessionId,
          credits_granted: creditsToAdd,
          payment_completed_at: new Date().toISOString()
        }
      })
      .select('id')
      .single();

    if (subscriptionError) {
      throw subscriptionError;
    }

    // Add credits to user account
    const { data: existingCredits, error: selectError } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    let creditId: number;
    if (existingCredits) {
      const newCredits = existingCredits.credits + creditsToAdd;
      const { data, error: updateError } = await supabase
        .from("credits")
        .update({ credits: newCredits })
        .eq("user_id", userId)
        .select("id")
        .single();

      if (updateError) throw updateError;
      creditId = data!.id;
    } else {
      const { data, error: insertError } = await supabase
        .from("credits")
        .insert({ user_id: userId, credits: creditsToAdd })
        .select("id")
        .single();

      if (insertError) throw insertError;
      creditId = data!.id;
    }

    // Payment completion processing finished

  } catch (error) {
    throw error;
  }
}

async function handlePaymentFailed(event: any, supabase: any) {
  try {
    const paymentData = event.data;
    const sessionId = paymentData.payment_id || paymentData.session_id || paymentData.id;
    
    // Update payment status to failed
    await supabase
      .from('dodo_payments')
      .update({ 
        status: 'failed',
        failed_at: new Date().toISOString()
      })
      .eq('dodo_payment_id', sessionId);

  } catch (error) {
    throw error;
  }
}

// GET endpoint for webhook verification (if needed)
function verifyWebhookSignature(
  webhookId: string,
  webhookTimestamp: string,
  payload: string,
  webhookSignature: string,
  secret: string,
): boolean {
  try {
    // Remove whsec_ prefix if present
    const cleanSecret = secret.startsWith("whsec_") ? secret.substring(6) : secret

    // Decode the base64 secret
     const key = Buffer.from(cleanSecret, "base64")

     // Create the signed payload: msgId.timestamp.payload
     const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`

     // Create HMAC SHA256 signature and encode as base64
     const expectedSignature = crypto.createHmac("sha256", key as any).update(signedPayload, "utf8").digest("base64")

    // Parse received signatures (can be multiple: "v1,sig1 v1,sig2")
    const receivedSignatures = webhookSignature.split(" ")

    // Check each signature
    for (const versionedSignature of receivedSignatures) {
      const [version, signature] = versionedSignature.split(",")

      if (version !== "v1") {
        continue
      }

      // Use timing-safe comparison
      if (signature && timingSafeEqual(signature, expectedSignature)) {
        return true
      }
    }

    return false
  } catch (error) {
    return false
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  const bufferA = Buffer.from(a, "utf8")
   const bufferB = Buffer.from(b, "utf8")

   return crypto.timingSafeEqual(bufferA as any, bufferB as any)
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "DodoPayments webhook endpoint" }, { status: 200 });
}
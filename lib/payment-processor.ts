import { createClient } from '@/utils/supabase/server'
import { creditService } from '@/lib/credits'
import { Database } from '@/types/supabase'

type DodoPayment = Database['public']['Tables']['dodo_payments']['Row']
type DodoSubscription = Database['public']['Tables']['dodo_subscriptions']['Row']
type PricingPlan = Database['public']['Tables']['dodo_pricing_plans']['Row']

export interface PaymentProcessingResult {
  success: boolean
  error?: string
  subscriptionId?: string
  creditsAdded?: number
}

export interface DodoWebhookPayload {
  event_type: string
  payment_id: string
  subscription_id?: string
  status: string
  amount: number
  currency: string
  metadata?: Record<string, any>
}

export class PaymentProcessor {
  private async getClient() {
    return await createClient()
  }

  /**
   * Process a completed payment from DodoPayments webhook
   */
  async processPayment(
    userId: string,
    dodoPaymentId: string,
    pricingPlanId: string,
    amount: number,
    currency: string = 'USD',
    metadata: Record<string, any> = {}
  ): Promise<PaymentProcessingResult> {
    try {
      const supabase = await this.getClient()

      // Get the pricing plan to determine credits
      const { data: pricingPlan, error: planError } = await supabase
        .from('dodo_pricing_plans')
        .select('*')
        .eq('id', pricingPlanId)
        .single()

      if (planError || !pricingPlan) {
        console.error('Error fetching pricing plan:', planError)
        return { success: false, error: 'Invalid pricing plan' }
      }

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('dodo_payments')
        .insert({
          user_id: userId,
          dodo_payment_id: dodoPaymentId,
          pricing_plan_id: pricingPlanId,
          amount,
          currency,
          status: 'completed',
          credits: pricingPlan.credits,
          metadata
        })
        .select()
        .single()

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
        return { success: false, error: 'Failed to create payment record' }
      }

      // Create subscription record (one-time payment)
      const { data: subscription, error: subscriptionError } = await supabase
        .from('dodo_subscriptions')
        .insert({
          user_id: userId,
          dodo_subscription_id: dodoPaymentId, // Using payment ID as subscription ID for one-time payments
          pricing_plan_id: pricingPlanId,
          status: 'active',
          metadata: {
            ...metadata,
            payment_type: 'one_time',
            payment_id: dodoPaymentId
          }
        })
        .select()
        .single()

      if (subscriptionError) {
        console.error('Error creating subscription record:', subscriptionError)
        // Try to rollback payment record
        await supabase
          .from('dodo_payments')
          .update({ status: 'failed' })
          .eq('id', payment.id)
        return { success: false, error: 'Failed to create subscription record' }
      }

      // Add credits to user's account
      const creditResult = await creditService.addCredits(
        userId,
        pricingPlan.credits,
        `Credits purchased - ${pricingPlan.name}`
      )

      if (!creditResult.success) {
        console.error('Error adding credits:', creditResult.error)
        // Try to rollback records
        await supabase
          .from('dodo_payments')
          .update({ status: 'failed' })
          .eq('id', payment.id)
        await supabase
          .from('dodo_subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', subscription.id)
        return { success: false, error: 'Failed to add credits to account' }
      }

      return {
        success: true,
        subscriptionId: subscription.id,
        creditsAdded: pricingPlan.credits
      }
    } catch (error) {
      console.error('Unexpected error processing payment:', error)
      return { success: false, error: 'Unexpected error occurred' }
    }
  }

  /**
   * Process a failed payment
   */
  async processFailedPayment(
    userId: string,
    dodoPaymentId: string,
    pricingPlanId: string,
    amount: number,
    currency: string = 'USD',
    metadata: Record<string, any> = {}
  ): Promise<PaymentProcessingResult> {
    try {
      const supabase = await this.getClient()

      // Create payment record with failed status
      const { error: paymentError } = await supabase
        .from('dodo_payments')
        .insert({
          user_id: userId,
          dodo_payment_id: dodoPaymentId,
          pricing_plan_id: pricingPlanId,
          amount,
          currency,
          status: 'failed',
          credits: 0,
          metadata: {
            ...metadata,
            failure_reason: 'Payment processing failed'
          }
        })

      if (paymentError) {
        console.error('Error creating failed payment record:', paymentError)
        return { success: false, error: 'Failed to record payment failure' }
      }

      return { success: true }
    } catch (error) {
      console.error('Unexpected error processing failed payment:', error)
      return { success: false, error: 'Unexpected error occurred' }
    }
  }


  /**
   * Get payment status
   */
  async getPaymentStatus(dodoPaymentId: string): Promise<{
    status?: string
    payment?: DodoPayment
    subscription?: DodoSubscription
    error?: string
  }> {
    try {
      const supabase = await this.getClient()

      const { data: payment, error: paymentError } = await supabase
        .from('dodo_payments')
        .select('*')
        .eq('dodo_payment_id', dodoPaymentId)
        .single()

      if (paymentError) {
        console.error('Error fetching payment status:', paymentError)
        return { error: 'Payment not found' }
      }

      const { data: subscription } = await supabase
        .from('dodo_subscriptions')
        .select('*')
        .eq('dodo_subscription_id', dodoPaymentId)
        .single()

      return {
        status: payment.status,
        payment,
        subscription: subscription || undefined
      }
    } catch (error) {
      console.error('Unexpected error fetching payment status:', error)
      return { error: 'Unexpected error occurred' }
    }
  }

  /**
   * Get user's payment history
   */
  async getUserPaymentHistory(
    userId: string,
    limit: number = 20
  ): Promise<{
    payments: (DodoPayment & { pricing_plan: PricingPlan })[]
    error?: string
  }> {
    try {
      const supabase = await this.getClient()

      const { data: payments, error } = await supabase
        .from('dodo_payments')
        .select(`
          *,
          pricing_plan:dodo_pricing_plans(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching payment history:', error)
        return { payments: [], error: 'Failed to fetch payment history' }
      }

      return { payments: payments || [] }
    } catch (error) {
      console.error('Unexpected error fetching payment history:', error)
      return { payments: [], error: 'Unexpected error occurred' }
    }
  }
}

// Export singleton instance
export const paymentProcessor = new PaymentProcessor()

// Helper functions
export async function processPayment(
  userId: string,
  dodoPaymentId: string,
  pricingPlanId: string,
  amount: number,
  currency?: string,
  metadata?: Record<string, any>
) {
  return paymentProcessor.processPayment(userId, dodoPaymentId, pricingPlanId, amount, currency, metadata)
}

export async function processFailedPayment(
  userId: string,
  dodoPaymentId: string,
  pricingPlanId: string,
  amount: number,
  currency?: string,
  metadata?: Record<string, any>
) {
  return paymentProcessor.processFailedPayment(userId, dodoPaymentId, pricingPlanId, amount, currency, metadata)
}

export async function getPaymentStatus(dodoPaymentId: string) {
  return paymentProcessor.getPaymentStatus(dodoPaymentId)
}

export async function getUserPaymentHistory(userId: string, limit?: number) {
  return paymentProcessor.getUserPaymentHistory(userId, limit)
}
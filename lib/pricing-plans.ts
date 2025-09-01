import { createClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';

type PricingPlan = Database['public']['Tables']['dodo_pricing_plans']['Row'];
type PricingPlanInsert = Database['public']['Tables']['dodo_pricing_plans']['Insert'];
type PricingPlanUpdate = Database['public']['Tables']['dodo_pricing_plans']['Update'];

export class PricingPlanService {
  private async getClient() {
    return await createClient();
  }

  /**
   * Get all active pricing plans
   */
  async getActivePlans(): Promise<PricingPlan[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('dodo_pricing_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch pricing plans: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get a specific pricing plan by ID
   */
  async getPlanById(planId: string): Promise<PricingPlan | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('dodo_pricing_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Plan not found
      }
      throw new Error(`Failed to fetch pricing plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Get a pricing plan by DodoPayments product ID
   */
  async getPlanByProductId(productId: string): Promise<PricingPlan | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('dodo_pricing_plans')
      .select('*')
      .eq('dodo_product_id', productId)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Plan not found
      }
      throw new Error(`Failed to fetch pricing plan by product ID: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new pricing plan
   */
  async createPlan(planData: PricingPlanInsert): Promise<PricingPlan> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('dodo_pricing_plans')
      .insert({
        ...planData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create pricing plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Update an existing pricing plan
   */
  async updatePlan(planId: string, updates: PricingPlanUpdate): Promise<PricingPlan> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('dodo_pricing_plans')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update pricing plan: ${error.message}`);
    }

    return data;
  }

  /**
   * Deactivate a pricing plan (soft delete)
   */
  async deactivatePlan(planId: string): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from('dodo_pricing_plans')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId);

    if (error) {
      throw new Error(`Failed to deactivate pricing plan: ${error.message}`);
    }
  }

  /**
   * Calculate the best value plan (most credits per dollar)
   */
  async getBestValuePlan(): Promise<PricingPlan | null> {
    const plans = await this.getActivePlans();
    
    if (plans.length === 0) {
      return null;
    }

    return plans.reduce((best, current) => {
      const currentValue = current.credits / parseFloat(current.price.toString());
      const bestValue = best.credits / parseFloat(best.price.toString());
      return currentValue > bestValue ? current : best;
    });
  }

  /**
   * Get pricing plans with value calculations
   */
  async getPlansWithValue(): Promise<Array<PricingPlan & { creditsPerDollar: number; isPopular?: boolean }>> {
    const plans = await this.getActivePlans();
    const bestValuePlan = await this.getBestValuePlan();
    
    return plans.map(plan => ({
      ...plan,
      creditsPerDollar: plan.credits / parseFloat(plan.price.toString()),
      isPopular: bestValuePlan?.id === plan.id
    }));
  }
}

// Export a singleton instance
export const pricingPlanService = new PricingPlanService();

// Helper function to format currency
export function formatPrice(price: number | string, currency: string = 'USD'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numPrice);
}

// Helper function to format credits
export function formatCredits(credits: number): string {
  return new Intl.NumberFormat('en-US').format(credits);
}
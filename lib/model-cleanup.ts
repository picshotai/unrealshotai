import { createClient } from '@/utils/supabase/server';

export interface CleanupResult {
  success: boolean;
  deletedCount: number;
  deletedModels: Array<{
    id: number;
    name: string;
    expires_at: string;
    user_id: string;
  }>;
  error?: string;
}

export async function cleanupExpiredModels(): Promise<CleanupResult> {
  try {
    const supabase = await createClient();
    
    // Get current timestamp
    const now = new Date().toISOString();
    
    // Find expired models that don't have auto_extend enabled
    const { data: expiredModels, error: fetchError } = await supabase
      .from('models')
      .select('id, name, user_id, expires_at, auto_extend')
      .lt('expires_at', now)
      .eq('auto_extend', false)
      .eq('status', 'finished');

    if (fetchError) {
      console.error('Error fetching expired models:', fetchError);
      return {
        success: false,
        deletedCount: 0,
        deletedModels: [],
        error: 'Failed to fetch expired models'
      };
    }

    if (!expiredModels || expiredModels.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        deletedModels: []
      };
    }

    console.log(`Found ${expiredModels.length} expired models to delete:`, 
      expiredModels.map(m => ({ id: m.id, name: m.name, expires_at: m.expires_at })));

    // Delete expired models (CASCADE will handle samples)
    const modelIds = expiredModels.map(model => model.id);
    const { error: deleteError, count } = await supabase
      .from('models')
      .delete()
      .in('id', modelIds);

    if (deleteError) {
      console.error('Error deleting expired models:', deleteError);
      return {
        success: false,
        deletedCount: 0,
        deletedModels: [],
        error: 'Failed to delete expired models'
      };
    }

    console.log(`Successfully deleted ${count} expired models`);

    return {
      success: true,
      deletedCount: count || 0,
      deletedModels: expiredModels.map(m => ({
        id: m.id,
        name: m.name,
        expires_at: m.expires_at,
        user_id: m.user_id
      }))
    };

  } catch (error) {
    console.error('Cleanup models error:', error);
    return {
      success: false,
      deletedCount: 0,
      deletedModels: [],
      error: 'Internal server error'
    };
  }
}

export async function getExpiredModelsCount(): Promise<{ count: number; models: any[] }> {
  try {
    const supabase = await createClient();
    
    // Get current timestamp
    const now = new Date().toISOString();
    
    // Find expired models that don't have auto_extend enabled
    const { data: expiredModels, error: fetchError } = await supabase
      .from('models')
      .select('id, name, user_id, expires_at, auto_extend, created_at')
      .lt('expires_at', now)
      .eq('auto_extend', false)
      .eq('status', 'finished');

    if (fetchError) {
      console.error('Error fetching expired models:', fetchError);
      return { count: 0, models: [] };
    }

    return {
      count: expiredModels?.length || 0,
      models: expiredModels || []
    };

  } catch (error) {
    console.error('Check expired models error:', error);
    return { count: 0, models: [] };
  }
}
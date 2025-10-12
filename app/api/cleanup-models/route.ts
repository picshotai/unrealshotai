import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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
      return NextResponse.json({ error: 'Failed to fetch expired models' }, { status: 500 });
    }

    if (!expiredModels || expiredModels.length === 0) {
      return NextResponse.json({ 
        message: 'No expired models to delete',
        deletedCount: 0 
      });
    }


    // Delete expired models (CASCADE will handle samples)
    const modelIds = expiredModels.map(model => model.id);
    const { error: deleteError, count } = await supabase
      .from('models')
      .delete()
      .in('id', modelIds);

    if (deleteError) {
      console.error('Error deleting expired models:', deleteError);
      return NextResponse.json({ error: 'Failed to delete expired models' }, { status: 500 });
    }


    return NextResponse.json({
      message: `Successfully deleted ${count} expired models`,
      deletedCount: count,
      deletedModels: expiredModels.map(m => ({ id: m.id, name: m.name, expires_at: m.expires_at }))
    });

  } catch (error) {
    console.error('Cleanup models error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to check for expired models without deleting
export async function GET(request: Request) {
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
      return NextResponse.json({ error: 'Failed to fetch expired models' }, { status: 500 });
    }

    return NextResponse.json({
      expiredModelsCount: expiredModels?.length || 0,
      expiredModels: expiredModels || []
    });

  } catch (error) {
    console.error('Check expired models error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
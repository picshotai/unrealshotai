import { cleanupExpiredModels } from '@/lib/model-cleanup';
import { NextResponse } from 'next/server';

// This endpoint can be called by cron services like Vercel Cron or external cron jobs
export async function GET(request: Request) {
  try {
    // Verify the request is from a trusted source (optional)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting scheduled model cleanup...');
    
    const result = await cleanupExpiredModels();
    
    if (result.success) {
      console.log(`Cleanup completed successfully. Deleted ${result.deletedCount} models.`);
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} expired models`,
        deletedCount: result.deletedCount,
        deletedModels: result.deletedModels
      });
    } else {
      console.error('Cleanup failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Also support POST for flexibility
export async function POST(request: Request) {
  return GET(request);
}
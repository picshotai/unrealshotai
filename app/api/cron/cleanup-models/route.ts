import { cleanupExpiredModels } from '@/lib/model-cleanup';
import { NextResponse } from 'next/server';
import { Receiver } from '@upstash/qstash';

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || '',
});

// This endpoint can be called by cron services like Vercel Cron or external cron jobs
export async function GET(request: Request) {
  try {
    // Verify the request is from a trusted source (optional)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (cronSecret && !(authHeader === `Bearer ${cronSecret}` || key === cronSecret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    const result = await cleanupExpiredModels();
    
    if (result.success) {
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
  try {
    // Verify Upstash signature (QStash POST calls will include this)
    const signature =
      request.headers.get('Upstash-Signature') ||
      request.headers.get('upstash-signature') ||
      '';

    const body = await request.text(); // QStash signs the raw body (may be empty string)

    if (!receiver.verify({ body, signature })) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }


    const result = await cleanupExpiredModels();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} expired models`,
        deletedCount: result.deletedCount,
        deletedModels: result.deletedModels,
      });
    } else {
      console.error('Cleanup failed:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Cron cleanup error (POST):', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
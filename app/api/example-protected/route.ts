import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { hasCredits, deductCredits } from '@/lib/credits';

// Example of a credit-protected API route
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has enough credits (5 credits for AI generation)
    const requiredCredits = 5;
    const { hasCredits: hasEnoughCredits, currentBalance } = await hasCredits(user.id, requiredCredits);
    
    if (!hasEnoughCredits) {
      return NextResponse.json(
        {
          error: 'Insufficient credits for AI generation',
          required: requiredCredits,
          available: currentBalance,
          message: `You need ${requiredCredits} credits for AI generation. You have ${currentBalance} credits. Please purchase more credits to continue.`,
          upgradeUrl: '/buy-credits',
        },
        { status: 402 }
      );
    }

    // Parse request body
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Deduct credits before processing
    const deductResult = await deductCredits(user.id, requiredCredits, 'AI content generation');
    
    if (!deductResult.success) {
      return NextResponse.json(
        { error: 'Failed to deduct credits' },
        { status: 500 }
      );
    }

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const generatedContent = `Generated content for: ${prompt}`;
    
    console.log(`User ${user.id} used AI generation. New balance: ${deductResult.newBalance}`);
    
    return NextResponse.json({
      success: true,
      content: generatedContent,
      userId: user.id,
      newBalance: deductResult.newBalance
    });
    
  } catch (error) {
    console.error('Error in protected route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Example of checking credits without deducting
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has enough credits (5 credits for AI generation)
    const requiredCredits = 5;
    const { hasCredits: hasEnoughCredits, currentBalance } = await hasCredits(user.id, requiredCredits);
    
    if (!hasEnoughCredits) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: requiredCredits,
          available: currentBalance,
        },
        { status: 402 }
      );
    }

    return NextResponse.json({
      message: 'You have enough credits for AI generation',
      userId: user.id,
      currentBalance
    });
    
  } catch (error) {
    console.error('Error checking credits:', error);
    return NextResponse.json(
      { error: 'Failed to check credits' },
      { status: 500 }
    );
  }
}
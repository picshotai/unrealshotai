import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { creditService } from '@/lib/credits';
import ExampleToolClient from './ExampleToolClient';

const REQUIRED_CREDITS = 5;

export default async function ExampleToolPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Check user's credit balance server-side
  const { balance, error } = await creditService.getUserCredits(user.id);
  const hasSufficientCredits = balance >= REQUIRED_CREDITS;
  
  if (error) {
    console.error('Error fetching credits:', error);
  }

  return (
    <ExampleToolClient 
      userId={user.id}
      initialCreditBalance={balance}
      hasSufficientCredits={hasSufficientCredits}
      requiredCredits={REQUIRED_CREDITS}
    />
  );
}
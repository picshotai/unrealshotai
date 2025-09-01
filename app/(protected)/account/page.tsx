import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AccountDashboard } from '@/components/account/account-dashboard'

export default async function AccountPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Fetch user's payment history
  const { data: payments } = await supabase
    .from('dodo_payments')
    .select(`
      *,
      pricing_plan:dodo_pricing_plans(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get user's current credit balance
  const { data: credits } = await supabase
    .from('credits')
    .select('credits')
    .eq('user_id', user.id)
    .single()

  // Calculate total credits purchased from completed payments
  const totalCreditsPurchased = payments
    ?.filter(payment => payment.status === 'completed')
    ?.reduce((sum, payment) => sum + payment.credits, 0) || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile, view payment history, and track your credits
        </p>
      </div>
      
      <AccountDashboard 
        user={user}
        payments={payments || []}
        currentCredits={credits?.credits || 0}
        totalCreditsPurchased={totalCreditsPurchased}
      />
    </div>
  )
}

export const metadata = {
  title: 'Account',
  description: 'Manage your account, view payment history, and track credits',
}
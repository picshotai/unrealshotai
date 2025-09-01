import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DemoTool from '@/components/demo-tool'

export default async function DemoToolPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <DemoTool />
    </div>
  )
}

export const metadata = {
  title: 'Secure API Demo Tool',
  description: 'Demonstration of secure API implementation with authentication, CSRF protection, and rate limiting.',
}
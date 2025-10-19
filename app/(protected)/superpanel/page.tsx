import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

function isAdminEmail(email?: string | null) {
  const env = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return !!email && env.includes(email.toLowerCase())
}

async function addCreditsAction(formData: FormData) {
  'use server'
  const userId = String(formData.get('userId') || '')
  const amount = Number(formData.get('amount') || '0')
  if (!userId || !(amount > 0)) return
  const admin = createAdminClient()
  const { data: existing } = await admin.from('credits').select('credits').eq('user_id', userId).single()
  if (!existing) {
    await admin.from('credits').insert({ user_id: userId, credits: amount })
  } else {
    await admin.from('credits').update({ credits: (existing.credits || 0) + amount }).eq('user_id', userId)
  }
  revalidatePath('/(protected)/__admin')
}

async function setCreditsAction(formData: FormData) {
  'use server'
  const userId = String(formData.get('userId') || '')
  const balance = Number(formData.get('balance') || '0')
  if (!userId) return
  const admin = createAdminClient()
  const { data: existing } = await admin.from('credits').select('credits').eq('user_id', userId).single()
  if (!existing) {
    await admin.from('credits').insert({ user_id: userId, credits: balance })
  } else {
    await admin.from('credits').update({ credits: balance }).eq('user_id', userId)
  }
  revalidatePath('/(protected)/__admin')
}

async function deleteModelAction(formData: FormData) {
  'use server'
  const modelIdRaw = String(formData.get('modelId') || '')
  const modelId = Number(modelIdRaw)
  if (!modelId || Number.isNaN(modelId)) return
  const admin = createAdminClient()
  // Delete prompts referencing this model (samples/images cascade via FKs)
  await admin.from('prompts').delete().eq('modelId', modelId)
  await admin.from('models').delete().eq('id', modelId)
  revalidatePath('/(protected)/__admin')
}

async function toggleAutoExtendAction(formData: FormData) {
  'use server'
  const modelIdRaw = String(formData.get('modelId') || '')
  const modelId = Number(modelIdRaw)
  const enable = String(formData.get('enable') || 'true') === 'true'
  if (!modelId || Number.isNaN(modelId)) return
  const admin = createAdminClient()
  await admin.from('models').update({ auto_extend: enable }).eq('id', modelId)
  revalidatePath('/(protected)/__admin')
}

async function updateSubscriptionStatusAction(formData: FormData) {
  'use server'
  const subId = String(formData.get('subId') || '')
  const status = String(formData.get('status') || '')
  if (!subId || !status) return
  const admin = createAdminClient()
  await admin.from('dodo_subscriptions').update({ status }).eq('id', subId)
  revalidatePath('/(protected)/__admin')
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email)) notFound()

  const admin = createAdminClient()
  const { data: latestModels } = await admin
    .from('models')
    .select('id, name, user_id, auto_extend, status, created_at')
    .order('created_at', { ascending: false })
    .limit(12)

  const { data: recentSubs } = await admin
    .from('dodo_subscriptions')
    .select('id, user_id, pricing_plan_id, status, dodo_subscription_id, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(10)

  // Compute expiry using created_at and auto_extend (14 vs 30 days)
  const computeExpiry = (m: { created_at: string; auto_extend: boolean | null }) => {
    try {
      const createdMs = new Date(m.created_at).getTime()
      const days = m.auto_extend ? 30 : 14
      const expiry = new Date(createdMs + days * 24 * 60 * 60 * 1000)
      return expiry.toLocaleString()
    } catch {
      return '-'
    }
  }
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Console</h1>
      <p className="text-sm text-muted-foreground">Private tools for credits, models and subscriptions. This route is gated and returns 404 for non-admins.</p>

      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
          <CardDescription>Add or set user credits by user_id (UUID).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form action={addCreditsAction} className="space-y-3">
              <Label htmlFor="userIdAdd">User ID</Label>
              <Input id="userIdAdd" name="userId" placeholder="00000000-0000-0000-0000-000000000000" />
              <Label htmlFor="amount">Amount to add</Label>
              <Input id="amount" name="amount" type="number" step="0.5" placeholder="10" />
              <Button type="submit">Add credits</Button>
            </form>
            <form action={setCreditsAction} className="space-y-3">
              <Label htmlFor="userIdSet">User ID</Label>
              <Input id="userIdSet" name="userId" placeholder="00000000-0000-0000-0000-000000000000" />
              <Label htmlFor="balance">Set balance to</Label>
              <Input id="balance" name="balance" type="number" step="0.5" placeholder="60" />
              <Button type="submit" variant="secondary">Set balance</Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Models</CardTitle>
          <CardDescription>Delete models or toggle auto-extend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form action={deleteModelAction} className="space-y-3">
              <Label htmlFor="modelIdDelete">Model ID</Label>
              <Input id="modelIdDelete" name="modelId" placeholder="123" />
              <Button type="submit" variant="destructive">Delete model</Button>
            </form>
            <form action={toggleAutoExtendAction} className="space-y-3">
              <Label htmlFor="modelIdToggle">Model ID</Label>
              <Input id="modelIdToggle" name="modelId" placeholder="123" />
              <div className="flex items-center gap-3">
                <Label htmlFor="enable">Enable</Label>
                <Input id="enable" name="enable" defaultValue="true" />
              </div>
              <Button type="submit" variant="outline">Update auto-extend</Button>
            </form>
          </div>

          <Separator />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auto-extend</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestModels?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.id}</TableCell>
                    <TableCell>{m.name}</TableCell>
                    <TableCell className="text-xs">{m.user_id}</TableCell>
                    <TableCell>{m.status}</TableCell>
                    <TableCell>{m.auto_extend ? 'yes' : 'no'}</TableCell>
                    <TableCell>{computeExpiry(m)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>View and update local subscription status (DodoPayments).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={updateSubscriptionStatusAction} className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor="subId">Subscription row ID</Label>
              <Input id="subId" name="subId" placeholder="uuid" />
            </div>
            <div className="flex-1">
              <Label htmlFor="status">Status</Label>
              <Input id="status" name="status" placeholder="active | cancelled | expired | pending" />
            </div>
            <Button type="submit" variant="secondary">Update status</Button>
          </form>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Dodo Sub ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubs?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs">{s.id}</TableCell>
                    <TableCell className="text-xs">{s.user_id}</TableCell>
                    <TableCell className="text-xs">{s.pricing_plan_id}</TableCell>
                    <TableCell className="text-xs">{s.dodo_subscription_id || '-'}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>{s.updated_at ? new Date(s.updated_at).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
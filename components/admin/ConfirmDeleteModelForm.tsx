'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ConfirmDeleteModelForm({
  action,
}: {
  action: (formData: FormData) => void
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form
    if (!form) return
    const fd = new FormData(form)
    const modelId = String(fd.get('modelId') || '').trim()
    const msg = modelId
      ? `Delete model ${modelId} permanently?\nThis cannot be undone.`
      : 'Delete model permanently?\nThis cannot be undone.'
    const ok = window.confirm(msg)
    if (!ok) {
      e.preventDefault()
    }
  }

  return (
    <form action={action} className="space-y-3">
      <Label htmlFor="modelIdDelete">Model ID</Label>
      <Input id="modelIdDelete" name="modelId" placeholder="123" />
      <Button type="submit" variant="destructive" onClick={handleClick}>
        Delete model
      </Button>
    </form>
  )
}
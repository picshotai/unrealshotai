'use client'

import { Button } from '@/components/ui/button'

interface RefreshButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
}

export function RefreshButton({ variant = 'outline', className }: RefreshButtonProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Button 
      variant={variant}
      className={className}
      onClick={handleRefresh}
    >
      Refresh Status
    </Button>
  )
}
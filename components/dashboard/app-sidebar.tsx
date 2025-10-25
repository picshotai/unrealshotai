"use client"

import * as React from "react"
import {
  Send,
  SquareTerminal,
  Coins,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Sparkles as SparklesIcon,
  FolderOpen,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCreditManager } from "@/lib/credit-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"

const navSecondary = [
  {
    title: "Support",
    url: "mailto:support@unrealshot.com",
    icon: Send,
  },
]

// Credits Card Component
function CreditsCard({ userId }: { userId?: string }) {
  const { balance, loading } = useCreditManager(userId || null)
  
  if (loading) {
    return (
      <Card className="mb-4 py-2">
        <CardContent className="p-3">
          <div className="text-sm font-medium mb-1">Plan Usage</div>
          <div className="text-xs text-muted-foreground mb-3 justify-between">Loading...</div>
          <div className="w-full h-8 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="py-2">
      <CardContent className="gap-1 flex flex-col px-3">
        <div className="text-sm font-medium mb-1">Plan Usage</div>
        <div className="text-xs text-muted-foreground mb-3 flex justify-between">
          <span className="flex items-center gap-2"><Coins className="h-3 w-3" />Credits</span> <span className="text-amber-600"> {balance.toLocaleString()}</span>
        </div>
        <Button size="sm" className="w-full bg-black hover:bg-black/90 text-white border-0" asChild>
          <Link href="/buy-credits">
            <Sparkles className="h-3 w-3" /> Get Credits
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function AppSidebar({ 
  user,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
    id?: string
  }
}) {
  const userData = user || {
    name: "User",
    email: "user@example.com",
    avatar: "/placeholder-user.jpg",
  }

  const supabase = createClient()
  const [hasTrainedModel, setHasTrainedModel] = React.useState(false)

  React.useEffect(() => {
    let active = true
    ;(async () => {
      try {
        let uid = userData.id
        if (!uid) {
          const { data: { user } } = await supabase.auth.getUser()
          uid = user?.id
        }
        if (!uid) {
          if (active) setHasTrainedModel(false)
          return
        }
        const { data } = await supabase
          .from("models")
          .select("id")
          .eq("user_id", uid)
          .eq("status", "finished")
          .limit(1)
        if (active) setHasTrainedModel(!!data && data.length > 0)
      } catch (e) {
        if (active) setHasTrainedModel(false)
      }
    })()
    return () => { active = false }
  }, [supabase, userData.id])

  const navItems = React.useMemo(() => [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    ...(hasTrainedModel ? [
      {
        title: "Generate Photos",
        url: "/generate-image",
        icon: SparklesIcon,
      },
    ] : []),
    {
      title: "Trained Models",
      url: "/trained-models",
      icon: FolderOpen,
    },
    {
      title: "My Gallery",
      url: "/gallery",
      icon: ImageIcon,
    },
    {
      title: "Photo Upload Guide",
      url: "/photo-upload-guide",
      icon: Upload,
    },
  ], [hasTrainedModel])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
               <Link href="/">
                  <Image src="/site-logo.png" alt="Unrealshot AI" width={30} height={30} className="rounded-sm"/>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Unrealshot AI</span>
                  <span className="truncate text-xs">Realistic AI Photoshoots</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <CreditsCard userId={userData.id} />
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

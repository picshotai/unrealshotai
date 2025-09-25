"use client"

import * as React from "react"
import {
  Command,
  Send,
  SquareTerminal,
  Coins,
  Sparkles,
  Image,
  Upload,
  Sparkles as SparklesIcon,
  FolderOpen,
} from "lucide-react"
import Link from "next/link"
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Generate Photos",
      url: "/generate-image",
      icon: SparklesIcon,
    },
    
    {
      title: "Trained Models",
      url: "/trained-models",
      icon: FolderOpen,
    },
  {
      title: "My Gallery",
      url: "/gallery",
      icon: Image,
    },
{
      title: "Photo Upload Guide",
      url: "/photo-upload-guide",
      icon: Upload,
    },
    
   ],
   navSecondary: [
   
    {
      title: "Support",
      url: "mailto:support@unrealshot.com",
      icon: Send,
    },
  ],
 
}

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
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Unrealshot AI</span>
                  <span className="truncate text-xs">Realistic AI Photoshoots</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <CreditsCard userId={userData.id} />
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

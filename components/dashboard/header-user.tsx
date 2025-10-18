"use client"

import {
  BadgeCheck,
  Bell,
  Coins,
  Home,
  LogOut,
  Sparkles,
} from "lucide-react"
import { signOut } from "@/app/auth/signout/actions"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useCreditManager } from "@/lib/credit-manager"

interface HeaderUserProps {
  user: {
    name: string
    email: string
    avatar: string
    id: string
  }
  initialCreditBalance: number
}

export function HeaderUser({ user, initialCreditBalance }: HeaderUserProps) {
  const { balance: creditBalance } = useCreditManager(user.id)
  return (
    <div className="flex items-center gap-3">
      {/* Credit Display */}
      <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md">
        <Coins className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-medium text-foreground">
          {creditBalance.toLocaleString()}
        </span>
      </div>
      
      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/buy-credits" className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Buy Credits
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
       
        <DropdownMenuGroup>
           <DropdownMenuItem>
            <Link href="/dashboard" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <BadgeCheck className="mr-2 h-4 w-4" />
            <Link href="/account">Account</Link>  
          </DropdownMenuItem>
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut()
          }}
          className="cursor-pointer text-red-600 focus:text-red-800"
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600 focus:text-red-800" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
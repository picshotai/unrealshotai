"use client"

import type { Database } from "@/types/supabase"
import type { creditsRow } from "@/types/utils"
import { createBrowserClient } from "@supabase/ssr" // Updated import
import { useEffect, useState } from "react"
import { Coins } from "lucide-react"

export const revalidate = 0

type ClientSideCreditsProps = {
  creditsRow: creditsRow | null
}

export default function ClientSideCredits({ creditsRow }: ClientSideCreditsProps) {
  if (!creditsRow)
    return (
      <p>
        <Coins className="inline-block mr-1" size={16} /> 0
      </p>
    )

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )
  const [credits, setCredits] = useState<creditsRow>(creditsRow)

  useEffect(() => {
    const channel = supabase
      .channel("realtime credits")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "credits" },
        (payload: { new: creditsRow }) => {
          setCredits(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (!credits) return null

  return (
    <p className="group inline-flex w-max items-center justify-center rounded-md bg-gradient-to-r to-blue-500 from-indigo-700 text-white hover:text-gray-200 hover:from-indigo-600 hover:to-blue-600 text-primary-foreground px-2 py-1 text-sm transition-colors hover:bg-primary/90 focus:bg-primary/90 focus:outline-none disabled:pointer-events-none disabled:opacity-50 font-medium shadow-sm">
      <Coins className="inline-block mr-1.5" size={14} />
      {credits.credits}
    </p>
  )
}
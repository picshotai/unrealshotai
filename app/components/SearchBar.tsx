"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      if (searchQuery) {
        router.push(`/blog?search=${encodeURIComponent(searchQuery)}`)
      } else {
        router.push("/blog")
      }
    })
  }

  const handleReset = () => {
    setSearchQuery("")
    router.push("/blog")
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search blog posts..."
            className="pl-10 pr-10 py-2 w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isPending}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleReset}
              disabled={isPending}
            >
              <X className="h-4 w-4 text-gray-400" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button
          type="submit"
          disabled={!searchQuery || isPending}
          className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        >
          Search
        </Button>
      </form>
    </div>
  )
}


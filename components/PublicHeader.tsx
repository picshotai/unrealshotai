"use client"

import Link from "next/link"
import clsx from "clsx"
import { useState } from "react"
import { useRouter } from "next/navigation"

const navItems = [
  { href: "/", label: "Home" },
  { href: "#bento", label: "Features" },
  
]

export function Header() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()



  return (
    <div className="flex flex-col items-center justify-center py-6">
      <nav className="bg-slate-1 rounded-full">
        <div
          className={clsx("bg-slate-1 rounded-full p-1 flex relative items-center", "shadow-sm border border-slate-6")}
        >
          {/* Animated background for navigation only */}
          <div
            className="absolute bg-slate-12 rounded-full transition-all duration-300 ease-out"
            style={{
              left: `${4 + activeIndex * 120}px`,
              width: "80px",
              height: "35px",
              top: "4px",
            }}
          />

          {/* Navigation items */}
          {navItems.map(({ href, label }, index) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full w-[90px] text-center",
                index === activeIndex ? "text-slate-1" : "text-slate-11 hover:text-slate-12",
              )}
            >
              {label}
            </Link>
          ))}

          {/* Sign In / User Menu - Inside the navigation container */}
          <div className="relative z-10 ml-2 border-l border-slate-6">
            
            
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-11 hover:text-slate-12 transition-colors rounded-full hover:bg-slate-3"
                >
                  Sign In
                </Link>
            
          </div>
        </div>
      </nav>
    </div>
  )
}

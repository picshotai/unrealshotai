import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  RocketIcon,
} from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
     <section className="relative min-h-screen overflow-hidden">
        {/* Background Decorations - Extended to very top of page */}
        <div className="fixed top-0 left-0 z-0 grid h-screen w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] pointer-events-none">
          <div className="col-span-1 flex h-full items-center justify-center border-r border-slate-6" />
          <div className="col-span-1 flex h-full items-center justify-center" />
          <div className="col-span-1 flex h-full items-center justify-center border-l border-slate-6" />
        </div>

        {/* Blur Effects */}
        <figure className="pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[200px]" />
        <figure className="pointer-events-none absolute left-[4vw] top-[64px] z-20 hidden aspect-square w-[32vw] rounded-full bg-muted opacity-50 blur-[100px] md:block" />
        <figure className="pointer-events-none absolute bottom-[-50px] right-[7vw] z-20 hidden aspect-square w-[30vw] rounded-full bg-muted opacity-50 blur-[100px] md:block" />

        {/* Content */}
        <div className="relative z-10 flex flex-col divide-y divide-border pt-14">
          <div className="flex flex-col items-center justify-end">
            <div className="flex items-center gap-2 border border-b-0 border-border px-4 py-2 rounded-t-lg bg-card">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-background" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-background" />
              </div>
              <p className="text-sm tracking-tight text-muted-foreground">Trusted by 11+ developers</p>
            </div>
          </div>

          <div>
            <div className="mx-auto flex min-h-[288px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-6 px-2 py-4 sm:px-16 lg:px-24">
              <Badge variant="secondary" className="mb-4 mt-8">
                <RocketIcon className="w-3 h-3 mr-1" />
                Ship faster with Unboilerplate
              </Badge>
              <h1 className="max-w-4xl text-pretty text-center text-[clamp(32px,7vw,64px)] font-medium leading-none tracking-[-1.44px] text-foreground md:tracking-[-2.16px] mb-4">
                The Cure for Boilerplate Fatigue
              </h1>
              <h2 className="max-w-2xl text-pretty text-center text-lg text-muted-foreground md:text-xl mb-8">
                A brutally simple Next.js boilerplate with auth and a clean one-time payment setup. Go from a blank folder to a working app in the time it takes to brew your coffee...
              </h2>
            </div>
          </div>

          {/* CTA Buttons - Aligned with grid columns but constrained width */}
          <div className="grid grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] w-full relative">
            <div className="col-span-1"></div>
            <div className="col-span-1 flex flex-col items-center">
              <div className="flex w-full max-w-[80vw] flex-col items-center justify-start md:max-w-[392px]">
                <Link
                  href="/lifetime"
                  className="flex h-14 w-full flex-col items-center justify-center bg-slate-12 text-slate-1 text-base font-medium hover:bg-slate-11 transition-colors group border-x border-slate-12"
                >
                  <span className="flex items-center gap-2">
                    Get Unboilerplate - $25
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <Link
                  href="/blocks"
                  className="flex h-14 w-full flex-col items-center justify-center border border-slate-6 bg-transparent backdrop-blur-xl transition-colors duration-150 hover:bg-slate-12/5 text-slate-12"
                >
                  View Live Demo
                </Link>
              </div>
            </div>
            <div className="col-span-1"></div>

            {/* Horizontal grid lines below the buttons */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-6 col-span-3"></div>
          </div>
        </div>
      </section>

  )
}
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

const FinalCTASection = () => {
  return (
    <section className="relative min-h-[calc(100vh-var(--header-height))] overflow-hidden">
      {/* Background Grid Lines - Extended to very top of page */}
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
        <div>
          <div className="mx-auto flex min-h-[400px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-8 px-2 py-16 sm:px-16 lg:px-24">
            <Badge variant="outline" className="bg-primary/10 border-primary/20">
              <RocketIcon className="w-3 h-3 mr-1" />
              Ready to Ship
            </Badge>
            
            <h1 className="max-w-4xl text-pretty text-center text-[clamp(32px,7vw,64px)] font-medium leading-none tracking-[-1.44px] text-foreground md:tracking-[-2.16px]">
              Stop Building Infrastructure.
              <br />
              Start Building Products.
            </h1>
            
            <p className="max-w-2xl text-pretty text-center text-lg text-muted-foreground md:text-xl leading-relaxed">
              Get the foundation you need to focus on what makes your product unique.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground mt-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>No vendor lock-in</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Own your code</span>
              </div>
            </div>
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
  );
};

export default FinalCTASection;
import { CheckIcon } from "lucide-react";

export const OfferSection = () => {
  return (
    <div className="border-x mx-5 md:mx-10 relative">
        {/* Creative Lines */}
        <div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-slate-12/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] border border-b-0 border-r-0 border-t-0"></div>
        <div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-slate-12/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] border border-t-0 border-b-0 border-l-0"></div>

        {/* Grid Background */}
        <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
          <div className="col-span-1 flex h-full items-center justify-center border-r border-border/30">
            <div className="flex h-full w-full flex-col justify-center opacity-20 space-y-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-px w-full bg-border" />
              ))}
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-1 flex h-full items-center justify-center border-l border-border/30">
            <div className="flex h-full w-full flex-col justify-center opacity-20 space-y-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-px w-full bg-border" />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 sm:px-6 py-20 sm:py-32">
          {/* Section Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Launch Offer</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h2 className="text-[clamp(36px,7vw,64px)] font-medium leading-tight tracking-[-1.6px] text-foreground mb-4">
              Get Your Kick-Start.
              <br />
              <span className="text-muted-foreground">Forever.</span>
            </h2>
            <p className="text-xl text-muted-foreground">No subscriptions. No tiers. No nonsense.</p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto">
            <div className="relative p-8 sm:p-12 rounded-3xl border-2 border-primary/20 bg-background/50 backdrop-blur-sm">
              {/* Launch Offer Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  LAUNCH OFFER
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8 pt-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-5xl sm:text-6xl font-bold text-foreground">$25</span>
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground line-through">Standard Price:</div>
                    <div className="text-lg text-muted-foreground line-through">$39</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">For the first 100 builders or until [Date]</p>
              </div>

              {/* CTA Button */}
              <button className="w-full py-4 px-8 rounded-2xl bg-foreground text-background font-medium text-lg hover:bg-foreground/90 transition-colors duration-200 mb-8">
                Get the Kick-Starter & Lifetime Access
              </button>

              {/* Value Props */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">One-time payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Use on unlimited projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Lifetime access to updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Clean, commented codebase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
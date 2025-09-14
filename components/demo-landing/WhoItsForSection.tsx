import { CheckIcon } from "lucide-react";

export const WhoItsForSection = () => {
  return (
      <section className="relative min-h-[90vh] overflow-hidden border-b border-border bg-gradient-to-b from-muted/20 to-background">
        <div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-slate-12/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] border border-b-0 border-r-0 border-t-0"></div>
        <div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-slate-12/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] border border-t-0 border-b-0 border-l-0"></div>

        {/* Grid Background */}
        <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
          <div className="col-span-1 flex h-full items-center justify-center border-r border-border/30">
            <div className="flex h-full w-full flex-col justify-center opacity-20 space-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-px w-full bg-border" />
              ))}
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-1 flex h-full items-center justify-center border-l border-border/30">
            <div className="flex h-full w-full flex-col justify-center opacity-20 space-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-px w-full bg-border" />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 sm:px-6 py-16 sm:py-24">
          {/* Section Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-muted-foreground">Your Tribe</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-16">
            <h2 className="text-[clamp(32px,6vw,56px)] font-medium leading-tight tracking-[-1.4px] text-foreground mb-6">
              This Was Built For You If...
            </h2>
          </div>

          {/* Tribe Cards */}
          <div className="grid gap-8 md:gap-12 max-w-4xl mx-auto">
            {/* Indie Hacker */}
            <div className="group relative p-8 rounded-3xl border border-border/60 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mt-1">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-lg leading-relaxed text-foreground">
                    You're a <span className="font-medium text-primary">pragmatic Indie Hacker</span> who needs to ship
                    and validate ideas this weekend, not next month.
                  </p>
                </div>
              </div>
            </div>

            {/* Experienced Developer */}
            <div className="group relative p-8 rounded-3xl border border-border/60 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mt-1">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-lg leading-relaxed text-foreground">
                    You're an <span className="font-medium text-primary">experienced Developer</span> who has your own
                    strong opinions and just wants a clean, reliable starting line.
                  </p>
                </div>
              </div>
            </div>

            {/* Freelancer */}
            <div className="group relative p-8 rounded-3xl border border-border/60 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mt-1">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-lg leading-relaxed text-foreground">
                    You're a <span className="font-medium text-primary">Freelancer</span> who needs to spin up robust,
                    production-ready projects for clients without inheriting a mountain of boilerplate debt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="text-center mt-16">
            <p className="text-xl text-muted-foreground font-medium">
              This was built for <span className="text-foreground">builders who want to build.</span>
            </p>
          </div>
        </div>
      </section>
  );
};
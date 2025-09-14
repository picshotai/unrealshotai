import { Badge } from "@/components/ui/badge";
import { CreativeGridLines } from "@/components/ui/creative-grid-lines";

export default function BentoSection() {
  return (
    <section id="bento" className="flex flex-col items-center justify-center w-full relative px-5 md:px-10 border-t">
        <div className="border-x mx-5 md:mx-10 relative min-h-screen">
          {/* Creative Grid Lines */}
          <div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-slate-12/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] border border-b-0 border-r-0 border-t-0 border-l"></div>
          <div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-slate-12/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] border border-t-0 border-b-0 border-l-0"></div>

          {/* Grid Background */}
          <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
            <div className="col-span-1 flex h-full items-center justify-center border-r border-border/30">
              {/* Left side decorative lines */}
              <div className="flex h-full w-full flex-col justify-center space-y-8 opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-px w-full bg-border" />
                ))}
              </div>
            </div>
            <div className="col-span-1 flex h-full items-center justify-center" />
            <div className="col-span-1 flex h-full items-center justify-center border-l border-border/30">
              {/* Right side decorative lines */}
              <div className="flex h-full w-full flex-col justify-center space-y-8 opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-px w-full bg-border" />
                ))}
              </div>
            </div>
          </div>

          {/* Subtle blur effects */}
          <figure className="pointer-events-none absolute left-1/4 top-1/4 z-0 aspect-square w-[40vw] rounded-full bg-muted/30 blur-[120px]" />
          <figure className="pointer-events-none absolute bottom-1/4 right-1/4 z-0 aspect-square w-[35vw] rounded-full bg-muted/20 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 py-24 sm:px-4 sm:py-14 border-t-0">
            {/* Section Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">The Truth</span>
              </div>
            </div>

            {/* Main Statement */}
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-[clamp(24px,5vw,42px)] font-bold leading-tight tracking-tight text-foreground max-w-4xl mx-auto">
                This Boilerplate Isn't for People Who{" "}
                <span className="relative text-muted-foreground">
                  Can't
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 -rotate-12 transform"></div>
                </span>{" "}
                Build It.
              </h2>
              <h3 className="text-[clamp(20px,4vw,32px)] font-semibold text-foreground">
                It's for People Who{" "}
                <span className="bg-gradient-to-r from-primary/20 to-primary/10 px-2 py-1 rounded">Won't</span>.
              </h3>
            </div>

            {/* Core Value Propositions */}
            <div className="max-w-4xl mx-auto space-y-8 mb-12">
              {/* Time Value */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-6 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm max-w-[90vw] sm:max-w-[80vw]">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-primary/50 relative">
                    <div className="absolute top-1 left-1/2 w-0.5 h-2 bg-primary/50 transform -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-1.5 h-0.5 bg-primary/50 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-foreground mb-2">You don't pay because you lack the skill.</p>
                  <p className="text-muted-foreground">
                    You pay because your time is worth more than the cost of reinventing the wheel.
                  </p>
                </div>
              </div>

              {/* Creative Energy */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-6 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <div className="w-6 h-6 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-orange-500/50"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-orange-500/50 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-1 bg-orange-500/50 transform -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-foreground mb-2">Your creative energy is finite.</p>
                  <p className="text-muted-foreground">
                    It should be spent on your product's unique features, not on boilerplate code.
                  </p>
                </div>
              </div>

              {/* Momentum */}
              <div className="flex flex-col sm:flex-row items-start gap-4 p-6 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <div className="w-6 h-6 relative">
                    <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-green-500/50 transform -translate-y-1/2"></div>
                    <div className="absolute right-0 top-1/2 w-0 h-0 border-l-2 border-t border-b border-green-500/50 transform -translate-y-1/2"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-foreground mb-2">
                    Momentum separates shipped projects from dead ones.
                  </p>
                  <p className="text-muted-foreground">
                    The difference between success and failure is staying focused on what matters.
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Statement */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="p-6 border border-border/50 rounded-xl bg-background/50 backdrop-blur-sm">
                <p className="text-lg text-muted-foreground mb-3">This isn't a shortcut for beginners.</p>
                <p className="text-xl font-semibold text-foreground mb-3">It's an accelerator for professionals.</p>
                <p className="text-muted-foreground">
                  For developers who understand that the real challenge isn't connecting APIs—it's staying focused long
                  enough to bring an idea to life.
                </p>
              </div>
            </div>

            {/* The $25 Value Proposition */}
            <div className="max-w-2xl mx-auto">
              <div className="relative p-8 border-2 border-primary/20 rounded-2xl bg-gradient-to-br from-background/90 to-card/50 backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-sm text-muted-foreground">For just</span>
                    <span className="text-4xl font-bold text-foreground">$25</span>
                    <span className="text-sm text-muted-foreground">you don't buy code</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>You buy back your Saturday</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>You buy back your momentum</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>You buy a direct path to line one of your idea</span>
                    </div>
                  </div>
                </div>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
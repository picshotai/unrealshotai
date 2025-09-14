import { Badge } from "@/components/ui/badge"
import {
  CpuIcon,
  PaletteIcon,
  RocketIcon,
  ZapIcon,
} from "lucide-react"

export default function PivotSection() {
  return (
     <section className="relative mi  n-h-[90vh] overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
        {/* Grid Background - Same as hero */}
        <div className="absolute left-0 top-0 z-1 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
          <div className="col-span-1 flex h-full items-center justify-center" />
          <div className="col-span-1 flex h-full items-center justify-center" />
          <div className="col-span-1 flex h-full items-center justify-center" />
        </div>

        {/* Sophisticated blur effects for transition feel */}
        <figure className="pointer-events-none absolute -z-1 left-[20%] top-[15%] aspect-square w-[30vw] rounded-full bg-primary/15 blur-[150px]" />
        <figure className="pointer-events-none absolute z-0 right-[25%] bottom-[20%] aspect-square w-[25vw] rounded-full bg-green-500/10 blur-[120px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col divide-y divide-border">
          {/* Header */}
          <div className="flex flex-col items-center justify-center py-14">
            <div className="mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 text-center sm:px-6">
              <Badge variant="outline" className="mb-8 bg-primary/10 border-primary/20">
                <RocketIcon className="w-3 h-3 mr-1" />
                The Pivot
              </Badge>
              <h2 className="text-[clamp(32px,6vw,56px)] font-medium leading-tight tracking-[-1.4px] text-foreground mb-8">
                The Better Way...
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A boilerplate should be a <span className="text-primary font-medium">foundation</span>, not a furnished
                house you have to remodel.
              </p>
            </div>
          </div>

          {/* Visual Comparison */}

          {/* Philosophy Section */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 text-center sm:px-6">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
                  <h3 className="text-2xl font-medium mb-6 text-foreground">Every project is unique.</h3>
                  <div className="grid gap-6 md:grid-cols-3 text-left">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                        <CpuIcon className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground">Your Architecture</h4>
                      <p className="text-sm text-muted-foreground">
                        Design patterns that fit your specific needs and scale requirements.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
                        <ZapIcon className="w-4 h-4 text-green-500" />
                      </div>
                      <h4 className="font-medium text-foreground">Your Feature Set</h4>
                      <p className="text-sm text-muted-foreground">
                        Build only what you need, when you need it, without bloat.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                        <PaletteIcon className="w-4 h-4 text-blue-500" />
                      </div>
                      <h4 className="font-medium text-foreground">Your Design</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete creative control over the user experience and branding.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    So why start with a rigid, opinionated framework that forces you to build <em>their</em> way?
                  </p>

                  <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
                    <p className="text-lg text-foreground mb-4">
                      <strong>The Kick-Starter</strong> isn't about giving you more features.
                    </p>
                    <p className="text-lg text-primary font-medium">
                      It's about giving you back your <span className="underline">freedom</span> and your most valuable
                      asset: <span className="underline">momentum</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
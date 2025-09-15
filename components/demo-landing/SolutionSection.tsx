import { Badge } from "@/components/ui/badge";
import { ClockIcon, ZapIcon, RocketIcon } from "lucide-react";

export default function SolutionSection() {
  return (
      <section className="relative min-h-[90vh] overflow-hidden border-b border-border bg-gradient-to-b from-muted/20 to-background">
        {/* Grid Background - Same as hero */}
        <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
          <div className="col-span-1 flex h-full items-center justify-center" />
          <div className="col-span-1 flex h-full items-center justify-center" />
          <div className="col-span-1 flex h-full items-center justify-center" />
        </div>

        {/* Energetic blur effects for solution feel */}
        <figure className="pointer-events-none absolute left-[15%] top-[10%] z-0 aspect-square w-[35vw] rounded-full bg-green-500/5 blur-[160px]" />
        <figure className="pointer-events-none absolute left-1/2 top-1/3 z-0 aspect-square w-[50vw] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[220px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col divide-y divide-border">
          {/* Header with Timer */}
          <div className="flex flex-col items-center justify-center py-20 border-t mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 sm:px-6">
            <div className="text-center justify-center px-2 text-center sm:px-6 flex flex-col items-center">
              <Badge variant="outline" className="mb-8 bg-green-500/10 border-green-500/20">
                <ZapIcon className="w-3 h-3 mr-1 text-green-500" />
                The Solution
              </Badge>

              {/* Timer Display */}
              <div className="mb-8 inline-flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Setup Time:</span>
                </div>
                <div className="text-3xl font-mono font-bold text-primary">5:00</div>
                <div className="text-sm text-muted-foreground">minutes</div>
              </div>

              <h2 className="text-[clamp(32px,6vw,56px)] font-medium leading-tight tracking-[-1.4px] text-foreground mb-8">
                The 5-Minute Promise
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
                Here's The Workflow. <span className="text-foreground font-medium">All Of It.</span> This isn't an exaggeration. This is the <em>entire</em> setup process.
              </p>
            </div>
          </div>

          {/* 3-Step Process */}
          <div className="flex items-center justify-center mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-8 py-12">
              {/* Progress Timeline */}
              <div className="mb-16 flex items-center justify-center">
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
                  {[1, 2, 3].map((step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {step}
                        </div>
                        <span className="text-sm font-medium text-foreground hidden sm:block">
                          {step === 1 ? "Clone" : step === 2 ? "Configure" : "Launch"}
                        </span>
                      </div>
                      {index < 2 && <div className="w-8 h-0.5 bg-primary/30 hidden sm:block" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps Grid */}
              <div className="grid gap-8 lg:gap-12">
                {/* Step 1: Clone the Repo */}
                <div className="group">
                  <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:bg-card/50 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">1</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-foreground mb-2">Clone the Repo</h3>
                        <p className="text-muted-foreground mb-4">
                          Get a clean, local copy of the codebase. No complex installers.
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <ClockIcon className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">30 seconds</span>
                      </div>
                    </div>

                    {/* Terminal */}
                    <div className="rounded-lg border border-border bg-background/80 backdrop-blur-sm overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">Terminal</span>
                      </div>
                      <div className="p-4 font-mono text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <span className="text-primary">$</span>
                          <span className="text-foreground">git clone [your-repo-url] my-new-app</span>
                        </div>
                        <div className="text-green-500 text-xs">Cloning into 'my-new-app'...</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Add Your Keys */}
                <div className="group">
                  <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:bg-card/50 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-blue-500">2</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-foreground mb-2">Add Your Keys</h3>
                        <p className="text-muted-foreground mb-4">
                          Open the .env.local.example file, rename it, and paste in your credentials.
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <ClockIcon className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">2 minutes</span>
                      </div>
                    </div>

                    {/* Environment File */}
                    <div className="rounded-lg border border-border bg-background/80 backdrop-blur-sm overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                        <div className="w-3 h-3 rounded bg-blue-500" />
                        <span className="text-sm text-muted-foreground">.env.local</span>
                      </div>
                      <div className="p-4 font-mono text-sm space-y-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground"># Database</span>
                          <span className="text-foreground">
                            SUPABASE_URL="<span className="text-green-500">your-project-url</span>"
                          </span>
                          <span className="text-foreground">
                            SUPABASE_ANON_KEY="<span className="text-green-500">your-anon-key</span>"
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground"># Payments</span>
                          <span className="text-foreground">
                            DODOPAYMENTS_API_KEY="<span className="text-green-500">your-api-key</span>"
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Run the Dev Server */}
                <div className="group">
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:bg-primary/10 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">3</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-foreground mb-2">Run the Dev Server</h3>
                        <p className="text-muted-foreground mb-4">
                          That's it. Your new app is running locally with a database, authentication, and payments ready
                          to go.
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <ClockIcon className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">30 seconds</span>
                      </div>
                    </div>

                    {/* Terminal Success */}
                    <div className="rounded-lg border border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/20 bg-primary/5">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">Terminal</span>
                      </div>
                      <div className="p-4 font-mono text-sm space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-primary">$</span>
                          <span className="text-foreground">npm run dev</span>
                        </div>
                        <div className="text-green-500 text-xs space-y-1">
                          <div>✓ Ready in 2.3s</div>
                          <div>✓ Database connected</div>
                          <div>✓ Auth configured</div>
                          <div>✓ Payments ready</div>
                          <div className="text-primary font-medium">→ Local: http://localhost:3000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message - Compact Before→After Bar */}
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 text-center sm:px-6">
              <div className="max-w-3xl mx-auto">
                {/* Compact success caption */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-3 py-1 mb-4">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <RocketIcon className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <span className="text-sm text-foreground/90">Ready to build, not deconstruct.</span>
                </div>

                {/* Before → After comparison bar */}
                <div className="relative w-full overflow-hidden rounded-xl border border-border/60 bg-background/80 backdrop-blur-sm">
                  <div className="grid grid-cols-2">
                    {/* Before */}
                    <div className="flex h-16 sm:h-20 items-center justify-center bg-destructive/5 text-destructive border-r border-border/60">
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold">8–12 hrs</div>
                        <div className="text-xs text-muted-foreground">Other boilerplates</div>
                      </div>
                    </div>
                    {/* After */}
                    <div className="flex h-16 sm:h-20 items-center justify-center bg-primary/5 text-primary">
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold">5 mins</div>
                        <div className="text-xs text-muted-foreground">Unboilerplate</div>
                      </div>
                    </div>
                  </div>

                  {/* Center divider + arrow */}
                  <div className="absolute inset-y-0 left-1/2 w-px bg-border/60" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background/90 px-2 py-0.5 text-xs text-muted-foreground">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
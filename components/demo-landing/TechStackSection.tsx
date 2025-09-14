import { CodeIcon, DatabaseIcon, PaletteIcon, ShieldIcon, ZapIcon, GlobeIcon, RocketIcon } from "lucide-react";

export default function TechStackSection() {
  return (
    <section
      id="tech-stack"
      className="relative min-h-screen border-b border-border"
    >
   
      <div className="relative grid grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] min-h-screen">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Left Grid Line */}
        <div className="relative border-border/40 border-r-0">
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mx-auto max-w-[90vw] sm:max-w-[80vw] px-2 text-center sm:px-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                <span className="text-sm text-muted-foreground font-medium">Tech Stack</span>
              </div>
              <h2 className="text-[clamp(32px,6vw,56px)] font-medium leading-tight tracking-[-1.4px] text-foreground mb-4">
                Just the Good Stuff.
                <br />
                Zero Fluff.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Every choice was made to maximize your control and minimize complexity.
              </p>
            </div>
          </div>

          {/* Tech Stack Blueprint */}
          <div className="flex items-center justify-center px-2 py-12 sm:px-6">
            <div className="w-full max-w-[90vw] sm:max-w-[80vw]">
              
                {/* Blueprint Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/40">
                  <div>
                    <h3 className="text-xl font-medium text-foreground mb-1">Architecture Specification</h3>
                    <p className="text-sm text-muted-foreground">Modern, powerful, and intentionally lean.</p>
                  </div>
                  <div className="text-xs text-muted-foreground/60 font-mono">v1.0</div>
                </div>

                {/* Tech Stack Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="group relative p-6 rounded-2xl border border-border/30 bg-background/20 hover:bg-background/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-border/40 bg-background/50 flex items-center justify-center">
                        <CodeIcon className="w-6 h-6 text-foreground/70" />
                      </div>
                      <h4 className="text-lg font-medium text-foreground">Next.js 15 + TypeScript</h4>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        App Router, Server Components, and full TypeScript support for modern React development.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary border border-primary/20">
                          App Router
                        </span>
                        <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          TypeScript
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Supabase */}
                  <div className="group relative p-6 rounded-2xl border border-border/30 bg-background/20 hover:bg-background/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-border/40 bg-background/50 flex items-center justify-center">
                        <DatabaseIcon className="w-6 h-6 text-foreground/70" />
                      </div>
                      <h4 className="text-lg font-medium text-foreground">Supabase</h4>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        PostgreSQL database with built-in authentication, real-time subscriptions, and edge functions.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-500 border border-green-500/20">
                          Auth
                        </span>
                        <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          PostgreSQL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tailwind CSS */}
                  <div className="group relative p-6 rounded-2xl border border-border/30 bg-background/20 hover:bg-background/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-border/40 bg-background/50 flex items-center justify-center">
                        <PaletteIcon className="w-6 h-6 text-foreground/70" />
                      </div>
                      <h4 className="text-lg font-medium text-foreground">Tailwind CSS + shadcn/ui</h4>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Utility-first CSS with beautiful, accessible components that you actually own.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                          Utility-First
                        </span>
                        <span className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-500 border border-purple-500/20">
                          Components
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DodoPayments */}
                  <div className="group relative p-6 rounded-2xl border border-border/30 bg-background/20 hover:bg-background/40 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-border/40 bg-background/50 flex items-center justify-center">
                        <ZapIcon className="w-6 h-6 text-foreground/70" />
                      </div>
                      <h4 className="text-lg font-medium text-foreground">DodoPayments</h4>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Simple, developer-friendly payment processing with webhooks and subscription management.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-500 border border-green-500/20">
                          Payments
                        </span>
                        <span className="px-2 py-1 text-xs rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                          Webhooks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why These Choices */}
                <div className="mt-12 pt-8 border-t border-border/40">
                  <h4 className="text-lg font-medium text-foreground mb-6 text-center">Why These Choices?</h4>
                  <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div className="p-4 rounded-xl border border-border/30 bg-background/10">
                      <ShieldIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h5 className="font-medium text-foreground mb-2">Battle-Tested</h5>
                      <p className="text-sm text-muted-foreground">
                        Every tool has been proven in production by thousands of developers.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/30 bg-background/10">
                      <GlobeIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h5 className="font-medium text-foreground mb-2">Future-Proof</h5>
                      <p className="text-sm text-muted-foreground">
                        Built on web standards and maintained by companies you can trust.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/30 bg-background/10">
                      <RocketIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <h5 className="font-medium text-foreground mb-2">Developer Joy</h5>
                      <p className="text-sm text-muted-foreground">
                        Excellent documentation, great DX, and active communities.
                      </p>
                    </div>
                  </div>
                </div>
              
            </div>
          </div>
        </div>

        {/* Right Grid Line */}
        <div className="relative border-border/40 border-l-0">
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        </div>
      </div>
    </section>
  );
}
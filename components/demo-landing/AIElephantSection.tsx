export default function AIElephantSection() {
  return (
     <section id="bento" className="flex flex-col items-center justify-center w-full relative px-5 md:px-10 py-24">
        
          


          {/* Subtle blur effects */}
          <figure className="pointer-events-none absolute left-1/4 top-1/4 z-0 aspect-square w-[40vw] rounded-full bg-muted/30 blur-[120px]" />
          <figure className="pointer-events-none absolute bottom-1/4 right-1/4 z-0 aspect-square w-[35vw] rounded-full bg-muted/20 blur-[100px]" />

          
            {/* Section Badge */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-1">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">The Honest Truth</span>
              </div>
            </div>

            {/* Main Content - Visual Layout */}
            <div className="text-center space-y-12">
              <h2 className="text-[clamp(28px,6vw,48px)] font-semibold leading-tight tracking-tight text-foreground">
                The AI Elephant in the Room.
              </h2>

              {/* Visual Question Flow */}
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Setup */}
                <div className="flex items-center justify-center gap-4 text-lg text-muted-foreground">
                  
                  <span>You have AI tools.</span>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  <span>You can code.</span>
                </div>

                {/* The Big Question */}
                <div className="relative p-8 border-primary/20 rounded-2xl bg-card/30 backdrop-blur-sm border">
                  <div className="text-center space-y-4">
                    <p className="text-xl font-medium text-foreground">
                      Could you build this entire system yourself in 24 hours?
                    </p>
                    <div className="text-4xl font-bold text-green-500">YES</div>
                    <p className="text-lg text-muted-foreground">Absolutely.</p>
                  </div>
                </div>

                {/* The Reality Check - Visual Timeline */}
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-xl font-medium text-foreground mb-4">
                      But here's what your Saturday would look like:
                    </p>
                  </div>

                  {/* Task Timeline */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { time: "9:00 AM", task: "Wiring up Supabase auth", icon: "🔐" },
                      { time: "11:30 AM", task: "Wrestling with Next.js routes", icon: "🛣️" },
                      { time: "2:00 PM", task: "Setting up database tables", icon: "🗄️" },
                      { time: "4:30 PM", task: "Integrating payment webhooks", icon: "💳" },
                      { time: "7:00 PM", task: "Styling login pages", icon: "🎨" },
                      { time: "9:30 PM", task: "Building protected dashboard", icon: "📊" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 border border-border/50 rounded-xl z-10 bg-background"
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground font-mono">{item.time}</div>
                          <div className="text-foreground font-medium">{item.task}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Punch Line - Visual Impact */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-2xl blur-xl" />
                  <div className="relative p-8 border border-red-500/20 rounded-2xl bg-background/80 backdrop-blur-sm">
                    <div className="text-center space-y-6">
                      <div className="text-2xl">⚡</div>
                      <p className="text-xl font-semibold text-foreground">
                        You just spent your most valuable resource
                      </p>
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg">
                        <span className="text-lg font-bold text-foreground">Initial Creative Energy</span>
                      </div>
                      <p className="text-lg text-muted-foreground">on plumbing.</p>

                      {/* Sunday Morning Reality */}
                      <div className="border-t border-border pt-6 mt-6">
                        <div className="flex items-center justify-center gap-4 text-muted-foreground">
                          <span>Sunday morning arrives</span>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                          <span>Momentum = Gone</span>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                          <span>Spark = Spent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           
          
        </div>
      </section>
  )
}
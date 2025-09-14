import { Badge } from "@/components/ui/badge";
import {
  AlertTriangleIcon,
  FileCode,
} from "lucide-react"

export default function ProblemSection() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden border-y border-border">
        {/* Grid Background - Same as hero */}
        <div className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)]">
          <div className="col-span-1 flex h-full items-center justify-center" />
          <div className="col-span-1 flex h-full items-center justify-center" />
          <div className="col-span-1 flex h-full items-center justify-center" />
        </div>

        {/* Subtle blur effects */}
        <figure className="pointer-events-none absolute left-[10%] top-[20%] z-0 aspect-square w-[25vw] rounded-full bg-destructive/10 blur-[120px]" />
        <figure className="pointer-events-none absolute right-[15%] bottom-[10%] z-0 aspect-square w-[20vw] rounded-full bg-orange-500/10 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col divide-y divide-border">
          {/* Header */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mx-auto max-w-[80vw] px-2 text-center sm:px-6">
              <Badge variant="destructive" className="mb-6">
                <AlertTriangleIcon className="w-3 h-3 mr-1" />
                The Problem
              </Badge>
              <h2 className="text-[clamp(28px,6vw,48px)] font-medium leading-tight tracking-[-1.2px] text-foreground mb-6">
                Sound Familiar? You Found a <span className="text-muted-foreground line-through">"Time-Saving"</span>{" "}
                Boilerplate...
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                And then you spent your first day as a{" "}
                <span className="text-destructive font-medium">code janitor</span>.
              </p>
              <p className="text-lg text-muted-foreground">
                You're fired up about a new idea. You grab a popular boilerplate to get a head start.{" "}
                <br className="hidden md:block" />
                But your git log for day one looks like this:
              </p>
            </div>
          </div>

          {/* Git Log Visualization */}
          <div className="flex items-center justify-center px-2 py-12 sm:px-6">
            <div className="w-full max-w-[90vw] sm:max-w-[60vw]">
              {/* Timeline-style Frustration Story */}
              <div className="space-y-4">
                {[
                  { type: "feat", message: "remove GraphQL and Apollo client", time: "9:00 AM" },
                  { type: "refactor", message: "rip out Redux/Zustand for my own state management", time: "10:30 AM" },
                  { type: "chore", message: "delete 15 example pages and 80 components", time: "12:00 PM" },
                  {
                    type: "fix",
                    message: "untangle a web of providers just to change the page title",
                    time: "2:30 PM",
                  },
                  {
                    type: "style",
                    message: "fight the component library to change a simple button color",
                    time: "4:00 PM",
                  },
                ].map((commit, index) => (
                  <div key={index} className="relative">
                    {/* Timeline connector line */}
                    {index < 4 && <div className="absolute left-8 top-12 w-px h-8 bg-border" />}

                    {/* Commit card */}
                    <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-destructive/10 border border-destructive/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-destructive rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                            {commit.type}
                          </span>
                          <span className="text-xs text-muted-foreground">{commit.time}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{commit.message}</p>
                      </div>

                      <div className="flex-shrink-0 text-destructive">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mx-auto max-w-[80vw] px-2 text-center sm:px-6">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  The industry calls this a <span className="text-foreground font-semibold">"head start"</span>.
                </p>
                <p className="text-xl font-bold text-foreground">
                  We call it{" "}
                  <span className="text-destructive">technical debt before you've even written a feature</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          {/* <div className="flex flex-col items-center justify-center py-16">
            <div className="mx-auto max-w-[80vw] px-2 text-center sm:px-6">
              {/* Main Message with Better Typography */}
          {/*    <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-destructive/10 to-destructive/5 rounded-2xl blur-xl" />
                <div className="relative p-8 rounded-2xl border border-destructive/20 bg-card/80 backdrop-blur-sm">
                  <div className="space-y-4">
                    <p className="text-xl text-muted-foreground">
                      The industry calls this a{" "}
                      <span className="text-foreground font-semibold bg-primary/10 px-2 py-1 rounded">
                        "head start"
                      </span>
                      .
                    </p>
                    <p className="text-2xl font-bold text-destructive">
                      We call it{" "}
                      <span className="underline decoration-destructive/50 underline-offset-4">
                        technical debt before you've even written a feature
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact Stats with Better Design */}
          {/*    <div className="grid gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: <ClockIcon className="w-6 h-6" />,
                    label: "Hours Wasted",
                    value: "8-12 hrs",
                    color: "text-destructive",
                    bgColor: "bg-destructive/10",
                    borderColor: "border-destructive/20",
                    description: "Just to get started",
                  },
                  {
                    icon: <XIcon className="w-6 h-6" />,
                    label: "Features Removed",
                    value: "15-30",
                    color: "text-orange-500",
                    bgColor: "bg-orange-500/10",
                    borderColor: "border-orange-500/20",
                    description: "Unwanted bloat",
                  },
                  {
                    icon: <AlertTriangleIcon className="w-6 h-6" />,
                    label: "Frustration Level",
                    value: "Maximum",
                    color: "text-yellow-500",
                    bgColor: "bg-yellow-500/10",
                    borderColor: "border-yellow-500/20",
                    description: "Before day one ends",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`relative group p-6 rounded-xl border ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm hover:scale-105 transition-transform`}
                  >
                    <div className="text-center space-y-3">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background border ${stat.borderColor} ${stat.color}`}
                      >
                        {stat.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </section>
  )
}
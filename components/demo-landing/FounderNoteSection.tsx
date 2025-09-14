import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const FounderNoteSection = () => {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
        {/* Creative Lines */}
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
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Personal Note</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[clamp(28px,5vw,40px)] font-medium leading-tight tracking-[-1.2px] text-foreground mb-12 text-center">
              A Note From Me
            </h2>

            {/* Founder's Message */}
            <div className="relative p-8 sm:p-12 rounded-3xl border border-border/60 bg-background/30 backdrop-blur-sm">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-foreground mb-6">
                  Hey, I'm <span className="font-medium">Harvansh Chaudhary</span>. My{" "}
                  <code className="px-2 py-1 rounded bg-muted/50 text-sm font-mono">~/Projects</code> directory is a
                  graveyard of ideas that died because of initial friction.
                </p>
                <p className="text-lg leading-relaxed text-foreground mb-6">
                  I built this because I was tired of the "all-in-one" boilerplates that gave me everything except a
                  clean start. This is the tool I wished I had.
                </p>
                <p className="text-lg leading-relaxed text-foreground mb-8">
                  It's designed to protect your initial spark of motivation so you can turn it into something real. I
                  hope it helps you.
                </p>

                {/* Signature */}
                <div className="pt-6 border-t border-border/40">
                  <p className="text-muted-foreground italic">— Harvansh, builder of the Unboilerplate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
     
    </section>
  );
};

export default FounderNoteSection;
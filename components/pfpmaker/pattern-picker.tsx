"use client"

import { patterns, type Pattern } from "@/lib/patterns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PatternPickerProps {
  value: Pattern | null
  onChange: (pattern: Pattern | null) => void
  baseColor: string
}

export function PatternPicker({ value, onChange, baseColor }: PatternPickerProps) {
  const handleColorChange = (newColor: string) => {
    if (value) {
      onChange({
        ...value,
        color: newColor
      })
    }
  }

  const PatternButton = ({ pattern }: { pattern: Pattern }) => {
    const isSelected = value?.id === pattern.id
    const patternColor = isSelected ? value.color : pattern.color
    
    return (
      <button
        key={pattern.id}
        className={cn(
          "aspect-square rounded-md border-2 overflow-hidden relative",
          isSelected ? "border-primary" : "border-transparent hover:border-primary/50",
        )}
        onClick={() => onChange({ ...pattern, color: value?.color || pattern.color })}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${pattern.svg}")`,
            backgroundSize: "20px 20px",
            filter: `opacity(0.5) drop-shadow(0 0 0 ${patternColor})`,
          }}
        />
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        <button
          className={cn(
            "aspect-square rounded-md border-2 flex items-center justify-center",
            value === null ? "border-primary" : "border-transparent hover:border-primary/50",
          )}
          onClick={() => onChange(null)}
        >
          <span className="text-xs text-muted-foreground">None</span>
        </button>
        {patterns.slice(0, 8).map((pattern) => (
          <PatternButton key={pattern.id} pattern={pattern} />
        ))}
      </div>

      {patterns.length > 9 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="more-patterns" className="border-none">
            <AccordionTrigger className="py-2 text-sm">More patterns</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-5 gap-2 pt-2">
                {patterns.slice(8).map((pattern) => (
                  <PatternButton key={pattern.id} pattern={pattern} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {value && (
        <div className="space-y-2">
          <Label htmlFor="patternColor">Pattern Color</Label>
          <Input
            id="patternColor"
            type="color"
            value={value.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
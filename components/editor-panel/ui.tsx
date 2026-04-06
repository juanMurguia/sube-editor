import type { ReactNode } from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

type SegmentedVariant = "panel" | "pill"

type SegmentedOption<T extends string> = {
  value: T
  label: string
  icon?: ReactNode
}

const SEGMENTED_STYLES: Record<SegmentedVariant, { base: string; active: string; inactive: string }> = {
  panel: {
    base: "flex-1 cursor-pointer py-1.5 rounded-lg text-sm font-semibold transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
    active: "bg-primary text-primary-foreground elev-shadow-1",
    inactive:
      "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]",
  },
  pill: {
    base: "cursor-pointer px-2.5 py-1 rounded-md text-xs font-semibold transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
    active: "bg-primary text-primary-foreground elev-shadow-1",
    inactive:
      "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]",
  },
}

const ICON_TOGGLE_BASE =
  "cursor-pointer p-1.5 rounded-md transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 elev-level-1"

const ICON_TOGGLE_ACTIVE = "bg-primary text-primary-foreground elev-shadow-1"
const ICON_TOGGLE_INACTIVE =
  "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"

export function SectionCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary p-4 elev-level-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SegmentedButtons<T extends string>({
  options,
  value,
  onChange,
  variant = "pill",
  className,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  variant?: SegmentedVariant
  className?: string
}) {
  const styles = SEGMENTED_STYLES[variant]

  return (
    <div className={className}>
      {options.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(styles.base, isActive ? styles.active : styles.inactive)}
          >
            {opt.icon ? (
              <span className="flex items-center gap-1">
                {opt.icon}
                {opt.label}
              </span>
            ) : (
              opt.label
            )}
          </button>
        )
      })}
    </div>
  )
}

export function IconToggleGroup<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; icon: ReactNode }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={className}>
      {options.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              ICON_TOGGLE_BASE,
              isActive ? ICON_TOGGLE_ACTIVE : ICON_TOGGLE_INACTIVE
            )}
          >
            {opt.icon}
          </button>
        )
      })}
    </div>
  )
}

export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  labelClassName,
  className,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  labelClassName?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-xs text-muted-foreground", labelClassName)}>
        {label}
      </span>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="flex-1 cursor-pointer"
      />
    </div>
  )
}

export function UploadButton({
  icon,
  title,
  subtitle,
  onClick,
  className,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer border-2 border-dashed border-border rounded-lg py-6 flex flex-col items-center gap-2 text-muted-foreground transition-[border-color,background-color,transform,box-shadow,color] duration-200 hover:border-primary hover:bg-primary/5 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.99]",
        className
      )}
    >
      {icon}
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs">{subtitle}</span>
    </button>
  )
}

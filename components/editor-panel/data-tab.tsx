import { useState, type ReactNode } from "react"
import {
  AlignCenter,
  AlignHorizontalDistributeCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalDistributeCenter,
  CreditCard,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getFontFamily, NAME_FONT_OPTIONS, NUMBER_FONT_OPTIONS } from "@/lib/font-options"
import { cn } from "@/lib/utils"
import type { CardState, TextAlign } from "@/lib/card-types"
import type { EditorChangeHandler, TextSideOption } from "./types"
import { IconToggleGroup, LabeledSlider, SegmentedButtons, SectionCard } from "./ui"

interface DataTabProps {
  card: CardState
  textSideOptions: TextSideOption[]
  onChange: EditorChangeHandler
}

const ALIGN_OPTIONS: { value: TextAlign; icon: ReactNode }[] = [
  { value: "left", icon: <AlignLeft size={14} /> },
  { value: "center", icon: <AlignCenter size={14} /> },
  { value: "right", icon: <AlignRight size={14} /> },
]

const TYPOGRAPHY_OPTIONS = [...NAME_FONT_OPTIONS, ...NUMBER_FONT_OPTIONS]

const NUMBER_DIRECTION_OPTIONS: {
  value: CardState["numberDirection"]
  label: string
  icon: ReactNode
}[] = [
  {
    value: "horizontal",
    label: "Horizontal",
    icon: <AlignHorizontalDistributeCenter size={12} />,
  },
  { value: "vertical", label: "Vertical", icon: <AlignVerticalDistributeCenter size={12} /> },
]

function formatCardNumber(value: string) {
  let v = value.replace(/\D/g, "").slice(0, 16)
  v = v.replace(/(.{4})/g, "$1 ").trim()
  return v
}

export function DataTab({ card, textSideOptions, onChange }: DataTabProps) {
  const [mode, setMode] = useState<"basic" | "advanced">("basic")

  function handleTypographyChange(value: string) {
    const fontId = value as typeof card.nameFont
    onChange({ nameFont: fontId, numberFont: fontId })
  }

  return (
    <div className="px-5 py-5 flex flex-col gap-6">
      <SectionCard className="gap-2 border-none pt-0">
        <p className="text-sm font-semibold text-foreground">Edición guiada</p>
        <p className="text-sm text-muted-foreground">
          Empezá por nombre y número. Los ajustes finos viven en Avanzado.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "basic" ? "default" : "outline"}
            onClick={() => setMode("basic")}
            className="text-sm"
          >
            Básico
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "advanced" ? "default" : "outline"}
            onClick={() => setMode("advanced")}
            className="text-sm"
          >
            Avanzado
          </Button>
        </div>
      </SectionCard>

      <SectionCard>
        <Label
          htmlFor="card-name"
          className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2"
        >
          <Type size={13} />
          Nombre
        </Label>
        <Input
          id="card-name"
          placeholder="Juan Cruz"
          value={card.name}
          onChange={(e) => onChange({ name: e.target.value.toUpperCase() })}
          className="cursor-pointer font-mono text-sm transition-shadow focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
          maxLength={26}
          autoComplete="name"
          inputMode="text"
          enterKeyHint="next"
          autoCapitalize="characters"
        />
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Mostrar en</span>
          <div role="group" aria-label="Mostrar nombre en">
            <SegmentedButtons
              options={textSideOptions}
              value={card.nameSide}
              onChange={(value) => onChange({ nameSide: value })}
              variant="pill"
              className="flex gap-1.5"
            />
          </div>
        </div>
        {mode === "advanced" && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Color</span>
              <input
                type="color"
                value={card.nameColor}
                onChange={(e) => onChange({ nameColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95 sm:w-8 sm:h-8 touch-manipulation"
                title="Color del nombre"
                aria-label="Color del nombre"
              />
              <span className="font-mono text-sm text-foreground">{card.nameColor.toUpperCase()}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Alineación</span>
              <div role="group" aria-label="Alineación del nombre">
                <IconToggleGroup
                  options={ALIGN_OPTIONS}
                  value={card.nameAlign}
                  onChange={(value) => onChange({ nameAlign: value })}
                  className="flex gap-1.5"
                />
              </div>
            </div>
            <LabeledSlider
              label={`Tamaño: ${card.nameFontSize}px`}
              value={card.nameFontSize}
              min={8}
              max={22}
              step={1}
              onChange={(value) => onChange({ nameFontSize: value })}
              labelClassName="w-16"
            />
          </>
        )}
      </SectionCard>

      <SectionCard>
        <Label
          htmlFor="card-number"
          className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2"
        >
          <CreditCard size={13} />
          Número
        </Label>
        <Input
          id="card-number"
          placeholder="0000 0000 0000 0000"
          value={card.number}
          onChange={(e) => onChange({ number: formatCardNumber(e.target.value) })}
          className="cursor-pointer font-mono text-sm tracking-widest transition-shadow focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
          maxLength={19}
          autoComplete="cc-number"
          inputMode="numeric"
          enterKeyHint="next"
        />
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Mostrar en</span>
          <div role="group" aria-label="Mostrar número en">
            <SegmentedButtons
              options={textSideOptions}
              value={card.numberSide}
              onChange={(value) => onChange({ numberSide: value })}
              variant="pill"
              className="flex gap-1.5"
            />
          </div>
        </div>
        {mode === "advanced" && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Color</span>
              <input
                type="color"
                value={card.numberColor}
                onChange={(e) => onChange({ numberColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95 sm:w-8 sm:h-8 touch-manipulation"
                title="Color del número"
                aria-label="Color del número"
              />
              <span className="font-mono text-sm text-foreground">{card.numberColor.toUpperCase()}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Alineación</span>
              <div role="group" aria-label="Alineación del número">
                <IconToggleGroup
                  options={ALIGN_OPTIONS}
                  value={card.numberAlign}
                  onChange={(value) => onChange({ numberAlign: value })}
                  className="flex gap-1.5"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Dirección</span>
              <div role="group" aria-label="Dirección del número">
                <SegmentedButtons
                  options={NUMBER_DIRECTION_OPTIONS}
                  value={card.numberDirection}
                  onChange={(value) => onChange({ numberDirection: value })}
                  variant="pill"
                  className="flex gap-1.5"
                />
              </div>
            </div>
            <LabeledSlider
              label={`Tamaño: ${card.numberFontSize}px`}
              value={card.numberFontSize}
              min={8}
              max={20}
              step={1}
              onChange={(value) => onChange({ numberFontSize: value })}
              labelClassName="w-16"
            />
          </>
        )}
      </SectionCard>

      {mode === "advanced" && (
        <>
          <SectionCard>
            <Label
              id="typography-label"
              className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2"
            >
              <Type size={13} />
              Tipografía
            </Label>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Aplica a nombre y número
            </span>
            <Select value={card.nameFont} onValueChange={handleTypographyChange}>
              <SelectTrigger
                id="typography-select"
                aria-labelledby="typography-label"
                className="w-full cursor-pointer transition-shadow focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
                style={{ fontFamily: getFontFamily(card.nameFont) }}
              >
                <SelectValue placeholder="Elegí una fuente" />
              </SelectTrigger>
              <SelectContent>
                {TYPOGRAPHY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="cursor-pointer">
                    <span style={{ fontFamily: getFontFamily(opt.id) }}>{opt.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SectionCard>

          <div className="flex items-center justify-between rounded-lg border border-border/45 bg-background/65 px-4 py-3">
            <span className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <CreditCard size={13} />
              Texto &quot;SUBE&quot;
            </span>
            <button
              type="button"
              onClick={() => onChange({ showCardLabel: !card.showCardLabel })}
              role="switch"
              aria-checked={card.showCardLabel}
              aria-label='Mostrar texto "SUBE"'
              className={cn(
                "relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-5 sm:w-9 touch-manipulation",
                card.showCardLabel ? "bg-primary" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform sm:h-3.5 sm:w-3.5",
                  card.showCardLabel ? "translate-x-6 sm:translate-x-4.5" : "translate-x-1 sm:translate-x-0.5",
                )}
              />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

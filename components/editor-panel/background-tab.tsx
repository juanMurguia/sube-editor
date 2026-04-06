import { useEffect, useState } from "react"
import type { CardSide, CardState } from "@/lib/card-types"
import type { EditorChangeHandler } from "./types"
import { SectionCard } from "./ui"

interface BackgroundTabProps {
  card: CardState
  onChange: EditorChangeHandler
}

export function BackgroundTab({ card, onChange }: BackgroundTabProps) {
  const [frontHex, setFrontHex] = useState(card.front.bgColor)
  const [backHex, setBackHex] = useState(card.back.bgColor)

  useEffect(() => {
    setFrontHex(card.front.bgColor)
  }, [card.front.bgColor])

  useEffect(() => {
    setBackHex(card.back.bgColor)
  }, [card.back.bgColor])

  function updateSideColor(side: CardSide, color: string) {
    onChange((prev) => ({
      ...prev,
      [side]: { ...prev[side], bgColor: color },
    }))
  }

  function normalizeHexColor(input: string) {
    const trimmed = input.trim()
    const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    if (!match) return null
    let hex = match[1].toLowerCase()
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    }
    return `#${hex}`
  }

  return (
    <div className="px-5 py-5 flex flex-col gap-5">
      <SectionCard>
        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
          Color de fondo — Frente
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={card.front.bgColor}
            onChange={(e) => {
              const nextColor = e.target.value
              updateSideColor("front", nextColor)
              setFrontHex(nextColor)
            }}
            className="w-12 h-12 rounded-lg cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95 sm:w-10 sm:h-10 touch-manipulation"
            aria-label="Color de fondo del frente"
          />
          <input
            type="text"
            value={frontHex}
            maxLength={7}
            spellCheck={false}
            inputMode="text"
            placeholder="#1A56DB"
            autoCapitalize="characters"
            aria-label="Hex del color de fondo del frente"
            onChange={(e) => {
              const nextValue = e.target.value
              setFrontHex(nextValue)
              const normalized = normalizeHexColor(nextValue)
              if (normalized) {
                updateSideColor("front", normalized)
              }
            }}
            onBlur={() => setFrontHex(card.front.bgColor)}
            className="h-11 w-28 rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-10"
          />
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
          Color de fondo — Dorso
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={card.back.bgColor}
            onChange={(e) => {
              const nextColor = e.target.value
              updateSideColor("back", nextColor)
              setBackHex(nextColor)
            }}
            className="w-12 h-12 rounded-lg cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95 sm:w-10 sm:h-10 touch-manipulation"
            aria-label="Color de fondo del dorso"
          />
          <input
            type="text"
            value={backHex}
            maxLength={7}
            spellCheck={false}
            inputMode="text"
            placeholder="#1A56DB"
            autoCapitalize="characters"
            aria-label="Hex del color de fondo del dorso"
            onChange={(e) => {
              const nextValue = e.target.value
              setBackHex(nextValue)
              const normalized = normalizeHexColor(nextValue)
              if (normalized) {
                updateSideColor("back", normalized)
              }
            }}
            onBlur={() => setBackHex(card.back.bgColor)}
            className="h-11 w-28 rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-10"
          />
        </div>
      </SectionCard>
    </div>
  )
}

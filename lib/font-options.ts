export type NameFontId = "space-grotesk" | "inter" | "sora" | "archivo"
export type NumberFontId = "roboto-mono" | "jetbrains-mono" | "ibm-plex-mono"
export type FontId = NameFontId | NumberFontId

export type FontOption = {
  id: FontId
  label: string
  cssVar: string
  fallbacks: string
}

export const NAME_FONT_OPTIONS: FontOption[] = [
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    cssVar: "--font-space-grotesk",
    fallbacks: "'Space Grotesk', system-ui, sans-serif",
  },
  {
    id: "inter",
    label: "Inter",
    cssVar: "--font-inter",
    fallbacks: "'Inter', system-ui, sans-serif",
  },
  {
    id: "sora",
    label: "Sora",
    cssVar: "--font-sora",
    fallbacks: "'Sora', system-ui, sans-serif",
  },
  {
    id: "archivo",
    label: "Archivo",
    cssVar: "--font-archivo",
    fallbacks: "'Archivo', system-ui, sans-serif",
  },
]

export const NUMBER_FONT_OPTIONS: FontOption[] = [
  {
    id: "roboto-mono",
    label: "Roboto Mono",
    cssVar: "--font-roboto-mono",
    fallbacks: "'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    cssVar: "--font-jetbrains-mono",
    fallbacks: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono",
    cssVar: "--font-ibm-plex-mono",
    fallbacks: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
]

const FONT_MAP = new Map<string, FontOption>([
  ...NAME_FONT_OPTIONS.map((opt) => [opt.id, opt]),
  ...NUMBER_FONT_OPTIONS.map((opt) => [opt.id, opt]),
])

export const DEFAULT_NAME_FONT: NameFontId = "space-grotesk"
export const DEFAULT_NUMBER_FONT: NumberFontId = "roboto-mono"

export function getFontFamily(id: string) {
  const option = FONT_MAP.get(id) ?? FONT_MAP.get(DEFAULT_NAME_FONT)!
  return `var(${option.cssVar}), ${option.fallbacks}`
}

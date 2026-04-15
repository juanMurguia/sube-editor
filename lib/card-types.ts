import type { FontId } from "./font-options"

export type CardSide = "front" | "back"
export type TextSide = CardSide | "both"
export type TextColor = "white" | "black" | "custom"
export type TextAlign = "left" | "center" | "right"

export interface CardImage {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  scale: number
  opacity: number
}

export interface CardDesign {
  // Background
  bgColor: string
  bgImage: string | null
  bgImageOpacity: number
  bgImageFit: "cover" | "contain" | "fill"

  // Images
  images: CardImage[]
}

export interface CardState {
  // Text fields
  name: string
  number: string

  // Which side shows name and number
  nameSide: TextSide
  numberSide: TextSide

  // Text appearance
  nameColor: string
  numberColor: string
  nameAlign: TextAlign
  numberAlign: TextAlign
  nameFont: FontId
  numberFont: FontId
  nameFontSize: number
  numberFontSize: number
  numberDirection: "horizontal" | "vertical"

  // Show card label ("SUBE" text / logo)
  showCardLabel: boolean

  // Front design
  front: CardDesign

  // Back design
  back: CardDesign

  // Currently editing side
  activeSide: CardSide
}

export const defaultCardState: CardState = {
  name: "",
  number: "",
  nameSide: "front",
  numberSide: "front",
  nameColor: "#ffffff",
  numberColor: "#ffffff",
  nameAlign: "left",
  numberAlign: "left",
  nameFont: "sora",
  numberFont: "jetbrains-mono",
  nameFontSize: 14,
  numberFontSize: 13,
  numberDirection: "horizontal",
  showCardLabel: true,
  front: {
    bgColor: "#1a56db",
    bgImage: null,
    bgImageOpacity: 1,
    bgImageFit: "cover",
    images: [],
  },
  back: {
    bgColor: "#1a56db",
    bgImage: null,
    bgImageOpacity: 1,
    bgImageFit: "cover",
    images: [],
  },
  activeSide: "front",
}

export type CardSide = "front" | "back"
export type TextColor = "white" | "black" | "custom"
export type TextAlign = "left" | "center" | "right"

export interface CardImage {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
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
  nameSide: CardSide
  numberSide: CardSide

  // Text appearance
  nameColor: string
  numberColor: string
  nameAlign: TextAlign
  numberAlign: TextAlign
  nameFontSize: number
  numberFontSize: number

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
  name: "MARIA GONZALEZ",
  number: "0000 0000 0000 0000",
  nameSide: "front",
  numberSide: "front",
  nameColor: "#ffffff",
  numberColor: "#ffffff",
  nameAlign: "left",
  numberAlign: "left",
  nameFontSize: 14,
  numberFontSize: 13,
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

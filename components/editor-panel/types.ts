import type { CardSide, CardState, TextSide } from "@/lib/card-types"

export type EditorChangeHandler = (
  update: Partial<CardState> | ((prev: CardState) => CardState)
) => void

export interface CardSideOption {
  value: CardSide
  label: string
}

export interface TextSideOption {
  value: TextSide
  label: string
}

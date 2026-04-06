import type { CardState } from "./card-types"

export async function exportCardsPDF(
  frontEl: HTMLElement,
  backEl: HTMLElement,
  _card: CardState
) {
  // Dynamically import heavy libs to keep initial bundle small
  const html2canvas = (await import("html2canvas")).default
  const { jsPDF } = await import("jspdf")

  // Render both sides at 3× scale for print quality
  const opts = {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    // Override oklch/lab colors that html2canvas can't parse
    onclone: (cloned: Document) => {
      // Force all elements to use rgb colors by ensuring no oklch/lab leaks in
      normalizeCloneColors(frontEl, cloned)
      normalizeCloneColors(backEl, cloned)
    },
  }

  const frontCanvas = await html2canvas(frontEl, opts)
  const backCanvas = await html2canvas(backEl, opts)

  // A4 dimensions in mm
  const A4_W = 210
  const A4_H = 297

  // Credit card: 85.6 × 54 mm
  const CARD_W = 85.6
  const CARD_H = 54

  // Centering horizontally
  const cardX = (A4_W - CARD_W) / 2

  // Gap between front and back
  const gap = 18

  // Total height of both cards + gap
  const totalH = CARD_H * 2 + gap

  // Vertical start (centered in A4, shifted up slightly to leave room for badge)
  const startY = (A4_H - totalH) / 2 - 16

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  // White background
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, A4_W, A4_H, "F")

  // ── FRONT CARD ──
  const frontData = frontCanvas.toDataURL("image/png")
  pdf.addImage(frontData, "PNG", cardX, startY, CARD_W, CARD_H)

  // Dashed cut guide — front
  drawDashedRect(pdf, cardX - 3, startY - 3, CARD_W + 6, CARD_H + 6, 3.5)

  // Label
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(6.5)
  pdf.setTextColor(160, 160, 160)
  pdf.text("FRENTE", cardX, startY - 5)

  // ── BACK CARD ──
  const backY = startY + CARD_H + gap
  const backData = backCanvas.toDataURL("image/png")
  pdf.addImage(backData, "PNG", cardX, backY, CARD_W, CARD_H)

  // Dashed cut guide — back
  drawDashedRect(pdf, cardX - 3, backY - 3, CARD_W + 6, CARD_H + 6, 3.5)

  // Label
  pdf.text("DORSO", cardX, backY - 5)

  // ── INFO TEXT (SINGLE LINE, NO BOX) ──
  const infoY = backY + CARD_H + 18
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(6)
  pdf.setTextColor(100, 65, 0)
  pdf.text(
    "Acordate de pedir que te lo impriman en papel autoadhesivo, asi lo podes pegar facil :)",
    A4_W / 2,
    infoY,
    { align: "center" }
  )

  // ── FOOTER ──
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(5.5)
  pdf.setTextColor(200, 200, 200)
  pdf.text("Diseñado con Mi SUBE Personalizada", A4_W / 2, A4_H - 7, { align: "center" })

  pdf.save("mi-sube-personalizada.pdf")
}

function drawDashedRect(
  pdf: InstanceType<typeof import("jspdf").jsPDF>,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  pdf.setDrawColor(190, 190, 190)
  pdf.setLineWidth(0.2)
  pdf.setLineDashPattern([1.5, 1.5], 0)
  pdf.roundedRect(x, y, w, h, r, r, "S")
}

const COLOR_PROPS = [
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-shadow",
  "box-shadow",
  "fill",
  "stroke",
  "background-image",
] as const

let colorCanvas: HTMLCanvasElement | null = null
let colorCtx: CanvasRenderingContext2D | null = null

function normalizeCloneColors(sourceRoot: HTMLElement, clonedDoc: Document) {
  const cloneRoot = clonedDoc.querySelector<HTMLElement>(
    `[data-card-side="${sourceRoot.dataset.cardSide}"]`
  )
  if (!cloneRoot) return

  const sourceEls = [sourceRoot, ...sourceRoot.querySelectorAll<HTMLElement>("*")]
  const cloneEls = [cloneRoot, ...cloneRoot.querySelectorAll<HTMLElement>("*")]
  const len = Math.min(sourceEls.length, cloneEls.length)

  for (let i = 0; i < len; i++) {
    const sourceEl = sourceEls[i]
    const cloneEl = cloneEls[i]
    const computed = window.getComputedStyle(sourceEl)

    for (const prop of COLOR_PROPS) {
      const value = computed.getPropertyValue(prop)
      if (!value || (!value.includes("oklch") && !value.includes("lab"))) continue

      const fixed = replaceUnsupportedColors(value)
      if (!fixed) continue

      cloneEl.style.setProperty(prop, fixed)
    }
  }
}

function replaceUnsupportedColors(value: string) {
  const replaced = value.replace(/(oklch|lab)\([^)]*\)/g, (match) => {
    const rgb = toRgb(match)
    return rgb ?? "rgba(0, 0, 0, 0)"
  })

  if (replaced !== value) return replaced

  // If we couldn't replace, fall back to transparent to avoid crashes
  if (value.includes("oklch") || value.includes("lab")) return "transparent"
  return value
}

function toRgb(color: string) {
  if (!color) return null

  if (!colorCanvas) {
    colorCanvas = document.createElement("canvas")
    colorCanvas.width = 1
    colorCanvas.height = 1
    colorCtx = colorCanvas.getContext("2d")
  }

  if (!colorCtx) return null

  try {
    colorCtx.clearRect(0, 0, 1, 1)
    colorCtx.fillStyle = "rgba(0, 0, 0, 0)"
    colorCtx.fillStyle = color.trim()
    colorCtx.fillRect(0, 0, 1, 1)
    const data = colorCtx.getImageData(0, 0, 1, 1).data
    const [r, g, b, a] = data
    if (a === 255) return `rgb(${r}, ${g}, ${b})`
    const alpha = Math.round((a / 255) * 1000) / 1000
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } catch {
    return null
  }
}

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
  const gap = 20

  // Total height of both cards + gap
  const totalH = CARD_H * 2 + gap

  // Vertical start (centered in A4)
  const startY = (A4_H - totalH) / 2

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  // White background
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, A4_W, A4_H, "F")

  // Front card
  const frontData = frontCanvas.toDataURL("image/png")
  pdf.addImage(frontData, "PNG", cardX, startY, CARD_W, CARD_H)

  // Label "FRENTE"
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7)
  pdf.setTextColor(150, 150, 150)
  pdf.text("FRENTE", cardX, startY - 2)

  // Back card
  const backData = backCanvas.toDataURL("image/png")
  pdf.addImage(backData, "PNG", cardX, startY + CARD_H + gap, CARD_W, CARD_H)

  // Label "DORSO"
  pdf.text("DORSO", cardX, startY + CARD_H + gap - 2)

  // Dashed cut guides around both cards
  pdf.setDrawColor(180, 180, 180)
  pdf.setLineWidth(0.2)
  pdf.setLineDashPattern([2, 2], 0)

  // Front card guide
  drawDashedRect(pdf, cardX - 2, startY - 2, CARD_W + 4, CARD_H + 4, 3)
  // Back card guide
  drawDashedRect(pdf, cardX - 2, startY + CARD_H + gap - 2, CARD_W + 4, CARD_H + 4, 3)

  // Small scissors icons on corners
  pdf.setFontSize(8)
  pdf.setTextColor(180, 180, 180)
  pdf.text("✂", cardX - 5, startY - 2)
  pdf.text("✂", cardX - 5, startY + CARD_H + gap - 2)

  // INFOGRAPHY BADGE at the bottom
  const badgeY = startY + totalH + 16
  const badgeW = 140
  const badgeH = 22
  const badgeX = (A4_W - badgeW) / 2

  pdf.setLineDashPattern([], 0)
  pdf.setFillColor(255, 248, 220)
  pdf.setDrawColor(230, 180, 60)
  pdf.setLineWidth(0.5)
  pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 3, 3, "FD")

  // Badge icon
  pdf.setFontSize(10)
  pdf.setTextColor(180, 120, 0)
  pdf.text("💡", badgeX + 4, badgeY + 8)

  // Badge text - split into two lines
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7)
  pdf.setTextColor(120, 80, 0)
  pdf.text(
    "Acordate de pedir que te lo impriman en papel autoadhesivo,",
    badgeX + 12,
    badgeY + 8
  )
  pdf.text(
    "así lo podés pegar fácil :)",
    badgeX + 12,
    badgeY + 15
  )

  // Footer
  pdf.setFontSize(6)
  pdf.setTextColor(200, 200, 200)
  pdf.text("Diseñado con Mi SUBE Personalizada", A4_W / 2, A4_H - 8, { align: "center" })

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
  pdf.setDrawColor(180, 180, 180)
  pdf.setLineWidth(0.2)
  pdf.setLineDashPattern([1.5, 1.5], 0)
  pdf.roundedRect(x, y, w, h, r, r, "S")
}

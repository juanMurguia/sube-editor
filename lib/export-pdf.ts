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
      const allEls = cloned.querySelectorAll<HTMLElement>("*")
      allEls.forEach((el) => {
        const computed = window.getComputedStyle(el)
        const bg = computed.backgroundColor
        if (bg && (bg.includes("oklch") || bg.includes("lab"))) {
          el.style.backgroundColor = "transparent"
        }
      })
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

  // ── INFOGRAPHY BADGE ──
  const badgeW = 150
  const badgeH = 26
  const badgeX = (A4_W - badgeW) / 2
  const badgeY = backY + CARD_H + 14

  pdf.setLineDashPattern([], 0)
  pdf.setFillColor(255, 249, 219)
  pdf.setDrawColor(210, 165, 40)
  pdf.setLineWidth(0.4)
  pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 3, 3, "FD")

  // Badge icon (lightbulb represented with text)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(9)
  pdf.setTextColor(150, 100, 0)
  pdf.text("!", badgeX + 5, badgeY + 9)

  // Badge main text
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7.5)
  pdf.setTextColor(100, 65, 0)
  pdf.text(
    "Acordate de pedir que te lo impriman en papel autoadhesivo,",
    badgeX + 12,
    badgeY + 9
  )
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7.5)
  pdf.text(
    "asi lo podes pegar facil :)",
    badgeX + 12,
    badgeY + 17
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

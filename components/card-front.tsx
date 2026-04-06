"use client"

import { forwardRef } from "react"
import { CardState } from "@/lib/card-types"

// SUBE card dimensions: 85.6mm × 54mm (standard credit card)
// Preview render at 342×216 px

interface CardFrontProps {
  card: CardState
  scale?: number
  forExport?: boolean
}

const CardFront = forwardRef<HTMLDivElement, CardFrontProps>(
  ({ card, scale = 1, forExport = false }, ref) => {
    const {
      front,
      name,
      number,
      nameSide,
      numberSide,
      nameColor,
      numberColor,
      nameAlign,
      numberAlign,
      nameFontSize,
      numberFontSize,
      numberDirection,
    } = card

    const showName = nameSide === "front"
    const showNumber = numberSide === "front"
    const isVertical = numberDirection === "vertical"

    const w = 342 * scale
    const h = 216 * scale
    const radius = 12 * scale

    return (
      <div
        ref={ref}
        data-card-side="front"
        style={{
          width: w,
          height: h,
          borderRadius: radius,
          position: "relative",
          overflow: "hidden",
          backgroundColor: front.bgColor,
          boxShadow: forExport ? "none" : "0 20px 60px rgba(0,0,0,0.3)",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {/* Background image — covers 100% of the card */}
        {front.bgImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${front.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: front.bgImageOpacity,
            }}
          />
        )}

        {/* Overlay images */}
        {front.images.map((img) => (
          <div
            key={img.id}
            style={{
              position: "absolute",
              left: img.x * scale,
              top: img.y * scale,
              width: img.width * scale,
              height: img.height * scale,
              opacity: img.opacity,
              backgroundImage: `url(${img.src})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}

        {/* Subtle gradient overlay for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.22) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* SUBE Label top-right */}
        {card.showCardLabel && (
          <div
            style={{
              position: "absolute",
              top: 14 * scale,
              right: 18 * scale,
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontWeight: 800,
              fontSize: 18 * scale,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              lineHeight: 1,
            }}
          >
            SUBE
          </div>
        )}

        {/* Card number — horizontal */}
        {showNumber && !isVertical && (
          <div
            style={{
              position: "absolute",
              bottom: showName ? 44 * scale : 22 * scale,
              left: 18 * scale,
              right: 18 * scale,
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              fontSize: numberFontSize * scale,
              letterSpacing: "0.15em",
              color: numberColor,
              textAlign: numberAlign,
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {number || "0000 0000 0000 0000"}
          </div>
        )}

        {/* Card number — vertical (modern style) */}
        {showNumber && isVertical && (
          <div
            style={{
              position: "absolute",
              left: 18 * scale,
              top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "center center",
              fontFamily: "'Courier New', monospace",
              fontWeight: 600,
              fontSize: numberFontSize * scale,
              letterSpacing: "0.18em",
              color: numberColor,
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {number || "0000 0000 0000 0000"}
          </div>
        )}

        {/* Card name */}
        {showName && (
          <div
            style={{
              position: "absolute",
              bottom: 16 * scale,
              left: 18 * scale,
              right: 18 * scale,
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontWeight: 600,
              fontSize: nameFontSize * scale,
              letterSpacing: "0.08em",
              color: nameColor,
              textAlign: nameAlign,
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              textTransform: "uppercase",
            }}
          >
            {name || "TU NOMBRE"}
          </div>
        )}
      </div>
    )
  }
)

CardFront.displayName = "CardFront"
export default CardFront

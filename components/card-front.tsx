"use client"

import { forwardRef } from "react"
import { CardState } from "@/lib/card-types"

// SUBE card dimensions: 85.6mm × 54mm (standard credit card)
// We render at 2× scale for quality: 342×216 px preview

interface CardFrontProps {
  card: CardState
  scale?: number
  forExport?: boolean
}

const CardFront = forwardRef<HTMLDivElement, CardFrontProps>(
  ({ card, scale = 1, forExport = false }, ref) => {
    const { front, name, number, nameSide, numberSide, nameColor, numberColor, nameAlign, numberAlign, nameFontSize, numberFontSize } = card

    const showName = nameSide === "front"
    const showNumber = numberSide === "front"

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
        {/* Background image */}
        {front.bgImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${front.bgImage})`,
              backgroundSize: front.bgImageFit === "fill" ? "100% 100%" : front.bgImageFit,
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
            background: "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 100%)",
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

        {/* Contactless icon top-left */}
        <div
          style={{
            position: "absolute",
            top: 14 * scale,
            left: 18 * scale,
          }}
        >
          <ContactlessIcon size={22 * scale} />
        </div>

        {/* Card number */}
        {showNumber && (
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
            {card.number || "0000 0000 0000 0000"}
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
            {card.name || "TU NOMBRE"}
          </div>
        )}
      </div>
    )
  }
)

CardFront.displayName = "CardFront"
export default CardFront

function ContactlessIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        fill="rgba(255,255,255,0.2)"
      />
      <path
        d="M6.5 12c0-1.5.5-2.9 1.4-4L6.5 6.6C5.2 8 4.5 9.9 4.5 12s.7 4 2 5.4l1.4-1.4C7 14.9 6.5 13.5 6.5 12z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M9.5 12c0-.8.3-1.6.8-2.1L8.9 8.5C8 9.5 7.5 10.7 7.5 12s.5 2.5 1.4 3.5l1.4-1.4c-.5-.5-.8-1.3-.8-2.1z"
        fill="rgba(255,255,255,0.9)"
      />
      <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.9)" />
      <path
        d="M14.5 12c0 .8-.3 1.6-.8 2.1l1.4 1.4c.9-1 1.4-2.2 1.4-3.5s-.5-2.5-1.4-3.5l-1.4 1.4c.5.5.8 1.3.8 2.1z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M17.5 12c0 1.5-.5 2.9-1.4 4l1.4 1.4c1.3-1.4 2-3.3 2-5.4s-.7-4-2-5.4L16.1 8c.9 1.1 1.4 2.5 1.4 4z"
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  )
}

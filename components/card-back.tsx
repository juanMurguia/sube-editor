"use client"

import { forwardRef } from "react"
import { CardState } from "@/lib/card-types"

interface CardBackProps {
  card: CardState
  scale?: number
  forExport?: boolean
}

const CardBack = forwardRef<HTMLDivElement, CardBackProps>(
  ({ card, scale = 1, forExport = false }, ref) => {
    const {
      back,
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

    const showName = nameSide === "back"
    const showNumber = numberSide === "back"
    const isVertical = numberDirection === "vertical"

    const w = 342 * scale
    const h = 216 * scale
    const radius = 12 * scale
    const magneticBandHeight = 40 * scale
    const magneticBandTop = 28 * scale

    return (
      <div
        ref={ref}
        data-card-side="back"
        style={{
          width: w,
          height: h,
          borderRadius: radius,
          position: "relative",
          overflow: "hidden",
          backgroundColor: back.bgColor,
          boxShadow: forExport ? "none" : "0 20px 60px rgba(0,0,0,0.3)",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {/* Background image — z-index 0, covers full card including behind magnetic band */}
        {back.bgImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage: `url(${back.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: back.bgImageOpacity,
            }}
          />
        )}

        {/* Overlay images — behind magnetic band */}
        {back.images.map((img) => (
          <div
            key={img.id}
            style={{
              position: "absolute",
              left: img.x * scale,
              top: img.y * scale,
              width: img.width * scale,
              height: img.height * scale,
              zIndex: 1,
              opacity: img.opacity,
              backgroundImage: `url(${img.src})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}

        {/* Subtle gradient for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: "linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.22) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* MAGNETIC BAND — always on top of everything */}
        <div
          style={{
            position: "absolute",
            top: magneticBandTop,
            left: 0,
            right: 0,
            height: magneticBandHeight,
            zIndex: 10,
            background: "linear-gradient(180deg, #1c1c1c 0%, #0a0a0a 45%, #252525 100%)",
          }}
        >
          {/* Metallic sheen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%, transparent 100%)",
            }}
          />
          {/* Micro text */}
          <div
            style={{
              position: "absolute",
              right: 8 * scale,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 5 * scale,
              color: "rgba(255,255,255,0.15)",
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            MAGNETIC STRIPE
          </div>
        </div>

        {/* SUBE label bottom-right */}
        {card.showCardLabel && (
          <div
            style={{
              position: "absolute",
              bottom: 14 * scale,
              right: 18 * scale,
              zIndex: 5,
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontWeight: 800,
              fontSize: 12 * scale,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.7)",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            SUBE
          </div>
        )}

        {/* Card number on back — horizontal */}
        {showNumber && !isVertical && (
          <div
            style={{
              position: "absolute",
              bottom: showName ? 44 * scale : 22 * scale,
              left: 18 * scale,
              right: 18 * scale,
              zIndex: 5,
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

        {/* Card number on back — vertical */}
        {showNumber && isVertical && (
          <div
            style={{
              position: "absolute",
              left: 18 * scale,
              top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "center center",
              zIndex: 5,
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

        {/* Card name on back */}
        {showName && (
          <div
            style={{
              position: "absolute",
              bottom: 16 * scale,
              left: 18 * scale,
              right: 18 * scale,
              zIndex: 5,
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

CardBack.displayName = "CardBack"
export default CardBack

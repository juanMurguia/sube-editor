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
    const { back, name, number, nameSide, numberSide, nameColor, numberColor, nameAlign, numberAlign, nameFontSize, numberFontSize } = card

    const showName = nameSide === "back"
    const showNumber = numberSide === "back"

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
        {/* Background image */}
        {back.bgImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${back.bgImage})`,
              backgroundSize: back.bgImageFit === "fill" ? "100% 100%" : back.bgImageFit,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: back.bgImageOpacity,
            }}
          />
        )}

        {/* Overlay images */}
        {back.images.map((img) => (
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

        {/* Subtle gradient for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* MAGNETIC BAND */}
        <div
          style={{
            position: "absolute",
            top: magneticBandTop,
            left: 0,
            right: 0,
            height: magneticBandHeight,
            background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 40%, #2a2a2a 100%)",
            zIndex: 10,
          }}
        >
          {/* Magnetic band shimmer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 70%, transparent 100%)",
            }}
          />
          {/* Band label */}
          <div
            style={{
              position: "absolute",
              right: 8 * scale,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 5 * scale,
              color: "rgba(255,255,255,0.2)",
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            MAGNETIC STRIPE
          </div>
        </div>

        {/* Bottom content area */}
        {/* Signature strip */}
        <div
          style={{
            position: "absolute",
            top: magneticBandTop + magneticBandHeight + 12 * scale,
            left: 18 * scale,
            right: 90 * scale,
            height: 28 * scale,
            background: "repeating-linear-gradient(90deg, #e8e8e8 0px, #f4f4f4 2px, #e8e8e8 4px)",
            borderRadius: 3 * scale,
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            paddingLeft: 8 * scale,
            overflow: "hidden",
          }}
        >
          {showName && (
            <span
              style={{
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontWeight: 600,
                fontSize: nameFontSize * scale * 0.85,
                color: "#1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                textAlign: nameAlign,
                width: "100%",
                display: "block",
              }}
            >
              {card.name || "TU NOMBRE"}
            </span>
          )}
        </div>

        {/* CVV box */}
        <div
          style={{
            position: "absolute",
            top: magneticBandTop + magneticBandHeight + 12 * scale,
            right: 18 * scale,
            width: 64 * scale,
            height: 28 * scale,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 3 * scale,
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 10 * scale,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: "0.1em",
          }}>
            CVV
          </span>
        </div>

        {/* Card number on back (if user chose back) */}
        {showNumber && (
          <div
            style={{
              position: "absolute",
              bottom: 16 * scale,
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

        {/* SUBE label bottom-right */}
        {card.showCardLabel && (
          <div
            style={{
              position: "absolute",
              bottom: 14 * scale,
              right: 18 * scale,
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontWeight: 800,
              fontSize: 12 * scale,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.6)",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          >
            SUBE
          </div>
        )}
      </div>
    )
  }
)

CardBack.displayName = "CardBack"
export default CardBack

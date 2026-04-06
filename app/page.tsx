"use client"

import { useState, useRef, useCallback } from "react"
import { CardState, defaultCardState } from "@/lib/card-types"
import CardFront from "@/components/card-front"
import CardBack from "@/components/card-back"
import EditorPanel from "@/components/editor-panel"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, RotateCcw } from "lucide-react"

export default function Home() {
  const [card, setCard] = useState<CardState>(defaultCardState)
  const [isExporting, setIsExporting] = useState(false)

  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (update: Partial<CardState> | ((prev: CardState) => CardState)) => {
      setCard((prev) => {
        if (typeof update === "function") return update(prev)
        return { ...prev, ...update }
      })
    },
    []
  )

  async function handleExport() {
    if (!frontRef.current || !backRef.current) return
    setIsExporting(true)
    try {
      const { exportCardsPDF } = await import("@/lib/export-pdf")
      await exportCardsPDF(frontRef.current, backRef.current, card)
    } catch (err) {
      console.error("Error exportando PDF:", err)
      alert("Ocurrió un error al generar el PDF. Intentá de nuevo.")
    } finally {
      setIsExporting(false)
    }
  }

  function handleReset() {
    if (confirm("¿Seguro que querés reiniciar el diseño?")) {
      setCard(defaultCardState)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-foreground font-serif leading-none">
              Mi SUBE Personalizada
            </h1>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              Diseñá y exportá tu tarjeta
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reiniciar</span>
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="sm"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow"
            >
              {isExporting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {isExporting ? "Generando..." : "Exportar PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT: Editor panel */}
        <aside className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col overflow-y-auto max-h-[45vh] lg:max-h-none">
          <EditorPanel card={card} onChange={handleChange} />
        </aside>

        {/* RIGHT: Preview area — always shows both sides */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 gap-8 overflow-auto">

          {/* Card previews — always both */}
          <div className="flex items-center justify-center gap-8 flex-wrap">

            {/* Front preview */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                  Frente
                </span>
              </div>
              <CardFront
                ref={frontRef}
                card={card}
                scale={1}
              />
              <p className="text-xs text-muted-foreground">85.6 × 54 mm</p>
            </div>

            {/* Back preview */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                  Dorso
                </span>
              </div>
              <CardBack
                ref={backRef}
                card={card}
                scale={1}
              />
              <p className="text-xs text-muted-foreground">Incluye banda magnética</p>
            </div>
          </div>

          {/* Export CTA */}
          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="lg"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/30 px-8"
          >
            {isExporting ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isExporting ? "Generando PDF..." : "Exportar diseño en PDF"}
          </Button>

          <p className="text-xs text-muted-foreground text-center max-w-xs">
            El PDF incluye frente y dorso en tamaño A4 con guías de corte.
          </p>
        </main>
      </div>
    </div>
  )
}

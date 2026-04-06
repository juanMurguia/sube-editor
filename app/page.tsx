"use client";

import CardBack from "@/components/card-back";
import CardFront from "@/components/card-front";
import EditorPanel from "@/components/editor-panel";
import { Button } from "@/components/ui/button";
import { CardState, defaultCardState } from "@/lib/card-types";
import { Download, RefreshCw, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function Home() {
  const [card, setCard] = useState<CardState>(defaultCardState);
  const [isExporting, setIsExporting] = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(
    (update: Partial<CardState> | ((prev: CardState) => CardState)) => {
      setCard((prev) => {
        if (typeof update === "function") return update(prev);
        return { ...prev, ...update };
      });
    },
    [],
  );

  async function handleExport() {
    if (!frontRef.current || !backRef.current) return;
    setIsExporting(true);
    try {
      const { exportCardsPDF } = await import("@/lib/export-pdf");
      await exportCardsPDF(frontRef.current, backRef.current, card);
    } catch (err) {
      console.error("Error exportando PDF:", err);
      alert("Ocurrió un error al generar el PDF. Intentá de nuevo.");
    } finally {
      setIsExporting(false);
    }
  }

  function handleReset() {
    if (confirm("¿Seguro que querés reiniciar el diseño?")) {
      setCard(defaultCardState);
    }
  }

  return (
    <div className="h-[100svh] bg-background flex flex-col overflow-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-foreground focus:shadow"
      >
        Saltar al contenido
      </a>

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
              type="button"
              aria-label="Reiniciar diseño"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Reiniciar</span>
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="sm"
              type="button"
              aria-busy={isExporting}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow"
            >
              {isExporting ? (
                <RefreshCw
                  size={14}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Download size={14} aria-hidden="true" />
              )}
              {isExporting ? "Generando…" : "Exportar PDF"}
            </Button>
            <span className="sr-only" aria-live="polite">
              {isExporting ? "Generando PDF…" : ""}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* LEFT: Editor panel */}
        <aside className="w-full lg:w-96 xl:w-md 2xl:w-120 border-b lg:border-b-0 lg:border-r border-border bg-card elev-level-1 flex flex-col overflow-y-auto overscroll-contain max-h-[45svh] lg:max-h-none lg:h-full min-h-0">
          <EditorPanel card={card} onChange={handleChange} />
        </aside>

        {/* RIGHT: Preview area — always shows both sides */}
        <main
          id="main"
          className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 gap-6 overflow-hidden"
          aria-labelledby="preview-title"
        >
          <div className="w-full max-w-5xl flex flex-col items-center gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2
                  id="preview-title"
                  className="text-xs font-semibold text-center uppercase tracking-wider text-muted-foreground"
                >
                  Vista previa
                </h2>
                <p className="text-xs text-muted-foreground">
                  La exportación incluye frente y dorso.
                </p>
              </div>
            </div>

            {/* Card previews — stacked on mobile, side by side on large screens */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-12">
              {/* Front preview */}
              <section
                className="flex flex-col items-center gap-3"
                aria-labelledby="front-title"
              >
                <h3
                  id="front-title"
                  className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary"
                >
                  Frente
                </h3>
                <div className="transition-transform duration-200 ease-out hover:scale-[1.02] will-change-transform [--card-shadow:0_18px_50px_rgba(0,0,0,0.25)] hover:[--card-shadow:0_26px_70px_rgba(0,0,0,0.38)]">
                  <CardFront ref={frontRef} card={card} scale={1} />
                </div>
              </section>

              {/* Back preview */}
              <section
                className="flex flex-col items-center gap-3"
                aria-labelledby="back-title"
              >
                <h3
                  id="back-title"
                  className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary"
                >
                  Dorso
                </h3>
                <div className="transition-transform duration-200 ease-out hover:scale-[1.02] will-change-transform [--card-shadow:0_18px_50px_rgba(0,0,0,0.25)] hover:[--card-shadow:0_26px_70px_rgba(0,0,0,0.38)]">
                  <CardBack ref={backRef} card={card} scale={1} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Incluye banda magnética
                </p>
              </section>
            </div>
          </div>

          {/* Export CTA removed from canvas */}
        </main>
      </div>
    </div>
  );
}

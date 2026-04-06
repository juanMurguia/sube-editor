"use client";

import CardBack from "@/components/card-back";
import CardFront from "@/components/card-front";
import EditorPanel from "@/components/editor-panel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { CardState, defaultCardState } from "@/lib/card-types";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Download,
  Menu,
  RefreshCw,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";

export default function Home() {
  const [card, setCard] = useState<CardState>(defaultCardState);
  const [isExporting, setIsExporting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<"front" | "back">("front");
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastDeltaRef = useRef({ x: 0, y: 0 });

  const isMobile = useIsMobile();

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

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
      setActivePreview("front");
      setPullDistance(0);
    }
  }, [isMobile]);

  const handlePreviewTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (!isMobile) return;
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      lastDeltaRef.current = { x: 0, y: 0 };
    },
    [isMobile],
  );

  const handlePreviewTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (!isMobile) return;
      const touch = event.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      lastDeltaRef.current = { x: dx, y: dy };

      if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
        const scrollTop = mainScrollRef.current?.scrollTop ?? 0;
        if (scrollTop <= 0) {
          setPullDistance(Math.min(dy, 80));
        }
      } else if (Math.abs(dx) > Math.abs(dy)) {
        setPullDistance(0);
      }
    },
    [isMobile],
  );

  const handlePreviewTouchEnd = useCallback(() => {
    if (!isMobile) return;
    const { x: dx, y: dy } = lastDeltaRef.current;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      setActivePreview((prev) => (prev === "front" ? "back" : "front"));
    }

    if (pullDistance > 60 && !isRefreshingPreview) {
      setIsRefreshingPreview(true);
      setPreviewKey((prev) => prev + 1);
      window.setTimeout(() => {
        setIsRefreshingPreview(false);
      }, 700);
    }

    setPullDistance(0);
  }, [isMobile, pullDistance, isRefreshingPreview]);

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
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-sm font-bold text-foreground font-serif leading-none">
              Mi SUBE Personalizada
            </h1>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              Diseñá y exportá tu tarjeta
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center hidden md:block">
            Made with ❤️ by{" "}
            <a
              href="https://devjuan.online"
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:underline"
            >
              Juan Cruz
            </a>
          </p>

          <div className="hidden sm:flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              type="button"
              aria-label="Reiniciar diseño"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span className="hidden md:inline">Reiniciar</span>
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
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Download size={15} aria-hidden="true" />
              )}
              {isExporting ? "Generando…" : "Exportar PDF"}
            </Button>
            <span className="sr-only" aria-live="polite">
              {isExporting ? "Generando PDF…" : ""}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="sm:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="sm:hidden border-t border-border bg-card"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  handleReset();
                  setIsMenuOpen(false);
                }}
                type="button"
                aria-label="Reiniciar diseño"
                className="gap-2 justify-center"
              >
                <RotateCcw size={16} aria-hidden="true" />
                Reiniciar diseño
              </Button>
              <Button
                onClick={() => {
                  handleExport();
                  setIsMenuOpen(false);
                }}
                disabled={isExporting}
                size="lg"
                type="button"
                aria-busy={isExporting}
                className="gap-2 justify-center bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow"
              >
                {isExporting ? (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Download size={16} aria-hidden="true" />
                )}
                {isExporting ? "Generando…" : "Exportar PDF"}
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-1">
                Made with ❤️ by{" "}
                <a
                  href="https://devjuan.online"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:underline"
                >
                  Juan Cruz
                </a>
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 ">
        {/* LEFT: Editor panel */}
        <aside className="w-full lg:w-96 xl:w-md 2xl:w-120 border-b lg:border-b-0 lg:border-r border-border bg-card elev-level-1 flex flex-col overflow-y-auto overscroll-contain max-h-[50svh] sm:max-h-[45svh] lg:max-h-none lg:h-full min-h-0">
          <EditorPanel card={card} onChange={handleChange} />
        </aside>

        {/* RIGHT: Preview area — always shows both sides */}
        <main
          id="main"
          ref={mainScrollRef}
          className=" flex-1 flex flex-col items-center justify-start lg:justify-center p-5 pb-24 sm:p-6 sm:pb-6 lg:p-8 gap-6 overflow-y-auto lg:overflow-hidden  "
          aria-labelledby="preview-title"
        >
          <div className="w-full max-w-5xl flex flex-col items-center gap-4">
            <div className="flex items-end justify-between gap-4 w-full">
              {!isMobile && (
                <div className="w-full text-center">
                  <h2
                    id="preview-title"
                    className="text-xs font-semibold text-center uppercase tracking-wider text-muted-foreground"
                  >
                    Vista previa
                  </h2>

                  <p className="text-xs text-muted-foreground text-center">
                    La exportación incluye frente y dorso.
                  </p>
                </div>
              )}
            </div>

            <div
              className="relative w-full flex items-center justify-center touch-pan-y"
              onTouchStart={handlePreviewTouchStart}
              onTouchMove={handlePreviewTouchMove}
              onTouchEnd={handlePreviewTouchEnd}
            >
              {isMobile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-card/90 shadow-sm backdrop-blur"
                  aria-label={
                    activePreview === "front"
                      ? "Mostrar dorso"
                      : "Mostrar frente"
                  }
                  onClick={() =>
                    setActivePreview((prev) =>
                      prev === "front" ? "back" : "front",
                    )
                  }
                >
                  <ChevronRight
                    size={18}
                    className={cn(
                      "transition-transform",
                      activePreview === "back" && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </Button>
              )}
              {isMobile && (
                <div
                  className={cn(
                    "pointer-events-none absolute -top-7 left-0 right-0 text-center text-[11px] text-muted-foreground transition-opacity",
                    pullDistance > 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {isRefreshingPreview
                    ? "Actualizando vista…"
                    : pullDistance > 60
                      ? "Soltá para refrescar"
                      : "Deslizá hacia abajo para refrescar"}
                </div>
              )}

              {/* Card previews — stacked on mobile, side by side on large screens */}
              <div
                key={previewKey}
                className={cn(
                  "flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-12 transition-transform duration-150",
                  pullDistance > 0 && "will-change-transform",
                )}
                style={{
                  transform:
                    isMobile && pullDistance > 0
                      ? `translateY(${pullDistance}px)`
                      : undefined,
                }}
              >
                {/* Front preview */}
                <section
                  className={cn(
                    "flex flex-col items-center gap-3",
                    isMobile && activePreview !== "front" && "hidden",
                  )}
                  aria-labelledby="front-title"
                  aria-hidden={isMobile && activePreview !== "front"}
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
                  className={cn(
                    "flex flex-col items-center gap-3",
                    isMobile && activePreview !== "back" && "hidden",
                  )}
                  aria-labelledby="back-title"
                  aria-hidden={isMobile && activePreview !== "back"}
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

            {isMobile && (
              <div className="flex items-center justify-center gap-2 pt-1">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    activePreview === "front"
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    activePreview === "back"
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {/* Export CTA removed from canvas */}
        </main>
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="lg"
            type="button"
            aria-busy={isExporting}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow"
          >
            {isExporting ? (
              <RefreshCw
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Download size={16} aria-hidden="true" />
            )}
            {isExporting ? "Generando…" : "Exportar Imprimible PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import CardBack from "@/components/card-back";
import CardFront from "@/components/card-front";
import EditorPanel from "@/components/editor-panel";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { CardState, defaultCardState } from "@/lib/card-types";
import { cn } from "@/lib/utils";
import { Download, Menu, RefreshCw, RotateCcw, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const DRAFT_STORAGE_KEY = "sube-editor:draft:v1";

function isCardStateLike(value: unknown): value is CardState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as CardState;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.number === "string" &&
    !!candidate.front &&
    !!candidate.back &&
    Array.isArray(candidate.front.images) &&
    Array.isArray(candidate.back.images)
  );
}

export default function Home() {
  const [card, setCard] = useState<CardState>(defaultCardState);
  const [isExporting, setIsExporting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<"front" | "back">("front");
  const [previewScale, setPreviewScale] = useState(1);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [, setLastSavedAt] = useState<Date | null>(null);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

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

  const handleExport = useCallback(async () => {
    if (!exportFrontRef.current || !exportBackRef.current) return;

    setIsExporting(true);
    try {
      const { exportCardsPDF } = await import("@/lib/export-pdf");
      await exportCardsPDF(exportFrontRef.current, exportBackRef.current, card);
      toast({
        title: "PDF listo",
        description: "Se generaron frente y dorso correctamente.",
      });
    } catch (err) {
      console.error("Error exportando PDF:", err);
      toast({
        variant: "destructive",
        title: "No se pudo exportar",
        description: "Volvé a intentarlo en unos segundos.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [card]);

  const clearDraft = useCallback(() => {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasSavedDraft(false);
    setLastSavedAt(null);
  }, []);

  const handleReset = useCallback(() => {
    const snapshot = card;
    setCard(defaultCardState);
    clearDraft();
    toast({
      title: "Diseño reiniciado",
      description: "Se borraron los cambios locales de esta sesión.",
      action: (
        <ToastAction
          altText="Deshacer reinicio"
          onClick={() => {
            setCard(snapshot);
            toast({
              title: "Cambios restaurados",
              description: "Tu diseño volvió al estado anterior.",
            });
          }}
        >
          Deshacer
        </ToastAction>
      ),
    });
  }, [card, clearDraft]);

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
      setActivePreview("front");
    }
  }, [isMobile]);

  useEffect(() => {
    const draftRaw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draftRaw) {
      setHasHydratedDraft(true);
      return;
    }

    try {
      const parsed = JSON.parse(draftRaw) as unknown;
      if (!isCardStateLike(parsed)) {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        setHasHydratedDraft(true);
        return;
      }

      setCard(parsed);
      setHasSavedDraft(true);
      setLastSavedAt(new Date());
      toast({
        title: "Borrador restaurado",
        description: "Recuperamos tu última personalización automáticamente.",
      });
    } catch {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } finally {
      setHasHydratedDraft(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedDraft) return;

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(card));
      setHasSavedDraft(true);
      setLastSavedAt(new Date());
    }, 250);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [card, hasHydratedDraft]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.ctrlKey || event.metaKey;
      if (!modifier) return;

      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        void handleExport();
      }

      if (event.key.toLowerCase() === "r" && event.shiftKey) {
        event.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleExport, handleReset]);

  useLayoutEffect(() => {
    if (!isMobile) {
      setPreviewScale(1);
      return;
    }

    const CARD_BASE_WIDTH = 342;
    const CARD_BASE_HEIGHT = 216;
    const VERTICAL_CHROME = 92;
    const HORIZONTAL_GUTTER = 16;

    const updateScale = () => {
      const wrap = previewWrapRef.current;
      if (!wrap) return;

      const availableWidth = Math.max(0, wrap.clientWidth - HORIZONTAL_GUTTER);
      const availableHeight = Math.max(0, wrap.clientHeight - VERTICAL_CHROME);
      if (availableWidth === 0 || availableHeight === 0) return;

      const widthScale = availableWidth / CARD_BASE_WIDTH;
      const heightScale = availableHeight / CARD_BASE_HEIGHT;
      const nextScale = Math.min(1, widthScale, heightScale);

      if (Number.isFinite(nextScale)) {
        setPreviewScale(nextScale);
      }
    };

    updateScale();

    const wrap = previewWrapRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (wrap && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScale();
      });
      resizeObserver.observe(wrap);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      resizeObserver?.disconnect();
    };
  }, [isMobile]);

  return (
    <div className="h-[100svh] bg-background flex flex-col overflow-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-foreground focus:shadow"
      >
        Saltar al contenido
      </a>

      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="relative max-w-7xl mx-auto px-4 min-h-14 sm:min-h-16 py-2 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-sm font-bold text-foreground font-serif leading-none">
              Mi SUBE Personalizada
            </h1>
            <p className="text-sm text-muted-foreground leading-none mt-0.5">
              Diseñá y exportá tu tarjeta
            </p>
          </div>

          <p className="hidden sm:block absolute left-1/2 -translate-x-1/2 text-xs text-muted-foreground leading-none">
            hecho con {"<3"} por{" "}
            <a
              href="https://x.com/DevJuanCruz"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              juan cruz
            </a>
          </p>

          <div className="hidden sm:flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              type="button"
              aria-label="Reiniciar diseño"
              className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
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

          <div className="sm:hidden flex items-center gap-1">
            <Button
              onClick={() => void handleExport()}
              disabled={isExporting}
              size="sm"
              type="button"
              aria-busy={isExporting}
              className="h-8 px-2.5 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow"
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
              {isExporting ? "Generando…" : "Exportar"}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="sm:hidden border-t border-border bg-card"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              {hasSavedDraft && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    clearDraft();
                    setIsMenuOpen(false);
                  }}
                  type="button"
                  className="justify-center"
                >
                  Descartar borrador
                </Button>
              )}
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
                  void handleExport();
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
            </div>
          </div>
        )}
      </header>

      {isMobile ? (
        <div
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-4"
          id="main"
          aria-labelledby="preview-title-mobile"
        >
          <section className="sticky top-0 z-30 border-b border-border/60 bg-background/95 px-3 pt-3 pb-3 backdrop-blur supports-[backdrop-filter]:bg-background/90">
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={activePreview === "front" ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePreview("front")}
                className="h-8 text-xs"
              >
                Frente
              </Button>
              <Button
                type="button"
                variant={activePreview === "back" ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePreview("back")}
                className="h-8 text-xs"
              >
                Dorso
              </Button>
            </div>

            <div
              ref={previewWrapRef}
              className="relative mt-2 h-[258px] w-full "
            >
              <div className="flex h-full items-center justify-center">
                <section
                  className={cn(
                    "flex flex-col items-center gap-3",
                    activePreview !== "front" && "hidden",
                  )}
                  aria-labelledby="front-title-mobile"
                  aria-hidden={activePreview !== "front"}
                >
                  <div className="[--card-shadow:0_18px_50px_rgba(10,15,28,0.24)]">
                    <CardFront
                      ref={frontRef}
                      card={card}
                      scale={previewScale}
                    />
                  </div>
                </section>

                <section
                  className={cn(
                    "flex flex-col items-center gap-3",
                    activePreview !== "back" && "hidden",
                  )}
                  aria-labelledby="back-title-mobile"
                  aria-hidden={activePreview !== "back"}
                >
                  <div className="[--card-shadow:0_18px_50px_rgba(10,15,28,0.24)]">
                    <CardBack ref={backRef} card={card} scale={previewScale} />
                  </div>
                </section>
              </div>
            </div>
          </section>

          <aside className="px-3 py-3">
            <EditorPanel card={card} onChange={handleChange} />
          </aside>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <aside className="w-96 xl:w-md 2xl:w-120 border-r border-border bg-card overflow-y-auto overscroll-contain min-h-0">
            <EditorPanel card={card} onChange={handleChange} />
          </aside>

          <main
            id="main"
            className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 gap-6 overflow-hidden"
            aria-labelledby="preview-title"
          >
            <div className="w-full max-w-5xl flex flex-col items-center gap-4 flex-1 min-h-0">
              <div className="w-full text-center">
                <h2
                  id="preview-title"
                  className="text-sm font-semibold text-center uppercase tracking-wider text-muted-foreground"
                >
                  Vista previa
                </h2>
                <p className="text-sm text-muted-foreground text-center">
                  La exportación incluye frente y dorso.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-12">
                <section
                  className="flex flex-col items-center gap-3"
                  aria-labelledby="front-title"
                >
                  <h3
                    id="front-title"
                    className="text-sm font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary"
                  >
                    Frente
                  </h3>
                  <div className="transition-transform duration-200 ease-out hover:scale-[1.02] will-change-transform [--card-shadow:0_18px_50px_rgba(10,15,28,0.24)] hover:[--card-shadow:0_26px_70px_rgba(10,15,28,0.34)]">
                    <CardFront ref={frontRef} card={card} />
                  </div>
                </section>

                <section
                  className="flex flex-col items-center gap-3"
                  aria-labelledby="back-title"
                >
                  <h3
                    id="back-title"
                    className="text-sm font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary"
                  >
                    Dorso
                  </h3>
                  <div className="transition-transform duration-200 ease-out hover:scale-[1.02] will-change-transform [--card-shadow:0_18px_50px_rgba(10,15,28,0.24)] hover:[--card-shadow:0_26px_70px_rgba(10,15,28,0.34)]">
                    <CardBack ref={backRef} card={card} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Incluye banda magnética
                  </p>
                </section>
              </div>
            </div>
          </main>
        </div>
      )}

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          transform: "translateX(-200vw)",
          pointerEvents: "none",
          opacity: 0,
          zIndex: -1,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <CardFront ref={exportFrontRef} card={card} scale={1} forExport />
        <CardBack ref={exportBackRef} card={card} scale={1} forExport />
      </div>
    </div>
  );
}

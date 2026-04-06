"use client"

import { useRef } from "react"
import { CardState, CardSide, TextAlign } from "@/lib/card-types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { getFontFamily, NAME_FONT_OPTIONS, NUMBER_FONT_OPTIONS } from "@/lib/font-options"
import {
  Upload,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Type,
  CreditCard,
  Layers,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
} from "lucide-react"

interface EditorPanelProps {
  card: CardState
  onChange: (update: Partial<CardState> | ((prev: CardState) => CardState)) => void
}

export default function EditorPanel({ card, onChange }: EditorPanelProps) {
  const cardWidth = 342
  const cardHeight = 216
  const frontFileRef = useRef<HTMLInputElement>(null)
  const backFileRef = useRef<HTMLInputElement>(null)
  const frontOverlayRef = useRef<HTMLInputElement>(null)
  const backOverlayRef = useRef<HTMLInputElement>(null)

  const activeSide = card.activeSide
  const design = card[activeSide]

  function handleBgFile(side: CardSide, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      onChange((prev) => ({
        ...prev,
        [side]: { ...prev[side], bgImage: src },
      }))
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function handleOverlayFile(side: CardSide, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      onChange((prev) => ({
        ...prev,
        [side]: {
          ...prev[side],
          images: [
            ...prev[side].images,
            { id: crypto.randomUUID(), src, x: 0, y: 0, width: cardWidth, height: cardHeight, scale: 1, opacity: 1 },
          ],
        },
      }))
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function removeBg(side: CardSide) {
    onChange((prev) => ({ ...prev, [side]: { ...prev[side], bgImage: null } }))
  }

  function removeImage(side: CardSide, id: string) {
    onChange((prev) => ({
      ...prev,
      [side]: { ...prev[side], images: prev[side].images.filter((img) => img.id !== id) },
    }))
  }

  const alignOptions: { value: TextAlign; icon: React.ReactNode }[] = [
    { value: "left", icon: <AlignLeft size={14} /> },
    { value: "center", icon: <AlignCenter size={14} /> },
    { value: "right", icon: <AlignRight size={14} /> },
  ]

  const sideOptions: { value: CardSide; label: string }[] = [
    { value: "front", label: "Frente" },
    { value: "back", label: "Dorso" },
  ]

  const typographyOptions = [...NAME_FONT_OPTIONS, ...NUMBER_FONT_OPTIONS]

  function handleTypographyChange(value: string) {
    const fontId = value as typeof card.nameFont
    onChange({ nameFont: fontId, numberFont: fontId })
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Active side tabs */}
      <div className="px-5 pt-5 pb-3 border-b border-border/70">
        <p className="text-[11px] text-muted-foreground font-semibold mb-2 uppercase tracking-[0.2em]">Editando cara</p>
        <div className="grid grid-cols-2 gap-2">
          {sideOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ activeSide: opt.value })}
              aria-pressed={activeSide === opt.value}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-sm font-semibold transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
                activeSide === opt.value
                  ? "bg-primary text-primary-foreground elev-shadow-1"
                  : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="datos" className="flex-1">
        <TabsList className="w-full h-auto rounded-xl border border-border/60 bg-secondary p-1 elev-level-1">
          <TabsTrigger value="datos" className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground gap-1 transition-[color,box-shadow,background-color] hover:bg-background/70 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--elevation-shadow-1)]">
            <Type size={13} /> Datos
          </TabsTrigger>
          <TabsTrigger value="fondo" className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground gap-1 transition-[color,box-shadow,background-color] hover:bg-background/70 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--elevation-shadow-1)]">
            <Palette size={13} /> Fondo
          </TabsTrigger>
          <TabsTrigger value="imagenes" className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground gap-1 transition-[color,box-shadow,background-color] hover:bg-background/70 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--elevation-shadow-1)]">
            <ImageIcon size={13} /> Imágenes
          </TabsTrigger>
        </TabsList>

        {/* DATOS */}
        <TabsContent value="datos" className="px-5 py-5 flex flex-col gap-6 m-0">
          {/* Name */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary p-4 elev-level-2">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Type size={13} />
              Nombre
            </Label>
            <Input
              placeholder=" Juan Cruz"
              value={card.name}
              onChange={(e) => onChange({ name: e.target.value.toUpperCase() })}
              className="font-mono text-sm transition-shadow focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
              maxLength={26}
            />
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Mostrar en</span>
              <div className="flex gap-1.5">
                {sideOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onChange({ nameSide: s.value })}
                    aria-pressed={card.nameSide === s.value}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
                      card.nameSide === s.value ? "bg-primary text-primary-foreground elev-shadow-1" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Color</span>
              <input
                type="color"
                value={card.nameColor}
                onChange={(e) => onChange({ nameColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95"
                title="Color del nombre"
              />
              <span className="font-mono text-xs text-foreground">{card.nameColor.toUpperCase()}</span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Alineación</span>
              <div className="flex gap-1.5">
                {alignOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => onChange({ nameAlign: a.value })}
                    aria-pressed={card.nameAlign === a.value}
                    className={cn(
                      "p-1.5 rounded-md transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 elev-level-1",
                      card.nameAlign === a.value ? "bg-primary text-primary-foreground elev-shadow-1" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
                    )}
                  >
                    {a.icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Tamaño: {card.nameFontSize}px</span>
              <Slider
                min={8}
                max={22}
                step={1}
                value={[card.nameFontSize]}
                onValueChange={([v]) => onChange({ nameFontSize: v })}
                className="flex-1"
              />
            </div>
          </div>

          {/* Number */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary p-4 elev-level-2">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <CreditCard size={13} />
              Número
            </Label>
            <Input
              placeholder="0000 0000 0000 0000"
              value={card.number}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "").slice(0, 16)
                v = v.replace(/(.{4})/g, "$1 ").trim()
                onChange({ number: v })
              }}
              className="font-mono text-sm tracking-widest transition-shadow focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
              maxLength={19}
            />
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Mostrar en</span>
              <div className="flex gap-1.5">
                {sideOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onChange({ numberSide: s.value })}
                    aria-pressed={card.numberSide === s.value}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
                      card.numberSide === s.value ? "bg-primary text-primary-foreground elev-shadow-1" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Color</span>
              <input
                type="color"
                value={card.numberColor}
                onChange={(e) => onChange({ numberColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95"
                title="Color del número"
              />
              <span className="font-mono text-xs text-foreground">{card.numberColor.toUpperCase()}</span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Alineación</span>
              <div className="flex gap-1.5">
                {alignOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => onChange({ numberAlign: a.value })}
                    aria-pressed={card.numberAlign === a.value}
                    className={cn(
                      "p-1.5 rounded-md transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 elev-level-1",
                      card.numberAlign === a.value ? "bg-primary text-primary-foreground elev-shadow-1" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
                    )}
                  >
                    {a.icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Dirección</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onChange({ numberDirection: "horizontal" })}
                  aria-pressed={card.numberDirection === "horizontal"}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
                    card.numberDirection === "horizontal" ? "bg-primary text-primary-foreground elev-shadow-1" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
                  )}
                >
                  <AlignHorizontalDistributeCenter size={12} />
                  Horizontal
                </button>
                <button
                  onClick={() => onChange({ numberDirection: "vertical" })}
                  aria-pressed={card.numberDirection === "vertical"}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-[transform,box-shadow,background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
                    card.numberDirection === "vertical" ? "bg-primary text-primary-foreground elev-shadow-1" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
                  )}
                >
                  <AlignVerticalDistributeCenter size={12} />
                  Vertical
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Tamaño: {card.numberFontSize}px</span>
              <Slider
                min={8}
                max={20}
                step={1}
                value={[card.numberFontSize]}
                onValueChange={([v]) => onChange({ numberFontSize: v })}
                className="flex-1"
              />
            </div>
          </div>

          {/* Typography */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary p-4 elev-level-2">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Type size={13} />
              Tipografía
            </Label>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Aplica a nombre y número</span>
            <Select value={card.nameFont} onValueChange={handleTypographyChange}>
              <SelectTrigger
                className="w-full transition-shadow focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
                style={{ fontFamily: getFontFamily(card.nameFont) }}
              >
                <SelectValue placeholder="Elegí una fuente" />
              </SelectTrigger>
              <SelectContent>
                {typographyOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    <span style={{ fontFamily: getFontFamily(opt.id) }}>{opt.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Card label */}
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary px-4 py-3 elev-level-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <CreditCard size={13} />
              Texto &quot;SUBE&quot;
            </span>
            <button
              onClick={() => onChange({ showCardLabel: !card.showCardLabel })}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                card.showCardLabel ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                card.showCardLabel ? "translate-x-4.5" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </TabsContent>

        {/* FONDO */}
        <TabsContent value="fondo" className="px-5 py-5 flex flex-col gap-5 m-0">
          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary p-4 elev-level-2">
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
              Color de fondo — {activeSide === "front" ? "Frente" : "Dorso"}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={design.bgColor}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    [activeSide]: { ...prev[activeSide], bgColor: e.target.value },
                  }))
                }
                className="w-10 h-10 rounded-lg cursor-pointer border border-border transition-transform hover:scale-105 active:scale-95"
              />
              <span className="font-mono text-sm text-foreground">{design.bgColor.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-secondary p-4 elev-level-2">
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
              Imagen de fondo — {activeSide === "front" ? "Frente" : "Dorso"}
            </p>
            {design.bgImage ? (
              <div className="flex flex-col gap-2">
                <div
                  className="w-full h-20 rounded-lg border border-border overflow-hidden shadow-[var(--elevation-shadow-1)]"
                  style={{
                    backgroundImage: `url(${design.bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Opacidad: {Math.round(design.bgImageOpacity * 100)}%</span>
                  <Slider
                    min={10}
                    max={100}
                    step={5}
                    value={[Math.round(design.bgImageOpacity * 100)]}
                    onValueChange={([v]) =>
                      onChange((prev) => ({
                        ...prev,
                        [activeSide]: { ...prev[activeSide], bgImageOpacity: v / 100 },
                      }))
                    }
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  {(["cover", "contain", "fill"] as const).map((fit) => (
                    <button
                      key={fit}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          [activeSide]: { ...prev[activeSide], bgImageFit: fit },
                        }))
                      }
                      className={cn(
                        "flex-1 py-1 rounded-md text-xs font-semibold transition-[transform,box-shadow,background-color,color] duration-200 capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98] elev-level-1",
                        design.bgImageFit === fit ? "bg-primary text-primary-foreground elev-shadow-1" : "bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground hover:shadow-[var(--elevation-shadow-1)]"
                      )}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => removeBg(activeSide)} className="transition-transform active:scale-[0.98]">
                  Quitar imagen
                </Button>
              </div>
            ) : (
              <button
                onClick={() => activeSide === "front" ? frontFileRef.current?.click() : backFileRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg py-6 flex flex-col items-center gap-2 text-muted-foreground transition-[border-color,background-color,transform,box-shadow,color] duration-200 hover:border-primary hover:bg-primary/5 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.99]"
              >
                <Upload size={20} />
                <span className="text-sm font-medium">Subir imagen de fondo</span>
                <span className="text-xs">PNG, JPG, WebP</span>
              </button>
            )}
            <input
              ref={frontFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleBgFile("front", e)}
            />
            <input
              ref={backFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleBgFile("back", e)}
            />
          </div>
        </TabsContent>

        {/* IMAGENES */}
        <TabsContent value="imagenes" className="px-5 py-5 flex flex-col gap-5 m-0">
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
            Imágenes encima — {activeSide === "front" ? "Frente" : "Dorso"}
          </p>
          <button
            onClick={() => activeSide === "front" ? frontOverlayRef.current?.click() : backOverlayRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg py-5 flex flex-col items-center gap-2 text-muted-foreground transition-[border-color,background-color,transform,box-shadow,color] duration-200 hover:border-primary hover:bg-primary/5 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.99]"
          >
            <Layers size={20} />
            <span className="text-sm font-medium">Agregar imagen encima</span>
            <span className="text-xs">PNG, JPG, SVG, WebP</span>
          </button>
          <input
            ref={frontOverlayRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleOverlayFile("front", e)}
          />
          <input
            ref={backOverlayRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleOverlayFile("back", e)}
          />

          {design.images.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No hay imágenes agregadas</p>
          ) : (
            <div className="flex flex-col gap-3">
              {design.images.map((img, i) => (
                <div key={img.id} className="flex flex-col gap-2 p-3 bg-secondary rounded-lg border border-border/60 transition-shadow hover:shadow-[var(--elevation-shadow-1)]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded border border-border overflow-hidden flex-shrink-0"
                      style={{
                        backgroundImage: `url(${img.src})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                    <span className="text-xs text-foreground font-medium flex-1">Imagen {i + 1}</span>
                    <button
                      onClick={() => removeImage(activeSide, img.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Opacidad: {Math.round(img.opacity * 100)}%</span>
                    <Slider
                      min={10}
                      max={100}
                      step={5}
                      value={[Math.round(img.opacity * 100)]}
                      onValueChange={([v]) =>
                        onChange((prev) => ({
                          ...prev,
                          [activeSide]: {
                            ...prev[activeSide],
                            images: prev[activeSide].images.map((im) =>
                              im.id === img.id ? { ...im, opacity: v / 100 } : im
                            ),
                          },
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Escala: {Math.round(img.scale * 100)}%</span>
                    <Slider
                      min={25}
                      max={200}
                      step={5}
                      value={[Math.round(img.scale * 100)]}
                      onValueChange={([v]) =>
                        onChange((prev) => ({
                          ...prev,
                          [activeSide]: {
                            ...prev[activeSide],
                            images: prev[activeSide].images.map((im) =>
                              im.id === img.id ? { ...im, scale: v / 100 } : im
                            ),
                          },
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Posición horizontal: {img.x}</span>
                      <Slider
                        min={0}
                        max={342}
                        step={5}
                        value={[img.x]}
                        onValueChange={([v]) =>
                          onChange((prev) => ({
                            ...prev,
                            [activeSide]: {
                              ...prev[activeSide],
                              images: prev[activeSide].images.map((im) =>
                                im.id === img.id ? { ...im, x: v } : im
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Posición vertical: {img.y}</span>
                      <Slider
                        min={0}
                        max={216}
                        step={5}
                        value={[img.y]}
                        onValueChange={([v]) =>
                          onChange((prev) => ({
                            ...prev,
                            [activeSide]: {
                              ...prev[activeSide],
                              images: prev[activeSide].images.map((im) =>
                                im.id === img.id ? { ...im, y: v } : im
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}

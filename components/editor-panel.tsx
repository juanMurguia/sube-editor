"use client"

import { useRef, useState } from "react"
import { CardState, CardSide, TextAlign } from "@/lib/card-types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Upload,
  Link,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Type,
  CreditCard,
  Layers,
} from "lucide-react"

interface EditorPanelProps {
  card: CardState
  onChange: (update: Partial<CardState> | ((prev: CardState) => CardState)) => void
}

export default function EditorPanel({ card, onChange }: EditorPanelProps) {
  const frontFileRef = useRef<HTMLInputElement>(null)
  const backFileRef = useRef<HTMLInputElement>(null)
  const frontOverlayRef = useRef<HTMLInputElement>(null)
  const backOverlayRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState("")
  const [urlTarget, setUrlTarget] = useState<"bg" | "overlay">("bg")
  const [urlSide, setUrlSide] = useState<CardSide>("front")
  const [urlError, setUrlError] = useState("")

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
            { id: crypto.randomUUID(), src, x: 10, y: 10, width: 80, height: 80, opacity: 1 },
          ],
        },
      }))
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function handleAddUrl() {
    setUrlError("")
    if (!urlInput.trim()) return
    const url = urlInput.trim()
    if (urlTarget === "bg") {
      onChange((prev) => ({
        ...prev,
        [urlSide]: { ...prev[urlSide], bgImage: url },
      }))
    } else {
      onChange((prev) => ({
        ...prev,
        [urlSide]: {
          ...prev[urlSide],
          images: [
            ...prev[urlSide].images,
            { id: crypto.randomUUID(), src: url, x: 10, y: 10, width: 80, height: 80, opacity: 1 },
          ],
        },
      }))
    }
    setUrlInput("")
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

  return (
    <div className="flex flex-col gap-0 h-full overflow-y-auto">
      {/* Active side tabs */}
      <div className="px-4 pt-4 pb-2 border-b border-border">
        <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">Editando cara</p>
        <div className="flex gap-2">
          {sideOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ activeSide: opt.value })}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all",
                activeSide === opt.value
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="datos" className="flex-1">
        <TabsList className="w-full rounded-none border-b border-border h-auto p-0 bg-transparent">
          <TabsTrigger value="datos" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs gap-1">
            <Type size={13} /> Datos
          </TabsTrigger>
          <TabsTrigger value="fondo" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs gap-1">
            <Palette size={13} /> Fondo
          </TabsTrigger>
          <TabsTrigger value="imagenes" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs gap-1">
            <ImageIcon size={13} /> Imágenes
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs gap-1">
            <Link size={13} /> URL
          </TabsTrigger>
        </TabsList>

        {/* DATOS */}
        <TabsContent value="datos" className="px-4 py-4 flex flex-col gap-5 m-0">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Nombre</Label>
            <Input
              placeholder="TU NOMBRE"
              value={card.name}
              onChange={(e) => onChange({ name: e.target.value.toUpperCase() })}
              className="font-mono text-sm"
              maxLength={26}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Mostrar en:</span>
              <div className="flex gap-1">
                {sideOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onChange({ nameSide: s.value })}
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium transition-all",
                      card.nameSide === s.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Color:</span>
              <input
                type="color"
                value={card.nameColor}
                onChange={(e) => onChange({ nameColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border border-border"
                title="Color del nombre"
              />
              <span className="text-xs text-muted-foreground">Alineación:</span>
              <div className="flex gap-1">
                {alignOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => onChange({ nameAlign: a.value })}
                    className={cn(
                      "p-1 rounded transition-all",
                      card.nameAlign === a.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
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

          <div className="h-px bg-border" />

          {/* Number */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">Número</Label>
            <Input
              placeholder="0000 0000 0000 0000"
              value={card.number}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "").slice(0, 16)
                v = v.replace(/(.{4})/g, "$1 ").trim()
                onChange({ number: v })
              }}
              className="font-mono text-sm tracking-widest"
              maxLength={19}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Mostrar en:</span>
              <div className="flex gap-1">
                {sideOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => onChange({ numberSide: s.value })}
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium transition-all",
                      card.numberSide === s.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Color:</span>
              <input
                type="color"
                value={card.numberColor}
                onChange={(e) => onChange({ numberColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border border-border"
                title="Color del número"
              />
              <span className="text-xs text-muted-foreground">Alineación:</span>
              <div className="flex gap-1">
                {alignOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => onChange({ numberAlign: a.value })}
                    className={cn(
                      "p-1 rounded transition-all",
                      card.numberAlign === a.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                    )}
                  >
                    {a.icon}
                  </button>
                ))}
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

          <div className="h-px bg-border" />

          {/* Card label */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <CreditCard size={13} />
              Texto &quot;SUBE&quot;
            </span>
            <button
              onClick={() => onChange({ showCardLabel: !card.showCardLabel })}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
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
        <TabsContent value="fondo" className="px-4 py-4 flex flex-col gap-4 m-0">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
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
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
              />
              <span className="font-mono text-sm text-foreground">{design.bgColor}</span>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
              Imagen de fondo — {activeSide === "front" ? "Frente" : "Dorso"}
            </p>
            {design.bgImage ? (
              <div className="flex flex-col gap-2">
                <div
                  className="w-full h-20 rounded-lg border border-border overflow-hidden"
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
                        "flex-1 py-1 rounded text-xs font-medium transition-all capitalize",
                        design.bgImageFit === fit ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                      )}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => removeBg(activeSide)}>
                  Quitar imagen
                </Button>
              </div>
            ) : (
              <button
                onClick={() => activeSide === "front" ? frontFileRef.current?.click() : backFileRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg py-6 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground"
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
        <TabsContent value="imagenes" className="px-4 py-4 flex flex-col gap-4 m-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            Imágenes encima — {activeSide === "front" ? "Frente" : "Dorso"}
          </p>
          <button
            onClick={() => activeSide === "front" ? frontOverlayRef.current?.click() : backOverlayRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg py-5 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground"
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
                <div key={img.id} className="flex flex-col gap-2 p-3 bg-secondary rounded-lg">
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
                    <span className="text-xs text-muted-foreground w-20">Tamaño: {img.width}px</span>
                    <Slider
                      min={20}
                      max={340}
                      step={10}
                      value={[img.width]}
                      onValueChange={([v]) =>
                        onChange((prev) => ({
                          ...prev,
                          [activeSide]: {
                            ...prev[activeSide],
                            images: prev[activeSide].images.map((im) =>
                              im.id === img.id ? { ...im, width: v, height: v } : im
                            ),
                          },
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Pos X: {img.x}</span>
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
                      <span className="text-xs text-muted-foreground">Pos Y: {img.y}</span>
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

        {/* URL */}
        <TabsContent value="url" className="px-4 py-4 flex flex-col gap-4 m-0">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Agregar imagen por URL</p>

            <div className="flex flex-col gap-3">
              <Input
                placeholder="https://ejemplo.com/imagen.jpg"
                value={urlInput}
                onChange={(e) => { setUrlInput(e.target.value); setUrlError("") }}
                className="text-xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">Tipo</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setUrlTarget("bg")}
                      className={cn(
                        "flex-1 py-1 rounded text-xs font-medium transition-all",
                        urlTarget === "bg" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                      )}
                    >
                      Fondo
                    </button>
                    <button
                      onClick={() => setUrlTarget("overlay")}
                      className={cn(
                        "flex-1 py-1 rounded text-xs font-medium transition-all",
                        urlTarget === "overlay" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                      )}
                    >
                      Encima
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium">Cara</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setUrlSide("front")}
                      className={cn(
                        "flex-1 py-1 rounded text-xs font-medium transition-all",
                        urlSide === "front" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                      )}
                    >
                      Frente
                    </button>
                    <button
                      onClick={() => setUrlSide("back")}
                      className={cn(
                        "flex-1 py-1 rounded text-xs font-medium transition-all",
                        urlSide === "back" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                      )}
                    >
                      Dorso
                    </button>
                  </div>
                </div>
              </div>

              {urlError && <p className="text-xs text-destructive">{urlError}</p>}

              <Button onClick={handleAddUrl} className="w-full gap-2" size="sm">
                <Link size={14} />
                Agregar imagen
              </Button>
            </div>
          </div>

          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Tip:</strong> Usá imágenes de Unsplash, Pexels u otros sitios. 
              Asegurate de que la URL termine en .jpg, .png o .webp para mejores resultados.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

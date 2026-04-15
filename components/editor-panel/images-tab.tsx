import { useRef, useState, type ChangeEvent } from "react"
import { Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { CardImage, CardSide, CardState } from "@/lib/card-types"
import type { EditorChangeHandler } from "./types"
import { CARD_HEIGHT, CARD_WIDTH } from "./constants"
import { LabeledSlider, SectionCard, UploadButton } from "./ui"

interface ImagesTabProps {
  card: CardState
  onChange: EditorChangeHandler
}

interface ImageItemProps {
  image: CardImage
  index: number
  mode: "basic" | "advanced"
  onRemove: (id: string) => void
  onUpdate: (id: string, update: Partial<CardImage>) => void
}

function ImageItem({ image, index, mode, onRemove, onUpdate }: ImageItemProps) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-secondary rounded-lg border border-border/60 transition-shadow hover:shadow-[var(--elevation-shadow-1)]">
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded border border-border overflow-hidden flex-shrink-0"
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f0f0f0",
          }}
        />
        <span className="text-xs text-foreground font-medium flex-1">Imagen {index + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(image.id)}
          aria-label={`Quitar imagen ${index + 1}`}
          className="cursor-pointer text-xs text-destructive hover:underline min-h-10 px-2 rounded-md touch-manipulation"
        >
          Quitar
        </button>
      </div>
      <LabeledSlider
        label={`Opacidad: ${Math.round(image.opacity * 100)}%`}
        value={Math.round(image.opacity * 100)}
        min={10}
        max={100}
        step={5}
        onChange={(value) => onUpdate(image.id, { opacity: value / 100 })}
        labelClassName="w-20"
      />
      <LabeledSlider
        label={`Escala: ${Math.round(image.scale * 100)}%`}
        value={Math.round(image.scale * 100)}
        min={25}
        max={200}
        step={5}
        onChange={(value) => onUpdate(image.id, { scale: value / 100 })}
        labelClassName="w-20"
      />
      {mode === "advanced" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Posición horizontal: {image.x}</span>
            <Slider
              min={0}
              max={CARD_WIDTH}
              step={5}
              value={[image.x]}
              onValueChange={([value]) => onUpdate(image.id, { x: value })}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Posición vertical: {image.y}</span>
            <Slider
              min={0}
              max={CARD_HEIGHT}
              step={5}
              value={[image.y]}
              onValueChange={([value]) => onUpdate(image.id, { y: value })}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function ImagesTab({ card, onChange }: ImagesTabProps) {
  const [mode, setMode] = useState<"basic" | "advanced">("basic")
  const frontOverlayRef = useRef<HTMLInputElement>(null)
  const backOverlayRef = useRef<HTMLInputElement>(null)

  function handlePickOverlay(side: CardSide) {
    if (side === "front") {
      frontOverlayRef.current?.click()
      return
    }
    backOverlayRef.current?.click()
  }

  function handleOverlayFile(side: CardSide, e: ChangeEvent<HTMLInputElement>) {
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
            {
              id: crypto.randomUUID(),
              src,
              x: 0,
              y: 0,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              scale: 1,
              opacity: 1,
            },
          ],
        },
      }))
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function updateImage(side: CardSide, id: string, update: Partial<CardImage>) {
    onChange((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        images: prev[side].images.map((image) =>
          image.id === id ? { ...image, ...update } : image,
        ),
      },
    }))
  }

  function removeImage(side: CardSide, id: string) {
    onChange((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        images: prev[side].images.filter((image) => image.id !== id),
      },
    }))
  }

  return (
    <div className="px-5 py-5 flex flex-col gap-5">
      <SectionCard className="gap-2">
        <p className="text-xs font-semibold text-foreground">Gestión de imágenes</p>
        <p className="text-[11px] text-muted-foreground">
          Básico para escala/opacidad. Avanzado suma posición exacta.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "basic" ? "default" : "outline"}
            onClick={() => setMode("basic")}
            className="text-xs"
          >
            Básico
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "advanced" ? "default" : "outline"}
            onClick={() => setMode("advanced")}
            className="text-xs"
          >
            Avanzado
          </Button>
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
          Imágenes encima - Frente
        </p>
        <UploadButton
          icon={<Layers size={20} />}
          title="Agregar imagen encima"
          subtitle="PNG, JPG, SVG, WebP"
          onClick={() => handlePickOverlay("front")}
          className="py-5"
        />
        <input
          ref={frontOverlayRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleOverlayFile("front", e)}
        />
        {card.front.images.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No hay imágenes agregadas</p>
        ) : (
          <div className="flex flex-col gap-3">
            {card.front.images.map((image, index) => (
              <ImageItem
                key={image.id}
                image={image}
                index={index}
                mode={mode}
                onRemove={(id) => removeImage("front", id)}
                onUpdate={(id, update) => updateImage("front", id, update)}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard>
        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-semibold">
          Imágenes encima - Dorso
        </p>
        <UploadButton
          icon={<Layers size={20} />}
          title="Agregar imagen encima"
          subtitle="PNG, JPG, SVG, WebP"
          onClick={() => handlePickOverlay("back")}
          className="py-5"
        />
        <input
          ref={backOverlayRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleOverlayFile("back", e)}
        />
        {card.back.images.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No hay imágenes agregadas</p>
        ) : (
          <div className="flex flex-col gap-3">
            {card.back.images.map((image, index) => (
              <ImageItem
                key={image.id}
                image={image}
                index={index}
                mode={mode}
                onRemove={(id) => removeImage("back", id)}
                onUpdate={(id, update) => updateImage("back", id, update)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}

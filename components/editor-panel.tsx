"use client"

import type { CardState } from "@/lib/card-types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Palette, Type } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
import type { EditorChangeHandler, TextSideOption } from "./editor-panel/types"

interface EditorPanelProps {
  card: CardState
  onChange: EditorChangeHandler
}

const TEXT_SIDE_OPTIONS: TextSideOption[] = [
  { value: "front", label: "Frente" },
  { value: "back", label: "Dorso" },
  { value: "both", label: "Ambos" },
]

const DataTab = dynamic(
  () =>
    import("./editor-panel/data-tab").then((mod) => ({
      default: mod.DataTab,
    })),
  {
    loading: () => (
      <div className="px-5 py-6 text-xs text-muted-foreground">Cargando…</div>
    ),
  },
)

const BackgroundTab = dynamic(
  () =>
    import("./editor-panel/background-tab").then((mod) => ({
      default: mod.BackgroundTab,
    })),
  {
    loading: () => (
      <div className="px-5 py-6 text-xs text-muted-foreground">Cargando…</div>
    ),
  },
)

const ImagesTab = dynamic(
  () =>
    import("./editor-panel/images-tab").then((mod) => ({
      default: mod.ImagesTab,
    })),
  {
    loading: () => (
      <div className="px-5 py-6 text-xs text-muted-foreground">Cargando…</div>
    ),
  },
)

export default function EditorPanel({ card, onChange }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState("datos")

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      <div className="px-5 pt-4 pb-1">
        <p className="text-[11px] text-muted-foreground">
          Tip: usá <span className="font-semibold text-foreground">Ctrl/Cmd + E</span> para exportar rápido.
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1"
      >
        <div className="px-5 pt-3">
          <TabsList className="w-full h-auto rounded-xl border border-border/60 bg-secondary p-1 elev-level-1">
          <TabsTrigger
            value="datos"
            className="flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground gap-1 transition-[color,box-shadow,background-color] hover:bg-background/70 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--elevation-shadow-1)]"
          >
            <Type size={13} /> Datos
          </TabsTrigger>
          <TabsTrigger
            value="fondo"
            className="flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground gap-1 transition-[color,box-shadow,background-color] hover:bg-background/70 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--elevation-shadow-1)]"
          >
            <Palette size={13} /> Fondo
          </TabsTrigger>
          <TabsTrigger
            value="imagenes"
            className="flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground gap-1 transition-[color,box-shadow,background-color] hover:bg-background/70 hover:text-foreground hover:shadow-[var(--elevation-shadow-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[var(--elevation-shadow-1)]"
          >
            <ImageIcon size={13} /> Imágenes
          </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="datos" className="m-0">
          {activeTab === "datos" && (
            <DataTab
              card={card}
              textSideOptions={TEXT_SIDE_OPTIONS}
              onChange={onChange}
            />
          )}
        </TabsContent>

        <TabsContent value="fondo" className="m-0">
          {activeTab === "fondo" && (
            <BackgroundTab card={card} onChange={onChange} />
          )}
        </TabsContent>

        <TabsContent value="imagenes" className="m-0">
          {activeTab === "imagenes" && (
            <ImagesTab card={card} onChange={onChange} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client";

import { useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ETAPAS = [
  { valor: "metas", label: "Metas" },
  { valor: "video", label: "Vídeo" },
  { valor: "cardapio", label: "Cardápio" },
  { valor: "receitas", label: "Receitas" },
  { valor: "suplementacao", label: "Suplementação" },
] as const;

export function ProtocoloNav({
  metasSlot,
  videoSlot,
  cardapioSlot,
  receitasSlot,
  suplementacaoSlot,
}: {
  metasSlot: ReactNode;
  videoSlot: ReactNode;
  cardapioSlot: ReactNode;
  receitasSlot: ReactNode;
  suplementacaoSlot: ReactNode;
}) {
  const [ativo, setAtivo] = useState<(typeof ETAPAS)[number]["valor"]>("metas");
  const indiceAtivo = ETAPAS.findIndex((etapa) => etapa.valor === ativo);

  return (
    <Tabs value={ativo} onValueChange={(v) => setAtivo(v as typeof ativo)}>
      <div className="mb-4 flex items-center justify-between px-1">
        {ETAPAS.map((etapa, i) => (
          <div key={etapa.valor} className="flex flex-1 items-center">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i <= indiceAtivo ? "bg-dourado" : "bg-dourado/25"
              )}
            />
            {i < ETAPAS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 transition-colors",
                  i < indiceAtivo ? "bg-dourado" : "bg-dourado/25"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <TabsList>
        {ETAPAS.map((etapa) => (
          <TabsTrigger key={etapa.valor} value={etapa.valor}>
            {etapa.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="metas">{metasSlot}</TabsContent>
      <TabsContent value="video">{videoSlot}</TabsContent>
      <TabsContent value="cardapio">{cardapioSlot}</TabsContent>
      <TabsContent value="receitas">{receitasSlot}</TabsContent>
      <TabsContent value="suplementacao">{suplementacaoSlot}</TabsContent>
    </Tabs>
  );
}

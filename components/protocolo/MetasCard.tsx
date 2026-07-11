"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Meta } from "@/types/database";

export function MetasCard({ metas: metasIniciais }: { metas: Meta[] }) {
  const [metas, setMetas] = useState(metasIniciais);
  const [poppingId, setPoppingId] = useState<string | null>(null);

  const concluidas = metas.filter((m) => m.concluida).length;
  const progresso = metas.length === 0 ? 0 : Math.round((concluidas / metas.length) * 100);

  async function toggleMeta(meta: Meta) {
    const concluida = !meta.concluida;
    setMetas((prev) => prev.map((m) => (m.id === meta.id ? { ...m, concluida } : m)));

    if (concluida) {
      setPoppingId(meta.id);
      setTimeout(() => setPoppingId(null), 400);
    }

    await fetch("/api/protocolo/metas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metaId: meta.id, concluida }),
    }).catch(() => {
      // Reverte visualmente se a chamada falhar.
      setMetas((prev) => prev.map((m) => (m.id === meta.id ? { ...m, concluida: meta.concluida } : m)));
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas metas</CardTitle>
        <div className="mt-2 flex items-center gap-3">
          <Progress value={progresso} className="flex-1" />
          <span className="text-sm font-medium text-marrom-escuro/70">{progresso}%</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {metas.map((meta) => (
          <label
            key={meta.id}
            className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-dourado/5"
          >
            <Checkbox
              checked={meta.concluida}
              onCheckedChange={() => toggleMeta(meta)}
              className={cn(poppingId === meta.id && "animate-goal-pop")}
            />
            <span>
              <span
                className={cn(
                  "block font-medium text-marrom-escuro",
                  meta.concluida && "text-marrom-escuro/50 line-through"
                )}
              >
                {meta.titulo}
              </span>
              {meta.descricao && (
                <span className="block text-sm text-marrom-escuro/60">{meta.descricao}</span>
              )}
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

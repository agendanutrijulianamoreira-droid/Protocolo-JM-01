import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ItemSuplementacao } from "@/types/database";

export function SuplementacaoLista({ itens }: { itens: ItemSuplementacao[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suplementação</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {itens.length === 0 ? (
          <p className="text-sm text-marrom-escuro/60">Nenhuma suplementação cadastrada.</p>
        ) : (
          itens.map((item, i) => (
            <div key={i} className="rounded-md border border-dourado/15 p-3">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold text-marrom-escuro">{item.nome}</p>
                <p className="text-sm text-dourado">{item.dose}</p>
              </div>
              <p className="text-sm text-marrom-escuro/70">{item.horario}</p>
              {item.observacao && (
                <p className="mt-1 text-xs text-marrom-escuro/50">{item.observacao}</p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

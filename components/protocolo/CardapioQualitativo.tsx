import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Cardapio } from "@/types/database";

const DIAS_SEMANA: { chave: string; label: string }[] = [
  { chave: "segunda", label: "Seg" },
  { chave: "terca", label: "Ter" },
  { chave: "quarta", label: "Qua" },
  { chave: "quinta", label: "Qui" },
  { chave: "sexta", label: "Sex" },
  { chave: "sabado", label: "Sáb" },
  { chave: "domingo", label: "Dom" },
];

export function CardapioQualitativo({ cardapio }: { cardapio: Cardapio }) {
  const diasDisponiveis = DIAS_SEMANA.filter((dia) => cardapio[dia.chave]?.length);
  const primeiroDia = diasDisponiveis[0]?.chave;

  if (!primeiroDia) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cardápio qualitativo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-marrom-escuro/60">Cardápio ainda não cadastrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cardápio qualitativo</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={primeiroDia}>
          <TabsList>
            {diasDisponiveis.map((dia) => (
              <TabsTrigger key={dia.chave} value={dia.chave}>
                {dia.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {diasDisponiveis.map((dia) => (
            <TabsContent key={dia.chave} value={dia.chave} className="flex flex-col gap-3">
              {cardapio[dia.chave].map((item, i) => (
                <div key={i} className="rounded-md border border-dourado/15 p-3">
                  <p className="text-sm font-semibold text-dourado">{item.refeicao}</p>
                  <p className="text-sm text-marrom-escuro/80">{item.descricao}</p>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

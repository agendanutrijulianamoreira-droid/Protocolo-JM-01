import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceitaModal } from "@/components/protocolo/ReceitaModal";
import type { Recipe } from "@/types/database";

export function ReceitasGrid({ recipes }: { recipes: Recipe[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas</CardTitle>
      </CardHeader>
      <CardContent>
        {recipes.length === 0 ? (
          <p className="text-sm text-marrom-escuro/60">Nenhuma receita cadastrada ainda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {recipes.map((recipe) => (
              <ReceitaModal key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

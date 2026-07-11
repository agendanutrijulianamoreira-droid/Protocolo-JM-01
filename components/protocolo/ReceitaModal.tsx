"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Recipe } from "@/types/database";

export function ReceitaModal({ recipe }: { recipe: Recipe }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col overflow-hidden rounded-md border border-dourado/15 bg-white text-left transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="relative aspect-video w-full bg-dourado/10">
            {recipe.imagem_url ? (
              <Image src={recipe.imagem_url} alt={recipe.titulo} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-marrom-escuro/40">
                Sem imagem
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold text-marrom-escuro">{recipe.titulo}</p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{recipe.titulo}</DialogTitle>
        {recipe.descricao && (
          <p className="mt-2 text-sm text-marrom-escuro/70">{recipe.descricao}</p>
        )}

        <h4 className="mt-4 text-sm font-semibold text-dourado">Ingredientes</h4>
        <ul className="mt-1 list-inside list-disc text-sm text-marrom-escuro/80">
          {recipe.ingredientes.map((ing, i) => (
            <li key={i}>
              {ing.quantidade} {ing.unidade} de {ing.item}
            </li>
          ))}
        </ul>

        <h4 className="mt-4 text-sm font-semibold text-dourado">Modo de preparo</h4>
        <p className="mt-1 whitespace-pre-line text-sm text-marrom-escuro/80">
          {recipe.modo_preparo}
        </p>
      </DialogContent>
    </Dialog>
  );
}

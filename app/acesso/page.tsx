import { Crown } from "lucide-react";
import { FormularioAcesso } from "@/components/acesso/FormularioAcesso";

export default function AcessoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Crown className="h-10 w-10 text-dourado" strokeWidth={1.5} />
          <h1 className="font-serif text-2xl font-semibold text-marrom-escuro">
            Bem-vinda ao seu protocolo
          </h1>
          <p className="text-sm text-marrom-escuro/70">
            Informe seu e-mail e CPF para acessar seu conteúdo exclusivo.
          </p>
        </div>
        <FormularioAcesso />
      </div>
    </main>
  );
}

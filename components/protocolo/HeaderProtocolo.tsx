"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, LogOut } from "lucide-react";

const WELCOME_STORAGE_KEY = "protocolo:ultima-boas-vindas";

function firstNome(nomeCompleto: string) {
  return nomeCompleto.trim().split(" ")[0];
}

export function HeaderProtocolo({ nome }: { nome: string }) {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = window.localStorage.getItem(WELCOME_STORAGE_KEY);
    if (lastShown !== today) {
      setShowWelcome(true);
      window.localStorage.setItem(WELCOME_STORAGE_KEY, today);
      const timer = setTimeout(() => setShowWelcome(false), 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/acesso");
    router.refresh();
  }

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-marrom-escuro text-creme animate-fade-in">
          <Crown className="h-12 w-12 text-dourado" strokeWidth={1.5} />
          <p className="font-serif text-3xl">
            Bem-vinda ao seu protocolo, {firstNome(nome)}
          </p>
        </div>
      )}
      <header className="flex items-center justify-between border-b border-dourado/20 bg-creme/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-dourado" strokeWidth={1.5} />
          <div>
            <p className="text-xs text-marrom-escuro/60">Protocolo de</p>
            <p className="font-serif text-lg font-semibold leading-none text-marrom-escuro">
              {nome}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-marrom-escuro/60 hover:bg-dourado/10 hover:text-marrom-escuro"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </header>
    </>
  );
}

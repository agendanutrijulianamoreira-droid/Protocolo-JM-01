"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FormularioOTP({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError("Digite os 6 dígitos do código.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Código inválido ou expirado.");
        return;
      }

      router.push("/protocolo");
      router.refresh();
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-sm font-medium text-marrom-escuro">
          Código de verificação
        </label>
        <Input
          id="code"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          placeholder="000000"
          className="text-center text-2xl tracking-[0.5em]"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Verificando..." : "Entrar"}
      </Button>

      <Link
        href="/acesso"
        className="text-center text-xs text-marrom-escuro/60 underline underline-offset-2 hover:text-marrom-escuro"
      >
        Não recebi o código, tentar novamente
      </Link>
    </form>
  );
}

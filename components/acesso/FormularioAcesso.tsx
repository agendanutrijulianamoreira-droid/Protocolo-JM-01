"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidCpf, normalizeCpf } from "@/lib/auth/cpf";

const schema = z.object({
  email: z.string().trim().email("Digite um e-mail válido."),
  cpf: z.string().refine(isValidCpf, "Digite um CPF válido."),
});

type FormData = z.infer<typeof schema>;

function formatCpf(value: string) {
  const digits = normalizeCpf(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function FormularioAcesso() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const cpfValue = watch("cpf") ?? "";

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setServerError("Não foi possível processar seu acesso. Tente novamente.");
        return;
      }

      router.push(`/acesso/verificar?email=${encodeURIComponent(data.email)}`);
    } catch {
      setServerError("Erro de conexão. Verifique sua internet e tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-marrom-escuro">
          E-mail
        </label>
        <Input id="email" type="email" autoComplete="email" placeholder="seu@email.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cpf" className="text-sm font-medium text-marrom-escuro">
          CPF
        </label>
        <Input
          id="cpf"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={formatCpf(cpfValue)}
          onChange={(e) => setValue("cpf", normalizeCpf(e.target.value), { shouldValidate: true })}
        />
        {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
      </div>

      {serverError && <p className="text-xs text-destructive">{serverError}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Enviando..." : "Receber código de acesso"}
      </Button>
    </form>
  );
}

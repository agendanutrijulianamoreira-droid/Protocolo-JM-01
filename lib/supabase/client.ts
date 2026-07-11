import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client browser-side com a chave anônima. As tabelas têm RLS restrita ao
// service_role, então este client só serve para consumir recursos públicos
// (ex.: imagens em bucket público do Storage), nunca para ler/escrever dados
// de pacientes.
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient<Database>(url, anonKey);
}

import "server-only";
import bcrypt from "bcryptjs";
import { normalizeCpf } from "@/lib/auth/cpf";

export async function hashCpf(cpf: string): Promise<string> {
  const digits = normalizeCpf(cpf);
  return bcrypt.hash(digits, 10);
}

export async function verifyCpf(cpf: string, cpfHash: string): Promise<boolean> {
  const digits = normalizeCpf(cpf);
  return bcrypt.compare(digits, cpfHash);
}

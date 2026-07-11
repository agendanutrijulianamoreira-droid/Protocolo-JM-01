import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isValidCpf } from "@/lib/auth/cpf";
import { verifyCpf } from "@/lib/auth/cpf-hash";
import { createOtpCode } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/email";

const requestSchema = z.object({
  email: z.string().trim().email(),
  cpf: z.string().refine(isValidCpf, "CPF inválido."),
});

// Resposta genérica em qualquer caso de erro de identificação, para não
// revelar se um e-mail está cadastrado (evita enumeração de pacientes).
const GENERIC_RESPONSE = {
  message: "Se os dados estiverem corretos, enviamos um código de verificação para o seu e-mail.",
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { email, cpf } = parsed.data;
  const supabase = createServiceRoleClient();

  const { data: patient } = await supabase
    .from("patients")
    .select("id, nome, email, cpf_hash, ativo")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!patient || !patient.ativo) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const cpfMatches = await verifyCpf(cpf, patient.cpf_hash);
  if (!cpfMatches) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const code = await createOtpCode(patient.id);
  await sendOtpEmail(patient.email, patient.nome, code);

  return NextResponse.json(GENERIC_RESPONSE);
}

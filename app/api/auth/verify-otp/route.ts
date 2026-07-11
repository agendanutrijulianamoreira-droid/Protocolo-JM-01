import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyOtpCode } from "@/lib/auth/otp";
import { createSession } from "@/lib/auth/session";
import { sendNewDeviceAlertEmail } from "@/lib/email";

const verifySchema = z.object({
  email: z.string().trim().email(),
  code: z.string().length(6),
});

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { email, code } = parsed.data;
  const supabase = createServiceRoleClient();

  const { data: patient } = await supabase
    .from("patients")
    .select("id, nome, email, ativo")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!patient || !patient.ativo) {
    return NextResponse.json({ error: "Código inválido ou expirado." }, { status: 401 });
  }

  const isValid = await verifyOtpCode(patient.id, code);
  if (!isValid) {
    return NextResponse.json({ error: "Código inválido ou expirado." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  const { exceededDeviceLimit } = await createSession({
    patientId: patient.id,
    ip,
    userAgent,
  });

  await supabase.from("access_logs").insert({
    patient_id: patient.id,
    ip,
    user_agent: userAgent,
  });

  if (exceededDeviceLimit) {
    await sendNewDeviceAlertEmail(patient.email, patient.nome);
  }

  return NextResponse.json({ ok: true });
}

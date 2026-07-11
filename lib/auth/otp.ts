import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { createServiceRoleClient } from "@/lib/supabase/server";

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;

export function generateOtpCode(): string {
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

export async function createOtpCode(patientId: string): Promise<string> {
  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiraEm = addMinutes(new Date(), OTP_TTL_MINUTES).toISOString();

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("otp_codes").insert({
    patient_id: patientId,
    code_hash: codeHash,
    expira_em: expiraEm,
  });

  if (error) throw error;

  return code;
}

export async function verifyOtpCode(patientId: string, code: string): Promise<boolean> {
  const supabase = createServiceRoleClient();

  const { data: candidates, error } = await supabase
    .from("otp_codes")
    .select("*")
    .eq("patient_id", patientId)
    .eq("usado", false)
    .gt("expira_em", new Date().toISOString())
    .order("criado_em", { ascending: false })
    .limit(5);

  if (error) throw error;
  if (!candidates || candidates.length === 0) return false;

  for (const candidate of candidates) {
    const matches = await bcrypt.compare(code, candidate.code_hash);
    if (matches) {
      await supabase.from("otp_codes").update({ usado: true }).eq("id", candidate.id);
      return true;
    }
  }

  return false;
}

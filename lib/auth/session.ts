import "server-only";
import { SignJWT } from "jose";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  SESSION_COOKIE_NAME,
  getSessionFromCookie,
  type SessionPayload,
} from "@/lib/auth/session-edge";

export { SESSION_COOKIE_NAME, getSessionFromCookie };
export type { SessionPayload };

const SESSION_TTL_DAYS = 30;
const MAX_ACTIVE_SESSIONS = 2;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não configurado.");
  }
  return new TextEncoder().encode(secret);
}

interface CreateSessionParams {
  patientId: string;
  ip: string | null;
  userAgent: string | null;
}

// Cria uma sessão (linha em `sessions` + cookie JWT assinado) e informa se o
// limite de dispositivos simultâneos foi excedido, para o chamador decidir
// se dispara o e-mail de alerta de novo acesso.
export async function createSession({
  patientId,
  ip,
  userAgent,
}: CreateSessionParams): Promise<{ exceededDeviceLimit: boolean }> {
  const supabase = createServiceRoleClient();
  const jti = randomUUID();
  const expiraEm = addDays(new Date(), SESSION_TTL_DAYS);

  const { data: activeSessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("patient_id", patientId)
    .is("revogada_em", null)
    .gt("expira_em", new Date().toISOString());

  const exceededDeviceLimit = (activeSessions?.length ?? 0) >= MAX_ACTIVE_SESSIONS;

  const { error } = await supabase.from("sessions").insert({
    patient_id: patientId,
    jti,
    ip,
    user_agent: userAgent,
    expira_em: expiraEm.toISOString(),
  });
  if (error) throw error;

  const token = await new SignJWT({ patient_id: patientId, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiraEm)
    .sign(getSecretKey());

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiraEm,
  });

  return { exceededDeviceLimit };
}

// Usada em Server Components/Route Handlers: além de validar o JWT, confirma
// que a sessão não foi revogada no banco.
export async function getActiveSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const payload = await getSessionFromCookie(token);
  if (!payload) return null;

  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("sessions")
    .select("id, revogada_em, expira_em")
    .eq("jti", payload.jti)
    .maybeSingle();

  if (!data || data.revogada_em || new Date(data.expira_em) < new Date()) {
    return null;
  }

  return payload;
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await getSessionFromCookie(token);

  if (payload) {
    const supabase = createServiceRoleClient();
    await supabase
      .from("sessions")
      .update({ revogada_em: new Date().toISOString() })
      .eq("jti", payload.jti);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

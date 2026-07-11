import { jwtVerify } from "jose";

// Módulo sem dependências Node-only (sem `crypto`, `next/headers` ou
// supabase-js), para poder ser importado com segurança pelo middleware, que
// roda no Edge Runtime.
export const SESSION_COOKIE_NAME = "protocolo_session";

export interface SessionPayload {
  patient_id: string;
  jti: string;
}

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não configurado.");
  }
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.patient_id !== "string" || typeof payload.jti !== "string") {
      return null;
    }
    return { patient_id: payload.patient_id, jti: payload.jti };
  } catch {
    return null;
  }
}

// Usada pelo middleware (Edge runtime): apenas valida a assinatura/expiração
// do JWT, sem consultar o banco (o middleware não tem acesso à service role).
export async function getSessionFromCookie(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  return verifySessionToken(token);
}

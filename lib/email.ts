import "server-only";
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "Protocolo <protocolo@example.com>";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResendClient();

  if (!resend) {
    // Sem RESEND_API_KEY configurada (ex.: ambiente local) — loga em vez de
    // falhar, para não travar o fluxo de desenvolvimento.
    console.info(`[email] (RESEND_API_KEY ausente) para=${to} assunto="${subject}"\n${html}`);
    return;
  }

  await resend.emails.send({ from: FROM, to, subject, html });
}

export async function sendOtpEmail(to: string, nome: string, code: string) {
  await sendEmail(
    to,
    "Seu código de acesso ao protocolo",
    `<p>Olá, ${nome}!</p>
     <p>Seu código de verificação é:</p>
     <p style="font-size:28px;font-weight:bold;letter-spacing:4px;">${code}</p>
     <p>Ele expira em 10 minutos. Se você não solicitou este acesso, ignore este e-mail.</p>`
  );
}

export async function sendNewDeviceAlertEmail(to: string, nome: string) {
  await sendEmail(
    to,
    "Detectamos um novo acesso ao seu protocolo",
    `<p>Olá, ${nome}!</p>
     <p>Detectamos um novo acesso ao seu protocolo a partir de um dispositivo diferente
     dos que você costuma usar.</p>
     <p>Se foi você, nenhuma ação é necessária. Se não reconhece este acesso,
     entre em contato conosco.</p>`
  );
}

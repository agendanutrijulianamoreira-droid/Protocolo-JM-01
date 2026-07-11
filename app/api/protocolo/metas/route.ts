import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getActiveSession } from "@/lib/auth/session";
import { createServiceRoleClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  metaId: z.string(),
  concluida: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data: protocol, error: fetchError } = await supabase
    .from("protocols")
    .select("id, patient_id, metas")
    .eq("patient_id", session.patient_id)
    .eq("ativo", true)
    .maybeSingle();

  if (fetchError || !protocol) {
    return NextResponse.json({ error: "Protocolo não encontrado." }, { status: 404 });
  }

  const metas = protocol.metas.map((meta) =>
    meta.id === parsed.data.metaId ? { ...meta, concluida: parsed.data.concluida } : meta
  );

  const { error: updateError } = await supabase
    .from("protocols")
    .update({ metas, atualizado_em: new Date().toISOString() })
    .eq("id", protocol.id);

  if (updateError) {
    return NextResponse.json({ error: "Não foi possível salvar." }, { status: 500 });
  }

  return NextResponse.json({ metas });
}

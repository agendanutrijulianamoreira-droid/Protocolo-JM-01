import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/auth/session";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateProtocolPdf } from "@/lib/watermark";

export async function GET() {
  const session = await getActiveSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data: patient } = await supabase
    .from("patients")
    .select("id, nome, cpf_ultimos_digitos")
    .eq("id", session.patient_id)
    .maybeSingle();

  const { data: protocol } = await supabase
    .from("protocols")
    .select("*")
    .eq("patient_id", session.patient_id)
    .eq("ativo", true)
    .maybeSingle();

  if (!patient || !protocol) {
    return NextResponse.json({ error: "Protocolo não encontrado." }, { status: 404 });
  }

  const recipeIds = protocol.receita_ids ?? [];
  const { data: recipes } = recipeIds.length
    ? await supabase.from("recipes").select("*").in("id", recipeIds)
    : { data: [] };

  const pdfBytes = await generateProtocolPdf({
    patient,
    protocol,
    recipes: recipes ?? [],
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="protocolo.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

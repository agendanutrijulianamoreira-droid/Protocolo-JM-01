import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth/session";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getWatermarkLabel } from "@/lib/watermark";
import { MetasCard } from "@/components/protocolo/MetasCard";
import { VideoExplicativo } from "@/components/protocolo/VideoExplicativo";
import { CardapioQualitativo } from "@/components/protocolo/CardapioQualitativo";
import { ReceitasGrid } from "@/components/protocolo/ReceitasGrid";
import { SuplementacaoLista } from "@/components/protocolo/SuplementacaoLista";
import { ProtocoloNav } from "@/components/protocolo/ProtocoloNav";
import { ProtectedContent } from "@/components/protocolo/ProtectedContent";
import { DownloadPdfButton } from "@/components/protocolo/DownloadPdfButton";

const VIDEO_BUCKET = "protocolos-videos";
const VIDEO_URL_TTL_SECONDS = 60 * 30;

export default async function ProtocoloPage() {
  const session = await getActiveSession();
  if (!session) {
    redirect("/acesso");
  }

  const supabase = createServiceRoleClient();

  const { data: patient } = await supabase
    .from("patients")
    .select("nome, cpf_ultimos_digitos")
    .eq("id", session.patient_id)
    .maybeSingle();

  const { data: protocol } = await supabase
    .from("protocols")
    .select("*")
    .eq("patient_id", session.patient_id)
    .eq("ativo", true)
    .maybeSingle();

  if (!patient || !protocol) {
    return (
      <p className="text-sm text-marrom-escuro/60">
        Ainda não encontramos um protocolo ativo para você. Fale com a Juliana para mais
        informações.
      </p>
    );
  }

  const recipeIds = protocol.receita_ids ?? [];
  const { data: recipes } = recipeIds.length
    ? await supabase.from("recipes").select("*").in("id", recipeIds)
    : { data: [] };

  let signedVideoUrl: string | null = null;
  if (protocol.video_url) {
    const { data: signed } = await supabase.storage
      .from(VIDEO_BUCKET)
      .createSignedUrl(protocol.video_url, VIDEO_URL_TTL_SECONDS);
    signedVideoUrl = signed?.signedUrl ?? null;
  }

  const watermarkLabel = getWatermarkLabel(patient);

  return (
    <ProtocoloNav
      metasSlot={<MetasCard metas={protocol.metas} />}
      videoSlot={<VideoExplicativo signedUrl={signedVideoUrl} watermarkLabel={watermarkLabel} />}
      cardapioSlot={
        <ProtectedContent>
          <CardapioQualitativo cardapio={protocol.cardapio} />
        </ProtectedContent>
      }
      receitasSlot={
        <ProtectedContent>
          <ReceitasGrid recipes={recipes ?? []} />
          <div className="mt-4">
            <DownloadPdfButton />
          </div>
        </ProtectedContent>
      }
      suplementacaoSlot={<SuplementacaoLista itens={protocol.suplementacao} />}
    />
  );
}

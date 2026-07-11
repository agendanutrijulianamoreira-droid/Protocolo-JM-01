import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/auth/session";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { HeaderProtocolo } from "@/components/protocolo/HeaderProtocolo";

export default async function ProtocoloLayout({ children }: { children: React.ReactNode }) {
  const session = await getActiveSession();
  if (!session) {
    redirect("/acesso");
  }

  const supabase = createServiceRoleClient();
  const { data: patient } = await supabase
    .from("patients")
    .select("nome")
    .eq("id", session.patient_id)
    .maybeSingle();

  if (!patient) {
    redirect("/acesso");
  }

  return (
    <div className="min-h-screen pb-16">
      <HeaderProtocolo nome={patient.nome} />
      <main className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">{children}</main>
    </div>
  );
}

import { Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { FormularioOTP } from "@/components/acesso/FormularioOTP";

export default function VerificarPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email;
  if (!email) {
    redirect("/acesso");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Mail className="h-10 w-10 text-dourado" strokeWidth={1.5} />
          <h1 className="font-serif text-2xl font-semibold text-marrom-escuro">
            Confira seu e-mail
          </h1>
          <p className="text-sm text-marrom-escuro/70">
            Enviamos um código de 6 dígitos para <strong>{email}</strong>.
          </p>
        </div>
        <FormularioOTP email={email} />
      </div>
    </main>
  );
}

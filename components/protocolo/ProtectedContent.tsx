"use client";

// Deterrent simples contra cópia casual (não impede print/gravação de tela,
// conforme PRD, seção "Estratégia anti-compartilhamento").
export function ProtectedContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="protected-content"
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

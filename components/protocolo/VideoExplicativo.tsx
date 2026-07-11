"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VideoExplicativo({
  signedUrl,
  watermarkLabel,
}: {
  signedUrl: string | null;
  watermarkLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vídeo explicativo</CardTitle>
      </CardHeader>
      <CardContent>
        {signedUrl ? (
          <div
            className="relative overflow-hidden rounded-md bg-marrom-escuro"
            onContextMenu={(e) => e.preventDefault()}
          >
            <video
              key={signedUrl}
              src={signedUrl}
              controls
              controlsList="nodownload"
              className="aspect-video w-full"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/40 px-2 py-1 text-xs text-white/80">
              {watermarkLabel}
            </span>
          </div>
        ) : (
          <p className="text-sm text-marrom-escuro/60">
            Nenhum vídeo disponível para o seu protocolo no momento.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadPdfButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  async function onDownload() {
    setIsDownloading(true);
    try {
      const res = await fetch("/api/protocolo/pdf");
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "protocolo.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button variant="outline" onClick={onDownload} disabled={isDownloading} className="w-full">
      <Download className="h-4 w-4" />
      {isDownloading ? "Gerando PDF..." : "Baixar meu protocolo em PDF"}
    </Button>
  );
}

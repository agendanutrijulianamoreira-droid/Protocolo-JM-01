import { PDFDocument, StandardFonts, rgb, degrees, PDFFont, PDFPage } from "pdf-lib";
import type { Protocol, Recipe } from "@/types/database";

interface WatermarkSubject {
  nome: string;
  cpf_ultimos_digitos: string;
}

// Texto usado tanto no PDF quanto na sobreposição do player de vídeo — a
// marca d'água não impede cópia, mas rastreia a origem se algo vazar
// (PRD, seção "Estratégia anti-compartilhamento").
export function getWatermarkLabel(subject: WatermarkSubject): string {
  return `${subject.nome} · CPF final ${subject.cpf_ultimos_digitos}`;
}

function drawWatermarkOnPage(page: PDFPage, font: PDFFont, label: string) {
  const { width, height } = page.getSize();
  page.drawText(label, {
    x: 24,
    y: 16,
    size: 8,
    font,
    color: rgb(0.6, 0.6, 0.6),
    opacity: 0.7,
  });
  page.drawText(label, {
    x: width / 2 - (label.length * 5) / 2,
    y: height / 2,
    size: 24,
    font,
    color: rgb(0.79, 0.64, 0.21),
    opacity: 0.12,
    rotate: degrees(35),
  });
}

const MARGIN = 48;
const LINE_HEIGHT = 16;

class PageWriter {
  doc: PDFDocument;
  font: PDFFont;
  bold: PDFFont;
  watermarkLabel: string;
  page!: PDFPage;
  y = 0;
  width = 0;
  height = 0;

  private constructor(doc: PDFDocument, font: PDFFont, bold: PDFFont, watermarkLabel: string) {
    this.doc = doc;
    this.font = font;
    this.bold = bold;
    this.watermarkLabel = watermarkLabel;
  }

  static async create(watermarkLabel: string) {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const writer = new PageWriter(doc, font, bold, watermarkLabel);
    writer.addPage();
    return writer;
  }

  addPage() {
    this.page = this.doc.addPage([595.28, 841.89]); // A4
    const { width, height } = this.page.getSize();
    this.width = width;
    this.height = height;
    this.y = height - MARGIN;
    drawWatermarkOnPage(this.page, this.font, this.watermarkLabel);
  }

  ensureSpace(lines = 1) {
    if (this.y - lines * LINE_HEIGHT < MARGIN + 20) {
      this.addPage();
    }
  }

  heading(text: string) {
    this.ensureSpace(2);
    this.y -= 6;
    this.page.drawText(text, {
      x: MARGIN,
      y: this.y,
      size: 16,
      font: this.bold,
      color: rgb(0.17, 0.1, 0.06),
    });
    this.y -= LINE_HEIGHT + 6;
  }

  subheading(text: string) {
    this.ensureSpace(1);
    this.page.drawText(text, {
      x: MARGIN,
      y: this.y,
      size: 12,
      font: this.bold,
      color: rgb(0.79, 0.64, 0.21),
    });
    this.y -= LINE_HEIGHT;
  }

  text(text: string, options?: { indent?: number }) {
    const indent = options?.indent ?? 0;
    const maxWidth = this.width - MARGIN * 2 - indent;
    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      const candidateWidth = this.font.widthOfTextAtSize(candidate, 10);
      if (candidateWidth > maxWidth && line) {
        this.ensureSpace(1);
        this.page.drawText(line, {
          x: MARGIN + indent,
          y: this.y,
          size: 10,
          font: this.font,
          color: rgb(0.17, 0.1, 0.06),
        });
        this.y -= LINE_HEIGHT;
        line = word;
      } else {
        line = candidate;
      }
    }

    if (line) {
      this.ensureSpace(1);
      this.page.drawText(line, {
        x: MARGIN + indent,
        y: this.y,
        size: 10,
        font: this.font,
        color: rgb(0.17, 0.1, 0.06),
      });
      this.y -= LINE_HEIGHT;
    }
  }

  spacer(amount = 6) {
    this.y -= amount;
  }
}

const DIAS_SEMANA: Record<string, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};

interface GenerateProtocolPdfParams {
  patient: WatermarkSubject;
  protocol: Protocol;
  recipes: Recipe[];
}

export async function generateProtocolPdf({
  patient,
  protocol,
  recipes,
}: GenerateProtocolPdfParams): Promise<Uint8Array> {
  const watermarkLabel = getWatermarkLabel(patient);
  const writer = await PageWriter.create(watermarkLabel);

  writer.heading(`Protocolo de ${patient.nome}`);
  if (protocol.fase_reino) {
    writer.text(`Fase: ${protocol.fase_reino}`);
    writer.spacer();
  }

  writer.subheading("Metas");
  for (const meta of protocol.metas) {
    writer.text(`${meta.concluida ? "[x]" : "[ ]"} ${meta.titulo}`);
    if (meta.descricao) writer.text(meta.descricao, { indent: 12 });
  }
  writer.spacer(14);

  writer.subheading("Cardápio qualitativo");
  for (const [dia, itens] of Object.entries(protocol.cardapio)) {
    writer.text(DIAS_SEMANA[dia] ?? dia);
    for (const item of itens) {
      writer.text(`${item.refeicao}: ${item.descricao}`, { indent: 12 });
    }
  }
  writer.spacer(14);

  if (recipes.length > 0) {
    writer.subheading("Receitas");
    for (const recipe of recipes) {
      writer.text(recipe.titulo);
      const ingredientes = recipe.ingredientes
        .map((i) => `${i.quantidade} ${i.unidade} de ${i.item}`)
        .join(", ");
      writer.text(`Ingredientes: ${ingredientes}`, { indent: 12 });
      writer.text(`Modo de preparo: ${recipe.modo_preparo}`, { indent: 12 });
      writer.spacer();
    }
  }

  writer.subheading("Suplementação");
  for (const item of protocol.suplementacao) {
    writer.text(`${item.nome} — ${item.dose} — ${item.horario}`);
    if (item.observacao) writer.text(item.observacao, { indent: 12 });
  }

  return writer.doc.save();
}

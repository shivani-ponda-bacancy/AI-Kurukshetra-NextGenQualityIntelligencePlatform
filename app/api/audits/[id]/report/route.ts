import { PDFDocument, StandardFonts } from "pdf-lib";

import { getAuditReportById } from "@/services/audits";
import { formatDate } from "@/utils/format";

export const runtime = "nodejs";

type FontLike = {
  widthOfTextAtSize: (text: string, size: number) => number;
};

function wrapText(text: string, font: FontLike, size: number, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, size);
    if (width <= maxWidth) {
      current = candidate;
      return;
    }

    if (current) {
      lines.push(current);
    }
    current = word;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const report = await getAuditReportById(params.id);

  if (!report) {
    return new Response("Audit not found", { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const margin = 50;
  const fontSize = 11;
  const titleSize = 16;
  const lineHeight = 14;
  let y = height - margin;

  const ensureSpace = (lines: number) => {
    if (y - lines * lineHeight < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
  };

  const drawLine = (text: string, useBold = false, size = fontSize) => {
    ensureSpace(1);
    page.drawText(text, { x: margin, y, size, font: useBold ? boldFont : font });
    y -= lineHeight;
  };

  const drawWrapped = (text: string, useBold = false, size = fontSize) => {
    const lines = wrapText(text, useBold ? boldFont : font, size, width - margin * 2);
    lines.forEach((line) => drawLine(line, useBold, size));
  };

  const drawSection = (title: string) => {
    y -= 6;
    drawLine(title, true, 13);
  };

  drawLine(`Audit report: ${report.title}`, true, titleSize);
  drawLine(`Audit ID: ${report.id}`);
  drawLine(`Prepared by: ${report.preparedBy} on ${formatDate(report.preparedOn)}`);
  y -= 6;

  drawSection("Summary");
  drawWrapped(`Type: ${report.auditType}`);
  drawWrapped(`Lead auditor: ${report.leadAuditor}`);
  drawWrapped(`Scheduled for: ${formatDate(report.scheduledFor)}`);
  drawWrapped(`Location: ${report.location}`);
  drawWrapped(`Scope: ${report.scope}`);
  drawWrapped(`Status: ${report.status}`);

  drawSection("Checklist");
  report.checklist.forEach((item) => {
    drawWrapped(`- ${item.title} | Owner: ${item.owner} | Status: ${item.status}`);
  });

  drawSection("Findings");
  if (report.findings.length === 0) {
    drawWrapped("No findings recorded.");
  } else {
    report.findings.forEach((finding) => {
      drawWrapped(`- ${finding.title} (${finding.severity}) | Owner: ${finding.owner} | Due: ${formatDate(finding.dueDate)} | Status: ${finding.status}`);
      drawWrapped(`  ${finding.description}`);
    });
  }

  drawSection("Corrective actions");
  if (report.correctiveActions.length === 0) {
    drawWrapped("No corrective actions recorded.");
  } else {
    report.correctiveActions.forEach((action) => {
      drawWrapped(`- ${action.title} | Owner: ${action.owner} | Due: ${formatDate(action.dueDate)} | Status: ${action.status}`);
    });
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = `${report.id}-report.pdf`;

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"${fileName}\"`,
    },
  });
}

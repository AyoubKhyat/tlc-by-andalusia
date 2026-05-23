export function generateCertificatePDF(data: {
  studentName: string;
  programTitle: string;
  examTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  examDate: string;
}): Uint8Array {
  const { studentName, programTitle, examTitle, score, maxScore, percentage, examDate } = data;

  const pageWidth = 842;
  const pageHeight = 595;
  const margin = 50;

  const lines: string[] = [];
  let yPos = pageHeight - margin;

  function addText(text: string, x: number, y: number, size: number, font: string) {
    const escaped = text
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
    lines.push(`BT /${font} ${size} Tf ${x} ${y} Td (${escaped}) Tj ET`);
  }

  function addCenteredText(text: string, y: number, size: number, font: string) {
    const charWidth = font === "Helvetica-Bold" ? size * 0.6 : size * 0.52;
    const textWidth = text.length * charWidth;
    const x = (pageWidth - textWidth) / 2;
    addText(text, x, y, size, font);
  }

  function addRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number) {
    lines.push(`${r} ${g} ${b} rg ${x} ${y} ${w} ${h} re f`);
  }

  addRect(0, 0, pageWidth, pageHeight, 1, 1, 1);

  addRect(margin - 10, margin - 10, pageWidth - 2 * (margin - 10), pageHeight - 2 * (margin - 10), 0.478, 0.122, 0.243);
  addRect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin, 1, 1, 1);

  addRect(margin + 5, margin + 5, pageWidth - 2 * (margin + 5), pageHeight - 2 * (margin + 5), 1, 1, 1);
  lines.push(`0.478 0.122 0.243 RG 0.5 w ${margin + 8} ${margin + 8} ${pageWidth - 2 * (margin + 8)} ${pageHeight - 2 * (margin + 8)} re S`);

  yPos = pageHeight - 100;
  lines.push("0.478 0.122 0.243 rg");
  addCenteredText("TLC by Andalusia Academy", yPos, 14, "Helvetica");

  yPos -= 50;
  addCenteredText("CERTIFICATE OF ACHIEVEMENT", yPos, 28, "Helvetica-Bold");

  yPos -= 20;
  addRect(pageWidth / 2 - 60, yPos, 120, 2, 0.478, 0.122, 0.243);

  yPos -= 40;
  lines.push("0.2 0.2 0.2 rg");
  addCenteredText("This is to certify that", yPos, 12, "Helvetica");

  yPos -= 35;
  lines.push("0.478 0.122 0.243 rg");
  addCenteredText(studentName, yPos, 24, "Helvetica-Bold");

  yPos -= 10;
  addRect(pageWidth / 2 - 80, yPos, 160, 1, 0.478, 0.122, 0.243);

  yPos -= 30;
  lines.push("0.2 0.2 0.2 rg");
  addCenteredText("has successfully completed", yPos, 12, "Helvetica");

  yPos -= 28;
  lines.push("0.106 0.165 0.290 rg");
  addCenteredText(programTitle, yPos, 18, "Helvetica-Bold");

  yPos -= 30;
  lines.push("0.2 0.2 0.2 rg");
  addCenteredText(`and passed the ${examTitle} examination`, yPos, 12, "Helvetica");

  yPos -= 28;
  addCenteredText(`with a score of ${score}/${maxScore} (${percentage}%)`, yPos, 14, "Helvetica-Bold");

  yPos -= 30;
  addCenteredText(`on ${examDate}`, yPos, 11, "Helvetica");

  const footerY = margin + 30;
  lines.push("0.6 0.6 0.6 rg");
  addCenteredText("TLC by Andalusia Academy - Marrakech, Morocco", footerY, 9, "Helvetica");

  const stream = lines.join("\n");
  const streamLength = new TextEncoder().encode(stream).length;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}]
   /Contents 4 0 R /Resources << /Font << /Helvetica 5 0 R /Helvetica-Bold 6 0 R >> >> >>
endobj

4 0 obj
<< /Length ${streamLength} >>
stream
${stream}
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj

xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000314 00000 n
0000000${(streamLength + 370).toString().padStart(4, "0")} 00000 n
0000000${(streamLength + 440).toString().padStart(4, "0")} 00000 n

trailer
<< /Size 7 /Root 1 0 R >>
startxref
${streamLength + 515}
%%EOF`;

  return new TextEncoder().encode(pdf);
}

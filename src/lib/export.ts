export function exportToCSV(data: Record<string, unknown>[], filename: string, columns?: { key: string; label: string }[]) {
  if (data.length === 0) return;

  const keys = columns ? columns.map((c) => c.key) : Object.keys(data[0]);
  const headers = columns ? columns.map((c) => c.label) : keys;

  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      keys
        .map((key) => {
          const val = getNestedValue(row, key);
          const str = val === null || val === undefined ? "" : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];

  downloadFile(csvRows.join("\n"), `${filename}.csv`, "text/csv;charset=utf-8;");
}

export function exportToPDF(
  data: Record<string, unknown>[],
  filename: string,
  title: string,
  columns: { key: string; label: string }[]
) {
  if (data.length === 0) return;

  const colWidths = columns.map((col) => {
    const headerLen = col.label.length;
    const maxDataLen = Math.max(
      ...data.map((row) => {
        const val = getNestedValue(row, col.key);
        return val === null || val === undefined ? 0 : String(val).length;
      })
    );
    return Math.min(Math.max(headerLen, maxDataLen), 40);
  });

  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  const pageWidth = Math.max(totalWidth * 8 + 80, 595);

  const rows = data.map((row) =>
    columns.map((col) => {
      const val = getNestedValue(row, col.key);
      return val === null || val === undefined ? "" : String(val);
    })
  );

  const tableTop = 100;
  const rowHeight = 25;
  const cellPadding = 8;
  const fontSize = 9;
  const headerFontSize = 10;

  const colPositions: number[] = [];
  let x = 40;
  for (const w of colWidths) {
    colPositions.push(x);
    x += (w / totalWidth) * (pageWidth - 80);
  }
  const colActualWidths = colWidths.map((w) => (w / totalWidth) * (pageWidth - 80));

  const pageHeight = 842;
  const rowsPerPage = Math.floor((pageHeight - tableTop - 60) / rowHeight);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  let pdfContent = "";
  const objects: string[] = [];
  let objectCount = 0;
  const pageRefs: number[] = [];

  function addObject(content: string) {
    objectCount++;
    objects.push(`${objectCount} 0 obj\n${content}\nendobj\n`);
    return objectCount;
  }

  addObject("<< /Type /Catalog /Pages 2 0 R >>");

  const pagesRef = addObject("PAGES_PLACEHOLDER");

  const fontRef = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  );
  const fontBoldRef = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
  );

  for (let page = 0; page < totalPages; page++) {
    const startRow = page * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, rows.length);
    const pageRows = rows.slice(startRow, endRow);

    let stream = "";

    stream += "0.478 0.122 0.243 rg\n";
    stream += `0 ${pageHeight - 60} ${pageWidth} 60 re f\n`;

    stream += "1 1 1 rg\n";
    stream += `BT /F2 16 Tf 40 ${pageHeight - 40} Td (${escapePDF(title)}) Tj ET\n`;
    stream += `BT /F1 8 Tf ${pageWidth - 200} ${pageHeight - 40} Td (Exported: ${new Date().toLocaleDateString()}) Tj ET\n`;

    stream += "0.95 0.95 0.95 rg\n";
    stream += `40 ${pageHeight - tableTop - rowHeight} ${pageWidth - 80} ${rowHeight} re f\n`;

    stream += "0.106 0.165 0.290 rg\n";
    for (let c = 0; c < columns.length; c++) {
      stream += `BT /F2 ${headerFontSize} Tf ${colPositions[c] + cellPadding} ${
        pageHeight - tableTop - rowHeight + 8
      } Td (${escapePDF(columns[c].label)}) Tj ET\n`;
    }

    for (let r = 0; r < pageRows.length; r++) {
      const y = pageHeight - tableTop - (r + 2) * rowHeight;

      if (r % 2 === 1) {
        stream += "0.98 0.98 0.98 rg\n";
        stream += `40 ${y} ${pageWidth - 80} ${rowHeight} re f\n`;
      }

      stream += "0.2 0.2 0.2 rg\n";
      for (let c = 0; c < pageRows[r].length; c++) {
        const text = truncateText(pageRows[r][c], colWidths[c]);
        stream += `BT /F1 ${fontSize} Tf ${colPositions[c] + cellPadding} ${
          y + 8
        } Td (${escapePDF(text)}) Tj ET\n`;
      }
    }

    stream += "0.7 0.7 0.7 rg\n";
    stream += `BT /F1 8 Tf ${pageWidth / 2 - 20} 20 Td (Page ${page + 1} of ${totalPages}) Tj ET\n`;

    const streamRef = addObject(
      `<< /Length ${stream.length} >>\nstream\n${stream}endstream`
    );

    const pageRef = addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${streamRef} 0 R /Resources << /Font << /F1 ${fontRef} 0 R /F2 ${fontBoldRef} 0 R >> >> >>`
    );
    pageRefs.push(pageRef);
  }

  objects[pagesRef - 1] = `${pagesRef} 0 obj\n<< /Type /Pages /Kids [${pageRefs
    .map((r) => `${r} 0 R`)
    .join(" ")}] /Count ${totalPages} >>\nendobj\n`;

  pdfContent = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(pdfContent.length);
    pdfContent += obj;
  }

  const xrefOffset = pdfContent.length;
  pdfContent += `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdfContent += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdfContent += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  downloadFile(pdfContent, `${filename}.pdf`, "application/pdf");
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return null;
  }, obj);
}

function escapePDF(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 2) + "..";
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

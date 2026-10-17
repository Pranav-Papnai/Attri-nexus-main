// Every exported cell goes through toCsvCell, so no field - however it was
// entered - can break out of its quotes or be read as a spreadsheet formula.

// Excel, Sheets and LibreOffice treat a cell starting with any of these as a
// formula; a leading apostrophe forces it to plain text.
const FORMULA_START = /^[=+\-@\t\r]/;

export function toCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const safe = FORMULA_START.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers, ...rows].map((row) => row.map(toCsvCell).join(',')).join('\r\n');
}

// A Blob download keeps every character intact (a data: URL is cut short at
// the first '#') and the BOM makes Excel read the file as UTF-8.
export function downloadCsv(fileName: string, headers: string[], rows: unknown[][]): void {
  const blob = new Blob(['﻿', toCsv(headers, rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

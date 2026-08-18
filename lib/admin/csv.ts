import Papa from "papaparse";
import type { AdminFieldDef } from "@/types/adminContent";

/**
 * "list" fields (facts, examples, etc.) are one column in the CSV, with
 * individual items separated by a pipe — a spreadsheet cell can't hold
 * true nested structure, and a pipe is unlikely to appear in real content
 * (unlike a comma, which definitely would). The downloadable template
 * demonstrates this convention directly rather than requiring a separate
 * instructions doc.
 */
const LIST_DELIMITER = "|";

export function generateCsvTemplate(fields: AdminFieldDef[]): string {
  const headers = fields.map((f) => f.key);
  const exampleRow = fields.map((f) => {
    if (f.type === "list") {
      return f.placeholder ?? `First item${LIST_DELIMITER}Second item${LIST_DELIMITER}Third item`;
    }
    if (f.type === "select") {
      return f.options?.[0]?.value ?? "";
    }
    return f.placeholder ?? "";
  });

  return Papa.unparse({ fields: headers, data: [exampleRow] });
}

export interface CsvRowError {
  row: number;
  message: string;
}

export interface CsvParseResult {
  validRows: Record<string, unknown>[];
  errors: CsvRowError[];
}

export function parseCsv(fields: AdminFieldDef[], csvText: string): CsvParseResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const validRows: Record<string, unknown>[] = [];
  const errors: CsvRowError[] = [];

  parsed.data.forEach((rawRow, index) => {
    const rowNumber = index + 2; // +1 for header row, +1 for 1-based counting
    const data: Record<string, unknown> = {};
    let rowError: string | null = null;

    for (const field of fields) {
      const raw = (rawRow[field.key] ?? "").trim();

      if (field.required && !raw) {
        rowError = `Missing required column "${field.key}".`;
        break;
      }

      if (field.type === "list") {
        data[field.key] = raw
          ? raw.split(LIST_DELIMITER).map((s) => s.trim()).filter(Boolean)
          : [];
        if (field.required && (data[field.key] as string[]).length === 0) {
          rowError = `Column "${field.key}" needs at least one item.`;
          break;
        }
      } else if (field.type === "select" && field.options) {
        const validValues = field.options.map((o) => o.value);
        if (raw && !validValues.includes(raw)) {
          rowError = `Column "${field.key}" value "${raw}" isn't one of: ${validValues.join(", ")}.`;
          break;
        }
        data[field.key] = raw || field.options[0]?.value;
      } else {
        data[field.key] = raw;
      }
    }

    if (rowError) {
      errors.push({ row: rowNumber, message: rowError });
    } else {
      validRows.push(data);
    }
  });

  return { validRows, errors };
}

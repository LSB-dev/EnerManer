const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface WerkApiResponse {
  werk: string;
  messstellenId: number;
  rechnungsempfaengerId: number;
  institut: string;
  endConsumer: string;
}

export async function fetchWerk(werkId = 1): Promise<WerkApiResponse> {
  const res = await fetch(`${API_BASE}/api/werk/${werkId}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// ───────────────────────────────────────────────────────────────
// ✨ NEW helpers for quarterly reports
// ───────────────────────────────────────────────────────────────
export interface QuarterlyReportDto {
  id?: number;
  quarter: number;
  year: number;
  electricity: number;
  gas: number;
  submissionDate?: string;
}

export async function postQuarterlyReport(
  werkId: number,
  body: QuarterlyReportDto
): Promise<QuarterlyReportDto> {
  const res = await fetch(`${API_BASE}/api/werk/${werkId}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getQuarterlyReports(
  werkId: number
): Promise<QuarterlyReportDto[]> {
  const res = await fetch(`${API_BASE}/api/werk/${werkId}/reports`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

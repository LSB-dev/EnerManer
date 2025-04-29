const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface WerkApiResponse {
  werk: string;
  messstellenId: number;
  rechnungsempfaengerId: number;
  institut: string;
  endConsumer: string;
}

/** Fetches the first Werk (“Hauptzähler”) from the back-end */
export async function fetchWerk(werkId = 1): Promise<WerkApiResponse> {
  const res = await fetch(`${API_BASE}/api/werk/${werkId}`);
  if (!res.ok) throw new Error(`API request failed ⇒ ${res.statusText}`);
  return res.json() as Promise<WerkApiResponse>;
}

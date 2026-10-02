import Papa from "papaparse";

export const SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";

export async function readSheetRows(sheet: string): Promise<any[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}&ts=${Date.now()}`;
  const r = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) throw new Error(`Falha ao ler a aba ${sheet}.`);
  const csv = await r.text();
  return Papa.parse(csv, { header: true, skipEmptyLines: true }).data as any[];
}

export async function getAppsScriptUrl(): Promise<string> {
  const rows = await readSheetRows("Configuracoes");
  const acceptedKeys = new Set(["apps_script_url", "google_apps_script_url", "webhook_url", "url"]);

  for (const row of rows) {
    const key = String(row?.chave || "").trim().toLowerCase();
    const value = String(row?.valor || "").trim();
    if (acceptedKeys.has(key) && value.startsWith("https://script.google.com/")) {
      return value;
    }
  }

  const envUrl = String(process.env.GOOGLE_APPS_SCRIPT_URL || "").trim();
  if (envUrl.startsWith("https://script.google.com/")) return envUrl;

  throw new Error("URL do Google Apps Script não encontrada na aba Configuracoes.");
}

export async function callAppsScript(action: string, payload: any): Promise<any> {
  const url = await getAppsScriptUrl();
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });

  const text = await r.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch {}

  if (!r.ok || !data || data.status !== "success") {
    throw new Error(data?.message || data?.error || "A planilha não confirmou a operação.");
  }

  return data;
}

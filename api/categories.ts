import Papa from "papaparse";

const SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";
const SECRET = process.env.APPS_SCRIPT_SECRET || "madeira_sensei_secret_2026";

async function readRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=CATEGORIAS_CAMPEONATO&ts=${Date.now()}`;
  const r = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) return [];
  const csv = await r.text();
  return Papa.parse(csv, { header: true, skipEmptyLines: true }).data as any[];
}

async function postScript(url: string, action: string, payload: any) {
  if (!url.startsWith("https://script.google.com/")) throw new Error("URL do Google Apps Script não configurada.");
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: SECRET, action, ...payload })
  });
  const text = await r.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch {}
  if (!r.ok || !data || data.status !== "success") throw new Error(data?.message || data?.error || "Google Sheets não confirmou a operação.");
  return data;
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const rows = await readRows();
      const championshipId = String(req.query?.championshipId || "").trim();
      const data = rows.filter(r => r?.id && r?.nome).map(r => ({
        id: String(r.id).trim(),
        championshipId: String(r.championshipId || "").trim(),
        nome: String(r.nome || "").trim(),
        modalidade: String(r.modalidade || "Geral").trim(),
        idadeMinima: r.idadeMinima ? Number(r.idadeMinima) : undefined,
        idadeMaxima: r.idadeMaxima ? Number(r.idadeMaxima) : undefined,
        sexo: String(r.sexo || "Misto").trim(),
        pesoMaximo: r.pesoMaximo ? Number(String(r.pesoMaximo).replace(",", ".")) : undefined
      })).filter(c => !championshipId || c.championshipId === championshipId);
      return res.status(200).json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Erro ao carregar categorias." });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const category = body.category || body;
      const appsScriptUrl = String(body.googleAppsScriptUrl || "").trim();
      if (!category?.id || !category?.nome) return res.status(400).json({ error: "Categoria inválida." });
      await postScript(appsScriptUrl, "SAVE_CATEGORY", { category });
      return res.status(201).json(category);
    } catch (e: any) {
      return res.status(502).json({ error: e?.message || "Erro ao salvar categoria." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método não permitido." });
}

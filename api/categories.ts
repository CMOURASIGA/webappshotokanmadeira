import Papa from "papaparse";

const SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";

async function readRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent("CATEGORIAS_CAMPEONATO")}&ts=${Date.now()}`;
  const r = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) return [];
  return Papa.parse(await r.text(), { header: true, skipEmptyLines: true }).data as any[];
}

async function callAppsScript(url: string, action: string, payload: any) {
  if (!url.startsWith("https://script.google.com/")) throw new Error("URL do Google Apps Script não configurada.");
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });
  const text = await r.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch {}
  if (!r.ok || !data || data.status !== "success") throw new Error(data?.message || data?.error || "A planilha não confirmou a operação.");
  return data;
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const rows = await readRows();
      const championshipId = String(req.query?.championshipId || "").trim();
      const data = rows
        .filter(r => r?.id && r?.nome)
        .map(r => ({
          id: String(r.id).trim(),
          championshipId: String(r.campeonatoId || "").trim(),
          nome: String(r.nome || "").trim(),
          sexo: String(r.sexo || "Misto").trim(),
          idadeMinima: r.idadeMinima ? Number(r.idadeMinima) : undefined,
          idadeMaxima: r.idadeMaxima ? Number(r.idadeMaxima) : undefined,
          pesoMaximo: r.pesoMaximo ? Number(String(r.pesoMaximo).replace(",", ".")) : undefined,
          observacoes: String(r.observacoes || "").trim()
        }))
        .filter(c => !championshipId || c.championshipId === championshipId);
      return res.status(200).json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Erro ao carregar categorias." });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const category = body.category || {};
      const appsScriptUrl = String(body.googleAppsScriptUrl || "").trim();
      if (!category?.id || !category?.nome || !category?.championshipId) {
        return res.status(400).json({ error: "Categoria inválida." });
      }
      const result = await callAppsScript(appsScriptUrl, "SAVE_CATEGORY", { category });
      return res.status(201).json({
        ...category,
        ...(result.category || {}),
        championshipId: category.championshipId
      });
    } catch (e: any) {
      return res.status(502).json({ error: e?.message || "Erro ao salvar categoria." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método não permitido." });
}

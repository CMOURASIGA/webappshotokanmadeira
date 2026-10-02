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
}

export default async function handler(req: any, res: any) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const categoryId = String(req.query?.id || "").trim();
    const appsScriptUrl = String(req.body?.googleAppsScriptUrl || req.query?.googleAppsScriptUrl || "").trim();
    if (!categoryId) return res.status(400).json({ error: "Categoria não informada." });
    await callAppsScript(appsScriptUrl, "DELETE_CATEGORY", { categoryId });
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "Erro ao excluir categoria." });
  }
}

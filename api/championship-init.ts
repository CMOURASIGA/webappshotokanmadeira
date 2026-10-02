export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const appsScriptUrl = String(req.body?.googleAppsScriptUrl || "").trim();
    if (!appsScriptUrl.startsWith("https://script.google.com/")) {
      return res.status(400).json({ error: "URL do Google Apps Script não configurada." });
    }

    const r = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "INIT_CHAMPIONSHIP_SHEETS" })
    });

    const text = await r.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch {}

    if (!r.ok || !data || data.status !== "success") {
      return res.status(502).json({ error: data?.message || data?.error || "A planilha não confirmou a inicialização." });
    }

    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "Erro ao inicializar estrutura na planilha." });
  }
}

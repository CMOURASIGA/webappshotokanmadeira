import { callAppsScript } from "./_sheetConfig";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const data = await callAppsScript("INIT_CHAMPIONSHIP_SHEETS", {});
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "Erro ao inicializar estrutura na planilha." });
  }
}

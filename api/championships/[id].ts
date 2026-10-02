import { callAppsScript } from "../_sheetConfig.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const championshipId = String(req.query?.id || "").trim();
    if (!championshipId) return res.status(400).json({ error: "Campeonato não informado." });
    await callAppsScript("DELETE_CHAMPIONSHIP", { championshipId });
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "Erro ao excluir campeonato." });
  }
}

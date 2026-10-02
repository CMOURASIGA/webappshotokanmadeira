import { callAppsScript } from "../_sheetConfig";

export default async function handler(req: any, res: any) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const categoryId = String(req.query?.id || "").trim();
    if (!categoryId) return res.status(400).json({ error: "Categoria não informada." });
    await callAppsScript("DELETE_CATEGORY", { categoryId });
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "Erro ao excluir categoria." });
  }
}

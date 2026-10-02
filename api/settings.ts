import { getAppsScriptUrl, SHEET_ID } from "./_sheetConfig.js";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const googleAppsScriptUrl = await getAppsScriptUrl();
      return res.status(200).json({
        googleSheetId: SHEET_ID,
        googleAppsScriptUrl
      });
    } catch (e: any) {
      return res.status(500).json({
        error: e?.message || "URL do Apps Script não configurada na aba Configuracoes."
      });
    }
  }

  res.setHeader("Allow", "GET");
  return res.status(405).json({
    error: "A URL do Apps Script é controlada pela aba Configuracoes da planilha."
  });
}

import { getAppsScriptUrl, SHEET_ID } from "./_sheetConfig.js";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      // A URL do Apps Script é uma configuração operacional e deve ser lida
      // diretamente da planilha a cada abertura/atualização do dashboard.
      // Evita 304/resposta em cache mantendo valor antigo ou campo vazio.
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");

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

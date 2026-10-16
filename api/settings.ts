import { getAppsScriptUrl, readSheetRows, SHEET_ID } from "./_sheetConfig.js";

function inferPixType(key: string): string {
  const clean = key.trim();
  if (/^\d{11}$/.test(clean.replace(/\D/g, ""))) return "TELEFONE";
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return "EMAIL";
  if (/^\d{11}$/.test(clean)) return "CPF";
  if (/^\d{14}$/.test(clean)) return "CNPJ";
  return "ALEATORIA";
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");

      const [googleAppsScriptUrl, rows] = await Promise.all([
        getAppsScriptUrl(),
        readSheetRows("Configuracoes")
      ]);

      const config = new Map<string, string>();
      rows.forEach((row: any) => {
        const key = String(row?.chave || "").trim().toLowerCase();
        if (key) config.set(key, String(row?.valor || "").trim());
      });

      const pixChave = config.get("pix_chave") || config.get("pix") || "";
      const pixTipo = (config.get("pix_tipo") || inferPixType(pixChave)).toUpperCase();

      return res.status(200).json({
        googleSheetId: SHEET_ID,
        googleAppsScriptUrl,
        pixTipo,
        pixChave,
        pixNome: config.get("pix_nome") || "MADEIRA KARATE",
        pixCidade: config.get("pix_cidade") || "RIO DE JANEIRO"
      });
    } catch (e: any) {
      return res.status(500).json({
        error: e?.message || "Configurações operacionais não encontradas na aba Configuracoes."
      });
    }
  }

  res.setHeader("Allow", "GET");
  return res.status(405).json({
    error: "As configurações operacionais são controladas pela aba Configuracoes da planilha."
  });
}

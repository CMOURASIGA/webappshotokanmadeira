import Papa from "papaparse";
import { callAppsScript } from "./_sheetConfig.js";

const GOOGLE_SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";
function toArray(value: unknown): string[] {
  return String(value || "")
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const url =
        `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=CAMPEONATOS&ts=${Date.now()}`;
      const response = await fetch(url, { headers: { "Cache-Control": "no-cache" } });

      if (!response.ok) {
        return res.status(502).json({ error: "Não foi possível ler a aba CAMPEONATOS da planilha." });
      }

      const csv = await response.text();
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

      const championships = (parsed.data as any[])
        .filter((row) => row?.id && row?.nome)
        .map((row) => ({
          id: String(row.id).trim(),
          slug: String(row.slug || row.id).trim(),
          nome: String(row.nome).trim(),
          descricao: String(row.descricao || "").trim(),
          dataCampeonato: String(row.dataCampeonato || "").trim(),
          local: String(row.local || "").trim(),
          aberturaInscricoes: String(row.aberturaInscricoes || "").trim(),
          encerramentoInscricoes: String(row.encerramentoInscricoes || "").trim(),
          status: String(row.status || "RASCUNHO").trim(),
          valorInscricao: Number(String(row.valorInscricao || "0").replace(",", ".")) || 0,
          modalidades: toArray(row.modalidades),
          configuracaoPix: {
            tipoChave: String(row.pixTipo || "TELEFONE").trim(),
            chave: String(row.pixChave || "").trim(),
            nomeRecebedor: String(row.pixNome || "").trim(),
            cidadeRecebedor: String(row.pixCidade || "").trim(),
            incluirValorNoQrCode: String(row.pixIncluirValor || "Sim").trim().toLowerCase() !== "não",
            instrucoesAdicionais: ""
          },
          regulamento: String(row.regulamento || "").trim(),
          permiteMenores: String(row.permiteMenores || "Sim").trim().toLowerCase() !== "não",
          createdAt: String(row.createdAt || "").trim(),
          updatedAt: String(row.updatedAt || "").trim()
        }));

      return res.status(200).json(championships);
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Erro ao carregar campeonatos." });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const championship = body.championship || body;

      if (!championship?.nome) {
        return res.status(400).json({ error: "Nome do campeonato é obrigatório." });
      }

      await callAppsScript("SAVE_CHAMPIONSHIP", { championship });

      return res.status(201).json(championship);
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || "Erro ao criar campeonato." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método não permitido." });
}

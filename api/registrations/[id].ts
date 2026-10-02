import Papa from "papaparse";
import { callAppsScript } from "../_sheetConfig";

const SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";

async function readRows() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent("Inscrições")}&ts=${Date.now()}`;
  const r = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) throw new Error("Falha ao ler a aba Inscrições.");
  return Papa.parse(await r.text(), { header: true, skipEmptyLines: true }).data as any[];
}

function toNumber(value: unknown): number {
  const raw = String(value ?? "0").trim();
  if (!raw) return 0;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return Number(normalized) || 0;
}

function mapRegistration(r: any) {
  return {
    id: String(r["Código"] || "").trim(),
    championshipId: String(r["Campeonato ID"] || "").trim(),
    championshipName: String(r["Campeonato"] || "").trim(),
    championshipSlug: "",
    nomeCompleto: String(r["Nome Completo"] || "").trim(),
    dataNascimento: String(r["Nascimento"] || "").trim(),
    idadeNaDataCampeonato: Number(r["Idade"] || 0),
    sexo: String(r["Sexo"] || "Masculino").trim(),
    graduacao: String(r["Graduação"] || "").trim(),
    peso: toNumber(r["Peso (kg)"]),
    modalidade: String(r["Participação"] || "").trim(),
    telefone: String(r["Telefone"] || "").trim(),
    email: String(r["E-mail"] || "").trim(),
    isMenor: String(r["Menor?"] || "").toLowerCase() === "sim",
    nomeResponsavel: String(r["Responsável"] || "").trim(),
    telefoneResponsavel: String(r["Tel Responsável"] || "").trim(),
    autorizacaoResponsavel: true,
    aceiteRegulamento: true,
    categoriaId: String(r["Categoria ID"] || "").trim(),
    categoriaNome: String(r["Chave/Categoria"] || "Sem Categoria").trim(),
    status: String(r["Status Inscrição"] || "RECEBIDA").trim(),
    paymentStatus: String(r["Status Pagamento"] || "AGUARDANDO_PAGAMENTO").trim(),
    valorInscricao: toNumber(r["Valor"]),
    dataHoraInscricao: String(r["Data/Hora Inscrição"] || "").trim(),
    conferidoEm: String(r["Data Confirmação"] || "").trim(),
    conferidoPor: String(r["Confirmado Por"] || "").trim(),
    comprovanteRecebido: String(r["Comprovante Recebido"] || "").toLowerCase() === "sim",
    observacoes: String(r["Observações"] || "").trim(),
    auditLogs: []
  };
}


export default async function handler(req: any, res: any) {
  const id = String(req.query?.id || "").trim();
  if (!id) return res.status(400).json({ error: "Código da inscrição não informado." });

  try {
    const rows = await readRows();
    const row = rows.find(r => String(r["Código"] || "").trim().toUpperCase() === id.toUpperCase());

    if (req.method === "GET") {
      if (!row) return res.status(404).json({ error: "Inscrição não encontrada." });
      return res.status(200).json(mapRegistration(row));
    }

    const body = req.body || {};
    if (req.method === "DELETE") {
      await callAppsScript("DELETE_REGISTRATION", { registrationId: id });
      return res.status(200).json({ success: true });
    }

    if (req.method === "PATCH") {
      if (!row) return res.status(404).json({ error: "Inscrição não encontrada." });
      const current = mapRegistration(row);
      const updates = body.updates || body;

      const merged: any = {
        ...current,
        ...updates,
        id: current.id
      };

      if (updates.markReceiptSent === true) {
        merged.paymentStatus = "AGUARDANDO_CONFERENCIA";
      }
      if (merged.paymentStatus === "PAGAMENTO_CONFIRMADO") {
        merged.status = "CONFIRMADA";
        merged.conferidoEm = new Date().toISOString();
        merged.conferidoPor = updates.adminName || merged.conferidoPor || "Sensei / Comissão";
      }

      const result = await callAppsScript("ADD_REGISTRATION", { registration: merged });
      return res.status(200).json({ ...merged, ...(result.registration || {}), auditLogs: [] });
    }

    res.setHeader("Allow", "GET, PATCH, DELETE");
    return res.status(405).json({ error: "Método não permitido." });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "Erro ao processar inscrição." });
  }
}

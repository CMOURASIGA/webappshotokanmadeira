import Papa from "papaparse";

const SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";

async function readSheet(sheet: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}&ts=${Date.now()}`;
  const r = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) throw new Error(`Falha ao ler a aba ${sheet}.`);
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

async function callAppsScript(url: string, action: string, payload: any) {
  if (!url.startsWith("https://script.google.com/")) {
    throw new Error("URL do Google Apps Script não configurada.");
  }

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });

  const text = await r.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch {}

  if (!r.ok || !data || data.status !== "success") {
    throw new Error(data?.message || data?.error || "A planilha não confirmou a operação.");
  }
  return data;
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const rows = await readSheet("Inscrições");
      const championshipId = String(req.query?.championshipId || "").trim();
      const data = rows
        .filter(r => r?.["Código"] && r?.["Nome Completo"])
        .map(mapRegistration)
        .filter(r => !championshipId || r.championshipId === championshipId);
      return res.status(200).json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Erro ao carregar inscrições." });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const input = body.registration || {};
      const appsScriptUrl = String(body.googleAppsScriptUrl || "").trim();

      if (!input.championshipId || !input.nomeCompleto || !input.dataNascimento || !input.telefone) {
        return res.status(400).json({ error: "Dados obrigatórios da inscrição não informados." });
      }

      const champs = await readSheet("CAMPEONATOS");
      const champ = champs.find(c => String(c.id || "").trim() === String(input.championshipId).trim());
      if (!champ) {
        return res.status(404).json({ error: "Campeonato não encontrado na planilha oficial." });
      }

      const registration = {
        ...input,
        id: "",
        championshipName: String(champ.nome || input.championshipName || "").trim(),
        modalidade: String(champ.modalidades || "").trim() || "Todas as modalidades do campeonato",
        status: "RECEBIDA",
        paymentStatus: "AGUARDANDO_PAGAMENTO",
        valorInscricao: toNumber(champ.valorInscricao),
        dataHoraInscricao: new Date().toISOString(),
        comprovanteRecebido: false,
        categoriaId: input.categoriaId || "",
        categoriaNome: input.categoriaNome || "Sem Categoria"
      };

      const result = await callAppsScript(appsScriptUrl, "ADD_REGISTRATION", { registration });
      if (!result.registration?.id) {
        return res.status(502).json({ error: "A planilha gravou a inscrição, mas não devolveu o código gerado." });
      }
      return res.status(201).json({ ...registration, ...result.registration, auditLogs: [] });
    } catch (e: any) {
      return res.status(502).json({ error: e?.message || "Erro ao criar inscrição." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método não permitido." });
}

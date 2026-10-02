import Papa from "papaparse";

const SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";
const SECRET = process.env.APPS_SCRIPT_SECRET || "madeira_sensei_secret_2026";

async function readSheet(sheet: string) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}&ts=${Date.now()}`;
  const r = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) return [];
  return Papa.parse(await r.text(), { header: true, skipEmptyLines: true }).data as any[];
}

function mapReg(r: any) {
  return {
    id: String(r.id || "").trim(),
    championshipId: String(r.championshipId || "").trim(),
    championshipName: String(r.championshipName || "").trim(),
    nomeCompleto: String(r.nomeCompleto || "").trim(),
    dataNascimento: String(r.dataNascimento || "").trim(),
    idadeNaDataCampeonato: Number(r.idadeNaDataCampeonato || 0),
    sexo: String(r.sexo || "Masculino").trim(),
    graduacao: String(r.graduacao || "").trim(),
    peso: Number(String(r.peso || "0").replace(",", ".")) || 0,
    modalidade: String(r.modalidade || "").trim(),
    telefone: String(r.telefone || "").trim(),
    email: String(r.email || "").trim(),
    isMenor: String(r.isMenor || "").toLowerCase() === "sim" || String(r.isMenor || "").toLowerCase() === "true",
    nomeResponsavel: String(r.nomeResponsavel || "").trim(),
    telefoneResponsavel: String(r.telefoneResponsavel || "").trim(),
    categoriaId: String(r.categoriaId || "").trim(),
    categoriaNome: String(r.categoriaNome || "Sem Categoria").trim(),
    status: String(r.status || "RECEBIDA").trim(),
    paymentStatus: String(r.paymentStatus || "AGUARDANDO_PAGAMENTO").trim(),
    valorInscricao: Number(String(r.valorInscricao || "0").replace(",", ".")) || 0,
    dataHoraInscricao: String(r.dataHoraInscricao || "").trim(),
    comprovanteRecebido: String(r.comprovanteRecebido || "").toLowerCase() === "sim" || String(r.comprovanteRecebido || "").toLowerCase() === "true",
    observacoes: String(r.observacoes || "").trim()
  };
}

function nextId(rows: any[]) {
  const year = new Date().getFullYear();
  const prefix = `CAM${year}-`;
  let max = 0;
  for (const r of rows) {
    const id = String(r.id || "");
    if (id.startsWith(prefix)) {
      const n = Number(id.slice(prefix.length));
      if (Number.isFinite(n)) max = Math.max(max, n);
    }
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

async function postScript(url: string, action: string, payload: any) {
  if (!url.startsWith("https://script.google.com/")) throw new Error("URL do Google Apps Script não configurada.");
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: SECRET, action, ...payload }) });
  const text = await r.text();
  let data: any = null; try { data = JSON.parse(text); } catch {}
  if (!r.ok || !data || data.status !== "success") throw new Error(data?.message || data?.error || "Google Sheets não confirmou a operação.");
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const rows = await readSheet("INSCRICOES_CAMPEONATO");
      const championshipId = String(req.query?.championshipId || "").trim();
      const data = rows.filter(r => r?.id && r?.nomeCompleto).map(mapReg).filter(r => !championshipId || r.championshipId === championshipId);
      return res.status(200).json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Erro ao carregar inscrições." });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const input = body.registration || body;
      const appsScriptUrl = String(body.googleAppsScriptUrl || "").trim();
      if (!input.championshipId || !input.nomeCompleto || !input.dataNascimento || !input.telefone) {
        return res.status(400).json({ error: "Dados obrigatórios da inscrição não informados." });
      }

      const [regs, champs] = await Promise.all([readSheet("INSCRICOES_CAMPEONATO"), readSheet("CAMPEONATOS")]);
      const champ = champs.find(c => String(c.id).trim() === String(input.championshipId).trim());
      if (!champ) return res.status(404).json({ error: "Campeonato não encontrado na planilha oficial." });

      const registration = {
        ...input,
        id: nextId(regs),
        championshipName: String(champ.nome || input.championshipName || "").trim(),
        modalidade: String(champ.modalidades || input.modalidade || "").trim(),
        status: "RECEBIDA",
        paymentStatus: "AGUARDANDO_PAGAMENTO",
        valorInscricao: Number(String(champ.valorInscricao || "0").replace(",", ".")) || 0,
        dataHoraInscricao: new Date().toISOString(),
        comprovanteRecebido: false,
        categoriaId: input.categoriaId || "",
        categoriaNome: input.categoriaNome || "Sem Categoria"
      };

      await postScript(appsScriptUrl, "ADD_REGISTRATION", { registration });
      return res.status(201).json(registration);
    } catch (e: any) {
      return res.status(502).json({ error: e?.message || "Erro ao criar inscrição." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método não permitido." });
}

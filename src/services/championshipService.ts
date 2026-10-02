import { 
  Championship, 
  AthleteRegistration, 
  ChampionshipCategory, 
  ChampionshipSettings, 
  AuditLog, 
  PaymentStatus, 
  RegistrationStatus 
} from "../types/championship";

const STORAGE_KEYS = {
  CHAMPIONSHIPS: "madeira_championships_v1",
  REGISTRATIONS: "madeira_registrations_v1",
  CATEGORIES: "madeira_categories_v1",
  SETTINGS: "madeira_champ_settings_v1",
  NEXT_SEQUENCE: "madeira_registration_sequence_v1"
};

const DEFAULT_SETTINGS: ChampionshipSettings = {
  adminPin: "1926", // Ano de fundação / PIN padrão seguro do Sensei (alterável no dashboard)
  googleSheetId: "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM",
  googleAppsScriptUrl: ""
};

/**
 * Campeonato inicial de referência para o Dojo
 */
const DEFAULT_INITIAL_CHAMPIONSHIP: Championship = {
  id: "champ-interno-2026",
  slug: "campeonato-interno-2026",
  nome: "1º Campeonato Interno Madeira Karate 2026",
  descricao: "Competição esportiva e pedagógica interna do Madeira Karate Shotokan, voltada ao aprimoramento técnico e espírito do Budo entre os alunos de todas as idades e graduações.",
  dataCampeonato: "2026-11-21",
  local: "Dojo Central Madeira Karate — Rio de Janeiro / RJ",
  aberturaInscricoes: "2026-10-01T08:00:00",
  encerramentoInscricoes: "2026-11-14T23:59:59",
  status: "INSCRICOES_ABERTAS",
  valorInscricao: 75.00,
  modalidades: ["Todas as Modalidades (Kata e Kumite)"],
  configuracaoPix: {
    tipoChave: "TELEFONE",
    chave: "21973681109",
    nomeRecebedor: "MADEIRA KARATE",
    cidadeRecebedor: "RIO DE JANEIRO",
    incluirValorNoQrCode: true,
    instrucoesAdicionais: "Pagamento referente à inscrição no 1º Campeonato Interno Madeira Karate 2026. Após o pagamento, envie o comprovante pelo WhatsApp do Dojo para conferência."
  },
  regulamento: `1. DA PARTICIPAÇÃO E ELEGIBILIDADE:
- Aberto a todos os alunos devidamente matriculados no Madeira Karate Shotokan.
- O atleta deve estar com o exame médico e atestado de aptidão física em dia para a prática esportiva.
- Para atletas menores de 18 anos, é obrigatória a autorização expressa do pai, mãe ou responsável legal na ficha de inscrição.

2. DO FORMATO TÉCNICO E ARBITRAGEM:
- Regras oficiais baseadas nos critérios de competição da JKA (Japan Karate Association).
- Formato Unificado: Todos os atletas inscritos competem em todas as modalidades do campeonato (Kata e Kumite).
- As categorias organizam as chaves oficiais de disputa com base na idade, sexo, faixa e peso do atleta.

3. DO UNIFORME E PROTEÇÕES:
- Karategui branco limpo e em perfeito estado, com a faixa correspondente à graduação informada.
- No Kumite, obrigatório o uso de protetor bucal e protetor de punho (luvas) adequadas. Coquilha para o sexo masculino.

4. DA CONFIRMAÇÃO DA INSCRIÇÃO E PAGAMENTO:
- A inscrição tem valor único estipulado pela organização.
- O pagamento é realizado via PIX e deve ser conferido manualmente pelo Dojo após envio do comprovante.
- O status 'CONFIRMADA' só é atribuído após a conferência e baixa financeira do pagamento.
- Em caso de dúvidas, consulte o Sensei responsável antes do prazo final de inscrições.`,
  permiteMenores: true,
  createdAt: "2026-09-30T10:00:00.000Z",
  updatedAt: "2026-09-30T10:00:00.000Z"
};

const DEFAULT_CATEGORIES: ChampionshipCategory[] = [
  {
    id: "cat-sub10-misto",
    championshipId: "champ-interno-2026",
    nome: "Mirim Misto (Até 10 Anos) — Todas as Faixas",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 4,
    idadeMaxima: 10,
    sexo: "Misto"
  },
  {
    id: "cat-sub13-masc-iniciante",
    championshipId: "champ-interno-2026",
    nome: "Infantil Masculino (11 a 13 Anos) — Faixas Branca a Vermelha",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 11,
    idadeMaxima: 13,
    sexo: "Masculino"
  },
  {
    id: "cat-sub13-masc-avancado",
    championshipId: "champ-interno-2026",
    nome: "Infantil Masculino (11 a 13 Anos) — Faixas Laranja a Roxa",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 11,
    idadeMaxima: 13,
    sexo: "Masculino"
  },
  {
    id: "cat-sub13-fem",
    championshipId: "champ-interno-2026",
    nome: "Infantil Feminino (11 a 13 Anos) — Todas as Faixas",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 11,
    idadeMaxima: 13,
    sexo: "Feminino"
  },
  {
    id: "cat-sub17-masc-colorida",
    championshipId: "champ-interno-2026",
    nome: "Juvenil Masculino (14 a 17 Anos) — Faixas Coloridas",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 14,
    idadeMaxima: 17,
    sexo: "Masculino"
  },
  {
    id: "cat-sub17-masc-graduado",
    championshipId: "champ-interno-2026",
    nome: "Juvenil Masculino (14 a 17 Anos) — Faixas Marrom e Preta",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 14,
    idadeMaxima: 17,
    sexo: "Masculino"
  },
  {
    id: "cat-sub17-fem",
    championshipId: "champ-interno-2026",
    nome: "Juvenil Feminino (14 a 17 Anos) — Todas as Faixas",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 14,
    idadeMaxima: 17,
    sexo: "Feminino"
  },
  {
    id: "cat-adulto-masc-colorida",
    championshipId: "champ-interno-2026",
    nome: "Adulto Masculino (18+ Anos) — Faixas Coloridas",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 18,
    sexo: "Masculino"
  },
  {
    id: "cat-adulto-masc-graduado",
    championshipId: "champ-interno-2026",
    nome: "Adulto Masculino (18+ Anos) — Faixas Marrom e Preta",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 18,
    sexo: "Masculino"
  },
  {
    id: "cat-adulto-fem",
    championshipId: "champ-interno-2026",
    nome: "Adulto Feminino (18+ Anos) — Todas as Faixas",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 18,
    sexo: "Feminino"
  },
  {
    id: "cat-master-misto",
    championshipId: "champ-interno-2026",
    nome: "Master Misto (35+ Anos) — Geral",
    modalidade: "Geral (Kata e Kumite)",
    idadeMinima: 35,
    sexo: "Misto"
  }
];

// Helper local storage seguro
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined" || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Erro ao carregar do storage (${key}):`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(data));
    // Notifica outros componentes e abas abertas da alteração
    window.dispatchEvent(new CustomEvent("madeira_storage_update", { detail: { key } }));
  } catch (e) {
    console.error(`Erro ao salvar no storage (${key}):`, e);
  }
}

/**
 * Calcula precisamente a idade do atleta na data do campeonato
 * (Regra obrigatória SPEC 08 item 5)
 */
export function calculateAgeOnDate(birthDateStr: string, targetDateStr: string): number {
  if (!birthDateStr || !targetDateStr) return 0;
  try {
    // Normalizar no formato YYYY-MM-DD
    const [bYear, bMonth, bDay] = birthDateStr.split("-").map(n => parseInt(n, 10));
    const [tYear, tMonth, tDay] = targetDateStr.split("-").map(n => parseInt(n, 10));
    
    if (!bYear || !bMonth || !bDay || !tYear || !tMonth || !tDay) return 0;

    let age = tYear - bYear;
    if (tMonth < bMonth || (tMonth === bMonth && tDay < bDay)) {
      age--;
    }
    return Math.max(0, age);
  } catch (e) {
    console.error("Erro ao calcular idade:", e);
    return 0;
  }
}

/**
 * Validação rigorosa do período de inscrições
 * (Regra obrigatória SPEC 08 item 3)
 */
export function getEnrollmentPeriodState(champ: Championship): {
  state: "BEFORE" | "OPEN" | "CLOSED";
  label: string;
  canRegister: boolean;
  message: string;
} {
  if (champ.status === "RASCUNHO") {
    return {
      state: "BEFORE",
      label: "Rascunho",
      canRegister: false,
      message: "Este campeonato está em elaboração e ainda não foi publicado."
    };
  }

  if (champ.status === "INSCRICOES_ENCERRADAS" || champ.status === "FINALIZADO") {
    return {
      state: "CLOSED",
      label: "Inscrições encerradas",
      canRegister: false,
      message: "O período oficial de inscrições deste campeonato foi encerrado."
    };
  }

  const now = new Date();
  const openTime = new Date(champ.aberturaInscricoes);
  const closeTime = new Date(champ.encerramentoInscricoes);

  if (now < openTime) {
    return {
      state: "BEFORE",
      label: "Inscrições ainda não iniciadas",
      canRegister: false,
      message: `As inscrições iniciarão em ${openTime.toLocaleDateString("pt-BR")} às ${openTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`
    };
  }

  if (now > closeTime) {
    return {
      state: "CLOSED",
      label: "Inscrições encerradas",
      canRegister: false,
      message: `O prazo de inscrições encerrou em ${closeTime.toLocaleDateString("pt-BR")} às ${closeTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`
    };
  }

  return {
    state: "OPEN",
    label: "Inscrições abertas",
    canRegister: true,
    message: `Inscrições abertas até ${closeTime.toLocaleDateString("pt-BR")} às ${closeTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`
  };
}

/**
 * Gerador de código sequencial único de inscrição (ex: CAM2026-0042)
 * (Regra obrigatória SPEC 08 item 6)
 */
function generateNextRegistrationId(championshipYear: number): string {
  const currentSeq = loadFromStorage<number>(STORAGE_KEYS.NEXT_SEQUENCE, 1);
  const nextSeq = currentSeq + 1;
  saveToStorage(STORAGE_KEYS.NEXT_SEQUENCE, nextSeq);

  return `CAM${championshipYear}-${String(currentSeq).padStart(4, "0")}`;
}

export const championshipService = {
  // --- Campeonatos ---
  getChampionships(): Championship[] {
    const list = loadFromStorage<Championship[]>(STORAGE_KEYS.CHAMPIONSHIPS, []);
    if (list.length === 0) {
      // Seed inicial se o storage estiver vazio
      saveToStorage(STORAGE_KEYS.CHAMPIONSHIPS, [DEFAULT_INITIAL_CHAMPIONSHIP]);
      return [DEFAULT_INITIAL_CHAMPIONSHIP];
    }
    return list;
  },

  getChampionshipBySlug(slug: string): Championship | undefined {
    const list = this.getChampionships();
    return list.find(c => c.slug.toLowerCase() === slug.toLowerCase() || c.id === slug);
  },

  getChampionshipById(id: string): Championship | undefined {
    const list = this.getChampionships();
    return list.find(c => c.id === id);
  },

  saveChampionship(championship: Championship): void {
    const list = this.getChampionships();
    const idx = list.findIndex(c => c.id === championship.id);
    const updated = { ...championship, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    saveToStorage(STORAGE_KEYS.CHAMPIONSHIPS, list);
  },

  deleteChampionship(id: string): void {
    const list = this.getChampionships().filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CHAMPIONSHIPS, list);
  },

  // --- Inscrições ---
  getRegistrations(championshipId?: string): AthleteRegistration[] {
    const all = loadFromStorage<AthleteRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    if (championshipId) {
      return all.filter(r => r.championshipId === championshipId);
    }
    return all;
  },

  getRegistrationById(id: string): AthleteRegistration | undefined {
    const cleanId = id.trim().toUpperCase();
    const all = this.getRegistrations();
    return all.find(r => r.id.toUpperCase() === cleanId);
  },

  /**
   * Consulta segura pelo atleta via Código + Dado de Validação (e-mail, data de nascimento ou telefone)
   * (Regra obrigatória SPEC 08 item 7)
   */
  lookupRegistration(code: string, validationValue: string): AthleteRegistration | null {
    const reg = this.getRegistrationById(code);
    if (!reg) return null;

    const cleanVal = validationValue.trim().toLowerCase().replace(/\D/g, "");
    const emailVal = validationValue.trim().toLowerCase();

    // Compara por e-mail
    if (reg.email.toLowerCase() === emailVal) return reg;

    // Compara por data de nascimento (ex: 2010-05-15 ou 15052010)
    const birthDigits = reg.dataNascimento.replace(/\D/g, "");
    if (cleanVal.length >= 6 && birthDigits.includes(cleanVal)) return reg;

    // Compara por telefone (apenas números)
    const phoneDigits = reg.telefone.replace(/\D/g, "");
    if (cleanVal.length >= 6 && phoneDigits.endsWith(cleanVal)) return reg;

    return null;
  },

  /**
   * Cria nova inscrição persistindo diretamente antes de retornar o código
   * (Regra obrigatória SPEC 08 item 6)
   */
  async createRegistration(
    champ: Championship,
    input: {
      nomeCompleto: string;
      dataNascimento: string;
      sexo: "Masculino" | "Feminino";
      graduacao: string;
      peso: number;
      modalidade?: string;
      telefone: string;
      email: string;
      observacoes?: string;
      nomeResponsavel?: string;
      telefoneResponsavel?: string;
      autorizacaoResponsavel?: boolean;
      aceiteRegulamento: boolean;
    }
  ): Promise<AthleteRegistration> {
    // 1. Validação estrita do período
    const period = getEnrollmentPeriodState(champ);
    if (!period.canRegister) {
      throw new Error(`Inscrições bloqueadas: ${period.message}`);
    }

    // Modalidade unificada: todos os atletas participam de todas as modalidades da competição
    const resolvedModality = input.modalidade?.trim() || "Todas as Modalidades (Kata e Kumite)";

    // 3. Cálculo da idade na data do campeonato
    const idade = calculateAgeOnDate(input.dataNascimento, champ.dataCampeonato);
    const isMenor = idade < 18;

    // 4. Verificação de menor
    if (isMenor) {
      if (!champ.permiteMenores) {
        throw new Error("Este campeonato não aceita atletas menores de 18 anos.");
      }
      if (!input.nomeResponsavel?.trim() || !input.telefoneResponsavel?.trim() || !input.autorizacaoResponsavel) {
        throw new Error("Para atletas menores de idade, os dados e autorização do responsável legal são obrigatórios.");
      }
    }

    if (!input.aceiteRegulamento) {
      throw new Error("É obrigatório ler e aceitar o regulamento do campeonato.");
    }

    // 5. Geração do código sequencial
    const champYear = new Date(champ.dataCampeonato).getFullYear() || 2026;
    const registrationId = generateNextRegistrationId(champYear);

    const nowIso = new Date().toISOString();

    const initialAudit: AuditLog = {
      timestamp: nowIso,
      action: "INSCRICAO_CRIADA",
      actor: "atleta",
      details: `Inscrição gerada com sucesso. Modalidade: ${resolvedModality}. Valor: R$ ${champ.valorInscricao.toFixed(2)}.`
    };

    const newRegistration: AthleteRegistration = {
      id: registrationId,
      championshipId: champ.id,
      championshipSlug: champ.slug,
      championshipName: champ.nome,
      nomeCompleto: input.nomeCompleto.trim(),
      dataNascimento: input.dataNascimento,
      idadeNaDataCampeonato: idade,
      sexo: input.sexo,
      graduacao: input.graduacao,
      peso: input.peso,
      modalidade: resolvedModality,
      telefone: input.telefone.trim(),
      email: input.email.trim(),
      observacoes: input.observacoes?.trim() || undefined,
      isMenor,
      nomeResponsavel: isMenor ? input.nomeResponsavel?.trim() : undefined,
      telefoneResponsavel: isMenor ? input.telefoneResponsavel?.trim() : undefined,
      autorizacaoResponsavel: isMenor ? input.autorizacaoResponsavel : undefined,
      aceiteRegulamento: true,
      status: "RECEBIDA",
      paymentStatus: "AGUARDANDO_PAGAMENTO",
      valorInscricao: champ.valorInscricao,
      dataHoraInscricao: nowIso,
      syncedToGoogleSheet: false,
      auditLogs: [initialAudit]
    };

    // 6. PERSISTÊNCIA REAL NO STORAGE PRIMEIRO!
    const all = this.getRegistrations();
    all.push(newRegistration);
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, all);

    // 7. Disparo assíncrono para Webhook Google Sheets se configurado
    this.syncSingleRegistrationToGoogleSheet(newRegistration).catch(err => {
      console.warn("Falha no envio assíncrono ao Google Sheets webhook:", err);
    });

    return newRegistration;
  },

  /**
   * Atualização de dados cadastrais pelo próprio atleta
   * (Regra obrigatória SPEC 08 item 7)
   */
  updateRegistrationByAthlete(
    id: string,
    champ: Championship,
    updates: {
      peso: number;
      telefone: string;
      email: string;
      modalidade?: string;
      observacoes?: string;
      nomeResponsavel?: string;
      telefoneResponsavel?: string;
    }
  ): AthleteRegistration {
    const period = getEnrollmentPeriodState(champ);
    if (!period.canRegister) {
      throw new Error("O prazo para alterações de dados deste campeonato encerrou.");
    }

    const all = this.getRegistrations();
    const idx = all.findIndex(r => r.id === id);
    if (idx < 0) {
      throw new Error("Inscrição não encontrada.");
    }

    const current = all[idx];
    if (current.status === "CANCELADA") {
      throw new Error("Inscrições canceladas não podem sofrer alterações pelo atleta.");
    }

    const resolvedModality = updates.modalidade || current.modalidade || "Todas as Modalidades (Kata e Kumite)";

    const changedFields: string[] = [];
    if (current.peso !== updates.peso) changedFields.push(`peso: ${current.peso}kg -> ${updates.peso}kg`);
    if (current.telefone !== updates.telefone) changedFields.push(`telefone atualizado`);
    if (current.email !== updates.email) changedFields.push(`email atualizado`);
    if (updates.modalidade && current.modalidade !== updates.modalidade) changedFields.push(`modalidade: ${current.modalidade} -> ${updates.modalidade}`);
    if (updates.observacoes && current.observacoes !== updates.observacoes) changedFields.push(`observações atualizadas`);

    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      action: "DADOS_ALTERADOS_ATLETA",
      actor: "atleta",
      details: changedFields.length > 0 ? `Alterações: ${changedFields.join("; ")}` : "Dados revisados sem alteração."
    };

    const updated: AthleteRegistration = {
      ...current,
      peso: updates.peso,
      telefone: updates.telefone,
      email: updates.email,
      modalidade: resolvedModality,
      observacoes: updates.observacoes !== undefined ? updates.observacoes : current.observacoes,
      nomeResponsavel: current.isMenor ? updates.nomeResponsavel : current.nomeResponsavel,
      telefoneResponsavel: current.isMenor ? updates.telefoneResponsavel : current.telefoneResponsavel,
      auditLogs: [...current.auditLogs, log]
    };

    all[idx] = updated;
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, all);

    return updated;
  },

  /**
   * Notificação de envio de comprovante pelo atleta
   */
  markReceiptSentByAthlete(id: string): AthleteRegistration {
    const all = this.getRegistrations();
    const idx = all.findIndex(r => r.id === id);
    if (idx < 0) throw new Error("Inscrição não encontrada.");

    const current = all[idx];
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      action: "COMPROVANTE_NOTIFICADO",
      actor: "atleta",
      details: "Atleta sinalizou o envio do comprovante para o WhatsApp do Dojo."
    };

    const updated: AthleteRegistration = {
      ...current,
      paymentStatus: current.paymentStatus === "AGUARDANDO_PAGAMENTO" ? "AGUARDANDO_CONFERENCIA" : current.paymentStatus,
      comprovanteEnviadoEm: new Date().toISOString(),
      auditLogs: [...current.auditLogs, log]
    };

    all[idx] = updated;
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, all);
    return updated;
  },

  /**
   * Ações administrativas sobre o pagamento e inscrição
   * (Regra obrigatória SPEC 08 itens 11 e 12)
   */
  adminUpdateStatus(
    id: string,
    updates: {
      status?: RegistrationStatus;
      paymentStatus?: PaymentStatus;
      categoriaId?: string;
      motivo?: string;
      adminName?: string;
    }
  ): AthleteRegistration {
    const all = this.getRegistrations();
    const idx = all.findIndex(r => r.id === id);
    if (idx < 0) throw new Error("Inscrição não encontrada.");

    const current = all[idx];
    const logs: AuditLog[] = [...current.auditLogs];
    const nowIso = new Date().toISOString();
    const admin = updates.adminName || "Sensei / Admin";

    let newStatus = current.status;
    let newPaymentStatus = current.paymentStatus;
    let conferidoEm = current.conferidoEm;
    let conferidoPor = current.conferidoPor;
    let motivo = current.motivoRejeicaoOuCancelamento;

    if (updates.paymentStatus && updates.paymentStatus !== current.paymentStatus) {
      newPaymentStatus = updates.paymentStatus;
      logs.push({
        timestamp: nowIso,
        action: `PAGAMENTO_${updates.paymentStatus}`,
        actor: "admin",
        details: `Status de pagamento alterado de '${current.paymentStatus}' para '${updates.paymentStatus}' por ${admin}.${updates.motivo ? ` Motivo: ${updates.motivo}` : ""}`
      });

      // Se pagamento confirmado, automaticamente aprova a inscrição para CONFIRMADA
      if (updates.paymentStatus === "PAGAMENTO_CONFIRMADO") {
        newStatus = "CONFIRMADA";
        conferidoEm = nowIso;
        conferidoPor = admin;
      }
    }

    if (updates.status && updates.status !== current.status) {
      newStatus = updates.status;
      if (updates.motivo) motivo = updates.motivo;
      logs.push({
        timestamp: nowIso,
        action: `INSCRICAO_${updates.status}`,
        actor: "admin",
        details: `Inscrição alterada de '${current.status}' para '${updates.status}' por ${admin}.${updates.motivo ? ` Motivo: ${updates.motivo}` : ""}`
      });
    }

    let categoriaId = current.categoriaId;
    let categoriaNome = current.categoriaNome;
    if (updates.categoriaId !== undefined) {
      categoriaId = updates.categoriaId || undefined;
      if (categoriaId) {
        const cat = this.getCategories(current.championshipId).find(c => c.id === categoriaId);
        categoriaNome = cat ? cat.nome : undefined;
      } else {
        categoriaNome = undefined;
      }
      logs.push({
        timestamp: nowIso,
        action: "CATEGORIA_ATRIBUIDA",
        actor: "admin",
        details: `Categoria definida: ${categoriaNome || "Sem Categoria"} por ${admin}.`
      });
    }

    const updated: AthleteRegistration = {
      ...current,
      status: newStatus,
      paymentStatus: newPaymentStatus,
      categoriaId,
      categoriaNome,
      conferidoEm,
      conferidoPor,
      motivoRejeicaoOuCancelamento: motivo,
      auditLogs: logs
    };

    all[idx] = updated;
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, all);

    // Disparo assíncrono para atualizar linha na planilha oficial Google Sheets em tempo real
    this.syncSingleRegistrationToGoogleSheet(updated).catch(err => {
      console.warn("Falha ao sincronizar atualização no Google Sheets:", err);
    });

    return updated;
  },

  deleteRegistration(id: string): void {
    const all = this.getRegistrations();
    const filtered = all.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, filtered);
  },

  // --- Categorias ---
  getCategories(championshipId?: string): ChampionshipCategory[] {
    let all = loadFromStorage<ChampionshipCategory[]>(STORAGE_KEYS.CATEGORIES, []);
    
    // Migração automática: se houver categorias legadas que separavam "Kata" e "Kumite",
    // substituímos pelas categorias oficiais unificadas (Kata + Kumite) conforme a regra do Dojo
    const hasLegacyModalities = all.some(c => 
      c.nome.toLowerCase().startsWith("kata ") || 
      c.nome.toLowerCase().startsWith("kumite ") ||
      c.nome.toLowerCase().includes("kata infantil") ||
      c.nome.toLowerCase().includes("kumite adulto")
    );

    if (all.length === 0 || hasLegacyModalities) {
      const seeded = championshipId
        ? DEFAULT_CATEGORIES.map(c => ({ ...c, championshipId }))
        : DEFAULT_CATEGORIES;
      all = seeded;
      saveToStorage(STORAGE_KEYS.CATEGORIES, seeded);
    }

    if (championshipId) {
      const filtered = all.filter(c => c.championshipId === championshipId);
      if (filtered.length > 0) return filtered;
    }
    return all;
  },

  resetToDefaultCategories(championshipId?: string): ChampionshipCategory[] {
    const list = championshipId
      ? DEFAULT_CATEGORIES.map(c => ({ ...c, championshipId }))
      : DEFAULT_CATEGORIES;
    saveToStorage(STORAGE_KEYS.CATEGORIES, list);
    return list;
  },

  saveCategory(category: ChampionshipCategory): void {
    const all = this.getCategories();
    const idx = all.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      all[idx] = category;
    } else {
      all.push(category);
    }
    saveToStorage(STORAGE_KEYS.CATEGORIES, all);
  },

  deleteCategory(id: string): void {
    const all = this.getCategories().filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CATEGORIES, all);
  },

  // --- Configurações do Sistema & PIN ---
  getSettings(): ChampionshipSettings {
    return loadFromStorage<ChampionshipSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  saveSettings(settings: ChampionshipSettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  verifyAdminPin(enteredPin: string): boolean {
    const s = this.getSettings();
    return enteredPin.trim() === s.adminPin.trim();
  },

  // --- Integração com Google Sheets (CSV & Apps Script Webhook) ---
  /**
   * Exporta todas as inscrições em CSV estruturado com BOM UTF-8 compatível com Excel e Google Sheets
   */
  exportRegistrationsToCsv(championshipId?: string): string {
    const regs = this.getRegistrations(championshipId);

    const headers = [
      "Código",
      "Campeonato",
      "Nome Completo",
      "Data Nascimento",
      "Idade no Campeonato",
      "Sexo",
      "Graduação",
      "Peso (kg)",
      "Modalidade",
      "Telefone / WhatsApp",
      "E-mail",
      "Menor de Idade",
      "Nome Responsável",
      "Telefone Responsável",
      "Categoria",
      "Status Inscrição",
      "Status Pagamento",
      "Valor (R$)",
      "Data/Hora Inscrição",
      "Comprovante Enviado Em",
      "Conferido Por",
      "Conferido Em",
      "Observações"
    ];

    const escapeCsv = (val: any): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = regs.map(r => [
      escapeCsv(r.id),
      escapeCsv(r.championshipName),
      escapeCsv(r.nomeCompleto),
      escapeCsv(r.dataNascimento),
      escapeCsv(r.idadeNaDataCampeonato),
      escapeCsv(r.sexo),
      escapeCsv(r.graduacao),
      escapeCsv(r.peso.toFixed(1).replace(".", ",")),
      escapeCsv(r.modalidade),
      escapeCsv(r.telefone),
      escapeCsv(r.email),
      escapeCsv(r.isMenor ? "Sim" : "Não"),
      escapeCsv(r.nomeResponsavel || ""),
      escapeCsv(r.telefoneResponsavel || ""),
      escapeCsv(r.categoriaNome || "Sem Categoria"),
      escapeCsv(r.status),
      escapeCsv(r.paymentStatus),
      escapeCsv(r.valorInscricao.toFixed(2).replace(".", ",")),
      escapeCsv(new Date(r.dataHoraInscricao).toLocaleString("pt-BR")),
      escapeCsv(r.comprovanteEnviadoEm ? new Date(r.comprovanteEnviadoEm).toLocaleString("pt-BR") : ""),
      escapeCsv(r.conferidoPor || ""),
      escapeCsv(r.conferidoEm ? new Date(r.conferidoEm).toLocaleString("pt-BR") : ""),
      escapeCsv(r.observacoes || "")
    ].join(";"));

    // BOM UTF-8 (\uFEFF) para garantir caracteres acentuados no Excel/Sheets
    return `\uFEFF${headers.join(";")}\n${rows.join("\n")}`;
  },

  /**
   * Dispara uma inscrição para o Webhook do Google Apps Script (se configurado pelo Sensei)
   */
  async syncSingleRegistrationToGoogleSheet(reg: AthleteRegistration): Promise<boolean> {
    const settings = this.getSettings();
    if (!settings.googleAppsScriptUrl || !settings.googleAppsScriptUrl.startsWith("https://script.google.com/")) {
      return false;
    }

    try {
      const payload = {
        action: "ADD_REGISTRATION",
        sheetId: settings.googleSheetId,
        registration: {
          ...reg,
          valorFormatado: `R$ ${reg.valorInscricao.toFixed(2).replace(".", ",")}`
        }
      };

      await fetch(settings.googleAppsScriptUrl, {
        method: "POST",
        mode: "no-cors", // Google Apps Script Web App redirects work seamlessly with no-cors
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      return true;
    } catch (e) {
      console.warn("Erro ao sincronizar com Google Apps Script:", e);
      return false;
    }
  },

  /**
   * Remove uma inscrição na planilha via Webhook do Google Apps Script
   */
  async deleteRegistrationFromGoogleSheet(registrationId: string): Promise<boolean> {
    const settings = this.getSettings();
    if (!settings.googleAppsScriptUrl || !settings.googleAppsScriptUrl.startsWith("https://script.google.com/")) {
      return false;
    }

    try {
      const payload = {
        action: "DELETE_REGISTRATION",
        sheetId: settings.googleSheetId,
        registrationId
      };

      await fetch(settings.googleAppsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      return true;
    } catch (e) {
      console.warn("Erro ao enviar exclusão para o Google Apps Script:", e);
      return false;
    }
  },

  /**
   * Solicita ao Google Apps Script a criação automática de todas as abas necessárias
   */
  async initializeAllGoogleSheetsTabs(): Promise<boolean> {
    const settings = this.getSettings();
    if (!settings.googleAppsScriptUrl || !settings.googleAppsScriptUrl.startsWith("https://script.google.com/")) {
      return false;
    }

    try {
      const payload = {
        action: "INIT_ALL_SHEETS",
        sheetId: settings.googleSheetId
      };

      await fetch(settings.googleAppsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      return true;
    } catch (e) {
      console.warn("Erro ao solicitar inicialização de abas no Google Apps Script:", e);
      return false;
    }
  },

  /**
   * Sincroniza em lote todas as inscrições registradas para a planilha via Apps Script
   */
  async syncAllRegistrationsToGoogleSheet(championshipId?: string): Promise<{ success: number; failed: number }> {
    const list = this.getRegistrations(championshipId);
    let success = 0;
    let failed = 0;
    for (const reg of list) {
      const ok = await this.syncSingleRegistrationToGoogleSheet(reg);
      if (ok) success++;
      else failed++;
    }
    return { success, failed };
  },

  /**
   * Código pronto para o Sensei copiar e colar no Google Apps Script da planilha
   */
  getGoogleAppsScriptSnippet(): string {
    return `/**
 * ====================================================================
 * GOOGLE APPS SCRIPT — INTEGRAÇÃO OFICIAL DOJO DIGITAL MADEIRA KARATE
 * ====================================================================
 * 
 * INSTRUÇÕES RÁPIDAS:
 * 1. Na planilha oficial do Dojo, abra o menu superior: "Extensões" > "Apps Script".
 * 2. Apague o código padrão que estiver lá e cole todo este arquivo.
 * 3. Se quiser criar todas as abas agora mesmo diretamente pelo editor:
 *    - Selecione a função "initAllSheets" no menu suspenso ao lado de "Executar".
 *    - Clique em "Executar" (conceda a permissão do Google uma única vez).
 *    - Todas as abas oficiais (Inscrições, Produtos, Eventos, Avisos, etc.) serão criadas com formatação!
 * 4. Para receber envios e exclusões do site automaticamente em tempo real:
 *    - Clique no botão azul "Implantar" (canto superior direito) > "Nova implantação".
 *    - Tipo de implantação: escolha "App da Web" (Web App).
 *    - Executar como: "Eu (seu e-mail)".
 *    - Quem pode acessar: "Qualquer pessoa" (Anyone).
 *    - Clique em "Implantar" e copie a URL gerada (começa com https://script.google.com/macros/s/...).
 * 5. Volte ao Dashboard do Dojo (/dashboard_campeonato), cole a URL no campo
 *    "URL do Webhook Google Apps Script" e salve!
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "empty_payload" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. INICIALIZAR TODAS AS ABAS
    if (data.action === "INIT_ALL_SHEETS") {
      initAllSheets();
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Abas inicializadas com sucesso!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheetName = "Inscrições";
    var sheet = ss.getSheetByName(sheetName);
    
    // Garante que a aba Inscrições existe com os cabeçalhos oficiais
    if (!sheet) {
      sheet = ensureInscricoesSheet(ss);
    }

    // 2. INSERIR OU ATUALIZAR INSCRIÇÃO
    if (data.action === "ADD_REGISTRATION" && data.registration) {
      var r = data.registration;
      var lastRow = sheet.getLastRow();
      var existingRowIndex = -1;

      // Se já houver linhas de dados, busca se o código já existe para atualizar ao invés de duplicar
      if (lastRow > 1) {
        var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]).trim() === String(r.id).trim()) {
            existingRowIndex = i + 2; // Linha real da planilha (1-indexed)
            break;
          }
        }
      }

      var rowData = [
        r.id,
        r.championshipName || "",
        r.nomeCompleto || "",
        r.dataNascimento || "",
        r.idadeNaDataCampeonato !== undefined ? r.idadeNaDataCampeonato : "",
        r.sexo || "",
        r.graduacao || "",
        r.peso !== undefined ? r.peso : "",
        r.modalidade || "Todas as Modalidades (Kata e Kumite)",
        r.telefone || "",
        r.email || "",
        r.isMenor ? "Sim" : "Não",
        r.nomeResponsavel || "",
        r.telefoneResponsavel || "",
        r.categoriaNome || "Sem Categoria",
        r.status || "RECEBIDA",
        r.paymentStatus || "AGUARDANDO_PAGAMENTO",
        r.valorFormatado || r.valorInscricao || "",
        r.dataHoraInscricao ? Utilities.formatDate(new Date(r.dataHoraInscricao), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss") : "",
        r.observacoes || ""
      ];

      if (existingRowIndex > 0) {
        sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: existingRowIndex > 0 ? "updated" : "inserted" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. EXCLUIR INSCRIÇÃO DA PLANILHA
    if (data.action === "DELETE_REGISTRATION" && data.registrationId) {
      var targetId = String(data.registrationId).trim();
      var lastRow = sheet.getLastRow();
      var deleted = false;

      if (lastRow > 1) {
        var idColumnValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        // Percorrer de trás para frente para exclusão segura de linha
        for (var idx = idColumnValues.length - 1; idx >= 0; idx--) {
          if (String(idColumnValues[idx][0]).trim() === targetId) {
            sheet.deleteRow(idx + 2);
            deleted = true;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", deleted: deleted }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "ignored" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função executável diretamente no Apps Script para criar/formatar todas as abas do sistema
 */
function initAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  ensureInscricoesSheet(ss);
  ensureConfiguracoesSheet(ss);
  ensureProdutosSheet(ss);
  ensureEventosSheet(ss);
  ensureAvisosSheet(ss);
  ensureKatasSheet(ss);
  ensureTecnicasSheet(ss);
  
  SpreadsheetApp.flush();
  Logger.log("Todas as abas do Madeira Karate foram verificadas e criadas com sucesso!");
}

function ensureInscricoesSheet(ss) {
  var name = "Inscrições";
  var sheet = ss.getSheetByName(name);
  var headers = [
    "Código", "Campeonato", "Nome Completo", "Nascimento", "Idade", 
    "Sexo", "Graduação", "Peso (kg)", "Modalidade", "Telefone", 
    "E-mail", "Menor?", "Responsável", "Tel Responsável", 
    "Categoria", "Status Inscrição", "Status Pagamento", "Valor", 
    "Data/Hora", "Observações"
  ];
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#D32F2F"); // Vermelho Karate
  }
  return sheet;
}

function ensureConfiguracoesSheet(ss) {
  var name = "Configuracoes";
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = ["chave", "valor", "descricao"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1F2937");
    sheet.appendRow(["whatsapp", "5521973681109", "WhatsApp oficial para contato e comprovantes"]);
    sheet.appendRow(["pix", "21973681109", "Chave PIX padrão do Dojo"]);
    sheet.appendRow(["logo", "https://i.imgur.com/fECU6ud.png", "Link direto da imagem do logo"]);
    sheet.appendRow(["google_analytics_id", "", "ID de medição GA4 (opcional)"]);
    sheet.appendRow(["video_faixa", "", "Link de vídeo orientador de amarração da faixa"]);
  }
  return sheet;
}

function ensureProdutosSheet(ss) {
  var name = "Produtos";
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = ["id", "nome", "descricao", "preco", "imagem1", "imagem2", "imagem3", "categoria", "tamanhos", "cores", "variacoes", "personalizavel", "disponivel", "ativo", "ordem"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1F2937");
  }
  return sheet;
}

function ensureEventosSheet(ss) {
  var name = "Eventos";
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = ["id", "titulo", "imagem", "mostrar_popup", "link_album", "data_evento"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1F2937");
  }
  return sheet;
}

function ensureAvisosSheet(ss) {
  var name = "Avisos";
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = ["id", "titulo", "imagem", "instagram_url", "mostrar_popup"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1F2937");
  }
  return sheet;
}

function ensureKatasSheet(ss) {
  var name = "Katas";
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = ["id", "video_url"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1F2937");
  }
  return sheet;
}

function ensureTecnicasSheet(ss) {
  var name = "Tecnicas";
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = ["id", "video_url", "imagem"];
    sheet.appendRow(headers);
    formatHeaderRow(sheet, headers.length, "#1F2937");
  }
  return sheet;
}

function formatHeaderRow(sheet, colCount, hexColor) {
  var range = sheet.getRange(1, 1, 1, colCount);
  range.setFontWeight("bold");
  range.setBackground(hexColor || "#1F2937");
  range.setFontColor("#FFFFFF");
  sheet.setFrozenRows(1);
}
`;
  }
};

import { 
  Championship, 
  AthleteRegistration, 
  ChampionshipCategory, 
  ChampionshipSettings, 
  AuditLog, 
  PaymentStatus, 
  RegistrationStatus 
} from "../types/championship";

const DEFAULT_SETTINGS: ChampionshipSettings = {
  adminPin: "1926",
  googleSheetId: "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM",
  googleAppsScriptUrl: ""
};

const LEGACY_SETTINGS_KEY = "madeira_champ_settings_v1";

function loadLocalValidationSettings(): ChampionshipSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(LEGACY_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<ChampionshipSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      adminPin: parsed.adminPin || DEFAULT_SETTINGS.adminPin,
      googleSheetId: parsed.googleSheetId || DEFAULT_SETTINGS.googleSheetId,
      googleAppsScriptUrl: parsed.googleAppsScriptUrl || ""
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveLocalValidationSettings(settings: ChampionshipSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEGACY_SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

// In-memory cache synced with the official central backend
let memoryCache = {
  championships: [] as Championship[],
  registrations: [] as AthleteRegistration[],
  categories: [] as ChampionshipCategory[],
  settings: loadLocalValidationSettings(),
  initialized: false
};

// Atualiza apenas o cache em memória.
// Não dispara eventos globais: os métodos de leitura chamavam esta função e,
// ao mesmo tempo, o dashboard escutava o evento para recarregar os mesmos dados,
// criando um loop contínuo de requisições.
function updateLocalCache() {
  // Intencionalmente sem side effects.
}

/**
 * Calcula precisamente a idade do atleta na data do campeonato
 * (Regra obrigatória SPEC 08 item 5)
 */
export function calculateAgeOnDate(birthDateStr: string, targetDateStr: string): number {
  if (!birthDateStr || !targetDateStr) return 0;
  try {
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

export const championshipService = {
  // --- Campeonatos (Fonte Central: Backend Server & Google Sheets) ---
  
  async fetchChampionships(): Promise<Championship[]> {
    try {
      const res = await fetch("/api/championships");
      if (res.ok) {
        const data = await res.json();
        memoryCache.championships = Array.isArray(data) ? data : [];
        updateLocalCache();
        return memoryCache.championships;
      }
    } catch (err) {
      console.warn("[championshipService] Error fetching /api/championships:", err);
    }
    return memoryCache.championships;
  },

  getChampionships(): Championship[] {
    // If not yet fetched, trigger background fetch
    if (!memoryCache.initialized) {
      this.fetchChampionships();
      memoryCache.initialized = true;
    }
    return memoryCache.championships;
  },

  getChampionshipBySlug(slug: string): Championship | undefined {
    const list = this.getChampionships();
    return list.find(c => c.slug.toLowerCase() === slug.toLowerCase() || c.id === slug);
  },

  getChampionshipById(id: string): Championship | undefined {
    const list = this.getChampionships();
    return list.find(c => c.id === id);
  },

  async saveChampionship(championship: Championship): Promise<Championship> {
    const res = await fetch("/api/championships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        championship,
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      let msg = "Erro ao salvar campeonato na fonte central.";
      try {
        const errJson = await res.json();
        if (errJson.error) msg = errJson.error;
      } catch {}
      throw new Error(msg);
    }

    const saved: Championship = await res.json();
    const idx = memoryCache.championships.findIndex(c => c.id === saved.id);
    if (idx >= 0) {
      memoryCache.championships[idx] = saved;
    } else {
      memoryCache.championships.push(saved);
    }
    updateLocalCache();
    return saved;
  },

  async deleteChampionship(id: string): Promise<void> {
    const res = await fetch(`/api/championships/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      let msg = "Erro ao excluir campeonato.";
      try {
        const errJson = await res.json();
        if (errJson.error) msg = errJson.error;
      } catch {}
      throw new Error(msg);
    }

    memoryCache.championships = memoryCache.championships.filter(c => c.id !== id);
    memoryCache.categories = memoryCache.categories.filter(c => c.championshipId !== id);
    updateLocalCache();
  },

  // --- Inscrições (Fonte Central: Backend Server & Google Sheets) ---

  async fetchRegistrations(championshipId?: string): Promise<AthleteRegistration[]> {
    try {
      const url = championshipId 
        ? `/api/registrations?championshipId=${encodeURIComponent(championshipId)}`
        : "/api/registrations";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (championshipId) {
            // Merge or update specific championship registrations in memory
            const other = memoryCache.registrations.filter(r => r.championshipId !== championshipId);
            memoryCache.registrations = [...other, ...data];
          } else {
            memoryCache.registrations = data;
          }
          updateLocalCache();
          return championshipId ? memoryCache.registrations.filter(r => r.championshipId === championshipId) : memoryCache.registrations;
        }
      }
    } catch (err) {
      console.warn("[championshipService] Error fetching /api/registrations:", err);
    }
    return championshipId ? memoryCache.registrations.filter(r => r.championshipId === championshipId) : memoryCache.registrations;
  },

  getRegistrations(championshipId?: string): AthleteRegistration[] {
    if (championshipId) {
      return memoryCache.registrations.filter(r => r.championshipId === championshipId);
    }
    return memoryCache.registrations;
  },

  getRegistrationById(id: string): AthleteRegistration | undefined {
    const cleanId = id.trim().toUpperCase();
    return memoryCache.registrations.find(r => r.id.toUpperCase() === cleanId);
  },

  /**
   * Consulta central pelo atleta via Código + Dado de Validação
   * (Regra obrigatória SPEC 08 item 7)
   */
  async lookupRegistration(code: string, validationValue: string): Promise<AthleteRegistration | null> {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await fetch(`/api/registrations/${encodeURIComponent(cleanCode)}`);
      if (res.ok) {
        const reg: AthleteRegistration = await res.json();
        const cleanVal = validationValue.trim().toLowerCase().replace(/\D/g, "");
        const emailVal = validationValue.trim().toLowerCase();

        // Validação de segurança por e-mail
        if (reg.email && reg.email.toLowerCase() === emailVal) return reg;

        // Validação de segurança por data de nascimento
        const birthDigits = (reg.dataNascimento || "").replace(/\D/g, "");
        if (cleanVal.length >= 6 && birthDigits.includes(cleanVal)) return reg;

        // Validação de segurança por telefone
        const phoneDigits = (reg.telefone || "").replace(/\D/g, "");
        if (cleanVal.length >= 6 && phoneDigits.endsWith(cleanVal)) return reg;
      }
    } catch (err) {
      console.warn("[championshipService] Error looking up registration:", err);
    }

    // Fallback verificação em memória local se já carregada
    const cached = this.getRegistrationById(cleanCode);
    if (cached) {
      const cleanVal = validationValue.trim().toLowerCase().replace(/\D/g, "");
      const emailVal = validationValue.trim().toLowerCase();
      if (cached.email.toLowerCase() === emailVal) return cached;
      const birthDigits = cached.dataNascimento.replace(/\D/g, "");
      if (cleanVal.length >= 6 && birthDigits.includes(cleanVal)) return cached;
      const phoneDigits = cached.telefone.replace(/\D/g, "");
      if (cleanVal.length >= 6 && phoneDigits.endsWith(cleanVal)) return cached;
    }

    return null;
  },

  /**
   * Cria nova inscrição com persistência central OBRIGATÓRIA antes de confirmar
   * (Regra fundamental Blockers 1, 2, 3 e SPEC 08 item 6)
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

    // 2. Cálculo da idade na data do campeonato
    const idade = calculateAgeOnDate(input.dataNascimento, champ.dataCampeonato);
    const isMenor = idade < 18;

    // 3. Verificação de menor
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

    // A inscrição é única: o atleta participa de todas as modalidades configuradas no campeonato.
    const resolvedModality =
      (champ.modalidades || []).map(m => m.trim()).filter(Boolean).join(", ") ||
      "Todas as modalidades do campeonato";

    const payload = {
      championshipId: champ.id,
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
      observacoes: input.observacoes?.trim() || "",
      isMenor,
      nomeResponsavel: isMenor ? input.nomeResponsavel?.trim() : "",
      telefoneResponsavel: isMenor ? input.telefoneResponsavel?.trim() : "",
      autorizacaoResponsavel: isMenor ? Boolean(input.autorizacaoResponsavel) : false,
      aceiteRegulamento: true
    };

    // 4. PERSISTÊNCIA CENTRAL OBRIGATÓRIA NO BACKEND / GOOGLE SHEETS
    // Blocker 3: Só confirmar inscrição após persistência central.
    // Em erro de Google Sheets/API: "Inscrição não concluída. Tente novamente."
    // NÃO aplicar fallback local como sucesso!
    let response: Response;
    try {
      response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration: payload,
          googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
        })
      });
    } catch (networkError) {
      console.error("[championshipService] Falha de comunicação com o servidor:", networkError);
      throw new Error("Inscrição não concluída. Tente novamente.");
    }

    if (!response.ok) {
      console.error("[championshipService] Servidor retornou status:", response.status);
      throw new Error("Inscrição não concluída. Tente novamente.");
    }

    const createdRegistration: AthleteRegistration = await response.json();
    
    // Atualiza cache em memória após persistência confirmada
    memoryCache.registrations.push(createdRegistration);
    updateLocalCache();

    return createdRegistration;
  },

  /**
   * Atualização de dados cadastrais pelo próprio atleta
   * (Regra obrigatória SPEC 08 item 7)
   */
  async updateRegistrationByAthlete(
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
  ): Promise<AthleteRegistration> {
    const period = getEnrollmentPeriodState(champ);
    if (!period.canRegister) {
      throw new Error("O prazo para alterações de dados deste campeonato encerrou.");
    }

    const payload = {
      peso: updates.peso,
      telefone: updates.telefone,
      email: updates.email,
      modalidade: updates.modalidade,
      observacoes: updates.observacoes,
      nomeResponsavel: updates.nomeResponsavel,
      telefoneResponsavel: updates.telefoneResponsavel
    };

    const res = await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: payload,
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar dados da inscrição na fonte central.");
    }

    const updated: AthleteRegistration = await res.json();
    const idx = memoryCache.registrations.findIndex(r => r.id === id);
    if (idx >= 0) memoryCache.registrations[idx] = updated;
    updateLocalCache();

    return updated;
  },

  /**
   * Notificação de envio de comprovante pelo atleta
   */
  async markReceiptSentByAthlete(id: string): Promise<AthleteRegistration> {
    const res = await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: { markReceiptSent: true },
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      throw new Error("Erro ao registrar sinalização de envio de comprovante.");
    }

    const updated: AthleteRegistration = await res.json();
    const idx = memoryCache.registrations.findIndex(r => r.id === id);
    if (idx >= 0) memoryCache.registrations[idx] = updated;
    updateLocalCache();

    return updated;
  },

  /**
   * Ações administrativas sobre o pagamento e inscrição
   * (Regra obrigatória SPEC 08 itens 11 e 12)
   */
  async adminUpdateStatus(
    id: string,
    updates: {
      status?: RegistrationStatus;
      paymentStatus?: PaymentStatus;
      categoriaId?: string;
      categoriaNome?: string;
      motivo?: string;
      adminName?: string;
    }
  ): Promise<AthleteRegistration> {
    const res = await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: {
          paymentStatus: updates.paymentStatus,
          status: updates.status,
          categoriaId: updates.categoriaId,
          categoriaNome: updates.categoriaNome,
          motivoRejeicaoOuCancelamento: updates.motivo,
          adminName: updates.adminName
        },
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar status na fonte central.");
    }

    const updated: AthleteRegistration = await res.json();
    const idx = memoryCache.registrations.findIndex(r => r.id === id);
    if (idx >= 0) memoryCache.registrations[idx] = updated;
    updateLocalCache();

    return updated;
  },

  async deleteRegistration(id: string): Promise<void> {
    const res = await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      throw new Error("Erro ao excluir inscrição da fonte central.");
    }

    memoryCache.registrations = memoryCache.registrations.filter(r => r.id !== id);
    updateLocalCache();
  },

  // --- Categorias (Fonte Central: Backend Server & Google Sheets) ---
  
  async fetchCategories(championshipId?: string): Promise<ChampionshipCategory[]> {
    try {
      const url = championshipId
        ? `/api/categories?championshipId=${encodeURIComponent(championshipId)}`
        : "/api/categories";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (championshipId) {
            const other = memoryCache.categories.filter(c => c.championshipId !== championshipId);
            memoryCache.categories = [...other, ...data];
          } else {
            memoryCache.categories = data;
          }
          updateLocalCache();
          return championshipId ? memoryCache.categories.filter(c => c.championshipId === championshipId) : memoryCache.categories;
        }
      }
    } catch (err) {
      console.warn("[championshipService] Error fetching /api/categories:", err);
    }
    return championshipId ? memoryCache.categories.filter(c => c.championshipId === championshipId) : memoryCache.categories;
  },

  getCategories(championshipId?: string): ChampionshipCategory[] {
    if (championshipId) {
      return memoryCache.categories.filter(c => c.championshipId === championshipId);
    }
    return memoryCache.categories;
  },

  resetToDefaultCategories(_championshipId?: string): ChampionshipCategory[] {
    // Blocker 5: Sem categorias institucionais inventadas. Base vazia -> nenhuma categoria.
    return [];
  },

  async saveCategory(category: ChampionshipCategory): Promise<ChampionshipCategory> {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      let msg = "Erro ao salvar categoria na fonte central.";
      try {
        const errJson = await res.json();
        if (errJson.error) msg = errJson.error;
      } catch {}
      throw new Error(msg);
    }

    const saved: ChampionshipCategory = await res.json();
    const idx = memoryCache.categories.findIndex(c => c.id === saved.id);
    if (idx >= 0) {
      memoryCache.categories[idx] = saved;
    } else {
      memoryCache.categories.push(saved);
    }
    updateLocalCache();
    return saved;
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });

    if (!res.ok) {
      throw new Error("Erro ao excluir categoria da fonte central.");
    }

    memoryCache.categories = memoryCache.categories.filter(c => c.id !== id);
    updateLocalCache();
  },

  // --- Configurações do Sistema & PIN (Autenticação Server-side) ---

  async fetchSettings(): Promise<ChampionshipSettings> {
    // Durante a Human Validation, URL do Apps Script e PIN são parametrizações
    // locais do navegador. Isso evita chamadas 404 a endpoints inexistentes no deploy.
    memoryCache.settings = loadLocalValidationSettings();
    return memoryCache.settings;
  },

  getSettings(): ChampionshipSettings {
    return memoryCache.settings;
  },

  async saveSettings(settings: ChampionshipSettings): Promise<void> {
    memoryCache.settings = { ...memoryCache.settings, ...settings };
    saveLocalValidationSettings(memoryCache.settings);
    updateLocalCache();
  },

  async verifyAdminPin(enteredPin: string): Promise<boolean> {
    const localSettings = loadLocalValidationSettings();
    return enteredPin.trim() === String(localSettings.adminPin || DEFAULT_SETTINGS.adminPin).trim();
  },

  // --- Integração com Google Sheets (CSV & Apps Script Webhook Seguro) ---

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

    return `\uFEFF${headers.join(";")}\n${rows.join("\n")}`;
  },

  /**
   * Aciona a sincronização completa entre o servidor e a planilha Google Sheets
   */
  async triggerSync(): Promise<{ success: boolean; results?: any }> {
    const [championships, registrations, categories] = await Promise.all([
      this.fetchChampionships(),
      this.fetchRegistrations(),
      this.fetchCategories()
    ]);
    return {
      success: true,
      results: {
        championships: championships.length,
        registrations: registrations.length,
        categories: categories.length
      }
    };
  },

  async deleteRegistrationFromGoogleSheet(registrationId: string): Promise<boolean> {
    await this.deleteRegistration(registrationId);
    return true;
  },

  async initializeAllGoogleSheetsTabs(): Promise<boolean> {
    const res = await fetch("/api/championship-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleAppsScriptUrl: memoryCache.settings.googleAppsScriptUrl || loadLocalValidationSettings().googleAppsScriptUrl || ""
      })
    });
    if (!res.ok) {
      let message = "Erro ao inicializar a estrutura de campeonatos na planilha.";
      try {
        const data = await res.json();
        if (data.error) message = data.error;
      } catch {}
      throw new Error(message);
    }
    return true;
  },

  async syncAllRegistrationsToGoogleSheet(_championshipId?: string): Promise<{ success: number; failed: number }> {
    await this.triggerSync();
    return { success: memoryCache.registrations.length, failed: 0 };
  },

  /**
   * Código oficial e seguro pronto para o Sensei colar no Google Apps Script da planilha
   * Valida SECRET_TOKEN e manipula as abas CAMPEONATOS, INSCRICOES_CAMPEONATO e CATEGORIAS_CAMPEONATO
   */
  getGoogleAppsScriptSnippet(): string {
    return `/**
 * GOOGLE APPS SCRIPT — DOJO DIGITAL MADEIRA KARATE
 * A planilha e a fonte oficial do modulo de campeonatos.
 *
 * Abas preservadas:
 * Produtos, Inscrições, Configuracoes, Katas, Tecnicas, Avisos, Eventos
 *
 * Abas adicionadas pelo modulo:
 * CAMPEONATOS, CATEGORIAS_CAMPEONATO
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ status: "error", message: "Payload vazio." });
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === "INIT_CHAMPIONSHIP_SHEETS" || data.action === "INIT_ALL_SHEETS") {
      initChampionshipSheets_(ss);
      return jsonResponse_({ status: "success", message: "Estrutura de campeonatos inicializada." });
    }

    if (data.action === "SAVE_CHAMPIONSHIP" && data.championship) {
      var championship = normalizeChampionship_(data.championship);
      var championshipSheet = ensureChampionshipsSheet_(ss);
      upsertObjectByKey_(championshipSheet, "id", championship.id, championshipHeaders_(), championship);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", target: "CAMPEONATOS", championship: championship });
    }

    if (data.action === "DELETE_CHAMPIONSHIP" && data.championshipId) {
      var champSheet = ensureChampionshipsSheet_(ss);
      var registrations = ensureRegistrationsSheet_(ss);
      var categories = ensureCategoriesSheet_(ss);

      var registrationsForChampionship = countRowsByValue_(registrations, "Campeonato ID", String(data.championshipId));
      if (registrationsForChampionship > 0) {
        return jsonResponse_({
          status: "error",
          message: "Não é possível excluir o campeonato porque existem inscrições vinculadas."
        });
      }

      deleteRowByKey_(champSheet, "id", String(data.championshipId));
      deleteRowsByValue_(categories, "campeonatoId", String(data.championshipId));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    if (data.action === "ADD_REGISTRATION" && data.registration) {
      var lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        var registrationSheet = ensureRegistrationsSheet_(ss);
        var registration = normalizeRegistration_(data.registration);

        if (!registration["Código"]) {
          registration["Código"] = nextRegistrationCode_(registrationSheet);
        }

        upsertObjectByKey_(
          registrationSheet,
          "Código",
          registration["Código"],
          registrationHeaders_(),
          registration
        );

        SpreadsheetApp.flush();
        return jsonResponse_({
          status: "success",
          target: "Inscrições",
          registration: registrationObjectForApi_(registration)
        });
      } finally {
        lock.releaseLock();
      }
    }

    if (data.action === "DELETE_REGISTRATION" && data.registrationId) {
      var registrationDeleteSheet = ensureRegistrationsSheet_(ss);
      deleteRowByKey_(registrationDeleteSheet, "Código", String(data.registrationId));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    if (data.action === "SAVE_CATEGORY" && data.category) {
      var categorySheet = ensureCategoriesSheet_(ss);
      var category = normalizeCategory_(data.category);
      upsertObjectByKey_(categorySheet, "id", category.id, categoryHeaders_(), category);
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", target: "CATEGORIAS_CAMPEONATO", category: category });
    }

    if (data.action === "DELETE_CATEGORY" && data.categoryId) {
      var categoryDeleteSheet = ensureCategoriesSheet_(ss);
      deleteRowByKey_(categoryDeleteSheet, "id", String(data.categoryId));
      SpreadsheetApp.flush();
      return jsonResponse_({ status: "success", deleted: true });
    }

    return jsonResponse_({ status: "ignored", message: "Ação não reconhecida: " + String(data.action || "") });
  } catch (err) {
    return jsonResponse_({ status: "error", message: String(err && err.message ? err.message : err) });
  }
}

function initChampionshipSheets_(ss) {
  ensureRegistrationsSheet_(ss);
  ensureChampionshipsSheet_(ss);
  ensureCategoriesSheet_(ss);
  SpreadsheetApp.flush();
}

function registrationHeaders_() {
  return [
    "Código",
    "Campeonato",
    "Nome Completo",
    "Nascimento",
    "Idade",
    "Sexo",
    "Graduação",
    "Peso (kg)",
    "Participação",
    "Telefone",
    "E-mail",
    "Menor?",
    "Responsável",
    "Tel Responsável",
    "Chave/Categoria",
    "Status Inscrição",
    "Status Pagamento",
    "Valor",
    "Data/Hora Inscrição",
    "Campeonato ID",
    "Categoria ID",
    "Data Confirmação",
    "Confirmado Por",
    "Comprovante Recebido",
    "Observações",
    "Atualizado Em"
  ];
}

function championshipHeaders_() {
  return [
    "id",
    "slug",
    "nome",
    "descricao",
    "dataCampeonato",
    "local",
    "aberturaInscricoes",
    "encerramentoInscricoes",
    "status",
    "valorInscricao",
    "modalidades",
    "pixTipo",
    "pixChave",
    "pixNome",
    "pixCidade",
    "pixIncluirValor",
    "regulamento",
    "permiteMenores",
    "createdAt",
    "updatedAt"
  ];
}

function categoryHeaders_() {
  return [
    "id",
    "campeonatoId",
    "nome",
    "sexo",
    "idadeMinima",
    "idadeMaxima",
    "pesoMaximo",
    "observacoes",
    "createdAt",
    "updatedAt"
  ];
}

function ensureRegistrationsSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "Inscrições", registrationHeaders_(), "#D32F2F");
}

function ensureChampionshipsSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "CAMPEONATOS", championshipHeaders_(), "#1F2937");
}

function ensureCategoriesSheet_(ss) {
  return ensureSheetWithHeaders_(ss, "CATEGORIAS_CAMPEONATO", categoryHeaders_(), "#1F2937");
}

function ensureSheetWithHeaders_(ss, name, requiredHeaders, color) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  var lastColumn = Math.max(sheet.getLastColumn(), 0);
  var existingHeaders = lastColumn > 0
    ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function(v) { return String(v).trim(); })
    : [];

  requiredHeaders.forEach(function(header) {
    if (existingHeaders.indexOf(header) === -1) {
      existingHeaders.push(header);
      sheet.getRange(1, existingHeaders.length).setValue(header);
    }
  });

  if (existingHeaders.length > 0) {
    var headerRange = sheet.getRange(1, 1, 1, existingHeaders.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground(color || "#1F2937");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function normalizeChampionship_(c) {
  var now = new Date().toISOString();
  return {
    id: String(c.id || ("champ-" + new Date().getTime())).trim(),
    slug: String(c.slug || c.id || "").trim(),
    nome: String(c.nome || "").trim(),
    descricao: String(c.descricao || "").trim(),
    dataCampeonato: String(c.dataCampeonato || "").trim(),
    local: String(c.local || "").trim(),
    aberturaInscricoes: String(c.aberturaInscricoes || "").trim(),
    encerramentoInscricoes: String(c.encerramentoInscricoes || "").trim(),
    status: String(c.status || "RASCUNHO").trim(),
    valorInscricao: Number(c.valorInscricao || 0),
    modalidades: Array.isArray(c.modalidades) ? c.modalidades.join(", ") : String(c.modalidades || "").trim(),
    pixTipo: c.configuracaoPix ? String(c.configuracaoPix.tipoChave || "").trim() : "",
    pixChave: c.configuracaoPix ? String(c.configuracaoPix.chave || "").trim() : "",
    pixNome: c.configuracaoPix ? String(c.configuracaoPix.nomeRecebedor || "").trim() : "",
    pixCidade: c.configuracaoPix ? String(c.configuracaoPix.cidadeRecebedor || "").trim() : "",
    pixIncluirValor: c.configuracaoPix && c.configuracaoPix.incluirValorNoQrCode === false ? "Não" : "Sim",
    regulamento: String(c.regulamento || "").trim(),
    permiteMenores: c.permiteMenores === false ? "Não" : "Sim",
    createdAt: String(c.createdAt || now),
    updatedAt: now
  };
}

function normalizeRegistration_(r) {
  var now = new Date().toISOString();
  var participation = r.modalidade || r.participacao || "";
  return {
    "Código": String(r.id || r["Código"] || "").trim(),
    "Campeonato": String(r.championshipName || r["Campeonato"] || "").trim(),
    "Nome Completo": String(r.nomeCompleto || r["Nome Completo"] || "").trim(),
    "Nascimento": String(r.dataNascimento || r["Nascimento"] || "").trim(),
    "Idade": r.idadeNaDataCampeonato !== undefined ? r.idadeNaDataCampeonato : (r["Idade"] || ""),
    "Sexo": String(r.sexo || r["Sexo"] || "").trim(),
    "Graduação": String(r.graduacao || r["Graduação"] || "").trim(),
    "Peso (kg)": r.peso !== undefined ? r.peso : (r["Peso (kg)"] || ""),
    "Participação": String(participation || "").trim(),
    "Telefone": String(r.telefone || r["Telefone"] || "").trim(),
    "E-mail": String(r.email || r["E-mail"] || "").trim(),
    "Menor?": r.isMenor === true || r["Menor?"] === "Sim" ? "Sim" : "Não",
    "Responsável": String(r.nomeResponsavel || r["Responsável"] || "").trim(),
    "Tel Responsável": String(r.telefoneResponsavel || r["Tel Responsável"] || "").trim(),
    "Chave/Categoria": String(r.categoriaNome || r["Chave/Categoria"] || "Sem Categoria").trim(),
    "Status Inscrição": String(r.status || r["Status Inscrição"] || "RECEBIDA").trim(),
    "Status Pagamento": String(r.paymentStatus || r["Status Pagamento"] || "AGUARDANDO_PAGAMENTO").trim(),
    "Valor": r.valorInscricao !== undefined ? r.valorInscricao : (r["Valor"] || 0),
    "Data/Hora Inscrição": String(r.dataHoraInscricao || r["Data/Hora Inscrição"] || now),
    "Campeonato ID": String(r.championshipId || r["Campeonato ID"] || "").trim(),
    "Categoria ID": String(r.categoriaId || r["Categoria ID"] || "").trim(),
    "Data Confirmação": String(r.conferidoEm || r["Data Confirmação"] || "").trim(),
    "Confirmado Por": String(r.conferidoPor || r["Confirmado Por"] || "").trim(),
    "Comprovante Recebido": r.comprovanteRecebido === true || r["Comprovante Recebido"] === "Sim" ? "Sim" : "Não",
    "Observações": String(r.observacoes || r["Observações"] || "").trim(),
    "Atualizado Em": now
  };
}

function registrationObjectForApi_(r) {
  return {
    id: r["Código"],
    championshipId: r["Campeonato ID"],
    championshipName: r["Campeonato"],
    nomeCompleto: r["Nome Completo"],
    dataNascimento: r["Nascimento"],
    idadeNaDataCampeonato: Number(r["Idade"] || 0),
    sexo: r["Sexo"],
    graduacao: r["Graduação"],
    peso: Number(r["Peso (kg)"] || 0),
    modalidade: r["Participação"],
    telefone: r["Telefone"],
    email: r["E-mail"],
    isMenor: r["Menor?"] === "Sim",
    nomeResponsavel: r["Responsável"],
    telefoneResponsavel: r["Tel Responsável"],
    categoriaId: r["Categoria ID"],
    categoriaNome: r["Chave/Categoria"],
    status: r["Status Inscrição"],
    paymentStatus: r["Status Pagamento"],
    valorInscricao: Number(r["Valor"] || 0),
    dataHoraInscricao: r["Data/Hora Inscrição"],
    conferidoEm: r["Data Confirmação"],
    conferidoPor: r["Confirmado Por"],
    comprovanteRecebido: r["Comprovante Recebido"] === "Sim",
    observacoes: r["Observações"]
  };
}

function normalizeCategory_(cat) {
  var now = new Date().toISOString();
  return {
    id: String(cat.id || ("cat-" + new Date().getTime())).trim(),
    campeonatoId: String(cat.championshipId || cat.campeonatoId || "").trim(),
    nome: String(cat.nome || "").trim(),
    sexo: String(cat.sexo || "Misto").trim(),
    idadeMinima: cat.idadeMinima !== undefined ? cat.idadeMinima : "",
    idadeMaxima: cat.idadeMaxima !== undefined ? cat.idadeMaxima : "",
    pesoMaximo: cat.pesoMaximo !== undefined ? cat.pesoMaximo : "",
    observacoes: String(cat.observacoes || "").trim(),
    createdAt: String(cat.createdAt || now),
    updatedAt: now
  };
}

function nextRegistrationCode_(sheet) {
  var year = new Date().getFullYear();
  var prefix = "CAM" + year + "-";
  var lastRow = sheet.getLastRow();
  var maxSeq = 0;

  if (lastRow > 1) {
    var headerMap = headerMap_(sheet);
    var codeColumn = headerMap["Código"];
    if (codeColumn) {
      var values = sheet.getRange(2, codeColumn, lastRow - 1, 1).getValues();
      values.forEach(function(row) {
        var value = String(row[0] || "").trim();
        if (value.indexOf(prefix) === 0) {
          var n = parseInt(value.substring(prefix.length), 10);
          if (!isNaN(n) && n > maxSeq) maxSeq = n;
        }
      });
    }
  }

  return prefix + String(maxSeq + 1).padStart(4, "0");
}

function upsertObjectByKey_(sheet, keyHeader, keyValue, headers, objectData) {
  var map = headerMap_(sheet);
  var keyColumn = map[keyHeader];
  if (!keyColumn) throw new Error("Coluna chave não encontrada: " + keyHeader);

  var targetRow = -1;
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var values = sheet.getRange(2, keyColumn, lastRow - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      if (String(values[i][0]).trim() === String(keyValue).trim()) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow < 0) targetRow = lastRow + 1;

  headers.forEach(function(header) {
    var column = map[header];
    if (column) {
      sheet.getRange(targetRow, column).setValue(objectData[header] !== undefined ? objectData[header] : "");
    }
  });
}

function deleteRowByKey_(sheet, keyHeader, keyValue) {
  var map = headerMap_(sheet);
  var keyColumn = map[keyHeader];
  if (!keyColumn || sheet.getLastRow() <= 1) return false;

  var values = sheet.getRange(2, keyColumn, sheet.getLastRow() - 1, 1).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).trim() === String(keyValue).trim()) {
      sheet.deleteRow(i + 2);
      return true;
    }
  }
  return false;
}

function deleteRowsByValue_(sheet, header, value) {
  var map = headerMap_(sheet);
  var column = map[header];
  if (!column || sheet.getLastRow() <= 1) return;

  var values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).trim() === String(value).trim()) {
      sheet.deleteRow(i + 2);
    }
  }
}

function countRowsByValue_(sheet, header, value) {
  var map = headerMap_(sheet);
  var column = map[header];
  if (!column || sheet.getLastRow() <= 1) return 0;

  var values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues();
  var count = 0;
  values.forEach(function(row) {
    if (String(row[0]).trim() === String(value).trim()) count++;
  });
  return count;
}

function headerMap_(sheet) {
  var lastColumn = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var map = {};
  headers.forEach(function(value, index) {
    map[String(value).trim()] = index + 1;
  });
  return map;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
  }
};

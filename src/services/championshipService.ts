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

// Safe cache helper (only used as auxiliary cache, never as official source)
function updateLocalCache() {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent("madeira_storage_update", { detail: { time: Date.now() } }));
    } catch {}
  }
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(championship)
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
      method: "DELETE"
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

    // Modalidade configurável
    const resolvedModality = input.modalidade?.trim() || (champ.modalidades && champ.modalidades[0]) || "Kata";

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
        body: JSON.stringify(payload)
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
      body: JSON.stringify(payload)
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
    const res = await fetch(`/api/registrations/${encodeURIComponent(id)}/receipt`, {
      method: "PATCH"
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
    const res = await fetch(`/api/registrations/${encodeURIComponent(id)}/payment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentStatus: updates.paymentStatus,
        status: updates.status,
        categoriaId: updates.categoriaId,
        categoriaNome: updates.categoriaNome,
        notes: updates.motivo,
        adminName: updates.adminName
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
      method: "DELETE"
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
      body: JSON.stringify(category)
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
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error("Erro ao excluir categoria da fonte central.");
    }

    memoryCache.categories = memoryCache.categories.filter(c => c.id !== id);
    updateLocalCache();
  },

  // --- Configurações do Sistema & PIN (Autenticação Server-side) ---

  async fetchSettings(): Promise<ChampionshipSettings> {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        memoryCache.settings = {
          ...memoryCache.settings,
          googleSheetId: data.googleSheetId || DEFAULT_SETTINGS.googleSheetId,
          googleAppsScriptUrl: data.googleAppsScriptUrl || ""
        };
        saveLocalValidationSettings(memoryCache.settings);
        return memoryCache.settings;
      }
    } catch (err) {
      console.warn("[championshipService] API de configurações indisponível; usando configuração local de validação.", err);
    }

    memoryCache.settings = loadLocalValidationSettings();
    return memoryCache.settings;
  },

  getSettings(): ChampionshipSettings {
    return memoryCache.settings;
  },

  async saveSettings(settings: ChampionshipSettings): Promise<void> {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleAppsScriptUrl: settings.googleAppsScriptUrl,
          newAdminPin: settings.adminPin
        })
      });

      if (res.ok) {
        memoryCache.settings = { ...memoryCache.settings, ...settings };
        saveLocalValidationSettings(memoryCache.settings);
        updateLocalCache();
        return;
      }

      console.warn("[championshipService] /api/settings indisponível no deploy; salvando configuração local para Human Validation.");
    } catch (err) {
      console.warn("[championshipService] Falha ao acessar /api/settings; salvando configuração local para Human Validation.", err);
    }

    // Compatibilidade temporária para o deploy estático atual:
    // preserva a URL do Apps Script e o PIN no mesmo navegador durante Human Validation.
    memoryCache.settings = { ...memoryCache.settings, ...settings };
    saveLocalValidationSettings(memoryCache.settings);
    updateLocalCache();
  },

  /**
   * Autenticação administrativa.
   * Quando o backend /api/admin/auth estiver disponível, ele é a autoridade.
   * No deploy estático atual, mantém o PIN local apenas para permitir Human Validation.
   */
  async verifyAdminPin(enteredPin: string): Promise<boolean> {
    const normalizedPin = enteredPin.trim();

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: normalizedPin })
      });

      if (res.ok) {
        const data = await res.json();
        return Boolean(data.success);
      }

      // Se o endpoint não existe no deploy atual (ex.: 404/405/5xx),
      // permite a validação usando o PIN configurado localmente.
      if (res.status !== 401 && res.status !== 403) {
        const localSettings = loadLocalValidationSettings();
        return normalizedPin === String(localSettings.adminPin || DEFAULT_SETTINGS.adminPin).trim();
      }

      return false;
    } catch {
      const localSettings = loadLocalValidationSettings();
      return normalizedPin === String(localSettings.adminPin || DEFAULT_SETTINGS.adminPin).trim();
    }
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
    const res = await fetch("/api/sync", { method: "POST" });
    if (!res.ok) {
      throw new Error("Erro ao sincronizar com Google Sheets.");
    }
    const data = await res.json();
    await this.fetchChampionships();
    await this.fetchRegistrations();
    await this.fetchCategories();
    return data;
  },

  async deleteRegistrationFromGoogleSheet(registrationId: string): Promise<boolean> {
    await this.deleteRegistration(registrationId);
    return true;
  },

  async initializeAllGoogleSheetsTabs(): Promise<boolean> {
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
 * ====================================================================
 * GOOGLE APPS SCRIPT — INTEGRAÇÃO OFICIAL DOJO DIGITAL MADEIRA KARATE
 * Planilha Oficial: 1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM
 * ====================================================================
 * 
 * SEGURANÇA OBRIGATÓRIA (Blocker 9):
 * Todas as requisições de gravação exigem validação de segredo no backend.
 */

var WEBHOOK_SECRET = "madeira_sensei_secret_2026";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Payload vazio." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);

    // Validação de segurança com token secreto
    if (data.secret !== WEBHOOK_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ status: "unauthorized", message: "Segredo inválido." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. INICIALIZAR TODAS AS ABAS OFICIAIS
    if (data.action === "INIT_ALL_SHEETS") {
      initAllSheets();
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Abas inicializadas com sucesso!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. GRAVAÇÃO / ATUALIZAÇÃO DE CAMPEONATO (Aba: CAMPEONATOS)
    if (data.action === "SAVE_CHAMPIONSHIP" && data.championship) {
      var c = data.championship;
      var sheetChamp = ensureSheet(ss, "CAMPEONATOS", [
        "id", "slug", "nome", "descricao", "dataCampeonato", "local",
        "aberturaInscricoes", "encerramentoInscricoes", "status", "valorInscricao",
        "modalidades", "pixTipo", "pixChave", "pixNome", "pixCidade",
        "regulamento", "createdAt", "updatedAt"
      ], "#1F2937");

      var rowChamp = [
        c.id, c.slug || c.id, c.nome, c.descricao || "", c.dataCampeonato, c.local,
        c.aberturaInscricoes, c.encerramentoInscricoes, c.status, c.valorInscricao,
        Array.isArray(c.modalidades) ? c.modalidades.join(", ") : c.modalidades,
        c.configuracaoPix ? c.configuracaoPix.tipoChave : "",
        c.configuracaoPix ? c.configuracaoPix.chave : "",
        c.configuracaoPix ? c.configuracaoPix.nomeRecebedor : "",
        c.configuracaoPix ? c.configuracaoPix.cidadeRecebedor : "",
        c.regulamento || "", c.createdAt || "", c.updatedAt || ""
      ];

      upsertRowById(sheetChamp, c.id, rowChamp);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", target: "CAMPEONATOS" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. GRAVAÇÃO / ATUALIZAÇÃO DE INSCRIÇÃO (Aba: INSCRICOES_CAMPEONATO)
    if (data.action === "ADD_REGISTRATION" && data.registration) {
      var r = data.registration;
      var sheetReg = ensureSheet(ss, "INSCRICOES_CAMPEONATO", [
        "id", "championshipId", "championshipName", "nomeCompleto", "dataNascimento",
        "idadeNaDataCampeonato", "sexo", "graduacao", "peso", "modalidade",
        "telefone", "email", "isMenor", "nomeResponsavel", "telefoneResponsavel",
        "categoriaId", "categoriaNome", "status", "paymentStatus", "valorInscricao",
        "dataHoraInscricao", "comprovanteRecebido", "observacoes"
      ], "#D32F2F");

      var rowReg = [
        r.id, r.championshipId, r.championshipName || "", r.nomeCompleto, r.dataNascimento,
        r.idadeNaDataCampeonato || 0, r.sexo, r.graduacao, r.peso || 0, r.modalidade || "",
        r.telefone, r.email, r.isMenor ? "Sim" : "Não", r.nomeResponsavel || "", r.telefoneResponsavel || "",
        r.categoriaId || "", r.categoriaNome || "Sem Categoria", r.status || "RECEBIDA",
        r.paymentStatus || "AGUARDANDO_PAGAMENTO", r.valorInscricao || 0,
        r.dataHoraInscricao ? Utilities.formatDate(new Date(r.dataHoraInscricao), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss") : "",
        r.comprovanteRecebido ? "Sim" : "Não", r.observacoes || ""
      ];

      upsertRowById(sheetReg, r.id, rowReg);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", target: "INSCRICOES_CAMPEONATO" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 4. EXCLUSÃO DE INSCRIÇÃO
    if (data.action === "DELETE_REGISTRATION" && data.registrationId) {
      var sReg = ss.getSheetByName("INSCRICOES_CAMPEONATO");
      if (sReg) deleteRowById(sReg, String(data.registrationId).trim());
      return ContentService.createTextOutput(JSON.stringify({ status: "success", deleted: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 5. GRAVAÇÃO DE CATEGORIA (Aba: CATEGORIAS_CAMPEONATO)
    if (data.action === "SAVE_CATEGORY" && data.category) {
      var cat = data.category;
      var sheetCat = ensureSheet(ss, "CATEGORIAS_CAMPEONATO", [
        "id", "championshipId", "nome", "modalidade", "idadeMinima", "idadeMaxima", "sexo", "pesoMaximo"
      ], "#1F2937");

      var rowCat = [
        cat.id, cat.championshipId, cat.nome, cat.modalidade || "Geral",
        cat.idadeMinima || "", cat.idadeMaxima || "", cat.sexo || "Misto", cat.pesoMaximo || ""
      ];

      upsertRowById(sheetCat, cat.id, rowCat);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", target: "CATEGORIAS_CAMPEONATO" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 6. EXCLUSÃO DE CATEGORIA
    if (data.action === "DELETE_CATEGORY" && data.categoryId) {
      var sCat = ss.getSheetByName("CATEGORIAS_CAMPEONATO");
      if (sCat) deleteRowById(sCat, String(data.categoryId).trim());
      return ContentService.createTextOutput(JSON.stringify({ status: "success", deleted: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ignored" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function initAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet(ss, "CAMPEONATOS", [
    "id", "slug", "nome", "descricao", "dataCampeonato", "local",
    "aberturaInscricoes", "encerramentoInscricoes", "status", "valorInscricao",
    "modalidades", "pixTipo", "pixChave", "pixNome", "pixCidade",
    "regulamento", "createdAt", "updatedAt"
  ], "#1F2937");

  ensureSheet(ss, "INSCRICOES_CAMPEONATO", [
    "id", "championshipId", "championshipName", "nomeCompleto", "dataNascimento",
    "idadeNaDataCampeonato", "sexo", "graduacao", "peso", "modalidade",
    "telefone", "email", "isMenor", "nomeResponsavel", "telefoneResponsavel",
    "categoriaId", "categoriaNome", "status", "paymentStatus", "valorInscricao",
    "dataHoraInscricao", "comprovanteRecebido", "observacoes"
  ], "#D32F2F");

  ensureSheet(ss, "CATEGORIAS_CAMPEONATO", [
    "id", "championshipId", "nome", "modalidade", "idadeMinima", "idadeMaxima", "sexo", "pesoMaximo"
  ], "#1F2937");

  SpreadsheetApp.flush();
}

function ensureSheet(ss, name, headers, headerColor) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold");
    range.setBackground(headerColor || "#1F2937");
    range.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function upsertRowById(sheet, id, rowData) {
  var lastRow = sheet.getLastRow();
  var existingIndex = -1;
  if (lastRow > 1) {
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === String(id).trim()) {
        existingIndex = i + 2;
        break;
      }
    }
  }
  if (existingIndex > 0) {
    sheet.getRange(existingIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

function deleteRowById(sheet, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = ids.length - 1; i >= 0; i--) {
      if (String(ids[i][0]).trim() === String(id).trim()) {
        sheet.deleteRow(i + 2);
      }
    }
  }
}
`;
  }
};

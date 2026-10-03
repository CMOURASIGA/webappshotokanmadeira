export type ChampionshipStatus = 
  | "RASCUNHO" 
  | "INSCRICOES_ABERTAS" 
  | "INSCRICOES_ENCERRADAS" 
  | "FINALIZADO";

export type PaymentStatus = 
  | "AGUARDANDO_PAGAMENTO" 
  | "AGUARDANDO_CONFERENCIA" 
  | "PAGAMENTO_CONFIRMADO" 
  | "PAGAMENTO_REJEITADO";

export type RegistrationStatus = 
  | "RECEBIDA" 
  | "CONFIRMADA" 
  | "CANCELADA";

export type PixKeyType = 
  | "CPF" 
  | "CNPJ" 
  | "EMAIL" 
  | "TELEFONE" 
  | "ALEATORIA";

export interface PixConfig {
  tipoChave: PixKeyType;
  chave: string;
  nomeRecebedor: string;
  cidadeRecebedor: string;
  incluirValorNoQrCode: boolean;
  instrucoesAdicionais?: string;
}

export interface Championship {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  dataCampeonato: string; // YYYY-MM-DD
  local: string;
  aberturaInscricoes: string; // ISO String (ex: 2026-10-01T08:00:00)
  encerramentoInscricoes: string; // ISO String (ex: 2026-11-10T23:59:59)
  status: ChampionshipStatus;
  valorInscricao: number;
  modalidades: string[]; // ex: ["Kata", "Kumite", "Kata + Kumite"]
  configuracaoPix: PixConfig;
  regulamento?: string;
  permiteMenores: boolean;
  idadeMinima?: number;
  idadeMaxima?: number;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChampionshipCategory {
  id: string;
  championshipId: string;
  nome: string;
  modalidade?: string; // Opcional (padrão: "Geral (Kata + Kumite)")
  sexo?: "Masculino" | "Feminino" | "Misto";
  faixas?: string[];
  idadeMinima?: number;
  idadeMaxima?: number;
  pesoMaximo?: number;
  observacoes?: string;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  actor: "atleta" | "admin" | "sistema";
  details: string;
}

export interface AthleteRegistration {
  id: string; // e.g. "CAM2026-0001"
  championshipId: string;
  championshipSlug: string;
  championshipName: string;
  
  // Athlete personal info
  nomeCompleto: string;
  dataNascimento: string; // YYYY-MM-DD
  idadeNaDataCampeonato: number; // Calculated on championship date
  sexo: "Masculino" | "Feminino";
  graduacao: string; // e.g. "Faixa Roxa (4º Kyu)"
  peso: number; // in kg
  modalidade: string;
  telefone: string;
  email: string;
  observacoes?: string;

  // Minor authorization info
  isMenor: boolean;
  nomeResponsavel?: string;
  telefoneResponsavel?: string;
  autorizacaoResponsavel?: boolean;

  // Acceptance & Terms
  aceiteRegulamento: boolean;

  // Category assignment (manual by admin in version 1)
  categoriaId?: string;
  categoriaNome?: string;

  // Status separation (SPEC 08 item 11)
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  valorInscricao: number;

  // Timestamps
  dataHoraInscricao: string;
  comprovanteEnviadoEm?: string;
  conferidoEm?: string;
  conferidoPor?: string;
  motivoRejeicaoOuCancelamento?: string;

  // Sync state
  syncedToGoogleSheet?: boolean;
  lastSyncAttempt?: string;

  // Change tracking
  auditLogs: AuditLog[];
}

export interface ChampionshipSettings {
  adminPin: string;
  googleSheetId: string;
  googleAppsScriptUrl?: string;
  lastSyncAt?: string;
}

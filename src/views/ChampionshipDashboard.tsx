import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Tag, 
  Check, 
  FileSpreadsheet, 
  Code, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  QrCode,
  Save,
  Eye,
  LogOut,
  RotateCcw,
  Calendar,
  MapPin,
  Flame,
  Sparkles,
  MessageCircle,
  Copy,
  Send,
  ArrowLeft,
  X,
  AlertTriangle,
  Layers
} from "lucide-react";
import { generatePixCopiaECola, generatePixQrCodeDataUrl } from "../lib/pixUtils";
import { formatModalidadesList } from "../lib/utils";
import { championshipService } from "../services/championshipService";
import { 
  Championship, 
  AthleteRegistration, 
  ChampionshipCategory, 
  ChampionshipSettings, 
  PaymentStatus, 
  RegistrationStatus,
  PixKeyType,
  PixConfig,
  ChampionshipStatus
} from "../types/championship";
import { useAppData } from "../contexts/AppDataContext";

const BELT_ORDER = [
  "Faixa Branca",
  "Faixa Amarela",
  "Faixa Vermelha",
  "Faixa Laranja",
  "Faixa Verde",
  "Faixa Roxa",
  "Faixa Marrom",
  "Faixa Preta"
];

export function ChampionshipDashboard() {
  const { config } = useAppData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("madeira_admin_authenticated") === "true";
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Tab State: 'overview' | 'registrations' | 'payments' | 'categories' | 'tournaments'
  const [activeTab, setActiveTab] = useState<"overview" | "registrations" | "payments" | "categories" | "tournaments">("overview");

  // Deletion Validation State
  const [deleteBlockedMessage, setDeleteBlockedMessage] = useState<string | null>(null);
  const [deletingChampionship, setDeletingChampionship] = useState<Championship | null>(null);

  // Edit Drawer State
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // General Settings Modal State (Google Apps Script & Admin PIN)
  const [showGeneralSettingsModal, setShowGeneralSettingsModal] = useState(false);

  // Championships & Registrations Data
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampId, setSelectedChampId] = useState<string>("");
  const [registrations, setRegistrations] = useState<AthleteRegistration[]>([]);
  const [categories, setCategories] = useState<ChampionshipCategory[]>([]);
  const [settings, setSettings] = useState<ChampionshipSettings>(championshipService.getSettings());

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPayment, setFilterPayment] = useState<string>("ALL");
  const [filterCategoryOnlyWithout, setFilterCategoryOnlyWithout] = useState(false);

  // Detailed Modal / Drawer
  const [selectedRegistration, setSelectedRegistration] = useState<AthleteRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingRegId, setRejectingRegId] = useState<string | null>(null);
  const [deletingRegistration, setDeletingRegistration] = useState<{ id: string; name: string } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ChampionshipCategory | null>(null);
  const [catNome, setCatNome] = useState("");
  const [catSexo, setCatSexo] = useState<"Masculino" | "Feminino" | "Misto">("Misto");
  const [catIdadeMin, setCatIdadeMin] = useState<string>("");
  const [catIdadeMax, setCatIdadeMax] = useState<string>("");
  const [catPesoMax, setCatPesoMax] = useState<string>("");

  // Championship Edit State (Settings Tab)
  const [champEditNome, setChampEditNome] = useState("");
  const [champEditSlug, setChampEditSlug] = useState("");
  const [champEditDesc, setChampEditDesc] = useState("");
  const [champEditData, setChampEditData] = useState("");
  const [champEditLocal, setChampEditLocal] = useState("");
  const [champEditAbertura, setChampEditAbertura] = useState("");
  const [champEditEncerramento, setChampEditEncerramento] = useState("");
  const [champEditStatus, setChampEditStatus] = useState<ChampionshipStatus>("INSCRICOES_ABERTAS");
  const [champEditValor, setChampEditValor] = useState<string>("");
  const [champEditModalidades, setChampEditModalidades] = useState<string>("");
  const [champEditRegulamento, setChampEditRegulamento] = useState("");
  const [champEditPermiteMenores, setChampEditPermiteMenores] = useState(true);
  const [editingChampId, setEditingChampId] = useState<string | null>(null);

  // Pix Edit State
  const [pixTipo, setPixTipo] = useState<PixKeyType>("TELEFONE");
  const [pixChave, setPixChave] = useState("");
  const [pixNome, setPixNome] = useState("");
  const [pixCidade, setPixCidade] = useState("");
  const [pixIncluirValor, setPixIncluirValor] = useState(true);
  const [pixInstrucoes, setPixInstrucoes] = useState("");

  // Google Sheets integration state
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState("");
  const [newAdminPin, setNewAdminPin] = useState("");
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Championship Drawer State
  const [isNewChampDrawerOpen, setIsNewChampDrawerOpen] = useState(false);
  const [newChampNome, setNewChampNome] = useState("");
  const [newChampData, setNewChampData] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [newChampLocal, setNewChampLocal] = useState("");
  const [newChampValor, setNewChampValor] = useState("");
  const [newChampDesc, setNewChampDesc] = useState("");
  const [newChampModalidades, setNewChampModalidades] = useState("Kata, Kumite");
  const [newChampPixTipo, setNewChampPixTipo] = useState<PixKeyType>("TELEFONE");
  const [newChampPixChave, setNewChampPixChave] = useState("21973681109");
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  // Modal PIX & WhatsApp para a linha de inscrição
  const [pixModalRegistration, setPixModalRegistration] = useState<AthleteRegistration | null>(null);
  const [modalPixPayload, setModalPixPayload] = useState("");
  const [modalPixQrUrl, setModalPixQrUrl] = useState("");
  const [modalPixCopied, setModalPixCopied] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carregar dados oficiais centralmente
  const loadAllData = async () => {
    try {
      const list = await championshipService.fetchChampionships();
      setChampionships(list);

      let activeId = selectedChampId;
      if ((!activeId || !list.some(c => c.id === activeId)) && list.length > 0) {
        activeId = list[0].id;
        setSelectedChampId(activeId);
      } else if (list.length === 0) {
        setSelectedChampId("");
      }

      if (activeId) {
        const [regs, cats] = await Promise.all([
          championshipService.fetchRegistrations(activeId),
          championshipService.fetchCategories(activeId)
        ]);
        setRegistrations(regs);
        setCategories(cats);

        const currentChamp = list.find(c => c.id === activeId);
        if (currentChamp) {
          setChampEditNome(currentChamp.nome);
          setChampEditSlug(currentChamp.slug);
          setChampEditDesc(currentChamp.descricao);
          setChampEditData(currentChamp.dataCampeonato);
          setChampEditLocal(currentChamp.local);
          setChampEditAbertura(currentChamp.aberturaInscricoes);
          setChampEditEncerramento(currentChamp.encerramentoInscricoes);
          setChampEditStatus(currentChamp.status);
          setChampEditValor(String(currentChamp.valorInscricao));
          setChampEditModalidades(currentChamp.modalidades ? currentChamp.modalidades.join(", ") : "");
          setChampEditRegulamento(currentChamp.regulamento || "");
          setChampEditPermiteMenores(currentChamp.permiteMenores);

          setPixTipo(currentChamp.configuracaoPix.tipoChave);
          setPixChave(currentChamp.configuracaoPix.chave);
          setPixNome(currentChamp.configuracaoPix.nomeRecebedor);
          setPixCidade(currentChamp.configuracaoPix.cidadeRecebedor);
          setPixIncluirValor(currentChamp.configuracaoPix.incluirValorNoQrCode);
          setPixInstrucoes(currentChamp.configuracaoPix.instrucoesAdicionais || "");
        }
      } else {
        setRegistrations([]);
        setCategories([]);
      }

      const appSettings = await championshipService.fetchSettings();
      setSettings(appSettings);
      setSheetWebhookUrl(appSettings.googleAppsScriptUrl || "");
    } catch (err) {
      console.error("[Dashboard] Erro ao carregar dados oficiais:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }

    // "storage" dispara apenas quando outra aba/janela altera o localStorage.
    // Não usamos mais evento customizado aqui para evitar recarregamento recursivo.
    const handleStorageUpdate = () => {
      if (isAuthenticated) {
        loadAllData();
      }
    };

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [isAuthenticated, selectedChampId]);

  // Fechar gavetas laterais com a tecla ESC
  useEffect(() => {
    if (!isNewChampDrawerOpen && !isEditDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNewChampDrawerOpen(false);
        setIsEditDrawerOpen(false);
        setEditingChampId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNewChampDrawerOpen, isEditDrawerOpen]);

  // Autenticação do Sensei com validação server-side
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingPin(true);
    try {
      const ok = await championshipService.verifyAdminPin(pinInput);
      if (ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("madeira_admin_authenticated", "true");
        setPinError(false);
        setPinInput("");
      } else {
        setPinError(true);
      }
    } catch {
      setPinError(true);
    } finally {
      setIsCheckingPin(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("madeira_admin_authenticated");
  };

  const isDateToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;
    return dateStr.slice(0, 10) === todayStr;
  };

  const formatChampDate = (dateStr?: string) => {
    if (!dateStr) return "Data a definir";
    try {
      const parts = dateStr.slice(0, 10).split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  const selectedChampionship = useMemo(() => {
    return championships.find(c => c.id === selectedChampId) || championships[0] || null;
  }, [championships, selectedChampId]);

  // Número oficial de WhatsApp do Dojo para envio de comprovantes
  const dojoWhatsappNumber = useMemo(() => {
    const raw = (selectedChampionship?.configuracaoPix.tipoChave === "TELEFONE" && selectedChampionship.configuracaoPix.chave)
      ? selectedChampionship.configuracaoPix.chave
      : (config?.whatsapp || "21973681109");
    const digits = raw.replace(/\D/g, "");
    return digits.startsWith("55") ? digits : `55${digits}`;
  }, [selectedChampionship, config]);

  // Efeito para gerar o QR Code Pix em tempo real para a linha de inscrição selecionada
  useEffect(() => {
    if (!pixModalRegistration) {
      setModalPixPayload("");
      setModalPixQrUrl("");
      setModalPixCopied(false);
      return;
    }

    const targetChamp = championships.find(c => c.id === pixModalRegistration.championshipId) || selectedChampionship;
    if (!targetChamp) return;

    try {
      const payload = generatePixCopiaECola({
        config: targetChamp.configuracaoPix,
        amount: targetChamp.configuracaoPix.incluirValorNoQrCode ? pixModalRegistration.valorInscricao : undefined,
        txid: "***"
      });

      setModalPixPayload(payload);
      generatePixQrCodeDataUrl(payload)
        .then(setModalPixQrUrl)
        .catch(err => console.error("Erro ao gerar QR Code PIX:", err));
    } catch (err) {
      console.error("Erro ao gerar payload PIX:", err);
    }
  }, [pixModalRegistration, championships, selectedChampionship]);

  // Resumo de todos os campeonatos da academia para visão consolidada
  const allChampionshipsSummary = useMemo(() => {
    const allRegs = championshipService.getRegistrations();
    return championships.map(c => {
      const cRegs = allRegs.filter(r => r.championshipId === c.id);
      const confirmed = cRegs.filter(r => r.paymentStatus === "PAGAMENTO_CONFIRMADO").length;
      const pendingConf = cRegs.filter(r => r.paymentStatus === "AGUARDANDO_CONFERENCIA").length;
      const pendingPay = cRegs.filter(r => r.paymentStatus === "AGUARDANDO_PAGAMENTO").length;
      const confirmedRev = cRegs
        .filter(r => r.paymentStatus === "PAGAMENTO_CONFIRMADO")
        .reduce((sum, r) => sum + r.valorInscricao, 0);
      const expectedRev = cRegs
        .filter(r => r.status !== "CANCELADA")
        .reduce((sum, r) => sum + r.valorInscricao, 0);
      const isToday = isDateToday(c.dataCampeonato);

      return {
        champ: c,
        total: cRegs.length,
        confirmed,
        pendingConf,
        pendingPay,
        confirmedRev,
        expectedRev,
        isToday
      };
    });
  }, [championships, registrations]);

  const todayCount = useMemo(() => {
    return championships.filter(c => isDateToday(c.dataCampeonato)).length;
  }, [championships]);

  // ==========================================
  // INDICADORES DA VISÃO GERAL (SPEC 08 item 1)
  // ==========================================
  const metrics = useMemo(() => {
    const totalInscritos = registrations.length;
    const aguardandoPagamento = registrations.filter(r => r.paymentStatus === "AGUARDANDO_PAGAMENTO").length;
    const aguardandoConferencia = registrations.filter(r => r.paymentStatus === "AGUARDANDO_CONFERENCIA").length;
    const confirmadas = registrations.filter(r => r.status === "CONFIRMADA").length;
    const canceladas = registrations.filter(r => r.status === "CANCELADA").length;

    // Valores financeiros
    const valorPrevisto = registrations
      .filter(r => r.status !== "CANCELADA")
      .reduce((acc, r) => acc + r.valorInscricao, 0);

    const valorConfirmado = registrations
      .filter(r => r.paymentStatus === "PAGAMENTO_CONFIRMADO")
      .reduce((acc, r) => acc + r.valorInscricao, 0);

    // Distribuição por Modalidade
    const porModalidade: Record<string, number> = {};
    registrations.forEach(r => {
      if (r.status !== "CANCELADA") {
        porModalidade[r.modalidade] = (porModalidade[r.modalidade] || 0) + 1;
      }
    });

    // Distribuição por Faixa
    const porFaixa: Record<string, number> = {};
    registrations.forEach(r => {
      if (r.status !== "CANCELADA") {
        const faixaPrefix = r.graduacao.split("(")[0].trim();
        porFaixa[faixaPrefix] = (porFaixa[faixaPrefix] || 0) + 1;
      }
    });

    // Distribuição por Categoria
    const porCategoria: Record<string, number> = {};
    let semCategoria = 0;
    registrations.forEach(r => {
      if (r.status !== "CANCELADA") {
        if (r.categoriaNome) {
          porCategoria[r.categoriaNome] = (porCategoria[r.categoriaNome] || 0) + 1;
        } else {
          semCategoria++;
        }
      }
    });

    // Distribuição Menores vs Adultos
    let menoresCount = 0;
    let adultosCount = 0;
    registrations.forEach(r => {
      if (r.status !== "CANCELADA") {
        if (r.isMenor) menoresCount++;
        else adultosCount++;
      }
    });

    return {
      totalInscritos,
      aguardandoPagamento,
      aguardandoConferencia,
      confirmadas,
      canceladas,
      valorPrevisto,
      valorConfirmado,
      porModalidade,
      porFaixa,
      porCategoria,
      semCategoria,
      menoresCount,
      adultosCount
    };
  }, [registrations]);

  // Lista Filtrada de Inscrições
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => {
      const matchSearch = searchTerm === "" || 
        r.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.telefone.includes(searchTerm) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
      const matchPayment = filterPayment === "ALL" || r.paymentStatus === filterPayment;
      const matchWithoutCategory = !filterCategoryOnlyWithout || !r.categoriaId;

      return matchSearch && matchStatus && matchPayment && matchWithoutCategory;
    });
  }, [registrations, searchTerm, filterStatus, filterPayment, filterCategoryOnlyWithout]);

  // Ações de Pagamento e Status
  const handleConfirmPayment = async (regId: string) => {
    try {
      const updated = await championshipService.adminUpdateStatus(regId, {
        paymentStatus: "PAGAMENTO_CONFIRMADO",
        status: "CONFIRMADA",
        adminName: "Sensei Madeira"
      });
      await loadAllData();
      if (selectedRegistration?.id === regId) setSelectedRegistration(updated);
      if (pixModalRegistration?.id === regId) setPixModalRegistration(updated);
      showToast(`Pagamento da inscrição ${regId} CONFIRMADO com sucesso!`);
    } catch (err: any) {
      showToast(`Erro: ${err.message}`);
    }
  };

  const handleOpenRejectModal = (regId: string) => {
    setRejectingRegId(regId);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleConfirmRejection = async () => {
    if (!rejectingRegId) return;
    try {
      const updated = await championshipService.adminUpdateStatus(rejectingRegId, {
        paymentStatus: "PAGAMENTO_REJEITADO",
        motivo: rejectionReason || "Comprovante divergente ou não localizado.",
        adminName: "Sensei Madeira"
      });
      await loadAllData();
      if (selectedRegistration?.id === rejectingRegId) setSelectedRegistration(updated);
      if (pixModalRegistration?.id === rejectingRegId) setPixModalRegistration(updated);
      setShowRejectModal(false);
      setRejectingRegId(null);
      showToast(`Pagamento da inscrição ${rejectingRegId} marcado como REJEITADO.`);
    } catch (err: any) {
      showToast(`Erro: ${err.message}`);
    }
  };

  const handleMarkAwaitingCheck = async (regId: string) => {
    try {
      const updated = await championshipService.adminUpdateStatus(regId, {
        paymentStatus: "AGUARDANDO_CONFERENCIA",
        adminName: "Sensei Madeira"
      });
      await loadAllData();
      if (selectedRegistration?.id === regId) setSelectedRegistration(updated);
      if (pixModalRegistration?.id === regId) setPixModalRegistration(updated);
      showToast(`Inscrição ${regId} marcada como Aguardando Conferência.`);
    } catch (err: any) {
      showToast(`Erro: ${err.message}`);
    }
  };

  const handleCancelRegistration = async (regId: string) => {
    const motivo = prompt("Motivo administrativo do cancelamento da inscrição:");
    if (motivo === null) return; // cancelou o prompt
    try {
      const updated = await championshipService.adminUpdateStatus(regId, {
        status: "CANCELADA",
        motivo: motivo || "Cancelamento administrativo pelo Dojo.",
        adminName: "Sensei Madeira"
      });
      await loadAllData();
      if (selectedRegistration?.id === regId) setSelectedRegistration(updated);
      showToast(`Inscrição ${regId} cancelada administrativamente.`);
    } catch (err: any) {
      showToast(`Erro: ${err.message}`);
    }
  };

  const handleAssignCategory = async (regId: string, catId: string) => {
    try {
      const updated = await championshipService.adminUpdateStatus(regId, {
        categoriaId: catId,
        adminName: "Sensei Madeira"
      });
      await loadAllData();
      if (selectedRegistration?.id === regId) setSelectedRegistration(updated);
      showToast(`Categoria atualizada para a inscrição ${regId}.`);
    } catch (err: any) {
      showToast(`Erro: ${err.message}`);
    }
  };

  const handleDeleteRegistration = (regId: string, name: string) => {
    setDeletingRegistration({ id: regId, name });
  };

  const confirmDeleteRegistration = async () => {
    if (!deletingRegistration) return;
    const target = deletingRegistration;
    try {
      // 1. Exclui do armazenamento do app
      championshipService.deleteRegistration(target.id);
      loadAllData();
      if (selectedRegistration?.id === target.id) {
        setSelectedRegistration(null);
      }

      // 2. Dispara remoção também na Planilha Oficial Google Sheets (via Apps Script Webhook)
      const hasWebhook = Boolean(settings.googleAppsScriptUrl?.trim() || sheetWebhookUrl.trim());
      if (hasWebhook) {
        championshipService.deleteRegistrationFromGoogleSheet(target.id).catch(err => {
          console.warn("Falha ao notificar exclusão ao Google Sheets:", err);
        });
      }

      showToast(`Inscrição ${target.id} (${target.name}) excluída com sucesso.`);
    } catch (err: any) {
      showToast(`Erro ao excluir inscrição: ${err.message}`);
    } finally {
      setDeletingRegistration(null);
    }
  };

  const handleInitSheets = async () => {
    const url = sheetWebhookUrl.trim() || settings.googleAppsScriptUrl?.trim();
    if (!url) {
      showToast("Configure e salve primeiro a URL do Webhook do Google Apps Script.");
      return;
    }
    setIsSyncing(true);
    try {
      await championshipService.initializeAllGoogleSheetsTabs();
      showToast("Comando de inicialização enviado! As abas oficiais estão sendo estruturadas na sua planilha.");
    } catch (e: any) {
      showToast(`Erro ao criar abas: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetCategories = () => {
    if (!confirm("Deseja restaurar as categorias oficiais unificadas (todas as modalidades Kata + Kumite organizadas por faixa etária)?")) return;
    try {
      championshipService.resetToDefaultCategories(selectedChampionship?.id);
      loadAllData();
      showToast("Categorias oficiais unificadas restauradas com sucesso!");
    } catch (err: any) {
      showToast(`Erro ao restaurar categorias: ${err.message}`);
    }
  };

  // Exportar CSV
  const handleExportCsv = () => {
    const csvContent = championshipService.exportRegistrationsToCsv(selectedChampId);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inscricoes_${selectedChampionship?.slug || "campeonato"}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Planilha CSV baixada com sucesso!");
  };

  const handleSyncAll = async () => {
    const url = sheetWebhookUrl.trim() || settings.googleAppsScriptUrl?.trim();
    if (!url) {
      showToast("Por favor, cole e salve a URL do Webhook do Apps Script primeiro.");
      return;
    }
    setIsSyncing(true);
    try {
      const res = await championshipService.syncAllRegistrationsToGoogleSheet(selectedChampId);
      showToast(`Sincronização concluída! ${res.success} inscrição(ões) enviada(s) para a planilha.`);
    } catch (e: any) {
      showToast(`Erro ao sincronizar: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Salvar Campeonato Editado
  const handleSaveChampionship = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = editingChampId || selectedChampId;
    const targetChamp = championships.find(c => c.id === targetId) || selectedChampionship;
    if (!targetChamp) return;

    try {
      const mods = champEditModalidades
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(Boolean);

      if (mods.length === 0) {
        throw new Error("Cadastre pelo menos uma modalidade para o campeonato.");
      }

      const val = parseFloat(champEditValor.replace(",", "."));
      if (isNaN(val) || val < 0) {
        throw new Error("Valor de inscrição inválido.");
      }

      const updated: Championship = {
        ...targetChamp,
        nome: champEditNome.trim(),
        slug: champEditSlug.trim(),
        descricao: champEditDesc.trim(),
        dataCampeonato: champEditData,
        local: champEditLocal.trim(),
        aberturaInscricoes: champEditAbertura,
        encerramentoInscricoes: champEditEncerramento,
        status: champEditStatus,
        valorInscricao: val,
        modalidades: mods,
        regulamento: champEditRegulamento,
        permiteMenores: champEditPermiteMenores,
        configuracaoPix: {
          tipoChave: pixTipo,
          chave: pixChave.trim(),
          nomeRecebedor: pixNome.trim(),
          cidadeRecebedor: pixCidade.trim(),
          incluirValorNoQrCode: pixIncluirValor,
          instrucoesAdicionais: pixInstrucoes
        }
      };

      await championshipService.saveChampionship(updated);
      await loadAllData();
      setIsEditDrawerOpen(false);
      setEditingChampId(null);
      showToast("Configurações do campeonato salvas com sucesso!");
    } catch (err: any) {
      showToast(`Erro ao salvar: ${err.message}`);
    }
  };

  // Abrir Drawer de Edição para um Campeonato
  const handleOpenEditDrawer = (champ?: Championship) => {
    const target = champ || selectedChampionship;
    if (!target) return;
    setEditingChampId(target.id);
    setSelectedChampId(target.id);

    setChampEditNome(target.nome);
    setChampEditSlug(target.slug);
    setChampEditDesc(target.descricao);
    setChampEditData(target.dataCampeonato);
    setChampEditLocal(target.local);
    setChampEditAbertura(target.aberturaInscricoes);
    setChampEditEncerramento(target.encerramentoInscricoes);
    setChampEditStatus(target.status);
    setChampEditValor(String(target.valorInscricao));
    setChampEditModalidades(target.modalidades ? target.modalidades.join(", ") : "");
    setChampEditRegulamento(target.regulamento || "");
    setChampEditPermiteMenores(target.permiteMenores);

    setPixTipo(target.configuracaoPix.tipoChave);
    setPixChave(target.configuracaoPix.chave);
    setPixNome(target.configuracaoPix.nomeRecebedor);
    setPixCidade(target.configuracaoPix.cidadeRecebedor);
    setPixIncluirValor(target.configuracaoPix.incluirValorNoQrCode);
    setPixInstrucoes(target.configuracaoPix.instrucoesAdicionais || "");

    setIsEditDrawerOpen(true);
  };

  // Visualizar Workspace do Campeonato
  const handleViewChampionship = (champ: Championship) => {
    setSelectedChampId(champ.id);
    setActiveTab("overview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Validação e Exclusão de Campeonato (CRUD)
  const handleDeleteChampionship = async (champ: Championship) => {
    setDeleteBlockedMessage(null);
    const champRegs = await championshipService.fetchRegistrations(champ.id);
    if (champRegs.length > 0) {
      setDeleteBlockedMessage(
        `Não é possível excluir o campeonato "${champ.nome}" porque ele já possui ${champRegs.length} inscrição(ões) cadastrada(s). Para excluir o torneio, é necessário primeiro cancelar ou remover todas as inscrições vinculadas.`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setDeletingChampionship(champ);
  };

  const confirmDeleteChampionship = async () => {
    if (!deletingChampionship) return;
    try {
      await championshipService.deleteChampionship(deletingChampionship.id);
      setDeletingChampionship(null);
      await loadAllData();
      showToast(`Campeonato "${deletingChampionship.nome}" excluído com sucesso.`);
    } catch (err: any) {
      showToast(`Erro ao excluir: ${err.message}`);
    }
  };

  // Salvar Categorias
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChampionship || !catNome.trim()) return;

    const newCat: ChampionshipCategory = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      championshipId: selectedChampionship.id,
      nome: catNome.trim(),
      modalidade: "Geral (Kata e Kumite)",
      sexo: catSexo,
      idadeMinima: catIdadeMin ? parseInt(catIdadeMin, 10) : undefined,
      idadeMaxima: catIdadeMax ? parseInt(catIdadeMax, 10) : undefined,
      pesoMaximo: catPesoMax ? parseFloat(catPesoMax.replace(",", ".")) : undefined
    };

    try {
      await championshipService.saveCategory(newCat);
      await loadAllData();
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCatNome("");
      setCatIdadeMin("");
      setCatIdadeMax("");
      setCatPesoMax("");
      showToast("Chave / Categoria salva com sucesso!");
    } catch (err: any) {
      showToast(`Erro ao salvar categoria: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Deseja realmente remover esta categoria?")) return;
    try {
      await championshipService.deleteCategory(catId);
      await loadAllData();
      showToast("Categoria excluída.");
    } catch (err: any) {
      showToast(`Erro ao excluir categoria: ${err.message}`);
    }
  };

  // Salvar Configurações Gerais e Google Sheets
  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedSettings: ChampionshipSettings = {
        ...settings,
        googleAppsScriptUrl: sheetWebhookUrl.trim(),
        adminPin: newAdminPin.trim() ? newAdminPin.trim() : settings.adminPin
      };
      await championshipService.saveSettings(updatedSettings);
      setSettings(updatedSettings);
      setNewAdminPin("");
      showToast("Configurações do sistema e Google Sheets atualizadas!");
    } catch (err: any) {
      showToast(`Erro ao salvar configurações: ${err.message}`);
    }
  };

  // Criar Novo Campeonato
  const handleCreateNewChampionship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChampNome.trim()) {
      showToast("Informe o nome do campeonato.");
      return;
    }

    const cleanSlug = newChampNome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `torneio-${Date.now()}`;

    const numVal = parseFloat(newChampValor.replace(",", ".")) || 0;
    const parsedMods = newChampModalidades
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(Boolean);

    const basePix: PixConfig = {
      tipoChave: newChampPixTipo,
      chave: newChampPixChave.trim() || "21973681109",
      nomeRecebedor: "MADEIRA KARATE",
      cidadeRecebedor: "RIO DE JANEIRO",
      incluirValorNoQrCode: true,
      instrucoesAdicionais: "Pagamento referente à inscrição no torneio. Envie o comprovante pelo WhatsApp do Dojo."
    };

    const newChamp: Championship = {
      id: `champ-${Date.now()}`,
      slug: cleanSlug,
      nome: newChampNome.trim(),
      descricao: newChampDesc.trim(),
      dataCampeonato: newChampData,
      local: newChampLocal.trim() || "Dojo Central Madeira Karate",
      aberturaInscricoes: new Date().toISOString(),
      encerramentoInscricoes: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "INSCRICOES_ABERTAS",
      valorInscricao: numVal,
      modalidades: parsedMods.length > 0 ? parsedMods : ["Kata", "Kumite"],
      configuracaoPix: basePix,
      regulamento: "Regras oficiais de competição baseadas nos critérios da JKA Brasil.",
      permiteMenores: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await championshipService.saveChampionship(newChamp);
      setSelectedChampId(newChamp.id);
      await loadAllData();
      setIsNewChampDrawerOpen(false);
      setNewChampNome("");
      setNewChampLocal("");
      setNewChampValor("");
      setNewChampDesc("");
      showToast(`Campeonato "${newChamp.nome}" cadastrado com sucesso!`);
    } catch (err: any) {
      showToast(`Erro ao criar campeonato: ${err.message}`);
    }
  };

  // ==========================================
  // TELA DE LOGIN / AUTENTICAÇÃO DO SENSEI
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-karate-red/10 text-karate-red rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-jp text-neutral-900">
              Painel de Gestão de Campeonatos
            </h1>
            <p className="text-xs text-neutral-500">
              Acesso restrito ao Sensei e à comissão organizadora do Madeira Karate.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 text-left">
                Senha / PIN de Acesso Administrativo
              </label>
              <input
                type="password"
                required
                placeholder="Digite o PIN do Sensei"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                disabled={isCheckingPin}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-center text-lg font-mono tracking-widest text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red disabled:opacity-50"
              />
              <div className="mt-2 text-left space-y-1">
                <span className="text-[11px] text-neutral-500 block">
                  * PIN administrativo padrão: <strong>1926</strong> (alterável no painel).
                </span>
                <p className="text-[10px] text-neutral-400 bg-neutral-50 p-2 rounded-lg border border-neutral-200 leading-relaxed">
                  Aviso de Segurança (SPEC 08): Autenticação operacional validada pelo backend do Dojo (modo administrativo para gestão técnica e conferência manual).
                </p>
              </div>
            </div>

            {pinError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg font-medium">
                PIN incorreto. Verifique com a comissão técnica.
              </p>
            )}

            <button
              type="submit"
              disabled={isCheckingPin}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold font-jp transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" /> 
              <span>{isCheckingPin ? "Validando no servidor..." : "Entrar no Dashboard"}</span>
            </button>
          </form>

          <Link to="/" className="inline-block text-xs text-neutral-400 hover:text-neutral-700">
            ← Retornar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD PRINCIPAL DO CAMPEONATO
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-neutral-700 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* HEADER PRINCIPAL UNIFICADO DO DASHBOARD                   */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-karate-red mb-1">
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Gestão Esportiva &amp; Financeira</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-jp text-neutral-900">
            Dashboard de Campeonatos
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Painel oficial do Dojo Madeira Karate: selecione ou crie um torneio para auditar atletas, conferir pagamentos e chaves.
          </p>
        </div>

        {/* Seletor Rápido de Torneio e Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2">
          {championships.length > 0 && (
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-500 pl-1.5 hidden sm:inline">Torneio:</span>
              <select
                value={selectedChampId}
                onChange={(e) => setSelectedChampId(e.target.value)}
                className="bg-transparent text-xs font-bold font-jp text-neutral-900 border-none outline-none cursor-pointer pr-2 max-w-[190px] sm:max-w-xs truncate"
                title="Trocar campeonato em foco"
              >
                {championships.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.status.replace("_", " ")})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setIsNewChampDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold font-jp transition-colors cursor-pointer shadow-sm"
            title="Criar um novo torneio (abre gaveta lateral diretamente diante da tela atual)"
          >
            <Plus className="w-4 h-4 text-karate-red" /> + Novo Torneio
          </button>

          {selectedChampionship && (
            <Link
              to={`/campeonatos/${selectedChampionship.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
              title="Abrir página pública de inscrições deste campeonato"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Página Pública
            </Link>
          )}

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            title="Exportar inscrições deste torneio para CSV"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            title="Sincroniza o status de pagamento e categorias com a planilha do Google"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sincronizando..." : "Sincronizar"}
          </button>

          <button
            onClick={() => setShowGeneralSettingsModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Configurações gerais do Google Sheets e PIN do Sensei"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" /> Planilha &amp; PIN
          </button>

          <button
            onClick={handleLogout}
            title="Sair do painel"
            className="p-2.5 text-neutral-400 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Label / Alerta na Tela se Exclusão Bloqueada por Inscrições */}
      {deleteBlockedMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl flex items-start justify-between text-red-900 shadow-md animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-red-700">
                Aviso: Exclusão Não Permitida
              </h4>
              <p className="text-xs font-semibold mt-0.5 leading-relaxed">
                {deleteBlockedMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDeleteBlockedMessage(null)}
            className="text-red-700 hover:text-red-900 font-bold text-xs p-1 cursor-pointer"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUADRO PRETO DO CAMPEONATO EM FOCO COM AÇÕES DIRETAS */}
      {selectedChampionship ? (
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 rounded-3xl p-6 text-white shadow-xl border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-karate-red text-white text-[11px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Trophy className="w-3.5 h-3.5" />
                Campeonato em Foco
              </span>

              {isDateToday(selectedChampionship.dataCampeonato) ? (
                <span className="px-3 py-1 bg-amber-400 text-neutral-950 text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 animate-pulse shadow-md">
                  <Flame className="w-3.5 h-3.5 text-karate-red" />
                  Acontecendo Hoje! ({formatChampDate(selectedChampionship.dataCampeonato)})
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] font-semibold rounded-lg flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  Data: {formatChampDate(selectedChampionship.dataCampeonato)}
                </span>
              )}

              <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] font-semibold rounded-lg flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {selectedChampionship.local}
              </span>

              <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] font-bold rounded-lg">
                R$ {selectedChampionship.valorInscricao.toFixed(2).replace(".", ",")}
              </span>

              <span className="px-2.5 py-1 bg-neutral-800 text-neutral-400 text-[11px] font-semibold rounded-lg">
                Status: {selectedChampionship.status.replace("_", " ")}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black font-jp text-white flex items-center gap-2">
                {selectedChampionship.nome}
              </h2>
              <p className="text-xs text-neutral-400 max-w-2xl mt-1 line-clamp-2">
                {selectedChampionship.descricao}
              </p>
            </div>
          </div>

          {/* Ações no Quadro Preto: Botão de Novo Torneio, Edição (abre Drawer) e Excluir */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewChampDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs font-jp transition-colors cursor-pointer border border-neutral-700 shadow-sm"
              title="Adicionar novo torneio via gaveta lateral"
            >
              <Plus className="w-4 h-4 text-karate-red" />
              <span>+ Novo Torneio</span>
            </button>

            <button
              onClick={() => handleOpenEditDrawer(selectedChampionship)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs font-jp transition-colors cursor-pointer shadow-md"
              title="Editar parâmetros, datas, regulamento e chave PIX deste campeonato via gaveta lateral"
            >
              <Edit2 className="w-4 h-4" />
              <span>Editar Campeonato</span>
            </button>

            <button
              onClick={() => handleDeleteChampionship(selectedChampionship)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-neutral-800 hover:bg-red-900/40 text-neutral-400 hover:text-red-300 border border-neutral-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Excluir este campeonato (apenas permitido se não houver inscrições)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 sm:p-16 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-300 text-center space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-400">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-extrabold font-jp text-neutral-900 text-xl">Nenhum campeonato cadastrado</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Não há campeonatos registrados na base oficial do Dojo. Crie o primeiro campeonato para iniciar a gestão de atletas e conferência de pagamentos.
            </p>
          </div>
          <button
            onClick={() => setIsNewChampDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold font-jp transition-colors cursor-pointer shadow-md"
            title="Criar campeonato"
          >
            <Plus className="w-4 h-4 text-karate-red" />
            <span>Criar campeonato</span>
          </button>
        </div>
      )}

      {/* Tabs de Navegação Unificada */}
      <div className="flex border-b border-neutral-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-karate-red text-karate-red"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Trophy className="w-4 h-4" /> Visão Geral
        </button>

        <button
          onClick={() => setActiveTab("registrations")}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === "registrations"
              ? "border-karate-red text-karate-red"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Users className="w-4 h-4" /> Inscrições ({registrations.length})
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === "payments"
              ? "border-karate-red text-karate-red"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <DollarSign className="w-4 h-4" /> Pagamentos
          {metrics.aguardandoConferencia > 0 && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {metrics.aguardandoConferencia}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === "categories"
              ? "border-karate-red text-karate-red"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Tag className="w-4 h-4" /> Categorias ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab("tournaments")}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === "tournaments"
              ? "border-karate-red text-karate-red"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Layers className="w-4 h-4" /> Todos os Torneios ({championships.length})
        </button>
      </div>

          {/* ======================================================== */}
          {/* ABA 1: VISÃO GERAL DO CAMPEONATO                         */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
          {/* Banner de Torneios de Hoje (se houver) */}
          {todayCount > 0 && (
            <div className="p-4 bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border border-amber-300 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Flame className="w-5 h-5 text-karate-red" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-900">
                    Dia de Competição: {todayCount} campeonato(s) marcado(s) para HOJE no Dojo!
                  </h4>
                  <p className="text-xs text-neutral-600">
                    Confira as inscrições, pesagens e chaves dos atletas em disputa no tatame.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 bg-amber-400 text-neutral-950 font-black text-xs rounded-xl uppercase tracking-wider">
                  Data de Hoje
                </span>
              </div>
            </div>
          )}

          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Total de Inscritos</span>
              <p className="text-3xl font-extrabold font-mono text-neutral-900">{metrics.totalInscritos}</p>
              <span className="text-[11px] text-neutral-400 block">Atletas registrados</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Inscrições Confirmadas</span>
              <p className="text-3xl font-extrabold font-mono text-emerald-600">{metrics.confirmadas}</p>
              <span className="text-[11px] text-emerald-700 block font-medium">Pagamento verificado</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Aguardando Conferência</span>
              <p className="text-3xl font-extrabold font-mono text-purple-600">{metrics.aguardandoConferencia}</p>
              <span className="text-[11px] text-purple-700 block font-medium">Comprovante enviado</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
              <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Aguardando Pagamento</span>
              <p className="text-3xl font-extrabold font-mono text-amber-600">{metrics.aguardandoPagamento}</p>
              <span className="text-[11px] text-amber-700 block font-medium">Sem comprovante ainda</span>
            </div>
          </div>

          {/* Cards Financeiros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
                <span>Receita Confirmada (Baixada)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                R$ {metrics.valorConfirmado.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-neutral-400">
                Correspondente a {metrics.confirmadas} inscrições com pagamento conferido.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase">
                <span>Receita Prevista (Total)</span>
                <DollarSign className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900">
                R$ {metrics.valorPrevisto.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-neutral-500">
                Considerando todos os atletas inscritos (exceto cancelados).
              </p>
            </div>
          </div>

          {/* Gráficos / Distribuições */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Participação Esportiva e Perfil */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-jp text-neutral-900 border-b border-neutral-100 pb-2">
                Participação & Faixa Etária
              </h3>
              {metrics.totalInscritos === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">Nenhum atleta inscrito ainda.</p>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Participação Integral Unificada
                    </span>
                    <p className="text-xs text-emerald-950 font-medium">
                      100% dos atletas ({metrics.totalInscritos}) competem em <strong>todas as modalidades do campeonato ({formatModalidadesList(selectedChampionship?.modalidades)})</strong>.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-neutral-50">
                      <span className="text-neutral-700">Menores de 18 anos:</span>
                      <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                        {metrics.menoresCount} ({Math.round((metrics.menoresCount / (metrics.totalInscritos || 1)) * 100)}%)
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-lg bg-neutral-50">
                      <span className="text-neutral-700">Adultos / Masters (18+ anos):</span>
                      <span className="bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded-full">
                        {metrics.adultosCount} ({Math.round((metrics.adultosCount / (metrics.totalInscritos || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Distribuição por Faixa */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-jp text-neutral-900 border-b border-neutral-100 pb-2">
                Distribuição por Faixa
              </h3>
              {Object.keys(metrics.porFaixa).length === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">Nenhum atleta inscrito ainda.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(metrics.porFaixa).map(([faixa, count]) => (
                    <div key={faixa} className="flex justify-between items-center text-xs p-1.5 rounded-lg bg-neutral-50">
                      <span className="text-neutral-700 font-medium">{faixa}</span>
                      <span className="bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Distribuição por Categoria */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h3 className="text-sm font-bold font-jp text-neutral-900">
                  Distribuição por Categoria
                </h3>
                {metrics.semCategoria > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {metrics.semCategoria} sem categoria
                  </span>
                )}
              </div>
              {Object.keys(metrics.porCategoria).length === 0 && metrics.semCategoria === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">Nenhuma categoria atribuída.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(metrics.porCategoria).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between items-center text-xs p-1.5 rounded-lg bg-neutral-50">
                      <span className="text-neutral-700 truncate max-w-[170px]" title={cat}>{cat}</span>
                      <span className="bg-karate-red/10 text-karate-red font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {count}
                      </span>
                    </div>
                  ))}
                  {metrics.semCategoria > 0 && (
                    <div className="flex justify-between items-center text-xs p-1.5 rounded-lg bg-amber-50 text-amber-900 font-medium">
                      <span>Sem Categoria Atribuída</span>
                      <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {metrics.semCategoria}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: INSCRIÇÕES                                        */}
      {/* ======================================================== */}
      {activeTab === "registrations" && (
        <div className="space-y-4">
          {/* Filtros e Busca */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por código, nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-700"
              >
                <option value="ALL">Status: Todos</option>
                <option value="RECEBIDA">Status: Recebida</option>
                <option value="CONFIRMADA">Status: Confirmada</option>
                <option value="CANCELADA">Status: Cancelada</option>
              </select>

              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-700"
              >
                <option value="ALL">Pagamento: Todos</option>
                <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                <option value="AGUARDANDO_CONFERENCIA">Aguardando Conferência</option>
                <option value="PAGAMENTO_CONFIRMADO">Pagamento Confirmado</option>
                <option value="PAGAMENTO_REJEITADO">Pagamento Rejeitado</option>
              </select>

              <label className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium bg-neutral-50 px-3 py-2 border border-neutral-300 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterCategoryOnlyWithout}
                  onChange={(e) => setFilterCategoryOnlyWithout(e.target.checked)}
                  className="rounded text-karate-red focus:ring-karate-red"
                />
                <span>Apenas sem categoria</span>
              </label>
            </div>
          </div>

          {/* Tabela de Inscrições */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Atleta</th>
                    <th className="py-3 px-4">Idade</th>
                    <th className="py-3 px-4">Faixa</th>
                    <th className="py-3 px-4">Chave / Categoria</th>
                    <th className="py-3 px-4">Inscrição</th>
                    <th className="py-3 px-4">Pagamento</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-400">
                        Nenhuma inscrição encontrada com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((r) => (
                      <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-neutral-900">{r.id}</td>
                        <td className="py-3 px-4">
                          <strong className="text-neutral-900 block font-semibold">{r.nomeCompleto}</strong>
                          <span className="text-[11px] text-neutral-400">{r.telefone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-neutral-800">{r.idadeNaDataCampeonato} anos</span>
                          {r.isMenor && (
                            <span className="text-[10px] text-purple-700 block font-bold">Menor</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-neutral-700">{r.graduacao.split("(")[0]}</td>
                        <td className="py-3 px-4">
                          <select
                            value={r.categoriaId || ""}
                            onChange={(e) => handleAssignCategory(r.id, e.target.value)}
                            className="text-xs p-1.5 bg-neutral-50 border border-neutral-300 rounded font-medium text-neutral-700 max-w-[200px] truncate"
                          >
                            <option value="">Sem Categoria (Definir)</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            r.status === "CONFIRMADA"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : r.status === "CANCELADA"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            r.paymentStatus === "PAGAMENTO_CONFIRMADO"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : r.paymentStatus === "PAGAMENTO_REJEITADO"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : r.paymentStatus === "AGUARDANDO_CONFERENCIA"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {r.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Botão de Geração de QR Code PIX & WhatsApp */}
                          <button
                            onClick={() => setPixModalRegistration(r)}
                            title="Gerar QR Code PIX & Cobrar/Enviar WhatsApp"
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                              r.paymentStatus === "PAGAMENTO_CONFIRMADO"
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : r.paymentStatus === "AGUARDANDO_CONFERENCIA"
                                ? "bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-extrabold"
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5 text-karate-red" />
                            <span>PIX / Zap</span>
                          </button>

                          <button
                            onClick={() => setSelectedRegistration(r)}
                            title="Ver detalhes completos"
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRegistration(r.id, r.nomeCompleto)}
                            title="Excluir inscrição (desistência do atleta)"
                            className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 bg-red-50 hover:border-red-600 border border-red-200 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: PAGAMENTOS (SPEC 08 item 12)                      */}
      {/* ======================================================== */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Conferência Manual:</strong> Verifique o extrato da conta bancária/PIX do Dojo antes de confirmar o pagamento do atleta.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Atleta</th>
                    <th className="py-3 px-4">Categoria / Chave</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4">Status Pagamento</th>
                    <th className="py-3 px-4">Data Inscrição</th>
                    <th className="py-3 px-4 text-right">Ações de Conferência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-400">
                        Nenhum pagamento registrado.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((r) => {
                      const cleanPhone = r.telefone.replace(/\D/g, "");
                      const whatsappLink = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                        `Olá ${r.nomeCompleto}, tudo bem? Aqui é do Madeira Karate referente à sua inscrição ${r.id} no campeonato.`
                      )}`;

                      return (
                        <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-neutral-900">{r.id}</td>
                          <td className="py-3 px-4">
                            <strong className="text-neutral-900 block font-semibold">{r.nomeCompleto}</strong>
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline inline-flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" /> WhatsApp: {r.telefone}
                            </a>
                          </td>
                          <td className="py-3 px-4 font-medium text-neutral-700">
                            {r.categoriaNome ? (
                              <span className="font-semibold text-neutral-800">{r.categoriaNome}</span>
                            ) : (
                              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                                Sem Categoria
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                            R$ {r.valorInscricao.toFixed(2).replace(".", ",")}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              r.paymentStatus === "PAGAMENTO_CONFIRMADO"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : r.paymentStatus === "PAGAMENTO_REJEITADO"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : r.paymentStatus === "AGUARDANDO_CONFERENCIA"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {r.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                            {new Date(r.dataHoraInscricao).toLocaleDateString("pt-BR")} {new Date(r.dataHoraInscricao).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setPixModalRegistration(r)}
                              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Ver QR Code PIX e Enviar WhatsApp"
                            >
                              <QrCode className="w-3.5 h-3.5 text-karate-red" />
                              <span>PIX / Zap</span>
                            </button>

                            {r.paymentStatus !== "PAGAMENTO_CONFIRMADO" && (
                              <button
                                onClick={() => handleConfirmPayment(r.id)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                title="Confirmar pagamento e ativar inscrição"
                              >
                                Confirmar
                              </button>
                            )}

                            {r.paymentStatus === "AGUARDANDO_PAGAMENTO" && (
                              <button
                                onClick={() => handleMarkAwaitingCheck(r.id)}
                                className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                title="Marcar que atleta enviou comprovante"
                              >
                                Em Conferência
                              </button>
                            )}

                            {r.paymentStatus !== "PAGAMENTO_REJEITADO" && (
                              <button
                                onClick={() => handleOpenRejectModal(r.id)}
                                className="px-2 py-1.5 bg-neutral-100 hover:bg-red-100 text-neutral-600 hover:text-red-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                title="Rejeitar pagamento"
                              >
                                Rejeitar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 4: CATEGORIAS (SPEC 08 item 8 - Chaves de Competição) */}
      {/* ======================================================== */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-3">
            <div>
              <h2 className="text-lg font-bold font-jp text-neutral-900">Chaves e Categorias Oficiais</h2>
              <p className="text-xs text-neutral-500">
                Como todos os atletas participam de todas as modalidades configuradas ({formatModalidadesList(selectedChampionship?.modalidades)}), as categorias organizam as chaves oficiais de disputa por faixa etária, sexo, graduação e peso.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetCategories}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                title="Restaura a lista oficial de chaves unificadas (sem Kata/Kumite separados)"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurar Chaves Oficiais
              </button>

              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCatNome("");
                  setCatIdadeMin("");
                  setCatIdadeMax("");
                  setCatPesoMax("");
                  setShowCategoryModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-karate-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" /> Nova Categoria
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const countAthletes = registrations.filter(r => r.categoriaId === c.id && r.status !== "CANCELADA").length;
              return (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Chave Geral • Kata + Kumite
                      </span>
                      <h3 className="font-bold text-neutral-900 text-sm mt-1">{c.nome}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(c);
                          setCatNome(c.nome);
                          setCatSexo(c.sexo || "Misto");
                          setCatIdadeMin(c.idadeMinima ? String(c.idadeMinima) : "");
                          setCatIdadeMax(c.idadeMaxima ? String(c.idadeMaxima) : "");
                          setCatPesoMax(c.pesoMaximo ? String(c.pesoMaximo) : "");
                          setShowCategoryModal(true);
                        }}
                        className="p-1 text-neutral-400 hover:text-neutral-800 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-1 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    <p><strong>Sexo:</strong> {c.sexo || "Misto"}</p>
                    <p><strong>Faixa Etária:</strong> {c.idadeMinima ? `${c.idadeMinima} anos` : "Livre"} até {c.idadeMaxima ? `${c.idadeMaxima} anos` : "Livre"}</p>
                    {c.pesoMaximo && <p><strong>Peso Máximo:</strong> até {c.pesoMaximo} kg</p>}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-neutral-500">Inscritos vinculados:</span>
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                      {countAthletes} atletas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 5: TODOS OS TORNEIOS (GRADE DE CARDS COM CRUD)       */}
      {/* ======================================================== */}
      {activeTab === "tournaments" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
            <div>
              <h2 className="text-lg font-extrabold font-jp text-neutral-900">
                Campeonatos Cadastrados ({championships.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Cada card representa um torneio independente. Utilize os botões para auditar, editar ou criar um novo torneio via gaveta lateral.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewChampDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-karate-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                title="Cadastrar um novo torneio via gaveta lateral"
              >
                <Plus className="w-3.5 h-3.5" /> + Adicionar Torneio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allChampionshipsSummary.map((item) => (
              <div
                key={item.champ.id}
                className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                  item.champ.id === selectedChampId ? "border-neutral-900 ring-2 ring-neutral-900/10" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="p-6 space-y-4">
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.isToday
                        ? "bg-amber-400 text-neutral-950 font-black animate-pulse"
                        : "bg-neutral-100 text-neutral-700"
                    }`}>
                      {item.isToday ? "🔥 HOJE" : `📅 ${formatChampDate(item.champ.dataCampeonato)}`}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.champ.id === selectedChampId && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded-lg">
                          Ativo
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-lg">
                        {item.champ.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Informações Básicas */}
                  <div>
                    <h3 className="font-extrabold font-jp text-lg text-neutral-900 line-clamp-2 leading-snug">
                      {item.champ.nome}
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{item.champ.local}</span>
                    </p>
                  </div>

                  {item.champ.descricao && (
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      {item.champ.descricao}
                    </p>
                  )}

                  {/* Métricas do Torneio em Grid 2x2 */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-neutral-100 text-xs">
                    <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Inscritos</span>
                      <span className="font-black font-mono text-neutral-900 text-lg">{item.total}</span>
                      <span className="text-[10px] text-emerald-600 block font-medium">{item.confirmed} confirmados</span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Arrecadação</span>
                      <span className="font-black font-mono text-emerald-600 text-lg">R$ {item.confirmedRev.toFixed(0)}</span>
                      <span className="text-[10px] text-neutral-400 block font-medium">previsto R$ {item.expectedRev.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Barra de Ações do CRUD no Card */}
                <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center gap-2">
                  <button
                    onClick={() => handleViewChampionship(item.champ)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5 ${
                      item.champ.id === selectedChampId
                        ? "bg-neutral-800 text-white"
                        : "bg-neutral-900 hover:bg-neutral-800 text-white"
                    }`}
                    title="Visualizar inscrições, pagamentos e categorias deste campeonato"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.champ.id === selectedChampId ? "Em Foco" : "Visualizar"}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditDrawer(item.champ)}
                    className="py-2.5 px-3 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    title="Editar configurações deste campeonato via gaveta lateral"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => handleDeleteChampionship(item.champ)}
                    className="py-2.5 px-3 bg-white hover:bg-red-50 text-neutral-400 hover:text-red-600 border border-neutral-200 hover:border-red-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    title="Excluir campeonato (apenas se não houver inscrições)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Inscrição */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Detalhes da Inscrição</span>
                <h3 className="font-bold font-mono text-neutral-900 text-xl">{selectedRegistration.id}</h3>
              </div>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer font-bold text-xs"
              >
                Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-2xl">
                <p><strong>Atleta:</strong> {selectedRegistration.nomeCompleto}</p>
                <p><strong>Nascimento:</strong> {selectedRegistration.dataNascimento}</p>
                <p><strong>Idade no Campeonato:</strong> {selectedRegistration.idadeNaDataCampeonato} anos {selectedRegistration.isMenor ? "(Menor)" : ""}</p>
                <p><strong>Sexo:</strong> {selectedRegistration.sexo}</p>
                <p><strong>Graduação:</strong> {selectedRegistration.graduacao}</p>
                <p><strong>Peso:</strong> {selectedRegistration.peso} kg</p>
                <p><strong>Modalidade:</strong> <span className="text-karate-red font-bold">{selectedRegistration.modalidade}</span></p>
                <p><strong>Valor:</strong> R$ {selectedRegistration.valorInscricao.toFixed(2)}</p>
                <p><strong>Telefone:</strong> {selectedRegistration.telefone}</p>
                <p><strong>E-mail:</strong> {selectedRegistration.email}</p>
                {selectedRegistration.categoriaNome && (
                  <p className="col-span-2"><strong>Categoria:</strong> {selectedRegistration.categoriaNome}</p>
                )}
                {selectedRegistration.nomeResponsavel && (
                  <p className="col-span-2 pt-1 border-t border-neutral-200">
                    <strong>Responsável Legal:</strong> {selectedRegistration.nomeResponsavel} ({selectedRegistration.telefoneResponsavel})
                  </p>
                )}
                {selectedRegistration.observacoes && (
                  <p className="col-span-2 pt-1">
                    <strong>Observações:</strong> {selectedRegistration.observacoes}
                  </p>
                )}
              </div>

              {/* Status e Ações */}
              <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span>Status Inscrição: <strong>{selectedRegistration.status}</strong></span>
                  <span>Status Pagamento: <strong>{selectedRegistration.paymentStatus}</strong></span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setPixModalRegistration(selectedRegistration)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm inline-flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Gerar QR Code PIX & WhatsApp</span>
                  </button>

                  {selectedRegistration.paymentStatus !== "PAGAMENTO_CONFIRMADO" && (
                    <button
                      onClick={() => handleConfirmPayment(selectedRegistration.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 cursor-pointer"
                    >
                      Confirmar Pagamento
                    </button>
                  )}

                  {selectedRegistration.status !== "CANCELADA" && (
                    <button
                      onClick={() => handleCancelRegistration(selectedRegistration.id)}
                      className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-200 cursor-pointer"
                    >
                      Cancelar Inscrição
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteRegistration(selectedRegistration.id, selectedRegistration.nomeCompleto)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Excluir inscrição definitivamente em caso de desistência"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir Inscrição
                  </button>
                </div>
              </div>

              {/* Histórico / Audit Log */}
              {selectedRegistration.auditLogs && selectedRegistration.auditLogs.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">Histórico de Auditoria:</span>
                  <div className="space-y-1 bg-neutral-50 p-3 rounded-xl">
                    {selectedRegistration.auditLogs.map((log, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-neutral-600">
                        <span>{log.details}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(log.timestamp).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejeição de Pagamento */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold font-jp text-neutral-900 text-base">Rejeitar Pagamento</h3>
            <p className="text-xs text-neutral-600">
              Informe o motivo da não confirmação do comprovante (ex: comprovante ilegível, valor divergente ou transferência não compensada):
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Comprovante ilegível. Favor reenviar no WhatsApp."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer"
              >
                Rejeitar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar Categoria */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold font-jp text-neutral-900 text-base">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Nome da Chave / Categoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mirim Misto (Até 10 Anos) — Todas as Faixas"
                  value={catNome}
                  onChange={(e) => setCatNome(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                />
              </div>

              {/* Informação sobre o Formato Unificado */}
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-950 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-[11px] leading-tight font-medium">
                  <strong>Formato Unificado:</strong> Chave de disputa válida para todas as modalidades do evento ({formatModalidadesList(selectedChampionship?.modalidades)}).
                </span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Sexo *</label>
                <select
                  value={catSexo}
                  onChange={(e) => setCatSexo(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                >
                  <option value="Misto">Misto</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Idade Mínima</label>
                  <input
                    type="number"
                    placeholder="Ex: 8"
                    value={catIdadeMin}
                    onChange={(e) => setCatIdadeMin(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Idade Máxima</label>
                  <input
                    type="number"
                    placeholder="Ex: 10"
                    value={catIdadeMax}
                    onChange={(e) => setCatIdadeMax(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Peso Máximo (kg, opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: 55.0"
                  value={catPesoMax}
                  onChange={(e) => setCatPesoMax(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-karate-red text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Script Google Apps Script */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-bold font-jp text-neutral-900 text-base">Código do Google Apps Script</h3>
              <button onClick={() => setShowScriptModal(false)} className="text-neutral-400 hover:text-neutral-700 font-bold text-xs cursor-pointer">
                Fechar
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Para receber as inscrições diretamente na sua planilha Google em tempo real, acesse a planilha do Madeira Karate, clique em <strong>Extensões &gt; Apps Script</strong>, cole o código abaixo e clique em <strong>Implantar &gt; Nova implantação &gt; App da Web</strong> (com permissão de acesso para Qualquer Pessoa). Depois, cole a URL gerada no campo correspondente nas configurações.
            </p>

            <pre className="flex-1 overflow-y-auto p-4 bg-neutral-900 text-neutral-200 text-[11px] font-mono rounded-xl leading-relaxed select-all">
              {championshipService.getGoogleAppsScriptSnippet()}
            </pre>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(championshipService.getGoogleAppsScriptSnippet());
                  showToast("Código copiado para a área de transferência!");
                }}
                className="px-4 py-2 bg-karate-red text-white rounded-xl text-xs font-bold hover:bg-red-700 cursor-pointer"
              >
                Copiar Código Completo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Exclusão de Inscrição */}
      {deletingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold font-jp text-neutral-900 text-base">Excluir Inscrição</h3>
                <span className="text-xs text-neutral-400 font-mono font-bold">{deletingRegistration.id}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Deseja realmente excluir permanentemente a inscrição de <strong>{deletingRegistration.name}</strong>?
            </p>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] leading-relaxed">
              Esta ação removerá definitivamente o registro do campeonato em caso de desistência do atleta.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRegistration(null)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteRegistration}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER LATERAL: CADASTRO DE NOVO TORNEIO / CAMPEONATO   */}
      {/* ======================================================== */}
      {typeof document !== "undefined" && isNewChampDrawerOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex justify-end items-stretch overflow-hidden animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label="Novo Torneio ou Campeonato">
          {/* Backdrop semi-transparente que escurece a tela atual e fecha ao clicar fora */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNewChampDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Painel do Drawer lateral que desliza diante da tela atual */}
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200 animate-in slide-in-from-right duration-300">
            {/* Header do Drawer */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-karate-red flex items-center justify-center shrink-0 shadow-sm">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold font-jp text-base text-white">
                    Novo Torneio / Campeonato
                  </h3>
                  <span className="text-[11px] text-neutral-400 block">
                    Cadastre um novo torneio com gestão isolada de inscrições e chaves
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewChampDrawerOpen(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Fechar gaveta"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com Scroll Suave */}
            <form onSubmit={handleCreateNewChampionship} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Cada torneio possui gestão independente: atletas, categorias e conferência de pagamentos.
                  </span>
                </div>

                {/* Informações Principais */}
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1.5 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-karate-red" />
                    Dados Gerais da Competição
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nome do Torneio / Campeonato *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 2º Campeonato Interno Madeira Karate 2026"
                      value={newChampNome}
                      onChange={(e) => setNewChampNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center justify-between">
                        <span>Data de Realização *</span>
                        {isDateToday(newChampData) && (
                          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            Marcado para Hoje!
                          </span>
                        )}
                      </label>
                      <input
                        type="date"
                        required
                        value={newChampData}
                        onChange={(e) => setNewChampData(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Taxa de Inscrição (R$) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="75,00"
                        value={newChampValor}
                        onChange={(e) => setNewChampValor(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Local do Evento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dojo Central Madeira Karate — Rio de Janeiro / RJ"
                      value={newChampLocal}
                      onChange={(e) => setNewChampLocal(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Modalidades do Campeonato * (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kata, Kumite"
                      value={newChampModalidades}
                      onChange={(e) => setNewChampModalidades(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      A inscrição do atleta é única e válida para todas as modalidades configuradas neste evento.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Breve Descrição Institucional
                    </label>
                    <textarea
                      rows={2}
                      value={newChampDesc}
                      onChange={(e) => setNewChampDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                      placeholder="Finalidade pedagógica, regras JKA, etc."
                    />
                  </div>

                  {/* Bloco PIX Inicial com Validação e Feedback */}
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                    <div className="flex items-center gap-2 text-karate-red">
                      <QrCode className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                        Chave PIX Inicial deste Torneio
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Tipo de Chave *</label>
                        <select
                          value={newChampPixTipo}
                          onChange={(e) => setNewChampPixTipo(e.target.value as PixKeyType)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          <option value="TELEFONE">Telefone / Celular</option>
                          <option value="CPF">CPF</option>
                          <option value="CNPJ">CNPJ</option>
                          <option value="EMAIL">E-mail</option>
                          <option value="ALEATORIA">Chave Aleatória</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Chave PIX *</label>
                        <input
                          type="text"
                          required
                          value={newChampPixChave}
                          onChange={(e) => setNewChampPixChave(e.target.value)}
                          placeholder={
                            newChampPixTipo === "TELEFONE"
                              ? "Ex: 21973681109"
                              : newChampPixTipo === "CPF"
                              ? "Ex: 12345678900"
                              : newChampPixTipo === "CNPJ"
                              ? "Ex: 12345678000199"
                              : newChampPixTipo === "EMAIL"
                              ? "Ex: contato@madeirakarate.com"
                              : "Ex: 123e4567-e89b-12d3-a456-426614174000"
                          }
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    {newChampPixTipo === "TELEFONE" && (
                      <div className="mt-1 space-y-1">
                        {(() => {
                          const digits = newChampPixChave.replace(/\D/g, "");
                          if (digits.length === 0) {
                            return (
                              <span className="text-[10px] text-neutral-400 block">
                                Digite o DDD + celular (ex: 21973681109).
                              </span>
                            );
                          }
                          if (digits.length < 10) {
                            return (
                              <span className="text-[11px] text-amber-700 font-semibold block bg-amber-50 p-2 rounded-lg border border-amber-200">
                                ⚠️ Atenção: {digits.length} dígito(s). Faltam dígitos do DDD ou do telefone para validação no DICT do Banco Central.
                              </span>
                            );
                          }
                          const formatted = digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
                          return (
                            <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-[11px] text-emerald-800">
                              <span className="font-bold block">✓ Formato internacional DICT do Banco Central:</span>
                              <span className="font-mono font-bold text-xs">{formatted}</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <span className="text-[10px] text-neutral-400 block">
                      Após a criação, você também poderá alterar todos os dados pela gaveta de edição do campeonato.
                    </span>
                  </div>
                </div>

                {/* Rodapé Fixo */}
                <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2 sticky bottom-0 bg-white py-3">
                  <button
                    type="button"
                    onClick={() => setIsNewChampDrawerOpen(false)}
                    className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-karate-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Campeonato</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Modal de Cobrança / Pagamento PIX e WhatsApp */}
      {pixModalRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-neutral-100 max-h-[92vh] overflow-y-auto">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5 text-karate-red" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                      {pixModalRegistration.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pixModalRegistration.paymentStatus === "PAGAMENTO_CONFIRMADO"
                        ? "bg-emerald-100 text-emerald-800"
                        : pixModalRegistration.paymentStatus === "AGUARDANDO_CONFERENCIA"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {pixModalRegistration.paymentStatus}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-neutral-900 mt-0.5">
                    {pixModalRegistration.nomeCompleto}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPixModalRegistration(null)}
                className="text-neutral-400 hover:text-neutral-700 font-bold text-xs cursor-pointer p-1"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Informações da Inscrição e Valores */}
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-neutral-500 block text-[11px]">Valor da Inscrição:</span>
                <span className="text-lg font-black font-mono text-neutral-900">
                  R$ {pixModalRegistration.valorInscricao.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 block text-[11px]">Telefone do Atleta:</span>
                <span className="font-semibold text-neutral-800 font-mono">
                  {pixModalRegistration.telefone}
                </span>
              </div>
            </div>

            {/* Bloco QR Code PIX */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col items-center gap-3">
              <span className="text-xs font-bold text-neutral-700">QR Code Oficial do PIX</span>

              {modalPixQrUrl ? (
                <div className="p-2 bg-white rounded-2xl border border-neutral-200 shadow-inner">
                  <img
                    src={modalPixQrUrl}
                    alt="QR Code Pix"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-neutral-100 rounded-2xl flex items-center justify-center text-xs text-neutral-400 animate-pulse">
                  Gerando QR Code...
                </div>
              )}

              {/* Botão Copiar Código PIX */}
              <button
                type="button"
                onClick={() => {
                  if (!modalPixPayload) return;
                  navigator.clipboard.writeText(modalPixPayload);
                  setModalPixCopied(true);
                  setTimeout(() => setModalPixCopied(false), 3000);
                  showToast("Código PIX Copia e Cola copiado com sucesso!");
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  modalPixCopied
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm"
                }`}
              >
                {modalPixCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Código PIX Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código PIX (Copia e Cola)</span>
                  </>
                )}
              </button>
            </div>

            {/* Ações de WhatsApp */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Comunicação Direta via WhatsApp:
              </span>

              {/* Botão 1: Enviar cobrança / chave PIX para o atleta */}
              <a
                href={`https://wa.me/${pixModalRegistration.telefone.replace(/\D/g, "").startsWith("55") ? pixModalRegistration.telefone.replace(/\D/g, "") : `55${pixModalRegistration.telefone.replace(/\D/g, "")}`}?text=${encodeURIComponent(
                  `Madeira Karate - Pagamento de Inscrição\n\nOlá, ${pixModalRegistration.nomeCompleto}!\n\nIdentificamos a sua inscrição (${pixModalRegistration.id}) no ${selectedChampionship?.nome || "Campeonato"}.\n\nParticipação: Todas as modalidades do campeonato\nModalidades do evento: ${formatModalidadesList(selectedChampionship?.modalidades)}\nValor: R$ ${pixModalRegistration.valorInscricao.toFixed(2).replace(".", ",")}\nChave PIX: ${selectedChampionship?.configuracaoPix.chave} (${selectedChampionship?.configuracaoPix.tipoChave})\nTitular: ${selectedChampionship?.configuracaoPix.nomeRecebedor}\n\nCódigo PIX Copia e Cola:\n${modalPixPayload}\n\nPor favor, após efetuar o pagamento, envie o comprovante por aqui para confirmarmos a sua vaga! Oss!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Cobrar / Enviar PIX no WhatsApp do Atleta</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
              </a>

              {/* Botão 2: Enviar comprovante para o WhatsApp do Dojo */}
              <a
                href={`https://wa.me/${dojoWhatsappNumber}?text=${encodeURIComponent(
                  `Olá Sensei! Segue o comprovante de pagamento da inscrição ${pixModalRegistration.id} do atleta ${pixModalRegistration.nomeCompleto} no valor de R$ ${pixModalRegistration.valorInscricao.toFixed(2).replace(".", ",")}.\nParticipação: Todas as modalidades do campeonato\nModalidades do evento: ${formatModalidadesList(selectedChampionship?.modalidades)}\n\nSegue o comprovante em anexo:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Enviar Comprovante p/ WhatsApp do Dojo</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
              </a>
            </div>

            {/* Ações Administrativas de Status */}
            <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row gap-2">
              {pixModalRegistration.paymentStatus === "AGUARDANDO_PAGAMENTO" && (
                <button
                  type="button"
                  onClick={() => handleMarkAwaitingCheck(pixModalRegistration.id)}
                  className="flex-1 py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Marcar "Comprovante Enviado"
                </button>
              )}

              {pixModalRegistration.paymentStatus !== "PAGAMENTO_CONFIRMADO" && (
                <button
                  type="button"
                  onClick={() => handleConfirmPayment(pixModalRegistration.id)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar Pagamento
                </button>
              )}

              <button
                type="button"
                onClick={() => setPixModalRegistration(null)}
                className="py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER LATERAL DE EDIÇÃO DO CAMPEONATO (SPEC DO USUÁRIO) */}
      {/* ======================================================== */}
      {typeof document !== "undefined" && isEditDrawerOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex justify-end items-stretch overflow-hidden animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label="Edição de Campeonato">
          {/* Backdrop semi-transparente que escurece a tela atual e fecha ao clicar fora */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setIsEditDrawerOpen(false);
              setEditingChampId(null);
            }}
            aria-hidden="true"
          />
          {/* Painel do Drawer lateral que desliza diante da tela atual */}
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-neutral-200 animate-in slide-in-from-right duration-300">
            {/* Header do Drawer */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-karate-red flex items-center justify-center shrink-0 shadow-sm">
                  <Edit2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold font-jp text-base text-white">
                    Editar Campeonato
                  </h3>
                  <span className="text-[11px] text-neutral-400 block line-clamp-1">
                    {champEditNome || selectedChampionship?.nome}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditDrawerOpen(false);
                  setEditingChampId(null);
                }}
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Fechar gaveta"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com Scroll Suave */}
            <form onSubmit={handleSaveChampionship} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>As alterações feitas nesta gaveta são isoladas e salvas exclusivamente para este campeonato.</span>
              </div>

              {/* Informações da Competição */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-1.5 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-karate-red" />
                  Informações da Competição
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome do Campeonato *</label>
                  <input
                    type="text"
                    required
                    value={champEditNome}
                    onChange={(e) => setChampEditNome(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-karate-red focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Slug da URL *</label>
                    <input
                      type="text"
                      required
                      value={champEditSlug}
                      onChange={(e) => setChampEditSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Status Oficial *</label>
                    <select
                      value={champEditStatus}
                      onChange={(e) => setChampEditStatus(e.target.value as ChampionshipStatus)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      <option value="RASCUNHO">RASCUNHO (Invisível)</option>
                      <option value="INSCRICOES_ABERTAS">INSCRICOES_ABERTAS (Aberto)</option>
                      <option value="INSCRICOES_ENCERRADAS">INSCRICOES_ENCERRADAS (Encerrado)</option>
                      <option value="FINALIZADO">FINALIZADO (Concluído)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Data da Competição *</label>
                    <input
                      type="date"
                      required
                      value={champEditData}
                      onChange={(e) => setChampEditData(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Taxa de Inscrição (R$) *</label>
                    <input
                      type="text"
                      required
                      value={champEditValor}
                      onChange={(e) => setChampEditValor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Modalidades do Campeonato * (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kata, Kumite"
                    value={champEditModalidades}
                    onChange={(e) => setChampEditModalidades(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    A inscrição do atleta é única e válida para todas as modalidades configuradas neste evento.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Local do Evento *</label>
                  <input
                    type="text"
                    required
                    value={champEditLocal}
                    onChange={(e) => setChampEditLocal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={champEditDesc}
                    onChange={(e) => setChampEditDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Abertura das Inscrições</label>
                    <input
                      type="datetime-local"
                      required
                      value={champEditAbertura ? champEditAbertura.slice(0, 16) : ""}
                      onChange={(e) => setChampEditAbertura(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Encerramento das Inscrições</label>
                    <input
                      type="datetime-local"
                      required
                      value={champEditEncerramento ? champEditEncerramento.slice(0, 16) : ""}
                      onChange={(e) => setChampEditEncerramento(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Regulamento e Normas</label>
                  <textarea
                    rows={3}
                    value={champEditRegulamento}
                    onChange={(e) => setChampEditRegulamento(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={champEditPermiteMenores}
                      onChange={(e) => setChampEditPermiteMenores(e.target.checked)}
                      className="rounded text-karate-red focus:ring-karate-red w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-neutral-800">
                      Permitir atletas menores de 18 anos (com termo de autorização dos pais)
                    </span>
                  </label>
                </div>
              </div>

              {/* Configurações de Pagamento PIX deste Campeonato */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-karate-red">
                  <QrCode className="w-4 h-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                    Configuração de Pagamento PIX deste Torneio
                  </h4>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-950 space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Validação Bancária da Chave PIX:</span>
                  </div>
                  <p>
                    A chave PIX informada abaixo deve ser uma chave <strong>real e ativa</strong> na sua conta bancária (registrada no DICT do Banco Central).
                  </p>
                  <p className="bg-white/70 p-2 rounded-lg border border-amber-200">
                    ⚠️ <strong>Se o seu app de banco informar "chave copia e cola não encontrada":</strong> isso significa que o banco buscou a chave nos registros do Banco Central e ela não existe ou está com formato diferente. Verifique se digitou o DDD correto ou cadastre seu CPF/e-mail/chave aleatória.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Tipo de Chave PIX *</label>
                    <select
                      value={pixTipo}
                      onChange={(e) => setPixTipo(e.target.value as PixKeyType)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      <option value="TELEFONE">Telefone / Celular (DDD + Número)</option>
                      <option value="CPF">CPF (apenas números)</option>
                      <option value="CNPJ">CNPJ (apenas números)</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="ALEATORIA">Chave Aleatória (EVP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Chave PIX Oficial *</label>
                    <input
                      type="text"
                      required
                      value={pixChave}
                      onChange={(e) => setPixChave(e.target.value)}
                      placeholder={
                        pixTipo === "TELEFONE"
                          ? "Ex: 21973681109"
                          : pixTipo === "CPF"
                          ? "Ex: 12345678900"
                          : pixTipo === "CNPJ"
                          ? "Ex: 12345678000199"
                          : pixTipo === "EMAIL"
                          ? "Ex: contato@madeirakarate.com"
                          : "Ex: 123e4567-e89b-12d3-a456-426614174000"
                      }
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold"
                    />
                    {pixTipo === "TELEFONE" && (
                      <div className="mt-1.5 space-y-1">
                        {(() => {
                          const digits = pixChave.replace(/\D/g, "");
                          if (digits.length === 0) {
                            return (
                              <span className="text-[10px] text-neutral-400 block">
                                Digite DDD + número (ex: 21973681109).
                              </span>
                            );
                          }
                          if (digits.length < 10) {
                            return (
                              <span className="text-[11px] text-amber-700 font-semibold block bg-amber-50 p-2 rounded-lg border border-amber-200">
                                ⚠️ Atenção: {digits.length} dígito(s). Faltam dígitos do DDD ou do telefone. No padrão do Banco Central são necessários 10 dígitos (DDD + fixo) ou 11 dígitos (DDD + celular).
                              </span>
                            );
                          }
                          const formatted = digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
                          return (
                            <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-[11px] text-emerald-800">
                              <span className="font-bold block">✓ Formato internacional DICT do Banco Central:</span>
                              <span className="font-mono font-bold text-xs">{formatted}</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {pixTipo === "CPF" && (
                      <div className="mt-1.5">
                        {(() => {
                          const digits = pixChave.replace(/\D/g, "");
                          if (digits.length > 0 && digits.length !== 11) {
                            return (
                              <span className="text-[11px] text-amber-700 font-semibold block bg-amber-50 p-2 rounded-lg border border-amber-200">
                                ⚠️ O CPF deve ter exatamente 11 dígitos (atualmente: {digits.length}).
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    {pixTipo === "CNPJ" && (
                      <div className="mt-1.5">
                        {(() => {
                          const digits = pixChave.replace(/\D/g, "");
                          if (digits.length > 0 && digits.length !== 14) {
                            return (
                              <span className="text-[11px] text-amber-700 font-semibold block bg-amber-50 p-2 rounded-lg border border-amber-200">
                                ⚠️ O CNPJ deve ter exatamente 14 dígitos (atualmente: {digits.length}).
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome do Recebedor (máx 25 chars) *</label>
                    <input
                      type="text"
                      required
                      maxLength={25}
                      value={pixNome}
                      onChange={(e) => setPixNome(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Cidade do Recebedor (máx 15 chars) *</label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      value={pixCidade}
                      onChange={(e) => setPixCidade(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pixIncluirValor}
                        onChange={(e) => setPixIncluirValor(e.target.checked)}
                        className="rounded text-karate-red focus:ring-karate-red w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-neutral-800">
                        Incluir valor da taxa de inscrição fixo no Payload do QR Code
                      </span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Instruções Adicionais de Pagamento</label>
                    <textarea
                      rows={2}
                      value={pixInstrucoes}
                      onChange={(e) => setPixInstrucoes(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs"
                      placeholder="Ex: Após efetuar o PIX, envie o comprovante no WhatsApp do Dojo para confirmar a vaga."
                    />
                  </div>
                </div>
              </div>

              {/* Rodapé do Drawer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditDrawerOpen(false);
                    setEditingChampId(null);
                  }}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Salvar Alterações do Campeonato</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE CAMPEONATO           */}
      {/* ======================================================== */}
      {deletingChampionship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold font-jp text-neutral-900 text-base">Excluir Campeonato</h3>
                <span className="text-xs text-neutral-500 line-clamp-1">{deletingChampionship.nome}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Deseja realmente excluir permanentemente o campeonato <strong>"{deletingChampionship.nome}"</strong>?
            </p>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] leading-relaxed">
              ✓ Este campeonato não possui nenhuma inscrição vinculada e pode ser removido com segurança.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingChampionship(null)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteChampionship}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL GOOGLE SHEETS & PIN DO SENSEI                      */}
      {/* ======================================================== */}
      {showGeneralSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-extrabold font-jp text-neutral-900 text-base">Google Sheets &amp; Acesso</h3>
                  <span className="text-xs text-neutral-500">Configurações globais de integração e segurança</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGeneralSettingsModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold text-xs cursor-pointer p-1"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={(e) => {
              handleSaveGeneralSettings(e);
              setShowGeneralSettingsModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  ID da Planilha Oficial Google Sheets
                </label>
                <div className="px-3.5 py-2.5 bg-neutral-100 rounded-xl text-xs font-mono text-emerald-800 font-semibold select-all">
                  {settings.googleSheetId}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  URL do Webhook Google Apps Script (Opcional para envio automático instantâneo)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/..."
                  value={sheetWebhookUrl}
                  onChange={(e) => setSheetWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Quando configurado, novas inscrições recebidas no site são enviadas em tempo real para a planilha oficial.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowScriptModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-karate-red" />
                  Ver / Copiar Código Apps Script
                </button>

                <button
                  type="button"
                  onClick={handleInitSheets}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-700" />
                  Inicializar Abas na Planilha
                </button>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Alterar PIN de Acesso Administrativo (Atual: {settings.adminPin})
                </label>
                <input
                  type="password"
                  placeholder="Novo PIN (ou deixe em branco para manter)"
                  value={newAdminPin}
                  onChange={(e) => setNewAdminPin(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowGeneralSettingsModal(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

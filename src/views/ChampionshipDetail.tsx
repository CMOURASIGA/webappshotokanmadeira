import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  ShieldCheck, 
  ChevronRight, 
  User, 
  Phone, 
  Mail, 
  Scale, 
  FileText, 
  ArrowLeft,
  Search,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Info
} from "lucide-react";
import { 
  championshipService, 
  calculateAgeOnDate, 
  getEnrollmentPeriodState 
} from "../services/championshipService";
import { Championship, AthleteRegistration } from "../types/championship";
import { generatePixCopiaECola, generatePixQrCodeDataUrl } from "../lib/pixUtils";
import { useAppData } from "../contexts/AppDataContext";

const BELT_OPTIONS = [
  "Faixa Branca (10º / 9º Kyu)",
  "Faixa Amarela (8º Kyu)",
  "Faixa Vermelha (7º Kyu)",
  "Faixa Laranja (6º Kyu)",
  "Faixa Verde (5º Kyu)",
  "Faixa Roxa (4º Kyu)",
  "Faixa Marrom (3º Kyu)",
  "Faixa Marrom (2º Kyu)",
  "Faixa Marrom (1º Kyu)",
  "Faixa Preta (1º Dan)",
  "Faixa Preta (2º Dan ou superior)"
];

export function ChampionshipDetail() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { config } = useAppData();

  const [championship, setChampionship] = useState<Championship | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState<"Masculino" | "Feminino">("Masculino");
  const [graduacao, setGraduacao] = useState(BELT_OPTIONS[0]);
  const [peso, setPeso] = useState<string>("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [autorizacaoResponsavel, setAutorizacaoResponsavel] = useState(false);
  const [aceiteRegulamento, setAceiteRegulamento] = useState(false);

  // Submission & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedRegistration, setCompletedRegistration] = useState<AthleteRegistration | null>(null);
  const [pixPayload, setPixPayload] = useState<string>("");
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState<string>("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [showRegulamentoModal, setShowRegulamentoModal] = useState(false);
  const [receiptMarked, setReceiptMarked] = useState(false);

  // Carregar dados do campeonato
  useEffect(() => {
    setLoading(true);
    const champs = championshipService.getChampionships();
    if (!slug) {
      if (champs.length > 0) {
        setChampionship(champs[0]);
      }
    } else {
      const found = championshipService.getChampionshipBySlug(slug);
      if (found) {
        setChampionship(found);
      } else if (champs.length > 0) {
        setChampionship(champs[0]);
      }
    }
    setLoading(false);
  }, [slug]);

  // Cálculo da idade na data do campeonato
  const idadeNaDataCampeonato = useMemo(() => {
    if (!dataNascimento || !championship?.dataCampeonato) return null;
    return calculateAgeOnDate(dataNascimento, championship.dataCampeonato);
  }, [dataNascimento, championship?.dataCampeonato]);

  const isMenor = idadeNaDataCampeonato !== null && idadeNaDataCampeonato < 18;

  // Status do período de inscrição
  const periodState = useMemo(() => {
    if (!championship) return null;
    return getEnrollmentPeriodState(championship);
  }, [championship]);

  // Gerar QR Code e Pix Payload quando a inscrição for finalizada com sucesso
  useEffect(() => {
    if (completedRegistration && championship) {
      const payload = generatePixCopiaECola({
        config: championship.configuracaoPix,
        amount: championship.valorInscricao,
        txid: "***"
      });
      setPixPayload(payload);

      generatePixQrCodeDataUrl(payload)
        .then(url => setPixQrCodeUrl(url))
        .catch(err => console.error("Erro ao gerar QR code:", err));
    }
  }, [completedRegistration, championship]);

  // Ação de copiar PIX
  const handleCopyPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!championship) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (!nomeCompleto.trim()) {
        throw new Error("Por favor, preencha o Nome Completo do Atleta.");
      }

      if (!dataNascimento) {
        throw new Error("Por favor, informe a Data de Nascimento do Atleta.");
      }

      const numericWeight = parseFloat(peso.replace(",", "."));
      if (isNaN(numericWeight) || numericWeight <= 0) {
        throw new Error("Informe um peso corporal válido em kg (ex: 68.5).");
      }

      if (!telefone.trim()) {
        throw new Error("Por favor, informe o WhatsApp / Celular do Atleta.");
      }

      if (!email.trim() || !email.includes("@")) {
        throw new Error("Por favor, informe um E-mail válido para confirmação da inscrição.");
      }

      if (isMenor) {
        if (!nomeResponsavel.trim()) {
          throw new Error("Para atleta menor de idade, o Nome do Responsável Legal é obrigatório.");
        }
        if (!telefoneResponsavel.trim()) {
          throw new Error("Para atleta menor de idade, o Telefone/WhatsApp do Responsável é obrigatório.");
        }
        if (!autorizacaoResponsavel) {
          throw new Error("Para atleta menor de idade, é obrigatório marcar a declaração de autorização do responsável.");
        }
      }

      if (!aceiteRegulamento) {
        throw new Error("É obrigatório concordar com o Regulamento Oficial do Campeonato para prosseguir.");
      }

      const reg = await championshipService.createRegistration(championship, {
        nomeCompleto,
        dataNascimento,
        sexo,
        graduacao,
        peso: numericWeight,
        modalidade: "Todas as Modalidades (Kata e Kumite)",
        telefone,
        email,
        nomeResponsavel: isMenor ? nomeResponsavel : undefined,
        telefoneResponsavel: isMenor ? telefoneResponsavel : undefined,
        autorizacaoResponsavel: isMenor ? autorizacaoResponsavel : undefined,
        aceiteRegulamento
      });

      // Confirmado em storage com sucesso!
      setCompletedRegistration(reg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Erro na inscrição:", err);
      const msg = err.message || "Erro ao processar inscrição. Verifique os dados e tente novamente.";
      setSubmitError(msg);
      // Rola a tela até o erro para o usuário ver imediatamente
      window.scrollTo({ top: 350, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Link para envio de WhatsApp reutilizando config.whatsapp do AppDataContext
  const generateWhatsAppReceiptUrl = () => {
    if (!completedRegistration) return "#";
    const rawNumber = config.whatsapp || "5521973681109";
    const cleanNumber = rawNumber.replace(/\D/g, "");

    const message = `Olá! Estou enviando o comprovante da inscrição do campeonato.\n\n` +
      `🥋 *Inscrição:* ${completedRegistration.id}\n` +
      `👤 *Atleta:* ${completedRegistration.nomeCompleto}\n` +
      `⚔️ *Participação:* Todas as Modalidades (Kata e Kumite)\n` +
      `💰 *Valor:* R$ ${completedRegistration.valorInscricao.toFixed(2).replace(".", ",")}\n\n` +
      `_Segue em anexo o comprovante de pagamento PIX para conferência._`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleMarkReceiptSent = () => {
    if (!completedRegistration) return;
    const updated = championshipService.markReceiptSentByAthlete(completedRegistration.id);
    setCompletedRegistration(updated);
    setReceiptMarked(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-3">
        <div className="w-10 h-10 border-4 border-karate-red border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Carregando dados do campeonato...</p>
      </div>
    );
  }

  if (!championship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-jp text-neutral-900 mb-2">Nenhum Campeonato Encontrado</h1>
        <p className="text-sm text-neutral-600 mb-6">Não há campeonatos cadastrados ou com inscrições ativas no momento.</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </Link>
      </div>
    );
  }

  // ==========================================
  // TELA DE SUCESSO / INSCRIÇÃO RECEBIDA
  // ==========================================
  if (completedRegistration) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in duration-300">
        {/* Banner de Confirmação */}
        <div className="bg-emerald-600 text-white p-6 sm:p-8 rounded-2xl shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider block mb-1">
                Registro Concluído com Sucesso
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-jp tracking-tight">
                Inscrição Recebida!
              </h1>
              <p className="text-sm text-emerald-50 mt-1">
                Guarde seu código de inscrição para acompanhar o status e o pagamento.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-200 block">Código da Inscrição:</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-white">
                {completedRegistration.id}
              </span>
            </div>
            <div>
              <span className="text-xs text-emerald-200 block">Valor da Inscrição:</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-white">
                R$ {completedRegistration.valorInscricao.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>

        {/* Separação de Status (SPEC 08 item 11) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-500 block">Status da Inscrição</span>
              <span className="font-bold text-neutral-800 text-sm">{completedRegistration.status}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {completedRegistration.status === "RECEBIDA" ? "Aguardando Confirmação" : completedRegistration.status}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-500 block">Status do Pagamento</span>
              <span className="font-bold text-neutral-800 text-sm">
                {completedRegistration.paymentStatus === "AGUARDANDO_PAGAMENTO" && "Aguardando Pagamento"}
                {completedRegistration.paymentStatus === "AGUARDANDO_CONFERENCIA" && "Aguardando Conferência"}
                {completedRegistration.paymentStatus === "PAGAMENTO_CONFIRMADO" && "Pagamento Confirmado"}
                {completedRegistration.paymentStatus === "PAGAMENTO_REJEITADO" && "Pagamento Rejeitado"}
              </span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              completedRegistration.paymentStatus === "AGUARDANDO_PAGAMENTO" 
                ? "bg-amber-50 text-amber-700 border-amber-200" 
                : completedRegistration.paymentStatus === "AGUARDANDO_CONFERENCIA"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {completedRegistration.paymentStatus}
            </span>
          </div>
        </div>

        {/* Seção de Pagamento PIX e Envio de Comprovante */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="w-10 h-10 rounded-xl bg-karate-red/10 flex items-center justify-center text-karate-red">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-jp text-neutral-900">Pagamento via PIX</h2>
              <p className="text-xs text-neutral-500">
                Pague pelo aplicativo do seu banco escaneando o QR Code ou utilizando o Pix Copia e Cola.
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80">
            {pixQrCodeUrl ? (
              <div className="bg-white p-3 rounded-xl shadow-md border border-neutral-200 shrink-0">
                <img 
                  src={pixQrCodeUrl} 
                  alt="QR Code PIX para pagamento da inscrição" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-neutral-200 animate-pulse rounded-xl" />
            )}

            <div className="space-y-3 text-center sm:text-left max-w-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Recebedor:</span>
                <p className="text-sm font-bold text-neutral-900">{championship.configuracaoPix.nomeRecebedor}</p>
                <p className="text-xs text-neutral-600">Cidade: {championship.configuracaoPix.cidadeRecebedor}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Chave PIX ({championship.configuracaoPix.tipoChave}):</span>
                <p className="text-xs font-mono bg-white p-2 rounded border border-neutral-200 text-neutral-800 break-all select-all font-semibold">
                  {championship.configuracaoPix.chave}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedPix ? "Código Pix Copiado!" : "Copiar PIX Copia e Cola"}
              </button>
            </div>
          </div>

          {/* Envio de Comprovante pelo WhatsApp */}
          <div className="bg-amber-50 border border-amber-200/80 p-5 rounded-xl space-y-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">Envio do Comprovante de Pagamento</h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Para que a inscrição seja conferida e confirmada pelo Sensei, envie o comprovante diretamente pelo WhatsApp oficial do Dojo.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={generateWhatsAppReceiptUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar Comprovante pelo WhatsApp
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </a>

              <button
                type="button"
                onClick={handleMarkReceiptSent}
                disabled={receiptMarked || completedRegistration.paymentStatus === "AGUARDANDO_CONFERENCIA"}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                {receiptMarked || completedRegistration.paymentStatus === "AGUARDANDO_CONFERENCIA"
                  ? "Comprovante Sinalizado"
                  : "Já enviei o comprovante"}
              </button>
            </div>

            <p className="text-[11px] text-amber-800/80 italic">
              * Nota: Clicar no botão do WhatsApp abre a conversa para envio do arquivo, mas não altera o status para Pago automaticamente. O pagamento é verificado manualmente pela administração do Dojo.
            </p>
          </div>

          {/* Dados do Atleta Cadastrado */}
          <div className="border-t border-neutral-100 pt-4 text-xs text-neutral-600 space-y-1.5">
            <h4 className="font-bold text-neutral-800 text-sm mb-2">Resumo da Inscrição Cadastrada:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-50 p-4 rounded-xl">
              <p><strong>Atleta:</strong> {completedRegistration.nomeCompleto}</p>
              <p><strong>Modalidade:</strong> {completedRegistration.modalidade}</p>
              <p><strong>Graduação:</strong> {completedRegistration.graduacao}</p>
              <p><strong>Peso:</strong> {completedRegistration.peso} kg</p>
              <p><strong>Idade no Campeonato:</strong> {completedRegistration.idadeNaDataCampeonato} anos {completedRegistration.isMenor ? "(Menor)" : ""}</p>
              <p><strong>Telefone:</strong> {completedRegistration.telefone}</p>
              <p><strong>E-mail:</strong> {completedRegistration.email}</p>
              {completedRegistration.nomeResponsavel && (
                <p className="col-span-1 sm:col-span-2">
                  <strong>Responsável Legal:</strong> {completedRegistration.nomeResponsavel} ({completedRegistration.telefoneResponsavel})
                </p>
              )}
            </div>
          </div>

          {/* Botões de Ação Final */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
            <Link
              to={`/campeonatos/${championship.slug}/consulta?code=${completedRegistration.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-karate-red hover:underline"
            >
              <Search className="w-4 h-4" /> Acompanhar / Alterar Inscrição Futuramente
            </Link>

            <Link
              to="/"
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Voltar à Página Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PÁGINA PÚBLICA / FORMULÁRIO DE INSCRIÇÃO
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Navegação Topo */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Início
        </Link>
        <Link 
          to={`/campeonatos/${championship.slug}/consulta`} 
          className="inline-flex items-center gap-1.5 font-semibold text-karate-red hover:underline"
        >
          <Search className="w-3.5 h-3.5" /> Já sou inscrito / Consultar inscrição
        </Link>
      </div>

      {/* Hero do Campeonato */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 border border-[#2B2B2B] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-karate-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-karate-red text-white uppercase">
              <Trophy className="w-3.5 h-3.5" /> Campeonato Oficial
            </span>

            {periodState && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                periodState.state === "OPEN"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : periodState.state === "BEFORE"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-neutral-800 text-neutral-400 border border-neutral-700"
              }`}>
                {periodState.label}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-jp tracking-tight text-white leading-tight">
            {championship.nome}
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {championship.descricao}
          </p>

          {/* Grid de Metadados Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80">
            <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
              <Calendar className="w-5 h-5 text-karate-gold shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">Data do Evento</span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {new Date(championship.dataCampeonato + "T00:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
              <MapPin className="w-5 h-5 text-karate-red shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">Local</span>
                <span className="text-xs sm:text-sm font-bold text-white truncate block max-w-[180px]" title={championship.local}>
                  {championship.local}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">Valor da Inscrição</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                  R$ {championship.valorInscricao.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>

          {/* Participação Integral Oficial */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-400 font-semibold">Participação:</span>
            <span className="bg-karate-gold/20 text-karate-gold border border-karate-gold/40 px-2.5 py-1 rounded-lg font-bold">
              Integral: Todas as Modalidades (Kata e Kumite)
            </span>
            {championship.permiteMenores && (
              <span className="bg-purple-900/40 text-purple-300 border border-purple-800/60 px-2.5 py-1 rounded-lg font-medium">
                Aberto a Menores (com autorização)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alerta de Período */}
      {periodState && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          periodState.state === "OPEN"
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : periodState.state === "BEFORE"
            ? "bg-amber-50 border-amber-200 text-amber-900"
            : "bg-neutral-100 border-neutral-200 text-neutral-700"
        }`}>
          {periodState.state === "OPEN" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="font-semibold block">{periodState.label}:</strong>
            <span>{periodState.message}</span>
          </div>
        </div>
      )}

      {/* Formulário de Inscrição */}
      {periodState?.canRegister ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-2.5 text-karate-red mb-1">
              <User className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Ficha de Inscrição Oficial</span>
            </div>
            <h2 className="text-2xl font-bold font-jp text-neutral-900">
              Dados do Atleta
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Preencha com atenção. A idade do atleta será calculada rigorosamente para a data do campeonato ({new Date(championship.dataCampeonato + "T00:00:00").toLocaleDateString("pt-BR")}).
            </p>
          </div>

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bloco 1: Informações Pessoais do Atleta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nome Completo do Atleta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva Santos"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  required
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                />
                {idadeNaDataCampeonato !== null && (
                  <p className="text-xs mt-1.5 font-medium flex items-center gap-1.5 text-neutral-700">
                    <Sparkles className="w-3.5 h-3.5 text-karate-gold" />
                    Idade no dia da competição: 
                    <span className="font-bold text-neutral-900"> {idadeNaDataCampeonato} anos</span>
                    {isMenor && (
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                        Menor de Idade
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Sexo para Organização de Categorias *
                </label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as "Masculino" | "Feminino")}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red cursor-pointer"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Graduação / Faixa Atual *
                </label>
                <select
                  value={graduacao}
                  onChange={(e) => setGraduacao(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red cursor-pointer"
                >
                  {BELT_OPTIONS.map((belt) => (
                    <option key={belt} value={belt}>{belt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Peso Corporal (kg) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 68.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Utilizado para balanceamento das chaves de Kumite.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  WhatsApp / Celular do Atleta *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (21) 97368-1109"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  E-mail do Atleta *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: atleta@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                />
              </div>

              {/* Informação sobre Participação Integral (Todos fazem Kata e Kumite) */}
              <div className="sm:col-span-2 bg-neutral-50 border border-neutral-200/90 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-neutral-700">
                <Trophy className="w-4 h-4 text-karate-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-semibold">Participação Integral (Kata + Kumite):</strong>
                  <span className="text-[11px] text-neutral-600 leading-relaxed">
                    Todos os atletas inscritos competem em todas as modalidades do campeonato. O chaveamento será organizado pela comissão técnica por categoria de idade, sexo e graduação.
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco 2: Autorização de Responsável (Exibido se idade < 18) */}
            {isMenor && (
              <div className="bg-purple-50/70 border border-purple-200 p-5 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-purple-900">
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                  <h3 className="text-sm font-bold">Autorização de Menor de Idade</h3>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  O atleta possui <strong>{idadeNaDataCampeonato} anos</strong> na data do campeonato. Conforme o regulamento, é obrigatória a identificação e consentimento do responsável legal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      Nome do Responsável Legal *
                    </label>
                    <input
                      type="text"
                      required={isMenor}
                      placeholder="Ex: Maria da Silva (Mãe)"
                      value={nomeResponsavel}
                      onChange={(e) => setNomeResponsavel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      Telefone / WhatsApp do Responsável *
                    </label>
                    <input
                      type="tel"
                      required={isMenor}
                      placeholder="Ex: (21) 98888-7777"
                      value={telefoneResponsavel}
                      onChange={(e) => setTelefoneResponsavel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    required={isMenor}
                    checked={autorizacaoResponsavel}
                    onChange={(e) => setAutorizacaoResponsavel(e.target.checked)}
                    className="mt-0.5 rounded border-purple-300 text-purple-700 focus:ring-purple-600 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-purple-950 font-medium leading-relaxed">
                    Eu, como responsável legal pelo atleta menor, declaro que autorizo sua participação neste campeonato, atesto que o atleta está clinicamente apto e assumo a responsabilidade por sua conduta e acompanhamento.
                  </span>
                </label>
              </div>
            )}

            {/* Regulamento e Aceite */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">Regulamento e Termos</span>
                <button
                  type="button"
                  onClick={() => setShowRegulamentoModal(true)}
                  className="text-xs text-karate-red hover:underline font-semibold cursor-pointer"
                >
                  Ler regulamento completo
                </button>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={aceiteRegulamento}
                  onChange={(e) => setAceiteRegulamento(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-karate-red focus:ring-karate-red w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-neutral-700 leading-relaxed">
                  Declaro que li e concordo com o <strong>Regulamento Oficial do Campeonato</strong>, me comprometo a respeitar o espírito esportivo do Budo, as regras de arbitragem da JKA e estou ciente de que a confirmação final da inscrição depende da conferência manual do pagamento via PIX.
                </span>
              </label>
            </div>

            {/* Alerta de erro logo acima do botão para visibilidade imediata */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="font-medium">{submitError}</span>
              </div>
            )}

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-karate-red hover:bg-red-700 text-white rounded-2xl text-sm sm:text-base font-bold font-jp transition-all shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando e gravando inscrição...
                  </>
                ) : (
                  <>
                    Finalizar Inscrição &amp; Gerar PIX
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-neutral-400 mt-2">
                O código único da inscrição será emitido após a gravação segura no sistema.
              </p>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-neutral-100 p-8 rounded-3xl text-center space-y-3 border border-neutral-200">
          <Clock className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-lg font-bold font-jp text-neutral-800">Inscrições Não Disponíveis</h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
            {periodState?.message || "O formulário de inscrições encontra-se fechado para este evento."}
          </p>
        </div>
      )}

      {/* Modal de Regulamento Completo */}
      {showRegulamentoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-karate-red" />
                <h3 className="font-bold font-jp text-neutral-900 text-base">Regulamento do Campeonato</h3>
              </div>
              <button 
                onClick={() => setShowRegulamentoModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-bold p-1 cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 text-xs text-neutral-700 whitespace-pre-line leading-relaxed font-sans">
              {championship.regulamento || "Regulamento em elaboração pela comissão técnica do Dojo Madeira Karate."}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAceiteRegulamento(true);
                  setShowRegulamentoModal(false);
                }}
                className="px-4 py-2 bg-karate-red text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
              >
                Li e Aceito o Regulamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

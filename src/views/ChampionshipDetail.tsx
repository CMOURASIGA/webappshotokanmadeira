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
import { formatModalidadesList } from "../lib/utils";
import { useAppData } from "../contexts/AppDataContext";
import { useLanguage } from "../i18n/LanguageContext";

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
  const { language, locale } = useLanguage();
  const copy = language === "en"
    ? {
        errName: "Enter the athlete's full name.", errBirth: "Enter the athlete's date of birth.", errAgePrefix: "This championship accepts athletes aged", to: "to", years: "years", errAgeSuffix: "based on age on the event date.",
        errWeight: "Enter a valid body weight in kg (example: 68.5).", errPhone: "Enter the athlete's WhatsApp / mobile number.", errEmail: "Enter a valid email address for registration confirmation.",
        errGuardian: "For a minor athlete, the legal guardian's name is required.", errGuardianPhone: "For a minor athlete, the guardian's phone / WhatsApp is required.", errGuardianConsent: "For a minor athlete, guardian authorization must be confirmed.", errRules: "You must agree to the Official Championship Rules to continue.",
        registrationComplete: "Registration Completed Successfully", registrationReceived: "Registration Received!", keepCode: "Keep your registration code to track status and payment.", registrationCode: "Registration Code", registrationFee: "Registration Fee",
        registrationStatus: "Registration Status", awaitingConfirmation: "Awaiting Confirmation", paymentStatus: "Payment Status", awaitingPayment: "Awaiting Payment", awaitingReview: "Awaiting Review", paymentConfirmed: "Payment Confirmed", paymentRejected: "Payment Rejected",
        pixPayment: "PIX Payment", pixHelp: "Pay through your banking app by scanning the QR Code or using PIX Copy and Paste.", pixCopyPaste: "PIX Copy and Paste", pixCopied: "PIX Code Copied!", copyPix: "Copy PIX Code", sendReceipt: "Send receipt via WhatsApp",
        receiptMarked: "Receipt Reported", receiptSent: "I have already sent the receipt", paymentNote: "* Note: the WhatsApp button opens the conversation so you can attach the file, but it does not automatically mark the payment as paid. Payment is manually verified by the dojo administration.",
        registrationSummary: "Registration Summary", athlete: "Athlete", participation: "Participation", allModalities: "All championship modalities", eventModalities: "Event modalities", grade: "Grade", weight: "Weight", ageAtEvent: "Age on event date", minor: "Minor", phone: "Phone", email: "Email", guardian: "Legal Guardian",
        trackRegistration: "Track / Update Registration Later", backHome: "Back to Home", eventDate: "Event Date", location: "Location", officialForm: "Official Registration Form", athleteData: "Athlete Information", fillCarefully: "Complete the form carefully. The athlete's age will be calculated for the championship date",
        fullName: "Athlete Full Name", birthDate: "Date of Birth", allowedAge: "Allowed age range", ageOutside: "age outside the permitted range.", sexForCategories: "Sex for Category Organization", male: "Male", female: "Female", currentGrade: "Current Grade / Belt", bodyWeight: "Body Weight (kg)", weightHelp: "Used for Kumite bracket balancing.", athletePhone: "Athlete WhatsApp / Mobile", athleteEmail: "Athlete Email", minorAuthorization: "Minor Athlete Authorization", guardianName: "Legal Guardian Name", guardianPhone: "Guardian Phone / WhatsApp", registrationsUnavailable: "Registration Unavailable", formClosed: "The registration form is closed for this event.",
        periodOpen: "Registration Open", periodBefore: "Registration Not Open Yet", periodClosed: "Registration Closed", periodOpenMsg: "Registration is currently open for this event.", periodBeforeMsg: "Registration has not opened yet.", periodClosedMsg: "Registration is currently closed for this event."
      }
    : language === "ja"
    ? {
        errName: "選手の氏名を入力してください。", errBirth: "選手の生年月日を入力してください。", errAgePrefix: "この大会の対象年齢は", to: "から", years: "歳", errAgeSuffix: "です。大会当日の年齢で判定します。",
        errWeight: "有効な体重を kg で入力してください（例: 68.5）。", errPhone: "選手の WhatsApp / 携帯番号を入力してください。", errEmail: "申込確認用の有効なメールアドレスを入力してください。",
        errGuardian: "未成年の選手は法定保護者の氏名が必要です。", errGuardianPhone: "未成年の選手は保護者の電話 / WhatsApp が必要です。", errGuardianConsent: "未成年の選手は保護者の同意確認が必要です。", errRules: "続行するには大会公式規定への同意が必要です。",
        registrationComplete: "申込が完了しました", registrationReceived: "申込を受け付けました", keepCode: "申込状況と支払いを確認するため、申込コードを保管してください。", registrationCode: "申込コード", registrationFee: "参加費",
        registrationStatus: "申込状況", awaitingConfirmation: "確認待ち", paymentStatus: "支払状況", awaitingPayment: "支払待ち", awaitingReview: "確認待ち", paymentConfirmed: "支払確認済み", paymentRejected: "支払確認不可",
        pixPayment: "PIX 支払い", pixHelp: "銀行アプリでQRコードを読み取るか、PIX コピー＆ペーストを使用してお支払いください。", pixCopyPaste: "PIX コピー＆ペースト", pixCopied: "PIX コードをコピーしました", copyPix: "PIX コードをコピー", sendReceipt: "WhatsApp で支払証明を送る",
        receiptMarked: "送付済みとして登録", receiptSent: "支払証明を送付しました", paymentNote: "* WhatsApp ボタンはファイル送付用の会話を開きますが、自動的に支払済みにはなりません。支払いは道場管理者が手動で確認します。",
        registrationSummary: "申込内容", athlete: "選手", participation: "参加", allModalities: "大会の全種目", eventModalities: "大会種目", grade: "級・段位", weight: "体重", ageAtEvent: "大会当日の年齢", minor: "未成年", phone: "電話", email: "メール", guardian: "法定保護者",
        trackRegistration: "後で申込を確認・変更", backHome: "ホームに戻る", eventDate: "開催日", location: "会場", officialForm: "公式申込フォーム", athleteData: "選手情報", fillCarefully: "正確に入力してください。年齢は大会当日を基準に計算されます",
        fullName: "選手氏名", birthDate: "生年月日", allowedAge: "対象年齢", ageOutside: "対象年齢外です。", sexForCategories: "カテゴリ編成用の性別", male: "男性", female: "女性", currentGrade: "現在の級・帯", bodyWeight: "体重 (kg)", weightHelp: "Kumite の組合せ調整に使用します。", athletePhone: "選手の WhatsApp / 携帯", athleteEmail: "選手メール", minorAuthorization: "未成年選手の同意", guardianName: "法定保護者氏名", guardianPhone: "保護者の電話 / WhatsApp", registrationsUnavailable: "申込受付停止中", formClosed: "この大会の申込受付は終了しています。",
        periodOpen: "申込受付中", periodBefore: "申込開始前", periodClosed: "申込受付終了", periodOpenMsg: "現在、この大会の申込を受け付けています。", periodBeforeMsg: "申込受付はまだ開始していません。", periodClosedMsg: "現在、この大会の申込受付は終了しています。"
      }
    : {
        errName: "Por favor, preencha o Nome Completo do Atleta.", errBirth: "Por favor, informe a Data de Nascimento do Atleta.", errAgePrefix: "Este campeonato aceita atletas de", to: "a", years: "anos", errAgeSuffix: "considerando a idade na data do evento.",
        errWeight: "Informe um peso corporal válido em kg (ex: 68.5).", errPhone: "Por favor, informe o WhatsApp / Celular do Atleta.", errEmail: "Por favor, informe um E-mail válido para confirmação da inscrição.",
        errGuardian: "Para atleta menor de idade, o Nome do Responsável Legal é obrigatório.", errGuardianPhone: "Para atleta menor de idade, o Telefone/WhatsApp do Responsável é obrigatório.", errGuardianConsent: "Para atleta menor de idade, é obrigatório marcar a declaração de autorização do responsável.", errRules: "É obrigatório concordar com o Regulamento Oficial do Campeonato para prosseguir.",
        registrationComplete: "Registro Concluído com Sucesso", registrationReceived: "Inscrição Recebida!", keepCode: "Guarde seu código de inscrição para acompanhar o status e o pagamento.", registrationCode: "Código da Inscrição", registrationFee: "Valor da Inscrição",
        registrationStatus: "Status da Inscrição", awaitingConfirmation: "Aguardando Confirmação", paymentStatus: "Status do Pagamento", awaitingPayment: "Aguardando Pagamento", awaitingReview: "Aguardando Conferência", paymentConfirmed: "Pagamento Confirmado", paymentRejected: "Pagamento Rejeitado",
        pixPayment: "Pagamento via PIX", pixHelp: "Pague pelo aplicativo do seu banco escaneando o QR Code ou utilizando o Pix Copia e Cola.", pixCopyPaste: "PIX Copia e Cola", pixCopied: "Código PIX Copiado!", copyPix: "Copiar Código PIX", sendReceipt: "Enviar comprovante pelo WhatsApp",
        receiptMarked: "Comprovante Sinalizado", receiptSent: "Já enviei o comprovante", paymentNote: "* Nota: clicar no botão do WhatsApp abre a conversa para envio do arquivo, mas não altera o status para Pago automaticamente. O pagamento é verificado manualmente pela administração do Dojo.",
        registrationSummary: "Resumo da Inscrição Cadastrada", athlete: "Atleta", participation: "Participação", allModalities: "Todas as modalidades do campeonato", eventModalities: "Modalidades do evento", grade: "Graduação", weight: "Peso", ageAtEvent: "Idade no Campeonato", minor: "Menor", phone: "Telefone", email: "E-mail", guardian: "Responsável Legal",
        trackRegistration: "Acompanhar / Alterar Inscrição Futuramente", backHome: "Voltar ao Início", eventDate: "Data do Evento", location: "Local", officialForm: "Ficha de Inscrição Oficial", athleteData: "Dados do Atleta", fillCarefully: "Preencha com atenção. A idade do atleta será calculada rigorosamente para a data do campeonato",
        fullName: "Nome Completo do Atleta", birthDate: "Data de Nascimento", allowedAge: "Faixa etária permitida", ageOutside: "idade fora da faixa permitida.", sexForCategories: "Sexo para Organização de Categorias", male: "Masculino", female: "Feminino", currentGrade: "Graduação / Faixa Atual", bodyWeight: "Peso Corporal (kg)", weightHelp: "Utilizado para balanceamento das chaves de Kumite.", athletePhone: "WhatsApp / Celular do Atleta", athleteEmail: "E-mail do Atleta", minorAuthorization: "Autorização de Menor de Idade", guardianName: "Nome do Responsável Legal", guardianPhone: "Telefone / WhatsApp do Responsável", registrationsUnavailable: "Inscrições Não Disponíveis", formClosed: "O formulário de inscrições encontra-se fechado para este evento.",
        periodOpen: "Inscrições Abertas", periodBefore: "Inscrições ainda não abertas", periodClosed: "Inscrições Encerradas", periodOpenMsg: "As inscrições estão abertas para este evento.", periodBeforeMsg: "As inscrições ainda não foram abertas.", periodClosedMsg: "As inscrições estão encerradas para este evento."
      };

  const beltDisplay: Record<string, string> = Object.fromEntries(BELT_OPTIONS.map((belt) => {
    if (language === "pt") return [belt, belt];
    const mappings: Record<string, { en: string; ja: string }> = {
      "Faixa Branca (10º / 9º Kyu)": { en: "White Belt (10th / 9th Kyu)", ja: "白帯 (10級 / 9級)" },
      "Faixa Amarela (8º Kyu)": { en: "Yellow Belt (8th Kyu)", ja: "黄帯 (8級)" },
      "Faixa Vermelha (7º Kyu)": { en: "Red Belt (7th Kyu)", ja: "赤帯 (7級)" },
      "Faixa Laranja (6º Kyu)": { en: "Orange Belt (6th Kyu)", ja: "橙帯 (6級)" },
      "Faixa Verde (5º Kyu)": { en: "Green Belt (5th Kyu)", ja: "緑帯 (5級)" },
      "Faixa Roxa (4º Kyu)": { en: "Purple Belt (4th Kyu)", ja: "紫帯 (4級)" },
      "Faixa Marrom (3º Kyu)": { en: "Brown Belt (3rd Kyu)", ja: "茶帯 (3級)" },
      "Faixa Marrom (2º Kyu)": { en: "Brown Belt (2nd Kyu)", ja: "茶帯 (2級)" },
      "Faixa Marrom (1º Kyu)": { en: "Brown Belt (1st Kyu)", ja: "茶帯 (1級)" },
      "Faixa Preta (1º Dan)": { en: "Black Belt (1st Dan)", ja: "黒帯 (初段)" },
      "Faixa Preta (2º Dan ou superior)": { en: "Black Belt (2nd Dan or higher)", ja: "黒帯 (二段以上)" }
    };
    return [belt, mappings[belt]?.[language] || belt];
  }));


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

  // Carregar dados do campeonato centralmente
  useEffect(() => {
    setLoading(true);
    championshipService.fetchChampionships().then((champs) => {
      let targetChamp: Championship | null = null;
      if (!slug) {
        if (champs.length > 0) {
          targetChamp = champs[0];
        }
      } else {
        const found = champs.find(c => c.slug.toLowerCase() === slug.toLowerCase() || c.id === slug);
        if (found) {
          targetChamp = found;
        } else if (champs.length > 0) {
          targetChamp = champs[0];
        }
      }
      setChampionship(targetChamp);
    }).finally(() => {
      setLoading(false);
    });
  }, [slug]);

  // Cálculo da idade na data do campeonato
  const idadeNaDataCampeonato = useMemo(() => {
    if (!dataNascimento || !championship?.dataCampeonato) return null;
    return calculateAgeOnDate(dataNascimento, championship.dataCampeonato);
  }, [dataNascimento, championship?.dataCampeonato]);

  const isMenor = idadeNaDataCampeonato !== null && idadeNaDataCampeonato < 18;
  const idadeForaDaFaixa = useMemo(() => {
    if (!championship || idadeNaDataCampeonato === null) return false;
    const min = championship.idadeMinima ?? 0;
    const max = championship.idadeMaxima ?? 120;
    return idadeNaDataCampeonato < min || idadeNaDataCampeonato > max;
  }, [championship, idadeNaDataCampeonato]);

  // Status do período de inscrição
  const periodState = useMemo(() => {
    if (!championship) return null;
    return getEnrollmentPeriodState(championship);
  }, [championship]);

  const periodLabel = periodState?.state === "OPEN" ? copy.periodOpen : periodState?.state === "BEFORE" ? copy.periodBefore : copy.periodClosed;
  const periodMessage = periodState?.state === "OPEN" ? copy.periodOpenMsg : periodState?.state === "BEFORE" ? copy.periodBeforeMsg : copy.periodClosedMsg;

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
        throw new Error(copy.errName);
      }

      if (!dataNascimento) {
        throw new Error(copy.errBirth);
      }

      if (idadeForaDaFaixa) {
        const min = championship.idadeMinima ?? 0;
        const max = championship.idadeMaxima ?? 120;
        throw new Error(
          `${copy.errAgePrefix} ${min} ${copy.to} ${max} ${copy.years}, ${copy.errAgeSuffix}`
        );
      }

      const numericWeight = parseFloat(peso.replace(",", "."));
      if (isNaN(numericWeight) || numericWeight <= 0) {
        throw new Error(copy.errWeight);
      }

      if (!telefone.trim()) {
        throw new Error(copy.errPhone);
      }

      if (!email.trim() || !email.includes("@")) {
        throw new Error(copy.errEmail);
      }

      if (isMenor) {
        if (!nomeResponsavel.trim()) {
          throw new Error(copy.errGuardian);
        }
        if (!telefoneResponsavel.trim()) {
          throw new Error(copy.errGuardianPhone);
        }
        if (!autorizacaoResponsavel) {
          throw new Error(copy.errGuardianConsent);
        }
      }

      if (!aceiteRegulamento) {
        throw new Error(copy.errRules);
      }

      // Regra da SPEC 08: Inscrição única válida para todas as modalidades do evento
      const modalidadesDoEvento = formatModalidadesList(championship.modalidades);

      const reg = await championshipService.createRegistration(championship, {
        nomeCompleto,
        dataNascimento,
        sexo,
        graduacao,
        peso: numericWeight,
        modalidade: modalidadesDoEvento,
        telefone,
        email,
        nomeResponsavel: isMenor ? nomeResponsavel : undefined,
        telefoneResponsavel: isMenor ? telefoneResponsavel : undefined,
        autorizacaoResponsavel: isMenor ? autorizacaoResponsavel : undefined,
        aceiteRegulamento
      });

      // Confirmado na fonte central com sucesso!
      setCompletedRegistration(reg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Erro na inscrição:", err);
      const msg = err.message || "Inscrição não concluída. Tente novamente.";
      setSubmitError(msg);
      // Rola a tela até o erro para o usuário ver imediatamente
      window.scrollTo({ top: 350, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Link para envio de WhatsApp reutilizando config.whatsapp do AppDataContext
  // Padrão limpo sem emojis (evita corrupção de caracteres no WhatsApp Web e Android)
  const generateWhatsAppReceiptUrl = () => {
    if (!completedRegistration || !championship) return "#";
    const rawNumber = config.whatsapp || "5521973681109";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const modalidadesEvento = formatModalidadesList(championship.modalidades);

    const message = "Olá! Estou enviando o comprovante da inscrição do campeonato.\n\n" +
      `Inscrição: ${completedRegistration.id}\n` +
      `Atleta: ${completedRegistration.nomeCompleto}\n` +
      "Participação: Todas as modalidades do campeonato\n" +
      `Modalidades do evento: ${modalidadesEvento}\n` +
      `Valor: R$ ${completedRegistration.valorInscricao.toFixed(2).replace(".", ",")}\n\n` +
      "Segue em anexo o comprovante de pagamento PIX para conferência.";

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleMarkReceiptSent = async () => {
    if (!completedRegistration) return;
    try {
      const updated = await championshipService.markReceiptSentByAthlete(completedRegistration.id);
      setCompletedRegistration(updated);
      setReceiptMarked(true);
    } catch (err) {
      console.error("Erro ao marcar envio de comprovante:", err);
    }
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
                {copy.registrationComplete}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-jp tracking-tight">
                {copy.registrationReceived}
              </h1>
              <p className="text-sm text-emerald-50 mt-1">
                {copy.keepCode}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-200 block">{copy.registrationCode}:</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-white">
                {completedRegistration.id}
              </span>
            </div>
            <div>
              <span className="text-xs text-emerald-200 block">{copy.registrationFee}:</span>
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
              <span className="text-xs text-neutral-500 block">{copy.registrationStatus}</span>
              <span className="font-bold text-neutral-800 text-sm">{completedRegistration.status}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {completedRegistration.status === "RECEBIDA" ? copy.awaitingConfirmation : completedRegistration.status}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-500 block">{copy.paymentStatus}</span>
              <span className="font-bold text-neutral-800 text-sm">
                {completedRegistration.paymentStatus === "AGUARDANDO_PAGAMENTO" && copy.awaitingPayment}
                {completedRegistration.paymentStatus === "AGUARDANDO_CONFERENCIA" && copy.awaitingReview}
                {completedRegistration.paymentStatus === "PAGAMENTO_CONFIRMADO" && copy.paymentConfirmed}
                {completedRegistration.paymentStatus === "PAGAMENTO_REJEITADO" && copy.paymentRejected}
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
              <h2 className="text-lg font-bold font-jp text-neutral-900">{copy.pixPayment}</h2>
              <p className="text-xs text-neutral-500">
                {copy.pixHelp}
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
                {copiedPix ? "Código Pix Copiado!" : "Copiar {copy.pixCopyPaste}"}
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
                  ? copy.receiptMarked
                  : copy.receiptSent}
              </button>
            </div>

            <p className="text-[11px] text-amber-800/80 italic">
              {copy.paymentNote}
            </p>
          </div>

          {/* {copy.athleteData} Cadastrado */}
          <div className="border-t border-neutral-100 pt-4 text-xs text-neutral-600 space-y-1.5">
            <h4 className="font-bold text-neutral-800 text-sm mb-2">{copy.registrationSummary}:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-50 p-4 rounded-xl">
              <p><strong>{copy.athlete}:</strong> {completedRegistration.nomeCompleto}</p>
              <p><strong>{copy.participation}:</strong> {copy.allModalities}</p>
              <p><strong>{copy.eventModalities}:</strong> {formatModalidadesList(championship.modalidades)}</p>
              <p><strong>{copy.grade}:</strong> {completedRegistration.graduacao}</p>
              <p><strong>{copy.weight}:</strong> {completedRegistration.peso} kg</p>
              <p><strong>{copy.ageAtEvent}:</strong> {completedRegistration.idadeNaDataCampeonato} {copy.years} {completedRegistration.isMenor ? `(${copy.minor})` : ""}</p>
              <p><strong>{copy.phone}:</strong> {completedRegistration.telefone}</p>
              <p><strong>{copy.email}:</strong> {completedRegistration.email}</p>
              {completedRegistration.nomeResponsavel && (
                <p className="col-span-1 sm:col-span-2">
                  <strong>{copy.guardian}:</strong> {completedRegistration.nomeResponsavel} ({completedRegistration.telefoneResponsavel})
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
              <Search className="w-4 h-4" /> {copy.trackRegistration}
            </Link>

            <Link
              to="/"
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition-colors"
            >
              {copy.backHome}
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
          <ArrowLeft className="w-3.5 h-3.5" /> {copy.backHome}
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
                {periodLabel}
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
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">{copy.eventDate}</span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {new Date(championship.dataCampeonato + "T00:00:00").toLocaleDateString(locale, {
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
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">{copy.location}</span>
                <span className="text-xs sm:text-sm font-bold text-white truncate block max-w-[180px]" title={championship.local}>
                  {championship.local}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">{copy.registrationFee}</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                  R$ {championship.valorInscricao.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>

          {/* Participação Integral Oficial Conforme Configuração do Evento */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-400 font-semibold">Participação:</span>
            <span className="bg-karate-gold/20 text-karate-gold border border-karate-gold/40 px-2.5 py-1 rounded-lg font-bold">
              Todas as modalidades do campeonato
            </span>
            <span className="bg-neutral-800 text-neutral-300 border border-neutral-700 px-2.5 py-1 rounded-lg font-medium">
              Modalidades do evento: {formatModalidadesList(championship.modalidades)}
            </span>
            <span className="bg-purple-900/40 text-purple-300 border border-purple-800/60 px-2.5 py-1 rounded-lg font-medium">
              Faixa etária: {championship.idadeMinima ?? 0} a {championship.idadeMaxima ?? 120} anos
            </span>
            {championship.permiteMenores && (
              <span className="bg-neutral-800 text-neutral-300 border border-neutral-700 px-2.5 py-1 rounded-lg font-medium">
                Menores exigem responsável e autorização
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
            <span>{periodMessage}</span>
          </div>
        </div>
      )}

      {/* Formulário de Inscrição */}
      {periodState?.canRegister ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-2.5 text-karate-red mb-1">
              <User className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">{copy.officialForm}</span>
            </div>
            <h2 className="text-2xl font-bold font-jp text-neutral-900">
              Dados do Atleta
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {copy.fillCarefully} ({new Date(championship.dataCampeonato + "T00:00:00").toLocaleDateString(locale)}).
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
                  {copy.fullName} *
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
                  {copy.birthDate} *
                </label>
                <input
                  type="date"
                  required
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
                />
                {idadeNaDataCampeonato !== null && (
                  <div className="mt-1.5 space-y-1">
                    <p className="text-xs font-medium flex items-center gap-1.5 text-neutral-700">
                      <Sparkles className="w-3.5 h-3.5 text-karate-gold" />
                      {copy.ageAtEvent}:
                      <span className="font-bold text-neutral-900"> {idadeNaDataCampeonato} {copy.years}</span>
                      {isMenor && (
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                          {copy.minor}
                        </span>
                      )}
                    </p>
                    {championship && (
                      <p className={`text-[11px] font-semibold ${idadeForaDaFaixa ? "text-red-600" : "text-emerald-700"}`}>
                        {copy.allowedAge}: {championship.idadeMinima ?? 0} a {championship.idadeMaxima ?? 120} {copy.years}
                        {idadeForaDaFaixa ? ` — ${copy.ageOutside}` : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {copy.sexForCategories} *
                </label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as "Masculino" | "Feminino")}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red cursor-pointer"
                >
                  <option value="Masculino">{copy.male}</option>
                  <option value="Feminino">{copy.female}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {copy.currentGrade} *
                </label>
                <select
                  value={graduacao}
                  onChange={(e) => setGraduacao(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red cursor-pointer"
                >
                  {BELT_OPTIONS.map((belt) => (
                    <option key={belt} value={belt}>{beltDisplay[belt] || belt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {copy.bodyWeight} *
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
                  {copy.weightHelp}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {copy.athletePhone} *
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
                  {copy.athleteEmail} *
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

              {/* Informação Institucional de Participação e Modalidades do Evento */}
              <div className="sm:col-span-2 bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-karate-red shrink-0" />
                  <span className="text-xs font-bold text-neutral-900">
                    Participação: Todas as modalidades do campeonato
                  </span>
                </div>
                <div className="text-xs text-neutral-700 pl-6">
                  <strong>Modalidades do evento:</strong> {formatModalidadesList(championship.modalidades)}
                </div>
                <div className="text-[11px] text-neutral-500 pl-6 leading-relaxed">
                  A inscrição é única e o atleta compete em todas as modalidades oficiais configuradas para este evento de acordo com sua categoria etária e graduação.
                </div>
              </div>
            </div>

            {/* Bloco 2: Autorização de Responsável (Exibido se idade < 18) */}
            {isMenor && (
              <div className="bg-purple-50/70 border border-purple-200 p-5 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-purple-900">
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                  <h3 className="text-sm font-bold">{copy.minorAuthorization}</h3>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  O atleta possui <strong>{idadeNaDataCampeonato} anos</strong> na data do campeonato. Conforme o regulamento, é obrigatória a identificação e consentimento do responsável legal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      {copy.guardianName} *
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
                      {copy.guardianPhone} *
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
          <h3 className="text-lg font-bold font-jp text-neutral-800">{copy.registrationsUnavailable}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
            {periodState?.message || copy.formClosed}
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

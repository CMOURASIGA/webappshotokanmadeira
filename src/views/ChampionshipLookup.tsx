import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle, 
  Edit3, 
  Save, 
  X, 
  ExternalLink,
  ShieldAlert,
  Calendar,
  User,
  Scale
} from "lucide-react";
import { championshipService, getEnrollmentPeriodState } from "../services/championshipService";
import { AthleteRegistration, Championship } from "../types/championship";
import { generatePixCopiaECola, generatePixQrCodeDataUrl } from "../lib/pixUtils";
import { useAppData } from "../contexts/AppDataContext";

export function ChampionshipLookup() {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const { config } = useAppData();

  const [code, setCode] = useState(searchParams.get("code") || "");
  const [validationKey, setValidationKey] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registration, setRegistration] = useState<AthleteRegistration | null>(null);
  const [championship, setChampionship] = useState<Championship | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editPeso, setEditPeso] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editNomeResp, setEditNomeResp] = useState("");
  const [editTelResp, setEditTelResp] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Pix info for pending payments
  const [pixPayload, setPixPayload] = useState("");
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [receiptMarked, setReceiptMarked] = useState(false);

  // Carregar dados se tiver código na URL e já tiver sido consultado
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setCode(urlCode);
    }
    if (slug) {
      const c = championshipService.getChampionshipBySlug(slug);
      if (c) setChampionship(c);
    }
  }, [slug, searchParams]);

  // Gerar PIX se o pagamento estiver pendente
  useEffect(() => {
    if (registration && championship && registration.paymentStatus !== "PAGAMENTO_CONFIRMADO") {
      const payload = generatePixCopiaECola({
        config: championship.configuracaoPix,
        amount: registration.valorInscricao,
        txid: "***"
      });
      setPixPayload(payload);
      generatePixQrCodeDataUrl(payload)
        .then(setPixQrCodeUrl)
        .catch(err => console.error("Erro ao gerar QR code:", err));
    }
  }, [registration, championship]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaveSuccess(false);

    if (!code.trim() || !validationKey.trim()) {
      setErrorMsg("Informe o código da inscrição e o dado de validação.");
      return;
    }

    const reg = championshipService.lookupRegistration(code.trim(), validationKey.trim());
    if (!reg) {
      setErrorMsg("Nenhuma inscrição encontrada com este código e dados de validação. Verifique seu código, e-mail ou data de nascimento digitados.");
      setRegistration(null);
      return;
    }

    setRegistration(reg);
    const champ = championshipService.getChampionshipById(reg.championshipId);
    if (champ) setChampionship(champ);

    // Carregar dados de edição
    setEditPeso(String(reg.peso));
    setEditTelefone(reg.telefone);
    setEditEmail(reg.email);
    setEditNomeResp(reg.nomeResponsavel || "");
    setEditTelResp(reg.telefoneResponsavel || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration || !championship) return;

    try {
      const numericWeight = parseFloat(editPeso.replace(",", "."));
      if (isNaN(numericWeight) || numericWeight <= 0) {
        throw new Error("Peso corporal inválido.");
      }

      const updated = championshipService.updateRegistrationByAthlete(
        registration.id,
        championship,
        {
          peso: numericWeight,
          telefone: editTelefone,
          email: editEmail,
          nomeResponsavel: editNomeResp,
          telefoneResponsavel: editTelResp
        }
      );

      setRegistration(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao salvar alterações.");
    }
  };

  const handleCopyPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleMarkReceiptSent = () => {
    if (!registration) return;
    const updated = championshipService.markReceiptSentByAthlete(registration.id);
    setRegistration(updated);
    setReceiptMarked(true);
  };

  const generateWhatsAppReceiptUrl = () => {
    if (!registration) return "#";
    const rawNumber = config.whatsapp || "5521973681109";
    const cleanNumber = rawNumber.replace(/\D/g, "");

    const message = `Olá! Estou enviando o comprovante da inscrição do campeonato.\n\n` +
      `🥋 *Inscrição:* ${registration.id}\n` +
      `👤 *Atleta:* ${registration.nomeCompleto}\n` +
      `⚔️ *Modalidade:* ${registration.modalidade}\n` +
      `💰 *Valor:* R$ ${registration.valorInscricao.toFixed(2).replace(".", ",")}\n\n` +
      `_Segue em anexo o comprovante de pagamento PIX para conferência._`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const periodState = championship ? getEnrollmentPeriodState(championship) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Navegação Topo */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <Link 
          to={championship ? `/campeonatos/${championship.slug}` : "/"} 
          className="inline-flex items-center gap-1 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Campeonato
        </Link>
      </div>

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-karate-red/10 text-karate-red flex items-center justify-center mx-auto">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-jp text-neutral-900">Consulta de Inscrição</h1>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">
          Acesse os dados da sua inscrição, verifique o status do pagamento ou atualize suas informações durante o período de inscrições abertas.
        </p>
      </div>

      {/* Formulário de Busca e Validação de Segurança */}
      <form onSubmit={handleLookup} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Código da Inscrição *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: CAM2026-0001"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Dado de Validação (E-mail, Telefone ou Data de Nasc.) *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: seu e-mail cadastrado ou telefone"
              value={validationKey}
              onChange={(e) => setValidationKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Consultar Inscrição
        </button>
      </form>

      {/* Resultados da Inscrição Encontrada */}
      {registration && championship && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in slide-in-from-bottom-3 duration-300">
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dados da inscrição atualizados com sucesso e salvos no histórico!</span>
            </div>
          )}

          {/* Cabeçalho da Inscrição */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 block uppercase">Código de Inscrição</span>
              <h2 className="text-2xl font-bold font-mono text-neutral-900">{registration.id}</h2>
              <span className="text-xs text-neutral-600 block mt-0.5">{registration.championshipName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Inscrição */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                registration.status === "CONFIRMADA"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : registration.status === "CANCELADA"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
                Inscrição: {registration.status}
              </span>

              {/* Status Pagamento */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                registration.paymentStatus === "PAGAMENTO_CONFIRMADO"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : registration.paymentStatus === "PAGAMENTO_REJEITADO"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : registration.paymentStatus === "AGUARDANDO_CONFERENCIA"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                Pagamento: {registration.paymentStatus}
              </span>
            </div>
          </div>

          {/* Dados do Atleta */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 font-jp">Dados do Atleta</h3>
                {periodState?.canRegister && registration.status !== "CANCELADA" && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-karate-red font-semibold hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Editar Informações
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                <p><strong>Nome Completo:</strong> {registration.nomeCompleto}</p>
                <p><strong>Participação:</strong> <span className="text-karate-red font-bold">{registration.modalidade || "Todas as Modalidades (Kata e Kumite)"}</span></p>
                <p><strong>Graduação:</strong> {registration.graduacao}</p>
                <p><strong>Peso Informado:</strong> {registration.peso} kg</p>
                <p><strong>Idade no Campeonato:</strong> {registration.idadeNaDataCampeonato} anos {registration.isMenor ? "(Menor)" : ""}</p>
                <p><strong>Sexo:</strong> {registration.sexo}</p>
                <p><strong>Telefone:</strong> {registration.telefone}</p>
                <p><strong>E-mail:</strong> {registration.email}</p>
                <p className="col-span-1 sm:col-span-2">
                  <strong>Categoria Oficial:</strong> {registration.categoriaNome || "A ser designada pela comissão técnica"}
                </p>
                {registration.nomeResponsavel && (
                  <p className="col-span-1 sm:col-span-2 pt-2 border-t border-neutral-200/60">
                    <strong>Responsável Legal:</strong> {registration.nomeResponsavel} — Tel: {registration.telefoneResponsavel}
                  </p>
                )}
              </div>

              {/* Informação sobre cancelamento */}
              <p className="text-[11px] text-neutral-400 italic">
                * Para cancelamento de inscrição, entre em contato direto com a administração do Dojo Madeira Karate. Apenas a comissão organizadora possui autorização para cancelar inscrições.
              </p>
            </div>
          ) : (
            /* Formulário de Edição pelo Atleta */
            <form onSubmit={handleSaveEdit} className="space-y-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-xs font-bold text-neutral-800">Editando Inscrição</span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-neutral-500 hover:text-neutral-800 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Peso (kg) *</label>
                  <input
                    type="text"
                    required
                    value={editPeso}
                    onChange={(e) => setEditPeso(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={editTelefone}
                    onChange={(e) => setEditTelefone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                  />
                </div>

                {registration.isMenor && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome do Responsável *</label>
                      <input
                        type="text"
                        required
                        value={editNomeResp}
                        onChange={(e) => setEditNomeResp(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Telefone do Responsável *</label>
                      <input
                        type="tel"
                        required
                        value={editTelResp}
                        onChange={(e) => setEditTelResp(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2 bg-neutral-100 p-2.5 rounded-xl text-neutral-600 text-[11px]">
                  <strong>Participação Integral:</strong> O atleta está inscrito em todas as modalidades do campeonato (Kata e Kumite).
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-karate-red hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* Bloco de Pagamento PIX (se ainda não confirmado) */}
          {registration.paymentStatus !== "PAGAMENTO_CONFIRMADO" && (
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <div className="flex items-center gap-2 text-neutral-900">
                <QrCode className="w-5 h-5 text-karate-red" />
                <h4 className="text-sm font-bold font-jp">Pagamento PIX da Inscrição</h4>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 justify-center">
                {pixQrCodeUrl && (
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-200 shrink-0">
                    <img 
                      src={pixQrCodeUrl} 
                      alt="QR Code Pix" 
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                )}

                <div className="space-y-2 text-center sm:text-left flex-1 max-w-sm">
                  <p className="text-xs text-neutral-600">
                    Valor: <strong className="text-neutral-900 font-mono text-sm">R$ {registration.valorInscricao.toFixed(2).replace(".", ",")}</strong>
                  </p>
                  <p className="text-xs text-neutral-600">
                    Chave: <span className="font-mono bg-white p-1 rounded border border-neutral-200 text-neutral-800 text-[11px] break-all">{championship.configuracaoPix.chave}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPix ? "Código Pix Copiado!" : "Copiar PIX Copia e Cola"}
                  </button>
                </div>
              </div>

              {/* Botão de Envio de Comprovante */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-neutral-200/60">
                <a
                  href={generateWhatsAppReceiptUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar Comprovante pelo WhatsApp
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={handleMarkReceiptSent}
                  disabled={receiptMarked || registration.paymentStatus === "AGUARDANDO_CONFERENCIA"}
                  className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {receiptMarked || registration.paymentStatus === "AGUARDANDO_CONFERENCIA"
                    ? "Comprovante já enviado"
                    : "Informar envio do comprovante"}
                </button>
              </div>
            </div>
          )}

          {/* Histórico de Alterações / Auditoria */}
          {registration.auditLogs && registration.auditLogs.length > 0 && (
            <div className="border-t border-neutral-100 pt-4 space-y-2">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block">
                Histórico e Rastreabilidade da Inscrição:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {registration.auditLogs.map((log, index) => (
                  <div key={index} className="text-[11px] text-neutral-600 bg-neutral-50 p-2 rounded-lg flex items-start justify-between gap-2">
                    <span>{log.details}</span>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                      {new Date(log.timestamp).toLocaleDateString("pt-BR")} {new Date(log.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle, 
  AlertCircle,
  HelpCircle,
  User,
  Phone,
  Mail,
  Loader2
} from "lucide-react";
import { useMadeiraStoreCart } from "../../contexts/MadeiraStoreCartContext";
import { useAppData } from "../../contexts/AppDataContext";
import { madeiraStoreService } from "../../services/madeiraStoreService";
import { generatePixCopiaECola, generatePixQrCodeDataUrl } from "../../lib/pixUtils";
import { StoreOrder } from "../../types/storeOrder";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

export function MadeiraStoreCartDrawer() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalItems, 
    totalAmount, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen 
  } = useMadeiraStoreCart();

  const { config } = useAppData();
  const { language, locale } = useLanguage();
  const copy = language === "en"
    ? {
        nameError: "Enter your full name.", phoneError: "Enter a valid phone / WhatsApp number with area code.",
        emailError: "Enter a valid email address for order confirmation.", orderError: "Unable to place the order. Please try again.",
        tokenError: "This order does not yet have a pickup token. Please contact the Madeira Karate staff.",
        receiptTitle: "ORDER RECEIPT", order: "Order", customer: "Customer", date: "Date", value: "Amount", status: "Status",
        presentQr: "Present this QR Code when collecting your order.", qrHelp: "The staff can check and confirm delivery using this QR Code.",
        whatsappIntro: "Hello! I am sending the payment receipt for my MadeiraStore order.", whatsappAttachment: "The PIX receipt is attached for verification.",
        cartTitle: "MadeiraStore Cart", checkoutTitle: "Complete Purchase", createdTitle: "Order Created!", item: "item", items: "items",
        selected: "selected", buyerData: "Enter buyer information", code: "Code", close: "Close", emptyCart: "Your cart is empty",
        emptyHint: "Browse MadeiraStore products and select the items you want.", viewProducts: "View Products", removeItem: "Remove item",
        size: "Size", color: "Color", option: "Option", customization: "Customization", decrease: "Decrease quantity", increase: "Increase quantity",
        summary: "Purchase Summary", total: "Total", fullName: "Full Name", nameExample: "Example: John Smith", phone: "Phone / WhatsApp",
        confirmEmail: "Confirmation Email", notes: "Notes (optional)", notesPlaceholder: "Pickup instructions or order details...",
        pickup: "In-person pickup", pickupText: "Products are collected at the Madeira Karate dojo after payment confirmation.",
        back: "Back", generating: "Creating Official Order...", createdSuccess: "Order Created Successfully!", totalValue: "Total Amount",
        payPix: "Pay with PIX", pixQrAlt: "PIX QR Code for payment", pixCopyPaste: "PIX Copy and Paste", pixCopied: "PIX Code Copied!",
        copyPix: "Copy PIX Code", receiptSaved: "Receipt saved", saveReceipt: "Save your receipt to continue",
        receiptExplain: "The receipt includes your order number and a QR Code for pickup verification.", downloadAgain: "Download receipt again",
        downloadReceipt: "Download order receipt", paymentReported: "Payment reported!", paymentDone: "I have already paid",
        paymentExplain: "Payment will be confirmed after Madeira Karate verifies the receipt.", sendWhatsapp: "Send receipt via WhatsApp",
        downloadBefore: "Download the receipt before continuing", trackOrder: "Track order", subtotal: "Items subtotal",
        grandTotal: "Grand Total", continueCheckout: "Continue to Checkout"
      }
    : language === "ja"
    ? {
        nameError: "氏名を入力してください。", phoneError: "市外局番を含む有効な電話番号 / WhatsApp を入力してください。",
        emailError: "注文確認用の有効なメールアドレスを入力してください。", orderError: "注文を登録できませんでした。もう一度お試しください。",
        tokenError: "この注文には受取用トークンがありません。Madeira Karate のスタッフにお問い合わせください。",
        receiptTitle: "注文控え", order: "注文", customer: "お客様", date: "日時", value: "金額", status: "状況",
        presentQr: "商品受取時にこのQRコードをご提示ください。", qrHelp: "スタッフがQRコードで注文確認と受渡し確認を行います。",
        whatsappIntro: "こんにちは。MadeiraStore の注文に関する支払証明を送付します。", whatsappAttachment: "確認用の PIX 支払証明を添付します。",
        cartTitle: "MadeiraStore カート", checkoutTitle: "注文を確定", createdTitle: "注文を作成しました", item: "点", items: "点",
        selected: "選択中", buyerData: "購入者情報を入力してください", code: "コード", close: "閉じる", emptyCart: "カートは空です",
        emptyHint: "MadeiraStore の商品から希望の商品を選択してください。", viewProducts: "商品を見る", removeItem: "商品を削除",
        size: "サイズ", color: "色", option: "種類", customization: "カスタマイズ", decrease: "数量を減らす", increase: "数量を増やす",
        summary: "注文内容", total: "合計", fullName: "氏名", nameExample: "例: 山田 太郎", phone: "電話 / WhatsApp",
        confirmEmail: "確認用メール", notes: "備考（任意）", notesPlaceholder: "受取方法や注文に関する補足...",
        pickup: "道場での受取", pickupText: "支払確認後、Madeira Karate の道場で商品を受け取ります。",
        back: "戻る", generating: "注文を作成中...", createdSuccess: "注文が完了しました", totalValue: "合計金額",
        payPix: "PIX で支払う", pixQrAlt: "PIX 支払用QRコード", pixCopyPaste: "PIX コピー＆ペースト", pixCopied: "PIX コードをコピーしました",
        copyPix: "PIX コードをコピー", receiptSaved: "注文控えを保存しました", saveReceipt: "続行するには注文控えを保存してください",
        receiptExplain: "注文控えには注文番号と受取確認用QRコードが含まれます。", downloadAgain: "注文控えを再ダウンロード",
        downloadReceipt: "注文控えをダウンロード", paymentReported: "支払済みとして送信しました", paymentDone: "支払いを完了しました",
        paymentExplain: "Madeira Karate が支払証明を確認した後、支払いが確定されます。", sendWhatsapp: "WhatsApp で支払証明を送る",
        downloadBefore: "続行する前に注文控えをダウンロードしてください", trackOrder: "注文状況を確認", subtotal: "商品小計",
        grandTotal: "合計金額", continueCheckout: "注文手続きへ"
      }
    : {
        nameError: "Informe o seu nome completo.", phoneError: "Informe um telefone / WhatsApp válido com DDD.",
        emailError: "Informe um e-mail válido para confirmação do pedido.", orderError: "Erro ao registrar o pedido. Tente novamente.",
        tokenError: "O pedido ainda não possui token de retirada. Entre em contato com a equipe Madeira Karate.",
        receiptTitle: "COMPROVANTE DE PEDIDO", order: "Pedido", customer: "Cliente", date: "Data", value: "Valor", status: "Status",
        presentQr: "Apresente este QR Code na retirada do pedido.", qrHelp: "O responsável poderá consultar e confirmar a entrega pelo QR Code.",
        whatsappIntro: "Olá! Estou enviando o comprovante do meu pedido na MadeiraStore.", whatsappAttachment: "Segue em anexo o comprovante PIX para conferência.",
        cartTitle: "Carrinho MadeiraStore", checkoutTitle: "Finalizar Compra", createdTitle: "Pedido Criado!", item: "item", items: "itens",
        selected: "selecionados", buyerData: "Informe os dados do comprador", code: "Código", close: "Fechar", emptyCart: "Seu carrinho está vazio",
        emptyHint: "Navegue pelos produtos da MadeiraStore e selecione os itens desejados.", viewProducts: "Ver Produtos", removeItem: "Remover item",
        size: "Tam", color: "Cor", option: "Opção", customization: "Gravação", decrease: "Diminuir quantidade", increase: "Aumentar quantidade",
        summary: "Resumo da Compra", total: "Total", fullName: "Nome Completo", nameExample: "Ex: Carlos Moura", phone: "Telefone / WhatsApp",
        confirmEmail: "E-mail para Confirmação", notes: "Observações (opcional)", notesPlaceholder: "Instruções sobre retirada ou detalhes do pedido...",
        pickup: "Retirada presencial", pickupText: "A retirada dos produtos é feita no dojo Madeira Karate após a confirmação do pagamento.",
        back: "Voltar", generating: "Gerando Pedido Oficial...", createdSuccess: "Pedido Criado com Sucesso!", totalValue: "Valor Total",
        payPix: "Pague com PIX", pixQrAlt: "QR Code PIX para pagamento", pixCopyPaste: "PIX Copia e Cola", pixCopied: "Código PIX Copiado!",
        copyPix: "Copiar Código PIX", receiptSaved: "Comprovante salvo", saveReceipt: "Salve seu comprovante para continuar",
        receiptExplain: "O comprovante contém o número do pedido e um QR Code para consulta e confirmação da retirada.", downloadAgain: "Baixar comprovante novamente",
        downloadReceipt: "Baixar comprovante do pedido", paymentReported: "Pagamento informado!", paymentDone: "Já realizei o pagamento",
        paymentExplain: "O pagamento será confirmado após conferência do comprovante pela Madeira Karate.", sendWhatsapp: "Enviar comprovante pelo WhatsApp",
        downloadBefore: "Baixe o comprovante antes de continuar", trackOrder: "Acompanhar status do pedido", subtotal: "Subtotal dos itens",
        grandTotal: "Total Geral", continueCheckout: "Continuar para Checkout"
      };

  // Checkout flow state
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Success / PIX state
  const [createdOrder, setCreatedOrder] = useState<StoreOrder | null>(null);
  const [pixPayload, setPixPayload] = useState<string>("");
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState<string>("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [markedPaymentSent, setMarkedPaymentSent] = useState(false);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleStartCheckout = () => {
    if (items.length === 0) return;
    setSubmitError(null);
    setStep("checkout");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!nomeCliente.trim()) {
      setSubmitError(copy.nameError);
      return;
    }
    if (!telefone.trim() || telefone.replace(/\D/g, "").length < 10) {
      setSubmitError(copy.phoneError);
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitError(copy.emailError);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Enviar criação do pedido ao backend/planilha
      const orderPayload = {
        nomeCliente: nomeCliente.trim(),
        telefone: telefone.trim(),
        email: email.trim().toLowerCase(),
        observacoes: observacoes.trim() || undefined,
        itens: items.map(item => ({
          produtoId: item.productId,
          produtoNome: item.product.name,
          categoria: item.product.category,
          quantidade: item.quantity,
          tamanho: item.selectedSize,
          cor: item.selectedColor,
          variacao: item.selectedVariation,
          personalizacao: item.customizationText,
          valorUnitario: item.unitPrice,
          subtotal: item.subtotal
        }))
      };

      const newOrder = await madeiraStoreService.createOrder(orderPayload);
      setCreatedOrder(newOrder);

      // 2. Gerar PIX com valor exato do pedido
      const pixConfig = await madeiraStoreService.getPixConfig();
      const payload = generatePixCopiaECola({
        config: pixConfig,
        amount: newOrder.valorTotal,
        txid: newOrder.codigo.replace(/[^a-zA-Z0-9]/g, "")
      });
      setPixPayload(payload);

      const qrUrl = await generatePixQrCodeDataUrl(payload);
      setPixQrCodeUrl(qrUrl);

      // 3. Limpar carrinho após confirmação do pedido
      clearCart();
      setStep("success");
    } catch (err: any) {
      console.error("[MadeiraStore] Erro ao criar pedido:", err);
      setSubmitError(err.message || copy.orderError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!createdOrder?.tokenRetirada) {
      setSubmitError(copy.tokenError);
      return;
    }

    const pickupUrl = `${window.location.origin}${window.location.pathname}#/madeirastore/retirada/${createdOrder.tokenRetirada}`;
    const pickupQr = await generatePixQrCodeDataUrl(pickupUrl);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";
    ctx.textAlign = "center";
    ctx.font = "700 42px Arial";
    ctx.fillText("MADEIRA KARATE", 540, 130);
    ctx.font = "700 30px Arial";
    ctx.fillText(copy.receiptTitle, 540, 205);

    try {
      if (config.logo) {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          logo.onload = () => resolve();
          logo.onerror = () => resolve();
          logo.src = config.logo;
        });
        if (logo.width) ctx.drawImage(logo, 455, 245, 170, 170);
      }
    } catch {}

    ctx.textAlign = "left";
    ctx.font = "700 36px Arial";
    ctx.fillText(`${copy.order}: ${createdOrder.codigo}`, 100, 500);
    ctx.font = "400 28px Arial";
    ctx.fillText(`${copy.customer}: ${createdOrder.nomeCliente}`, 100, 555);
    ctx.fillText(`${copy.date}: ${new Date(createdOrder.dataCriacao).toLocaleString(locale)}`, 100, 605);
    ctx.fillText(`${copy.value}: R$ ${createdOrder.valorTotal.toFixed(2).replace(".", ",")}`, 100, 655);
    ctx.fillText(`${copy.status}: ${createdOrder.statusPedido}`, 100, 705);

    const qr = new Image();
    await new Promise<void>((resolve) => {
      qr.onload = () => resolve();
      qr.onerror = () => resolve();
      qr.src = pickupQr;
    });
    if (qr.width) ctx.drawImage(qr, 315, 790, 450, 450);

    ctx.textAlign = "center";
    ctx.font = "700 28px Arial";
    ctx.fillText(copy.presentQr, 540, 1300);
    ctx.font = "400 22px Arial";
    ctx.fillStyle = "#555555";
    ctx.fillText(copy.qrHelp, 540, 1350);
    ctx.fillText(createdOrder.codigo, 540, 1420);

    const link = document.createElement("a");
    link.download = `MadeiraStore-${createdOrder.codigo}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setReceiptDownloaded(true);
  };

  const handleCopyPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleMarkPaymentDone = async () => {
    if (!createdOrder) return;
    try {
      const updated = await madeiraStoreService.markPaymentSent(createdOrder.id);
      setCreatedOrder(updated);
      setMarkedPaymentSent(true);
    } catch (e) {
      console.error("Erro ao informar pagamento:", e);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!createdOrder) return "#";
    const rawNumber = config.whatsapp || "5521973681109";
    const cleanNumber = rawNumber.replace(/\D/g, "");

    const msg = `${copy.whatsappIntro}\n\n` +
      `${copy.order}: ${createdOrder.codigo}\n` +
      `${copy.customer}: ${createdOrder.nomeCliente}\n` +
      `${copy.value}: R$ ${createdOrder.valorTotal.toFixed(2).replace(".", ",")}\n\n` +
      copy.whatsappAttachment;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  const handleClose = () => {
    setIsCartDrawerOpen(false);
    if (step === "success") {
      setStep("cart");
      setCreatedOrder(null);
      setPixPayload("");
      setPixQrCodeUrl("");
      setMarkedPaymentSent(false);
      setReceiptDownloaded(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-[100dvh] max-h-[100dvh] min-h-0 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-karate-red flex items-center justify-center font-bold text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base leading-tight">
                {step === "cart" && copy.cartTitle}
                {step === "checkout" && copy.checkoutTitle}
                {step === "success" && copy.createdTitle}
              </h2>
              <span className="text-[10px] text-neutral-400 block">
                {step === "cart" && `${totalItems} ${totalItems === 1 ? copy.item : copy.items} ${copy.selected}`}
                {step === "checkout" && copy.buyerData}
                {step === "success" && `${copy.code}: ${createdOrder?.codigo}`}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label={copy.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {/* ETAPA 1: CARRINHO */}
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                  </div>
                  <h3 className="font-bold text-neutral-800 text-base mb-1">{copy.emptyCart}</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mb-6">
                    {copy.emptyHint}
                  </p>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    {copy.viewProducts}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex gap-3 items-start"
                    >
                      {item.product.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-neutral-200 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-2 leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                            title={copy.removeItem}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variações */}
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-neutral-600">
                          {item.selectedSize && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium">
                              {copy.size}: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium">
                              {copy.color}: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedVariation && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium">
                              {copy.option}: {item.selectedVariation}
                            </span>
                          )}
                          {item.customizationText && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 italic block w-full mt-0.5">
                              {copy.customization}: "{item.customizationText}"
                            </span>
                          )}
                        </div>

                        {/* Preço e Quantidade */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-neutral-100 text-neutral-700 transition-colors"
                              aria-label={copy.decrease}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-900 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-neutral-100 text-neutral-700 transition-colors"
                              aria-label={copy.increase}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-bold text-xs sm:text-sm text-neutral-900">
                            R$ {item.subtotal.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ETAPA 2: FORMULÁRIO DE CHECKOUT */}
          {step === "checkout" && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  {copy.summary}
                </span>
                <p className="text-xs font-semibold text-neutral-800">
                  {totalItems} {totalItems === 1 ? copy.item : copy.items} {copy.selected}
                </p>
                <p className="text-lg font-black text-karate-red font-mono mt-0.5">
                  {copy.total}: R$ {totalAmount.toFixed(2).replace(".", ",")}
                </p>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {copy.fullName} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      placeholder={copy.nameExample}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {copy.phone} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Ex: (21) 97368-1109"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {copy.confirmEmail} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {copy.notes}
                  </label>
                  <textarea
                    rows={2}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder={copy.notesPlaceholder}
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-snug">
                📍 <strong>{copy.pickup}:</strong> {copy.pickupText}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep("cart")}
                  className="px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-xl"
                >
                  {copy.back}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-karate-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{copy.generating}</span>
                    </>
                  ) : (
                    <>
                      <span>{copy.checkoutTitle}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ETAPA 3: TELA DE SUCESSO & PAGAMENTO PIX */}
          {step === "success" && createdOrder && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-sm text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">
                  {copy.createdSuccess}
                </span>
                <h3 className="text-xl font-black font-mono mt-0.5">
                  {createdOrder.codigo}
                </h3>
                <p className="text-sm font-bold text-white mt-1">
                  {copy.totalValue}: R$ {createdOrder.valorTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>

              {/* QR Code PIX */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-center space-y-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  {copy.payPix}
                </span>

                {pixQrCodeUrl ? (
                  <div className="bg-white p-3 rounded-xl border border-neutral-200 inline-block shadow-xs">
                    <img
                      src={pixQrCodeUrl}
                      alt={copy.pixQrAlt}
                      className="w-44 h-44 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-neutral-200 animate-pulse rounded-xl mx-auto" />
                )}

                {/* Copia e Cola */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide block">
                    {copy.pixCopyPaste}
                  </span>
                  <div className="p-2 bg-white rounded-lg border border-neutral-300 text-[11px] font-mono break-all text-neutral-700 max-h-16 overflow-y-auto">
                    {pixPayload}
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="w-full py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{copy.pixCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{copy.copyPix}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border space-y-3 ${receiptDownloaded ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-300"}`}>
                <div className="text-center">
                  <span className="text-xs font-bold block">{receiptDownloaded ? copy.receiptSaved : copy.saveReceipt}</span>
                  <p className="text-[11px] text-neutral-600 mt-1">
                    {copy.receiptExplain}
                  </p>
                </div>
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full py-3 px-4 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{receiptDownloaded ? copy.downloadAgain : copy.downloadReceipt}</span>
                </button>
              </div>

              {/* Botão Já Realizei o Pagamento */}
              <div className="p-3 bg-neutral-100 rounded-xl space-y-2">
                <button
                  onClick={handleMarkPaymentDone}
                  disabled={markedPaymentSent || !receiptDownloaded}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    markedPaymentSent
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 cursor-pointer shadow-xs"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{markedPaymentSent ? copy.paymentReported : copy.paymentDone}</span>
                </button>
                <p className="text-[11px] text-neutral-600 text-center">
                  {copy.paymentExplain}
                </p>
              </div>

              {/* Botão de Envio de Comprovante via WhatsApp */}
              {receiptDownloaded ? (
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{copy.sendWhatsapp}</span>
                </a>
              ) : (
                <div className="w-full py-3 px-4 bg-neutral-300 text-neutral-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                  <MessageCircle className="w-4 h-4" />
                  <span>{copy.downloadBefore}</span>
                </div>
              )}

              {/* Link para consulta */}
              <div className="pt-2 text-center">
                <Link
                  to={`/madeirastore/pedido`}
                  onClick={handleClose}
                  className="text-xs text-karate-red hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>{copy.trackOrder} {createdOrder.codigo}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Apenas no passo do carrinho) */}
        {step === "cart" && items.length > 0 && (
          <div className="shrink-0 p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>{copy.subtotal}:</span>
              <span className="font-bold text-neutral-900 font-mono">
                R$ {totalAmount.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="flex items-center justify-between text-base font-extrabold text-neutral-900 pt-1 border-t border-neutral-200">
              <span>{copy.grandTotal}:</span>
              <span className="text-karate-red font-mono">
                R$ {totalAmount.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <button
              onClick={handleStartCheckout}
              className="w-full py-3 px-4 rounded-xl bg-karate-red hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>{copy.continueCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

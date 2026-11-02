import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight,
  Copy, 
  Check, 
  HelpCircle, 
  ExternalLink, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  Filter, 
  RefreshCw,
  Clock,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../contexts/AppDataContext";
import { useCart } from "../contexts/CartContext";
import { ProductCardV2 } from "../components/store/ProductCardV2";
import { ChampionshipPromoBanner } from "../components/championship/ChampionshipPromoBanner";
import { useLanguage } from "../i18n/LanguageContext";

export function Store() {
  const navigate = useNavigate();
  const { products, config, loading, productsError } = useAppData();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { language } = useLanguage();
  const copy = language === "en"
    ? { back: "Back", viewOrder: "View My Order", viewCart: "View Cart", selectedOrder: "Selected Order", savedDevice: "Saved on this device", itemWaiting: "item ready to send", itemsWaiting: "items ready to send", reviewSend: "Review & Send Order", commercial: "COMMERCIAL AREA", madeiraTitle: "Discover MadeiraStore: products, accessories, fitness items and partner products", madeiraText: "Products for students and the community with formal checkout and exact PIX amount.", accessMadeira: "Open MadeiraStore", howOrder: "How does ordering from Madeira Karate work?", howOrderText: "No advance charge: stock and size availability are confirmed by the staff via WhatsApp.", hidePix: "Hide PIX details", showPix: "View PIX Key", choose: "Choose", chooseText: "Select size, color and items in the cart.", whatsappText: "The item list is sent to the dojo staff.", confirmation: "Confirmation", confirmationText: "The team confirms stock and timing at the dojo.", pickup: "Pickup", pickupText: "Secure PIX after confirmation, then collect at the dojo.", attention: "Attention", attentionText: "Please only make the transfer after the staff confirms availability of your size.", officialPix: "Official PIX Key", copied: "Copied!", copyKey: "Copy Key", paymentInfo: "Payment details will be provided by the dojo staff after the order and item availability are confirmed.", officialArticles: "Official JKA Articles", storeTitle: "Official Dojo Store", localMemory: "Local memory", securePix: "Secure PIX", filter: "Filter", all: "All", loading: "Loading official store catalog...", loadError: "Unable to load the store", loadErrorText: "There was a temporary issue connecting to the product spreadsheet. Try reloading or contact the dojo staff via WhatsApp.", tryAgain: "Try Again", contactStaff: "Contact Staff", noProducts: "No products available at the moment", noProductsText: "We are updating our stock of dogi, belts and uniforms. Contact the dojo staff for special orders or sizing questions.", whatsappStaff: "Contact Staff on WhatsApp", noCategory: "No products are registered in the selected category.", viewAll: "View all products" }
    : language === "ja"
    ? { back: "戻る", viewOrder: "注文内容を見る", viewCart: "カートを見る", selectedOrder: "選択中の商品", savedDevice: "この端末に保存", itemWaiting: "点を送信待ち", itemsWaiting: "点を送信待ち", reviewSend: "確認して注文を送る", commercial: "商品エリア", madeiraTitle: "MadeiraStore: 商品、アクセサリー、フィットネス用品、提携商品", madeiraText: "会員とコミュニティ向けの商品を、正式な注文手続きと正確な PIX 金額でご案内します。", accessMadeira: "MadeiraStore を開く", howOrder: "Madeira Karate の注文方法", howOrderText: "前払いはありません。在庫とサイズは WhatsApp でスタッフが確認します。", hidePix: "PIX 情報を隠す", showPix: "PIX キーを見る", choose: "選択", chooseText: "サイズ、色、商品を選んでカートに追加します。", whatsappText: "商品一覧を道場スタッフへ送信します。", confirmation: "確認", confirmationText: "スタッフが道場で在庫と受取時期を確認します。", pickup: "受取", pickupText: "確認後に PIX で支払い、道場で受け取ります。", attention: "ご注意", attentionText: "サイズの在庫確認が完了してから送金してください。", officialPix: "公式 PIX キー", copied: "コピーしました", copyKey: "キーをコピー", paymentInfo: "注文内容と在庫を確認した後、道場スタッフから支払情報をご案内します。", officialArticles: "JKA 公式用品", storeTitle: "道場公式ストア", localMemory: "端末に保存", securePix: "安全な PIX", filter: "絞り込み", all: "すべて", loading: "公式ストアの商品を読み込み中...", loadError: "ストアを読み込めませんでした", loadErrorText: "商品スプレッドシートとの通信に一時的な問題が発生しました。再読み込みするか WhatsApp で道場スタッフにお問い合わせください。", tryAgain: "再試行", contactStaff: "スタッフに連絡", noProducts: "現在販売中の商品はありません", noProductsText: "道着、帯、ユニフォームの在庫を更新中です。特別注文やサイズについては道場スタッフにお問い合わせください。", whatsappStaff: "WhatsApp で問い合わせ", noCategory: "選択したカテゴリに商品はありません。", viewAll: "すべての商品を見る" }
    : { back: "Voltar", viewOrder: "Ver Meu Pedido", viewCart: "Ver Carrinho", selectedOrder: "Pedido Selecionado", savedDevice: "Salvo no aparelho", itemWaiting: "item aguardando envio", itemsWaiting: "itens aguardando envio", reviewSend: "Conferir & Enviar Pedido", commercial: "ÁREA COMERCIAL", madeiraTitle: "Conheça a MadeiraStore: produtos, acessórios, itens fitness e produtos parceiros", madeiraText: "Produtos para alunos e comunidade com checkout formal e PIX com valor exato.", accessMadeira: "Acessar MadeiraStore", howOrder: "Como funciona o pedido na Madeira Karate?", howOrderText: "Sem cobrança antecipada: reserva de estoque e tamanho confirmados pela secretaria via WhatsApp.", hidePix: "Ocultar dados do PIX", showPix: "Consultar Chave PIX", choose: "Escolha", chooseText: "Selecione tamanho, cor e itens no carrinho.", whatsappText: "Envio automático da lista para a secretaria.", confirmation: "Confirmação", confirmationText: "Equipe confirma estoque e prazos no dojo.", pickup: "Retirada", pickupText: "PIX seguro após confirmação e retirada no treino.", attention: "Atenção", attentionText: "Por gentileza, só realize a transferência após a confirmação da disponibilidade do seu tamanho pela secretaria.", officialPix: "Chave PIX Oficial", copied: "Copiada!", copyKey: "Copiar Chave", paymentInfo: "Os dados de pagamento serão fornecidos pela secretaria após a confirmação do pedido e disponibilidade dos itens.", officialArticles: "Artigos Oficiais JKA", storeTitle: "Loja Oficial do Dojo", localMemory: "Memória local", securePix: "PIX seguro", filter: "Filtrar", all: "Todos", loading: "Carregando catálogo da loja oficial...", loadError: "Não foi possível carregar a loja", loadErrorText: "Ocorreu uma instabilidade na conexão com a planilha de produtos. Por favor, tente recarregar ou contate a secretaria diretamente pelo WhatsApp.", tryAgain: "Tentar Novamente", contactStaff: "Falar com a Secretaria", noProducts: "Nenhum produto disponível no momento", noProductsText: "Estamos atualizando nosso estoque de dogis, faixas e uniformes. Consulte a secretaria do dojo para encomendas especiais ou dúvidas de tamanhos.", whatsappStaff: "Consultar Secretaria no WhatsApp", noCategory: "Nenhum produto cadastrado para a categoria selecionada.", viewAll: "Ver todos os produtos" };

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedPix, setCopiedPix] = useState(false);
  const [showPixDetails, setShowPixDetails] = useState(false);

  // Catálogo oficial Madeira: fonte exclusiva na aba Produtos
  const storeProducts = useMemo(() => products, [products]);

  // Extrair categorias reais existentes dos produtos da loja oficial
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    storeProducts.forEach((p) => {
      if (p.category && p.category.trim() !== "") {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [storeProducts]);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return storeProducts;
    return storeProducts.filter((p) => p.category === selectedCategory);
  }, [storeProducts, selectedCategory]);

  const copyPixKey = () => {
    if (!config.pix) return;
    navigator.clipboard.writeText(config.pix);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      {/* Barra de navegação e atalho do carrinho */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{copy.back}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm group ${
            totalItems > 0
              ? "bg-karate-red hover:bg-red-700 text-white"
              : "bg-neutral-900 hover:bg-black text-white"
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-4 h-4 ${totalItems > 0 ? "text-white" : "text-karate-gold"}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-white text-karate-red text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span>{totalItems > 0 ? copy.viewOrder : copy.viewCart}</span>
          {subtotal > 0 && (
            <span className="text-neutral-200 font-normal hidden sm:inline">
              (R$ {subtotal.toFixed(2).replace(".", ",")})
            </span>
          )}
        </button>
      </div>

      {/* Label e Banner de Pedido em Andamento - Acima de tudo em qualquer gadget */}
      {totalItems > 0 && (
        <div className="bg-neutral-900 text-white rounded-2xl p-3.5 sm:p-4 border border-karate-gold/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-karate-red text-white flex items-center justify-center font-bold relative shrink-0">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-karate-red text-[9px] font-black flex items-center justify-center shadow">
                {totalItems}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-karate-gold font-mono">
                  {copy.selectedOrder}
                </span>
                <span className="text-[10px] text-neutral-400">• {copy.savedDevice}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {totalItems} {totalItems === 1 ? copy.itemWaiting : copy.itemsWaiting}
                <span className="text-karate-gold font-mono ml-2">
                  (R$ {subtotal.toFixed(2).replace(".", ",")})
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-karate-red hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{copy.reviewSend}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Divulgação do Campeonato Esportivo Oficial (SPEC 08 item 4) */}
      <ChampionshipPromoBanner variant="store" />

      {/* Banner de Divulgação da MadeiraStore */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-karate-gold/20 text-karate-gold flex items-center justify-center shrink-0 border border-karate-gold/30">
            <ShoppingBag className="w-5 h-5 text-karate-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-karate-gold font-mono">
                {copy.commercial}
              </span>
              <span className="text-[9px] bg-karate-red text-white font-bold px-1.5 py-0.5 rounded-full">
                MadeiraStore
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              {copy.madeiraTitle}
            </p>
            <p className="text-xs text-neutral-300">
              {copy.madeiraText}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/madeirastore")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <span>{copy.accessMadeira}</span>
          <ArrowRight className="w-4 h-4 text-karate-red" />
        </button>
      </div>

      {/* Label e Guia do Fluxo Oficial de Pedido - Posicionado ACIMA em qualquer gadget */}
      <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-karate-red/20 text-karate-red flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-karate-gold" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-jp text-white leading-tight">
                {copy.howOrder}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {copy.howOrderText}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPixDetails(!showPixDetails)}
            className="text-xs text-karate-gold hover:underline font-bold self-start sm:self-auto shrink-0 cursor-pointer py-1"
          >
            {showPixDetails ? copy.hidePix : copy.showPix}
          </button>
        </div>

        {/* Timeline dos 4 passos do Pedido - Layout compacto e direto para qualquer tela */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-neutral-800/80 rounded-xl p-2.5 sm:p-3 border border-neutral-700/60 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-karate-red text-white text-[10px] font-bold flex items-center justify-center font-mono shrink-0 mt-0.5">
              1
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">
                1. {copy.choose}
              </h3>
              <p className="text-[10px] text-neutral-300 leading-snug line-clamp-2">
                {copy.chooseText}
              </p>
            </div>
          </div>

          <div className="bg-neutral-800/80 rounded-xl p-2.5 sm:p-3 border border-neutral-700/60 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-karate-red text-white text-[10px] font-bold flex items-center justify-center font-mono shrink-0 mt-0.5">
              2
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">
                2. WhatsApp
              </h3>
              <p className="text-[10px] text-neutral-300 leading-snug line-clamp-2">
                {copy.whatsappText}
              </p>
            </div>
          </div>

          <div className="bg-neutral-800/80 rounded-xl p-2.5 sm:p-3 border border-neutral-700/60 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-karate-red text-white text-[10px] font-bold flex items-center justify-center font-mono shrink-0 mt-0.5">
              3
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">
                3. {copy.confirmation}
              </h3>
              <p className="text-[10px] text-neutral-300 leading-snug line-clamp-2">
                {copy.confirmationText}
              </p>
            </div>
          </div>

          <div className="bg-neutral-800/80 rounded-xl p-2.5 sm:p-3 border border-neutral-700/60 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center font-mono shrink-0 mt-0.5">
              4
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">
                4. PIX & {copy.pickup}
              </h3>
              <p className="text-[10px] text-neutral-300 leading-snug line-clamp-2">
                {copy.pickupText}
              </p>
            </div>
          </div>
        </div>

        {/* Caixa Retrátil do PIX */}
        {showPixDetails && (
          <div className="bg-neutral-800 rounded-xl p-3.5 sm:p-4 border border-neutral-700 animate-in fade-in duration-300 space-y-2.5">
            <div className="flex items-start gap-2 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>{copy.attention}:</strong> {copy.attentionText}
              </span>
            </div>

            {config.pix && config.pix.trim() !== "" ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-700">
                <div className="space-y-0.5 text-left w-full sm:w-auto">
                  <span className="text-[10px] text-neutral-400 block font-mono uppercase">
                    {copy.officialPix}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono select-all">
                    {config.pix}
                  </span>
                </div>

                <button
                  onClick={copyPixKey}
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{copy.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-300" />
                      <span>{copy.copyKey}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700 text-xs text-neutral-300">
                {copy.paymentInfo}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Institucional da Loja - Enxuto e Elegante */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-karate-red/10 flex items-center justify-center text-karate-red shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-karate-gold uppercase tracking-wider font-mono">
                {copy.officialArticles}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 font-jp">
                {copy.storeTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-500 shrink-0">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
              <span>{copy.localMemory}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{copy.securePix}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros por Categoria (quando houver categorias reais) */}
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>{copy.filter}:</span>
          </div>

          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {copy.all} ({products.length})
          </button>

          {availableCategories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Estados: Carregando, Erro de Integração, Lista Vazia ou Catálogo */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-neutral-300 border-t-karate-red rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 font-medium">
            {copy.loading}
          </p>
        </div>
      ) : productsError ? (
        /* Erro técnico de integração (Distinto de lista vazia) */
        <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-jp">
              {copy.loadError}
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {copy.loadErrorText}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{copy.tryAgain}</span>
            </button>
            <a
              href={`https://wa.me/${config.whatsapp}?text=Olá!%20Gostaria%20de%20informações%20sobre%20os%20produtos%20da%20loja%20Madeira%20Karate.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-karate-red hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>{copy.contactStaff}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : products.length === 0 ? (
        /* Lista vazia oficial (Sem dados mockados) */
        <div className="bg-white rounded-2xl border border-neutral-200 p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-jp">
              {copy.noProducts}
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {copy.noProductsText}
            </p>
          </div>
          <a
            href={`https://wa.me/${config.whatsapp}?text=Olá!%20Gostaria%20de%20saber%20sobre%20a%20próxima%20remessa%20de%20kimonos%20e%20faixas%20da%20Madeira%20Karate.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>{copy.whatsappStaff}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Categoria sem produtos */
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-3">
          <p className="text-xs text-neutral-500">
            {copy.noCategory}
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-xs font-bold text-karate-red hover:underline"
          >
            {copy.viewAll} ({products.length})
          </button>
        </div>
      ) : (
        /* Grid Visual do Catálogo */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCardV2 key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

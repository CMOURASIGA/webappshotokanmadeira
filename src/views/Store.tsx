import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Copy, 
  Check, 
  HelpCircle, 
  ExternalLink, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  Filter, 
  RefreshCw,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../contexts/AppDataContext";
import { useCart } from "../contexts/CartContext";
import { ProductCardV2 } from "../components/store/ProductCardV2";
import { CartDrawer } from "../components/store/CartDrawer";

export function Store() {
  const navigate = useNavigate();
  const { products, config, loading, productsError } = useAppData();
  const { totalItems, subtotal, setIsCartOpen } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedPix, setCopiedPix] = useState(false);
  const [showPixDetails, setShowPixDetails] = useState(false);

  // Extrair categorias reais existentes dos produtos (sem dados fictícios)
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim() !== "") {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [products]);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const copyPixKey = () => {
    if (!config.pix) return;
    navigator.clipboard.writeText(config.pix);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      {/* Botão de navegação e atalho do carrinho */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm group"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-karate-gold" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-karate-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Ver Carrinho</span>
          {subtotal > 0 && (
            <span className="text-neutral-400 font-normal hidden sm:inline">
              (R$ {subtotal.toFixed(2).replace(".", ",")})
            </span>
          )}
        </button>
      </div>

      {/* Header Institucional da Loja */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-karate-red/10 flex items-center justify-center text-karate-red">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-karate-gold uppercase tracking-wider font-mono">
                Artigos Oficiais
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-jp">
                Loja Oficial do Dojo
              </h1>
            </div>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed pt-1">
            Uniformes, faixas e vestuário da Madeira Karate Shotokan. Todos os pedidos são direcionados para a secretaria do dojo via WhatsApp para confirmação de estoque, tamanho e retirada presencial.
          </p>
        </div>

        {/* Badge Informativo de Armazenamento */}
        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
            <span>Carrinho salvo na memória deste aparelho</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pagamento seguro via PIX somente após confirmação</span>
          </span>
        </div>
      </div>

      {/* Guia do Fluxo Oficial de Pedido (Prevenção de PIX antecipado) */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-jp text-white">
              Como funciona o pedido na Madeira Karate?
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Evitamos cobranças automáticas para garantir que o tamanho desejado esteja reservado para você.
            </p>
          </div>

          <button
            onClick={() => setShowPixDetails(!showPixDetails)}
            className="text-xs text-karate-gold hover:underline font-bold self-start sm:self-auto shrink-0"
          >
            {showPixDetails ? "Ocultar dados do PIX" : "Consultar Chave PIX"}
          </button>
        </div>

        {/* Timeline dos 4 passos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-800/80 rounded-xl p-4 border border-neutral-700/60 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-karate-red text-white text-xs font-bold flex items-center justify-center font-mono">
              1
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Escolha os Produtos
            </h3>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Selecione o tamanho, cor ou personalize faixas e kimonos adicionando ao carrinho.
            </p>
          </div>

          <div className="bg-neutral-800/80 rounded-xl p-4 border border-neutral-700/60 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-karate-red text-white text-xs font-bold flex items-center justify-center font-mono">
              2
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Envio via WhatsApp
            </h3>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Ao clicar no botão, uma mensagem organizada com todos os itens é aberta no WhatsApp oficial.
            </p>
          </div>

          <div className="bg-neutral-800/80 rounded-xl p-4 border border-neutral-700/60 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-karate-red text-white text-xs font-bold flex items-center justify-center font-mono">
              3
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Confirmação Secretaria
            </h3>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              A equipe confirma se há o tamanho em estoque no dojo e passa as orientações finais.
            </p>
          </div>

          <div className="bg-neutral-800/80 rounded-xl p-4 border border-neutral-700/60 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center font-mono">
              4
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Pagamento & Retirada
            </h3>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Você realiza o PIX após o ok da secretaria e retira suas peças no dojo nos horários de treino.
            </p>
          </div>
        </div>

        {/* Caixa Retrátil do PIX */}
        {showPixDetails && (
          <div className="bg-neutral-800 rounded-xl p-4 sm:p-5 border border-neutral-700 animate-in fade-in duration-300 space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Atenção:</strong> Por gentileza, só realize a transferência após a confirmação da disponibilidade do seu tamanho pela secretaria.
              </span>
            </div>

            {config.pix && config.pix.trim() !== "" ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 p-3.5 rounded-lg border border-neutral-700">
                <div className="space-y-0.5 text-left w-full sm:w-auto">
                  <span className="text-[11px] text-neutral-400 block font-mono uppercase">
                    Chave PIX Oficial
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white font-mono select-all">
                    {config.pix}
                  </span>
                </div>

                <button
                  onClick={copyPixKey}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-300" />
                      <span>Copiar Chave</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-neutral-900 p-3.5 rounded-lg border border-neutral-700 text-xs text-neutral-300">
                Os dados de pagamento serão fornecidos pela secretaria após a confirmação do pedido e disponibilidade dos itens.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barra de Filtros por Categoria (quando houver categorias reais) */}
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </div>

          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300"
            }`}
          >
            Todos ({products.length})
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
            Carregando catálogo da loja oficial...
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
              Não foi possível carregar a loja
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Ocorreu uma instabilidade na conexão com a planilha de produtos. Por favor, tente recarregar ou contate a secretaria diretamente pelo WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar Novamente</span>
            </button>
            <a
              href={`https://wa.me/${config.whatsapp}?text=Olá!%20Gostaria%20de%20informações%20sobre%20os%20produtos%20da%20loja%20Madeira%20Karate.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-karate-red hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>Falar com a Secretaria</span>
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
              Nenhum produto disponível no momento
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Estamos atualizando nosso estoque de dogis, faixas e uniformes. Consulte a secretaria do dojo para encomendas especiais ou dúvidas de tamanhos.
            </p>
          </div>
          <a
            href={`https://wa.me/${config.whatsapp}?text=Olá!%20Gostaria%20de%20saber%20sobre%20a%20próxima%20remessa%20de%20kimonos%20e%20faixas%20da%20Madeira%20Karate.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Consultar Secretaria no WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Categoria sem produtos */
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-3">
          <p className="text-xs text-neutral-500">
            Nenhum produto cadastrado para a categoria selecionada.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-xs font-bold text-karate-red hover:underline"
          >
            Ver todos os produtos ({products.length})
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

      {/* Componente gaveta do carrinho */}
      <CartDrawer />
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Filter, 
  RefreshCw, 
  Package, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../contexts/AppDataContext";
import { useMadeiraStoreCart } from "../contexts/MadeiraStoreCartContext";
import { MadeiraStoreProductCard } from "../components/store/MadeiraStoreProductCard";
import { MadeiraStoreCartDrawer } from "../components/store/MadeiraStoreCartDrawer";

export function MadeiraStore() {
  const navigate = useNavigate();
  const { products, loading, productsError } = useAppData();
  const { totalItems, totalAmount, setIsCartDrawerOpen } = useMadeiraStoreCart();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar apenas produtos com canal 'madeirastore' ou 'ambos' (SPEC 09 item 1)
  const storeProducts = useMemo(() => {
    return products.filter((p) => p.canal === "madeirastore" || p.canal === "ambos");
  }, [products]);

  // Extrair categorias reais existentes dos produtos da MadeiraStore
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    storeProducts.forEach((p) => {
      if (p.category && p.category.trim() !== "") {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [storeProducts]);

  // Filtrar por categoria e por termo de busca
  const filteredProducts = useMemo(() => {
    return storeProducts.filter((p) => {
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch = searchTerm.trim() === "" || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [storeProducts, selectedCategory, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full px-2 sm:px-4">
      {/* Barra de Navegação Superior */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Link para consulta de pedido */}
          <Link
            to="/madeirastore/pedido"
            className="px-3 py-1.5 rounded-xl border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-bold transition-all bg-white shadow-xs"
          >
            Consultar Pedido
          </Link>

          {/* Botão de Carrinho */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm group cursor-pointer ${
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
            <span>{totalItems > 0 ? "Ver Carrinho" : "Carrinho"}</span>
            {totalAmount > 0 && (
              <span className="text-neutral-200 font-normal hidden sm:inline">
                (R$ {totalAmount.toFixed(2).replace(".", ",")})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Comercial da MadeiraStore */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-neutral-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-karate-gold/10 to-transparent pointer-events-none hidden sm:block" />
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-karate-gold text-xs font-bold tracking-wider uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Área Comercial Madeira</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            MadeiraStore
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 font-medium">
            Produtos selecionados para alunos e comunidade Madeira Karate.
          </p>

          <p className="text-xs text-neutral-400 pt-1 leading-relaxed">
            Alimentos, itens de treino, acessórios e produtos de parceiros. Faça seu pedido com checkout formal, receba o PIX com o valor exato e retire no dojo.
          </p>
        </div>

        {/* Link alternativo para Loja Oficial JKA */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-neutral-400">
            Procurando uniformes, dogis e faixas oficiais JKA?
          </span>
          <Link
            to="/store"
            className="text-karate-gold hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>Ir para Loja Oficial de Artigos JKA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Barra de Filtros & Busca */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Busca por texto */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos na MadeiraStore..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:border-karate-red shadow-xs"
            />
          </div>

          <span className="text-xs text-neutral-500 font-medium self-end sm:self-auto">
            {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </span>
        </div>

        {/* Filtros de Categorias */}
        {availableCategories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300"
              }`}
            >
              Todos os Produtos
            </button>

            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid de Produtos */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 space-y-3">
          <div className="w-8 h-8 border-3 border-karate-red border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-neutral-500">Carregando catálogo da MadeiraStore...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-neutral-800 text-base mb-1">
            Nenhum produto encontrado
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Tente ajustar o termo de busca ou limpar a categoria selecionada."
              : "Não há produtos cadastrados para a MadeiraStore na planilha oficial neste momento."}
          </p>
          {(searchTerm || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all cursor-pointer"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <MadeiraStoreProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Informações de Retirada & Segurança */}
      <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-xs mb-0.5">Pagamento Seguro PIX</h4>
            <p className="text-[11px] leading-snug">Chave oficial com conferência manual da secretaria.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-xs mb-0.5">Retirada no Dojo</h4>
            <p className="text-[11px] leading-snug">Produtos conferidos e retirados presencialmente no dojo.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-xs mb-0.5">Acompanhamento</h4>
            <p className="text-[11px] leading-snug">Consulte seu código de pedido a qualquer momento.</p>
          </div>
        </div>
      </div>

      {/* Drawer do Carrinho da MadeiraStore */}
      <MadeiraStoreCartDrawer />
    </div>
  );
}

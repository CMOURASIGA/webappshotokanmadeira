import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { Search, MessageCircle, Instagram, GraduationCap, ShoppingBag } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";
import { useCart } from "../contexts/CartContext";
import { Link, useLocation } from "react-router-dom";
import { PWAInstallButton } from "./pwa/PWAInstallButton";

export function Layout({ children }: { children: ReactNode }) {
  const { config } = useAppData();
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState("");

  const whatsappUrl = `https://wa.me/${config.whatsapp}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20academia.`;

  // Atalho de teclado global: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openSearch = (query = "") => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#111111] flex font-sans overflow-x-hidden relative">
      {/* Sidebar Desktop (exibida em telas >= 1024px) */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full min-w-0 relative">
        {/* Header Superior Responsivo */}
        <header className="h-16 sm:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 md:px-8 lg:px-10 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Tag Dojo Digital para Desktop */}
            <span className="text-[#BC002D] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase italic hidden lg:block shrink-0">
              Dojo Digital
            </span>
            <div className="hidden lg:block h-4 w-[1px] bg-gray-300"></div>
            <span className="text-gray-600 text-xs hidden lg:block truncate">
              Estudo e Disciplina
            </span>
            
            {/* Marca Madeira Karate para Mobile e Tablet */}
            <Link to="/" className="lg:hidden flex items-center gap-2.5 min-w-0 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-neutral-900 border border-neutral-700">
                <img 
                  src={config.logo || undefined} 
                  alt="Madeira Karate Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-jp font-bold tracking-wide uppercase text-karate-black text-xs sm:text-sm truncate">
                  Madeira Karate
                </h1>
                <span className="text-[10px] text-karate-gold font-medium tracking-wider hidden sm:block leading-none">
                  Shotokan JKA
                </span>
              </div>
            </Link>
          </div>

          {/* Área de Busca e Ações */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão de Carrinho / Loja */}
            <Link
              to="/store"
              onClick={() => {
                // Se já estiver na página da loja ou tiver itens selecionados, abre o drawer
                if (location.pathname === "/store" || totalItems > 0) {
                  setIsCartOpen(true);
                }
              }}
              aria-label="Acessar a loja e carrinho de compras"
              title="Loja Oficial e Carrinho do Dojo"
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-karate-red bg-[#F4F4F4] hover:bg-gray-200/80 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-transparent hover:border-gray-300 transition-all shrink-0 relative"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
              <span className="hidden sm:inline">Carrinho</span>
              {totalItems > 0 && (
                <span className="bg-karate-red text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center -ml-0.5">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Atalho para Área do Aluno */}
            <Link
              to="/student-area"
              aria-label="Área do Aluno"
              title="Área do Aluno & Treinamento Autônomo"
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-karate-red bg-[#F4F4F4] hover:bg-gray-200/80 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-transparent hover:border-gray-300 transition-all shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-karate-gold" />
              <span className="hidden sm:inline">Área do Aluno</span>
            </Link>

            {/* Botão de Instalação PWA Header */}
            <PWAInstallButton variant="header" />

            {/* Campo de Busca Interativo no Header */}
            <button
              onClick={() => openSearch()}
              aria-label="Buscar técnica ou kata... ⌘K"
              className="group flex items-center gap-2 bg-[#F4F4F4] hover:bg-gray-200/80 text-gray-600 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition-all text-xs border border-transparent hover:border-gray-300 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover:text-karate-red transition-colors shrink-0" />
              <span className="hidden sm:inline-block text-gray-600 group-hover:text-gray-900 truncate max-w-[140px] md:max-w-[200px]">
                Buscar técnica ou kata...
              </span>
              <span className="sm:hidden text-xs text-gray-600">Buscar</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-white border border-gray-300 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Badge de Estilo / Status */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200 text-[11px] text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden md:inline">JKA Shotokan</span>
            </div>
          </div>
        </header>

        {/* Viewport Principal com Scroll Suave e Margens Seguras */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 lg:p-10 pb-[90px] lg:pb-12 w-full max-w-full overflow-x-hidden">
          <div className="max-w-6xl mx-auto relative w-full">
            {children}
          </div>
        </main>

        {/* Footer Institucional Desktop */}
        <footer className="h-12 bg-[#111111] items-center justify-center shrink-0 hidden lg:flex px-4 border-t border-neutral-800">
          <p className="text-[10px] text-neutral-400 tracking-[0.25em] uppercase text-center">
            O conteúdo educativo não substitui a orientação presencial de um sensei qualificado.
          </p>
        </footer>
      </div>

      {/* Navegação Mobile Inferior & Drawer */}
      <MobileNav onOpenSearch={() => openSearch()} />

      {/* Modal de Busca Global Indexada */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        initialQuery={searchInitialQuery}
      />

      {/* Botões Flutuantes de Ação Rápida (WhatsApp & Instagram) */}
      <div className="fixed bottom-[74px] lg:bottom-8 right-3 sm:right-6 lg:right-8 flex flex-col gap-2.5 z-30">
        <a 
          href="https://instagram.com/madeirakarateshotokan" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-3 sm:p-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-pink-500"
          title="Siga nosso Instagram"
          aria-label="Instagram Madeira Karate"
        >
          <Instagram className="w-5 h-5 sm:w-5 sm:h-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[200px] transition-all duration-300 ease-in-out font-medium text-xs group-hover:ml-2">
            @madeirakarateshotokan
          </span>
        </a>
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 sm:p-3.5 rounded-full shadow-lg hover:scale-105 hover:bg-[#20bd5a] active:scale-95 transition-all flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          title="Fale conosco no WhatsApp"
          aria-label="WhatsApp Madeira Karate"
        >
          <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[200px] transition-all duration-300 ease-in-out font-medium text-xs group-hover:ml-2">
            Saiba mais
          </span>
        </a>
      </div>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { 
  Home, 
  Megaphone, 
  Camera, 
  Calendar, 
  ShoppingBag, 
  BookOpen, 
  Shield, 
  List, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  ScrollText, 
  History, 
  Menu, 
  X, 
  ChevronRight,
  Search,
  GraduationCap
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { useCart } from "../contexts/CartContext";

interface NavItem {
  name: string;
  path: string;
  icon: typeof Home;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function MobileNav({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { config } = useAppData();
  const { totalItems } = useCart();

  // Fecha o drawer sempre que a rota mudar
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Bloqueia scroll do body quando o menu está aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Barra inferior enxuta (4 atalhos principais + botão Menu)
  const bottomBarLinks = [
    { name: "Início", path: "/", icon: Home },
    { name: "Mural", path: "/mural", icon: Megaphone },
    { name: "Katas", path: "/katas", icon: BookOpen },
    { name: "Loja", path: "/store", icon: ShoppingBag },
  ];

  // Estrutura completa das seções no Drawer
  const sections: NavSection[] = [
    {
      title: "PRINCIPAL",
      items: [
        { name: "Início", path: "/", icon: Home },
        { name: "Mural", path: "/mural", icon: Megaphone },
        { name: "Eventos", path: "/events", icon: Camera },
        { name: "Grade de Horários", path: "/schedule", icon: Calendar },
        { name: "Loja", path: "/store", icon: ShoppingBag },
      ]
    },
    {
      title: "TREINAMENTO",
      items: [
        { name: "Área do Aluno", path: "/student-area", icon: GraduationCap },
        { name: "Katas", path: "/katas", icon: BookOpen },
        { name: "Técnicas", path: "/techniques", icon: Shield },
        { name: "Faixas", path: "/belts", icon: List },
        { name: "Série de Katas", path: "/kata-series", icon: Layers },
      ]
    },
    {
      title: "CONHECIMENTO",
      items: [
        { name: "Vocabulário", path: "/vocabulary", icon: Sparkles },
        { name: "O que é Kata?", path: "/what-is-kata", icon: HelpCircle },
        { name: "Dojo Kun", path: "/dojo-kun", icon: ScrollText },
        { name: "História", path: "/history", icon: History },
      ]
    }
  ];

  return (
    <>
      {/* Barra Inferior Fixa Mobile & Tablet (< lg) */}
      <nav 
        aria-label="Navegação Inferior Mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-[#111111]/95 backdrop-blur-md text-white border-t border-[#2B2B2B] flex items-center justify-around z-40 px-2 py-1.5"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {bottomBarLinks.map((link) => {
          const isActive = link.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(link.path);

          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 px-2 flex-1 rounded-lg transition-all min-h-[44px]",
                isActive 
                  ? "text-red-400 font-bold" 
                  : "text-neutral-300 hover:text-white"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {link.path === "/store" && totalItems > 0 && (
                  <span className="absolute -top-1 -right-2 bg-karate-gold text-neutral-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{link.name}</span>
            </Link>
          );
        })}

        {/* Botão para abrir o menu completo */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir Menu Completo"
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-1.5 px-2 flex-1 rounded-lg transition-all min-h-[44px]",
            menuOpen ? "text-red-400 font-bold" : "text-neutral-300 hover:text-white"
          )}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium leading-none">Menu</span>
        </button>
      </nav>

      {/* Drawer com Navegação Completa */}
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
        />
      )}

      <div 
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[85vw] max-w-xs bg-[#111111] z-50 lg:hidden flex flex-col transition-transform duration-300 ease-out border-l border-neutral-800 shadow-2xl",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Topo do Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
              <img src={config.logo || undefined} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-white text-xs font-bold tracking-widest uppercase leading-tight">Madeira Karate</h2>
              <span className="text-[10px] text-karate-gold font-medium">Menu do Dojo</span>
            </div>
          </div>
          <button 
            onClick={() => setMenuOpen(false)} 
            aria-label="Fechar menu"
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Atalho de Busca no Menu Mobile */}
        {onOpenSearch && (
          <div className="p-3 border-b border-neutral-800 bg-neutral-950/40">
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs px-3 py-2.5 rounded-xl border border-neutral-800 flex items-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4 text-karate-gold" />
              <span>Buscar técnica, kata, faixa...</span>
            </button>
          </div>
        )}

        {/* Lista de Seções */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2 pb-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase font-mono">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = item.path === "/" 
                    ? location.pathname === "/" 
                    : location.pathname.startsWith(item.path);

                  const Icon = item.icon;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all",
                          isActive 
                            ? "bg-karate-red text-white font-bold shadow-sm" 
                            : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-neutral-400")} />
                          <span>{item.name}</span>
                          {item.path === "/store" && totalItems > 0 && (
                            <span className="bg-karate-gold text-neutral-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                              {totalItems}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Rodapé do Menu */}
        <div className="p-3 border-t border-neutral-800 text-center bg-neutral-950/60">
          <p className="text-[10px] text-neutral-400 font-jp tracking-wider">
            空手道 • SHOTOKAN JKA
          </p>
        </div>
      </div>
    </>
  );
}

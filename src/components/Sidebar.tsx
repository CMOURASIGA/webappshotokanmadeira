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
  GraduationCap
} from "lucide-react";
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

export function Sidebar() {
  const location = useLocation();
  const { config } = useAppData();
  const { totalItems } = useCart();

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
    <aside 
      aria-label="Navegação Principal Desktop"
      className="hidden lg:flex flex-col w-64 bg-[#111111] h-screen fixed top-0 left-0 border-r border-[#2B2B2B] z-30 select-none"
    >
      {/* Cabeçalho com Identidade Visual */}
      <div className="p-6 flex flex-col items-center border-b border-[#2B2B2B] shrink-0">
        <Link to="/" className="flex flex-col items-center group">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 overflow-hidden transition-transform group-hover:scale-105 duration-300">
            <img 
              src={config.logo || undefined} 
              alt="Madeira Karate Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-white text-sm font-bold tracking-widest uppercase text-center leading-tight">
            Madeira<br/>
            <span className="text-karate-gold text-[10px] font-semibold tracking-wider">
              Karate Shotokan &amp;<br/>Artes Marciais
            </span>
          </h1>
        </Link>
      </div>

      {/* Menu Categorizado */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto divide-y divide-neutral-800/40">
        {sections.map((section, sIndex) => (
          <div key={section.title} className={sIndex > 0 ? "pt-4 mt-3" : ""}>
            <p className="px-3 pb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase font-mono">
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
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        isActive
                          ? "bg-karate-red text-white shadow-sm font-semibold"
                          : "text-neutral-300 hover:text-white hover:bg-[#202020]"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-neutral-400")} />
                      <span className="truncate flex-1">{item.name}</span>
                      {item.path === "/store" && totalItems > 0 && (
                        <span className="bg-karate-gold text-neutral-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Rodapé da Sidebar */}
      <div className="p-3 border-t border-[#2B2B2B] shrink-0 text-center">
        <span className="text-[10px] font-jp text-neutral-400 tracking-widest">
          空手道 • JKA SHOTOKAN
        </span>
      </div>
    </aside>
  );
}

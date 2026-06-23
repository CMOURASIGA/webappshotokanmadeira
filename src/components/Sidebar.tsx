import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { BookOpen, Home, List, Shield, User, Calendar } from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const links = [
    { name: "Início", path: "/", icon: Home },
    { name: "Grade de Horários", path: "/schedule", icon: Calendar },
    { name: "Série de Katas", path: "/kata-series", icon: BookOpen },
    { name: "Lista de Katas", path: "/katas", icon: BookOpen },
    { name: "Técnicas", path: "/techniques", icon: Shield },
    { name: "Vocabulário", path: "/vocabulary", icon: BookOpen },
    { name: "Faixas", path: "/belts", icon: List },
    { name: "O que é Kata?", path: "/what-is-kata", icon: BookOpen },
    { name: "Dojo Kun", path: "/dojo-kun", icon: Shield },
    { name: "História", path: "/history", icon: BookOpen },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#111111] h-screen fixed top-0 left-0 border-r border-[#2B2B2B]">
      <div className="p-8 flex flex-col items-center border-b border-[#2B2B2B]">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden bg-white">
          <img src="https://i.imgur.com/FFeA342.png" alt="Madeira Karate Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-white text-base font-bold tracking-widest uppercase text-center leading-tight">
          Madeira<br/><span className="text-karate-gold text-[10px]">Karate Shotokan &<br/>Artes Marciais</span>
        </h1>
      </div>

      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {links.map((link, index) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-sm font-medium transition-colors",
                    isActive
                      ? "bg-karate-red text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <span className="font-serif italic text-white/50 text-xs">0{index + 1}</span>
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

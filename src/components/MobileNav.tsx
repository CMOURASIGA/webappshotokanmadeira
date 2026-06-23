import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { BookOpen, Home, List, Shield, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";

export function MobileNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const mainLinks = [
    { name: "Início", path: "/", icon: Home },
    { name: "Katas", path: "/katas", icon: BookOpen },
    { name: "Técnicas", path: "/techniques", icon: Shield },
  ];

  const moreLinks = [
    { name: "Faixas", path: "/belts", icon: List },
    { name: "Série de Katas", path: "/kata-series", icon: BookOpen },
    { name: "Vocabulário", path: "/vocabulary", icon: BookOpen },
    { name: "O que é Kata?", path: "/what-is-kata", icon: BookOpen },
    { name: "Dojo Kun", path: "/dojo-kun", icon: Shield },
    { name: "História", path: "/history", icon: BookOpen },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#111111] text-white border-t border-[#2B2B2B] flex items-center justify-around pb-safe z-50">
        {mainLinks.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-2 flex-1",
                isActive ? "text-karate-red" : "text-neutral-400 hover:text-white"
              )}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-1">{link.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-3 px-2 flex-1 text-neutral-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Menu</span>
        </button>
      </nav>

      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-0 bg-[#111111] z-[60] transition-transform duration-300 md:hidden flex flex-col",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2B2B2B]">
          <h2 className="text-white font-bold tracking-widest uppercase">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-4">
            {moreLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-colors",
                      isActive ? "bg-karate-red text-white" : "text-neutral-300 hover:bg-[#2B2B2B] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

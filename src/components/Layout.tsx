import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Search, MessageCircle } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const whatsappUrl = "https://wa.me/5521968384077?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20academia.";

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#111111] flex font-sans overflow-hidden h-screen relative">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-full relative">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[#BC002D] font-bold text-sm tracking-[0.2em] uppercase italic hidden md:block">Dojo Digital</span>
            <div className="hidden md:block h-4 w-[1px] bg-gray-300"></div>
            <span className="text-gray-400 text-xs hidden md:block">Estudo e Disciplina</span>
            
            <div className="md:hidden flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white">
                <img src="https://i.imgur.com/FFeA342.png" alt="Madeira Karate Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-jp font-bold tracking-wide uppercase text-karate-black text-sm">Madeira Karate</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar técnica ou kata..." 
                className="bg-[#F4F4F4] border-none text-xs py-2 pl-9 pr-4 w-48 md:w-64 rounded-full focus:ring-1 focus:ring-[#BC002D] outline-none transition-all"
              />
            </div>
            <div className="hidden md:block w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 pb-[120px] md:pb-10">
          <div className="max-w-6xl mx-auto relative w-full">
            {children}
          </div>
        </main>

        <footer className="h-12 bg-[#111111] items-center justify-center shrink-0 hidden md:flex">
          <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase">O conteúdo educativo não substitui a orientação presencial de um sensei qualificado.</p>
        </footer>
      </div>
      <MobileNav />

      {/* WhatsApp Floating Button */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-[90px] md:bottom-8 right-4 md:right-8 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 hover:bg-[#20bd5a] transition-all z-50 flex items-center justify-center group"
        title="Fale conosco no WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium text-sm group-hover:ml-2">
          Saiba mais
        </span>
      </a>
    </div>
  );
}

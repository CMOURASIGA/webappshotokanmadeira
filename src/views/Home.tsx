import { Link } from "react-router-dom";
import { katas, techniques, belts } from "../data/mockData";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="md:col-span-8 flex flex-col gap-6">
        <div className="relative bg-[#111111] h-[320px] rounded-lg overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-10 z-20 pr-10">
            <span className="bg-[#BC002D] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Kihon Kata</span>
            <h2 className="text-white text-4xl md:text-6xl font-black mt-2 tracking-tighter">HEIAN SHODAN</h2>
            <p className="text-gray-400 text-sm mt-4 max-w-md italic">O primeiro passo do caminho. Foco em Zenkutsu-dachi e movimentos fundamentais de defesa e ataque.</p>
            <Link to="/katas/heian-shodan" className="mt-6 inline-block bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#BC002D] hover:text-white transition-all">
              Iniciar Estudo
            </Link>
          </div>
          {/* Decorative graphic */}
          <div className="absolute top-10 right-10 z-20 hidden md:block">
             <div className="w-32 h-32 border-4 border-white/10 rounded-full flex items-center justify-center">
                <span className="text-white/20 text-5xl italic font-serif">初</span>
             </div>
          </div>
        </div>

        {/* Quick Access: Techniques (Grid style from Editorial) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {techniques.slice(0, 3).map((tech, i) => (
            <Link key={tech.id} to={`/techniques/${tech.id}`} 
              className={`bg-white p-5 shadow-sm border-t-2 hover:bg-neutral-50 transition-colors ${i === 0 ? 'border-[#BC002D]' : i === 1 ? 'border-[#111111]' : 'border-[#C8A24A]'}`}>
              <p className={`text-[10px] uppercase font-bold ${i === 0 ? 'text-[#BC002D]' : i === 1 ? 'text-gray-400' : 'text-[#C8A24A]'}`}>{tech.category}</p>
              <h3 className="text-lg font-bold mt-1">{tech.nameJp}</h3>
              <p className="text-xs text-gray-500 mt-2 truncate">{tech.namePt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Side Panel (FAIXAS & INFO) */}
      <section className="md:col-span-4 flex flex-col gap-6">
        <div className="bg-white flex-1 p-8 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-4 mb-6">Níveis de Graduação</h3>
          
          <div className="space-y-6">
            <Link to="/belts" className="flex items-center gap-4 group">
              <div className="w-3 h-12 bg-white border border-gray-300 group-hover:border-karate-red transition-colors"></div>
              <div>
                <p className="text-xs font-bold">9º KYU - BRANCA</p>
                <p className="text-[10px] text-gray-400 uppercase italic">Iniciante / Pureza</p>
              </div>
              <div className="ml-auto text-gray-300">✓</div>
            </Link>
            <Link to="/belts" className="flex items-center gap-4 group">
              <div className="w-3 h-12 bg-[#FFEB3B] group-hover:scale-105 transition-transform"></div>
              <div>
                <p className="text-xs font-bold">8º KYU - AMARELA</p>
                <p className="text-[10px] text-gray-400 uppercase italic">Crescimento / Sol</p>
              </div>
              <div className="ml-auto text-gray-300">✓</div>
            </Link>
            <Link to="/belts" className="flex items-center gap-4 group">
              <div className="w-3 h-12 bg-[#F27D26] group-hover:scale-105 transition-transform"></div>
              <div>
                <p className="text-xs font-bold">7º KYU - LARANJA</p>
                <p className="text-[10px] text-gray-400 uppercase italic">Energia / Vitalidade</p>
              </div>
              <div className="ml-auto text-[#BC002D] animate-pulse">●</div>
            </Link>
            <Link to="/belts" className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
              <div className="w-3 h-12 bg-[#4CAF50]"></div>
              <div>
                <p className="text-xs font-bold">6º KYU - VERDE</p>
                <p className="text-[10px] text-gray-400 uppercase italic">Esperança / Raízes</p>
              </div>
            </Link>
          </div>

          <div className="mt-12 p-4 bg-[#F4F4F4] rounded">
             <p className="text-[10px] leading-relaxed text-gray-600">
               <strong className="text-black">Nota do Sensei:</strong> O Karate não é apenas físico. Lembre-se: "Karate ni sente nashi" (No Karate não existe primeiro ataque).
             </p>
          </div>
        </div>
      </section>

    </div>
  );
}

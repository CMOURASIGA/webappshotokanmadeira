import { belts } from "../data/mockData";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BeltsList() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">Faixas (Obi)</h2>
        <p className="text-neutral-500 text-lg">Evolução e graduação no Karate Shotokan</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        {belts.map((belt) => (
          <div key={belt.id} className="flex flex-col md:flex-row md:items-start gap-6 p-8 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-4 border-neutral-100 shadow-inner" style={{ backgroundColor: belt.color }}>
                {belt.id === "black" && <span className="text-white text-xs font-bold font-jp tracking-widest">初段</span>}
                {belt.id === "white" && <span className="text-karate-dark text-xs font-bold font-jp">無級</span>}
              </div>
              
              <div className="w-48">
                <h3 className="text-2xl font-bold font-jp">{belt.name}</h3>
                <p className="text-sm font-bold text-karate-red uppercase tracking-wider">{belt.level}</p>
              </div>
            </div>

            <div className="flex-1 space-y-6 md:pt-1">
              {belt.meaning && (
                <div>
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Significado da Cor</h4>
                  <p className="text-neutral-700 leading-relaxed text-sm">{belt.meaning}</p>
                </div>
              )}
              {belt.requirements && belt.requirements.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Requisitos Principais</h4>
                  <ul className="flex flex-wrap gap-2">
                    {belt.requirements.map((req, i) => (
                      <li key={i} className="bg-white border border-neutral-200 text-xs px-3 py-1.5 rounded-full text-neutral-700 shadow-sm">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

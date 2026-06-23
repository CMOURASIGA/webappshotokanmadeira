import { Link, useNavigate } from "react-router-dom";
import { techniques } from "../data/mockData";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export function TechniquesList() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  
  const categories = Array.from(new Set(techniques.map(t => t.category)));

  const filteredTechniques = selectedCategory === "Todas" 
    ? techniques 
    : techniques.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-jp">Kihon (Técnicas)</h2>
          <p className="text-neutral-500">Fundamentos e golpes base do Karate</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory("Todas")}
            className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "Todas" 
                ? "bg-karate-red text-white" 
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-karate-red hover:text-karate-red"
            }`}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap text-sm px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === cat 
                  ? "bg-karate-red text-white border border-karate-red" 
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-karate-red hover:text-karate-red"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTechniques.map(tech => (
          <Link key={tech.id} to={`/techniques/${tech.id}`} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md hover:border-karate-red/50 transition-all group flex flex-col">
            <div className="bg-[#111111] h-32 p-4 flex items-center justify-center border-b border-neutral-100 relative overflow-hidden">
               <div className="text-6xl font-serif italic text-white/10 absolute -left-2 -top-2 pointer-events-none group-hover:text-karate-red/20 transition-colors">
                技
              </div>
              <h3 className="text-white text-xl font-black tracking-widest uppercase z-10 text-center">{tech.nameJp}</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-xs font-bold text-karate-red uppercase tracking-wider mb-1 block">{tech.category}</span>
              <h3 className="text-lg font-bold group-hover:text-karate-red transition-colors">{tech.nameJp}</h3>
              <p className="text-sm text-neutral-500 mb-4">{tech.namePt}</p>
              
              <div className="mt-auto">
                <span className="inline-block bg-neutral-100 text-neutral-600 text-[10px] uppercase font-bold px-2 py-1 rounded">
                  Recomendado: {tech.recommendedBeltId}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

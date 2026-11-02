import { Link, useNavigate } from "react-router-dom";
import { katas } from "../data/mockData";
import { Search, ArrowLeft } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export function KatasList() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const copy = language === "en"
    ? { subtitle: "Fundamental forms of Shotokan Karate", allLevels: "All Levels", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", allGroups: "All Groups", movements: "official JKA movements", updating: "Sequence being updated" }
    : language === "ja"
    ? { subtitle: "Shotokan Karate の基本となる形", allLevels: "すべてのレベル", beginner: "初級", intermediate: "中級", advanced: "上級", allGroups: "すべてのグループ", movements: "JKA公式動作", updating: "動作順を更新中" }
    : { subtitle: "{copy.subtitle}", allLevels: "Todos os Níveis", beginner: "Iniciante", intermediate: "Intermediário", advanced: "Avançado", allGroups: "Todos os Grupos", movements: "mov. oficiais JKA", updating: "{copy.updating}" };
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-jp">Katas</h2>
          <p className="text-neutral-500">Formas fundamentais do Karate Shotokan</p>
        </div>
        
        <div className="flex gap-2">
          <select className="bg-white border border-neutral-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-karate-red">
            <option>{copy.allLevels}</option>
            <option>{copy.beginner}</option>
            <option>{copy.intermediate}</option>
            <option>{copy.advanced}</option>
          </select>
          <select className="bg-white border border-neutral-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-karate-red">
            <option>{copy.allGroups}</option>
            <option>Heian</option>
            <option>Tekki</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {katas.map(kata => (
          <Link key={kata.id} to={`/katas/${kata.id}`} className="flex flex-col bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md hover:border-karate-red/30 transition-all group">
            <div className="bg-[#111111] p-6 flex items-center justify-center border-b border-neutral-100 relative overflow-hidden h-32">
              <div className="text-6xl font-serif italic text-white/10 absolute -right-4 -top-4 pointer-events-none group-hover:text-karate-red/20 transition-colors">
                型
              </div>
              <h3 className="text-white text-2xl font-black tracking-widest uppercase z-10">{kata.name.split(' ')[0]}</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold group-hover:text-karate-red transition-colors">{kata.name}</h3>
              </div>
              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{kata.meaning}</p>
              
              <div className="mt-auto flex flex-wrap gap-2 text-xs">
                <span className="bg-karate-light text-karate-dark px-2 py-1 rounded font-medium">{kata.group}</span>
                {kata.movementsCount > 0 && (
                  <span className="bg-karate-light text-karate-dark px-2 py-1 rounded font-medium">
                    {kata.movementsCount} {copy.movements}
                  </span>
                )}
                {(!kata.movements || kata.movements.length === 0) && (
                  <span className="bg-amber-50 text-amber-800 px-2 py-1 rounded font-medium border border-amber-200">
                    Sequência em atualização
                  </span>
                )}
                <span className="bg-karate-red/10 text-karate-red px-2 py-1 rounded font-medium">{kata.level}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

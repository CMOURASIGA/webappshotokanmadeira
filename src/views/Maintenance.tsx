import { Wrench, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export function Maintenance() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = language === "en"
    ? { title: "Under Maintenance", text: "This area is currently under maintenance or development.", back: "Back", home: "Go to Home" }
    : language === "ja"
    ? { title: "メンテナンス中", text: "このエリアは現在メンテナンスまたは開発中です。", back: "戻る", home: "ホームへ" }
    : { title: "Em Manutenção", text: "Esta área do aplicativo está atualmente em manutenção ou desenvolvimento.", back: "Voltar", home: "Ir para o Início" };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-karate-red/10 rounded-full flex items-center justify-center text-karate-red mb-4">
        <Wrench className="w-12 h-12" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-bold font-jp">{copy.title}</h2>
        <p className="text-neutral-500 max-w-md mx-auto text-lg">
          {copy.text}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-karate-red transition-all font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {copy.back}
        </button>
        <Link 
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-karate-red text-white hover:bg-karate-dark transition-all shadow-md font-medium"
        >
          <Home className="w-5 h-5" />
          {copy.home}
        </Link>
      </div>
    </div>
  );
}

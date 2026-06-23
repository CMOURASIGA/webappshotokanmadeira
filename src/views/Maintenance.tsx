import { Wrench, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Maintenance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-karate-red/10 rounded-full flex items-center justify-center text-karate-red mb-4">
        <Wrench className="w-12 h-12" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-bold font-jp">Em Manutenção</h2>
        <p className="text-neutral-500 max-w-md mx-auto text-lg">
          Esta área do aplicativo está atualmente em manutenção ou desenvolvimento. Estamos trabalhando para trazer novidades em breve!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-karate-red transition-all font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <Link 
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-karate-red text-white hover:bg-karate-dark transition-all shadow-md font-medium"
        >
          <Home className="w-5 h-5" />
          Ir para o Início
        </Link>
      </div>
    </div>
  );
}

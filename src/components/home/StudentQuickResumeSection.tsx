import { Link } from "react-router-dom";
import { GraduationCap, Play, Star, ListChecks, ArrowRight, Clock, Award, Smartphone, ShieldCheck } from "lucide-react";
import { useStudent } from "../../contexts/StudentContext";
import { belts } from "../../data/mockData";

export function StudentQuickResumeSection() {
  const { 
    lastStudy, 
    getKataProgress, 
    favorites, 
    selectedExamBeltId, 
    getBeltExamProgress, 
    technicalNotes 
  } = useStudent();

  const currentExamBelt = belts.find(b => b.id === selectedExamBeltId) || belts[1];
  const examRequirements = currentExamBelt.requirements || [];
  const examProgress = getBeltExamProgress(currentExamBelt.id, examRequirements.length);

  return (
    <section className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-sm">
      {lastStudy ? (
        /* Caso o aluno já tenha iniciado estudos */
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-karate-red/10 text-karate-red text-xs font-bold uppercase tracking-wider">
                <Play className="w-3 h-3 fill-karate-red" />
                Continuar Estudando
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Visto recentemente
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-jp text-neutral-900">
                {lastStudy.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                {lastStudy.subtitle} • {lastStudy.categoryOrGroup}
              </p>
            </div>

            {/* Progresso de Movimentos para Katas */}
            {lastStudy.type === "kata" && lastStudy.totalMovements && (
              <div className="max-w-md space-y-1">
                {(() => {
                  const progress = getKataProgress(lastStudy.id, lastStudy.totalMovements);
                  return (
                    <>
                      <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
                        <span>{progress.completed} de {progress.total} movimentos memorizados</span>
                        <span className="font-bold text-karate-red">{progress.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                        <div 
                          className="h-full bg-karate-red rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Atalhos Rápidos da Área do Aluno */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
            <div className="flex items-center gap-2">
              <Link
                to={lastStudy.type === "kata" ? `/katas/${lastStudy.id}` : `/techniques/${lastStudy.id}`}
                className="inline-flex items-center justify-center gap-2 bg-karate-red hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm text-xs sm:text-sm flex-1 sm:flex-initial"
              >
                <span>Retomar {lastStudy.type === "kata" ? "Kata" : "Técnica"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/student-area"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-karate-gold" />
                <span>Área do Aluno</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <Link to="/student-area?tab=favorites" className="hover:text-karate-gold transition-colors flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-karate-gold text-karate-gold" />
                  <span>{favorites.length} favoritos</span>
                </Link>
                <span>•</span>
                <Link to="/student-area?tab=exam" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exame {currentExamBelt.name} ({examProgress.percentage}%)</span>
                </Link>
              </div>

              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <Smartphone className="w-3 h-3 text-neutral-400" />
                <span>Salvo na memória deste aparelho</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Caso ainda não haja estudos recentes gravados */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-neutral-900 text-karate-gold flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-neutral-900 font-jp">
                  Área do Aluno & Treinamento Individual
                </h2>
                <span className="text-[10px] bg-karate-gold/20 text-neutral-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  Novo
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Salve seus katas favoritos, acompanhe movimentos memorizados e guarde anotações do Sensei no seu aparelho.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              to="/student-area"
              className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Acessar Área do Aluno</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

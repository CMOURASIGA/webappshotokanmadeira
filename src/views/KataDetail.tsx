import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { katas } from "../data/mockData";
import { ArrowLeft, Play, Shield, AlertTriangle, Star, CheckCircle2, GraduationCap, Info } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";
import { useStudent } from "../contexts/StudentContext";

export function KataDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kataVideos } = useAppData();
  const { 
    recordStudy, 
    toggleKataMovement, 
    isMovementCompleted, 
    getKataProgress, 
    isFavorite, 
    toggleFavorite 
  } = useStudent();
  
  const kata = katas.find(k => k.id === id);

  useEffect(() => {
    if (kata) {
      recordStudy({
        id: kata.id,
        type: "kata",
        title: kata.name,
        subtitle: kata.meaning,
        categoryOrGroup: kata.group,
        totalMovements: kata.movements && kata.movements.length > 0 ? kata.movements.length : undefined
      });
    }
  }, [kata?.id, recordStudy]);

  if (!kata) {
    return <div className="p-8 text-center">Kata não encontrado.</div>;
  }
  
  const videoUrl = kataVideos[kata.id] || kata.videoUrl;
  const isFav = isFavorite(kata.id);
  const progress = getKataProgress(kata.id, kata.movements && kata.movements.length > 0 ? kata.movements.length : 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <Link
          to="/student-area"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <GraduationCap className="w-3.5 h-3.5 text-karate-gold" />
          <span>Ver na Área do Aluno</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="bg-karate-dark text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 text-[150px] leading-none font-jp font-black pointer-events-none translate-x-1/4 -translate-y-1/4">
            型
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">{kata.group}</span>
                <span className="bg-karate-red px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">{kata.level}</span>
              </div>

              {/* Botão de Favoritar Kata */}
              <button
                onClick={() => toggleFavorite({
                  id: kata.id,
                  type: "kata",
                  title: kata.name,
                  subtitle: kata.meaning,
                  categoryOrGroup: kata.group
                })}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isFav
                    ? "bg-karate-gold text-neutral-950 shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
                }`}
                title={isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              >
                <Star className={`w-3.5 h-3.5 ${isFav ? "fill-neutral-950 text-neutral-950" : "text-white"}`} />
                <span>{isFav ? "Favoritado" : "Favoritar"}</span>
              </button>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-jp mb-2">{kata.name}</h1>
            <p className="text-xl text-neutral-300 font-medium">{kata.meaning}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {videoUrl && (
              <section className="mb-8">
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-karate-black flex items-center justify-center relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={videoUrl} 
                    title={`Vídeo do Kata ${kata.name}`}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </section>
            )}
            <section>
              <h2 className="text-2xl font-bold mb-4 font-jp border-b border-neutral-100 pb-2">Sobre o Kata</h2>
              <p className="text-neutral-700 leading-relaxed">{kata.description}</p>
            </section>

            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3 mb-4">
                <h2 className="text-2xl font-bold font-jp flex items-center gap-2">
                  <Shield className="text-karate-red w-6 h-6" />
                  Sequência de Movimentos {kata.movementsCount > 0 ? `(${kata.movementsCount} movimentos — JKA)` : ""}
                </h2>

                {kata.movements.length > 0 && (
                  <div className="text-xs font-semibold text-neutral-500 flex items-center gap-2">
                    <span>Memorização: {progress.completed}/{progress.total}</span>
                    <span className="font-bold text-karate-red font-mono">({progress.percentage}%)</span>
                  </div>
                )}
              </div>

              {kata.movements.length > 0 ? (
                <>
                  {/* Barra de Progresso Visual de Cobertura do Kata */}
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-5 border border-neutral-200/60">
                    <div 
                      className="h-full bg-karate-red rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200/60">
                    <p className="text-xs text-neutral-500 mb-4 italic">
                      Dica de estudo: Toque no checkbox de cada movimento à medida que for memorizando a sequência técnica.
                    </p>
                    <ul className="space-y-2.5">
                      {kata.movements.map((mov, i) => {
                        const done = isMovementCompleted(kata.id, i);

                        return (
                          <li 
                            key={i} 
                            onClick={() => toggleKataMovement(kata.id, i)}
                            className={`flex gap-3 items-start p-2.5 rounded-lg transition-colors cursor-pointer select-none ${
                              done ? "bg-emerald-50/70 text-neutral-900 border border-emerald-200/60" : "hover:bg-white text-neutral-700"
                            }`}
                          >
                            <button
                              type="button"
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                done ? "bg-emerald-600 text-white" : "border border-neutral-300 bg-white"
                              }`}
                            >
                              {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                            <span className="text-karate-red font-bold text-xs min-w-[20px] mt-0.5">{i+1}.</span>
                            <span className={`leading-snug text-sm flex-1 ${done ? "line-through text-neutral-500" : ""}`}>
                              {mov.replace(/^\d+\.\s*/, '')}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-200/70 text-neutral-600 flex items-center justify-center mx-auto">
                    <Info className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-neutral-800 text-base">Sequência técnica em atualização</h3>
                  {kata.movementsCount > 0 && (
                    <p className="text-sm font-semibold text-neutral-800">
                      Quantidade oficial: {kata.movementsCount} movimentos
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    A quantidade de movimentos está validada pelo Manual Técnico do Instrutor da JKA Headquarters. A sequência detalhada passo a passo ainda está sendo revisada e complementada no Madeira Karate. Para estudo prático, siga a orientação do seu Sensei.
                  </p>
                  <a
                    href="https://www.jka.or.jp/wp/wp-content/uploads/2017/04/tech_manual_instructor.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-karate-red hover:underline"
                  >
                    Fonte oficial: JKA Headquarters
                  </a>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 font-jp border-b border-neutral-100 pb-2 flex items-center gap-2">
                <AlertTriangle className="text-karate-gold w-6 h-6" />
                Bunkai (Aplicação)
              </h2>
              <p className="text-neutral-700 leading-relaxed bg-karate-gold/10 p-5 rounded-xl border border-karate-gold/20">
                {kata.bunkai}
              </p>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100">
              <h3 className="font-bold text-lg mb-4 text-karate-black">Técnicas Principais</h3>
              <div className="flex flex-wrap gap-2">
                {kata.mainTechniques.map(tech => (
                  <span key={tech} className="bg-white border border-neutral-200 text-neutral-700 text-sm px-3 py-1.5 rounded-full shadow-sm hover:border-karate-red hover:text-karate-red transition-colors cursor-pointer">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {kata.attentionPoints.length > 0 && (
              <div className="bg-karate-red/5 p-6 rounded-xl border border-karate-red/10">
                <h3 className="font-bold text-lg mb-3 text-karate-red">Pontos de Atenção</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700">
                  {kata.attentionPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { techniques } from "../data/mockData";
import { ArrowLeft, CheckCircle2, XCircle, Info, Star, GraduationCap } from "lucide-react";
import { useAppData } from "../contexts/AppDataContext";
import { useStudent } from "../contexts/StudentContext";

export function TechniqueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { techniqueVideos, techniqueImages } = useAppData();
  const { recordStudy, isFavorite, toggleFavorite } = useStudent();
  
  const tech = techniques.find(t => t.id === id);

  useEffect(() => {
    if (tech) {
      recordStudy({
        id: tech.id,
        type: "technique",
        title: tech.nameJp,
        subtitle: tech.namePt,
        categoryOrGroup: tech.category
      });
    }
  }, [tech?.id, recordStudy]);

  if (!tech) {
    return <div className="p-8 text-center">Técnica não encontrada.</div>;
  }

  const videoUrl = techniqueVideos[tech.id] || tech.videoUrl;
  const imageUrl = techniqueImages[tech.id] || tech.imageUrl;
  const isFav = isFavorite(tech.id);

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
        <div className="bg-karate-dark text-white p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 opacity-5 text-[200px] leading-none font-jp font-black pointer-events-none -translate-x-1/4 -translate-y-1/4">
            技
          </div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="inline-block bg-karate-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {tech.category}
              </span>

              {/* Botão de Favoritar Técnica */}
              <button
                onClick={() => toggleFavorite({
                  id: tech.id,
                  type: "technique",
                  title: tech.nameJp,
                  subtitle: tech.namePt,
                  categoryOrGroup: tech.category
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

            <h1 className="text-4xl md:text-5xl font-bold font-jp mb-2">{tech.nameJp}</h1>
            <p className="text-xl text-neutral-300">{tech.namePt}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {imageUrl && (
              <section className="mb-8">
                <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-neutral-950 flex items-center justify-center relative p-2">
                  <img 
                    src={imageUrl} 
                    alt={tech.nameJp} 
                    className="w-auto h-auto max-w-full object-contain max-h-[480px] rounded-xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'py-12 text-center text-neutral-400 text-sm';
                        fallback.innerText = 'Imagem temporariamente indisponível';
                        parent.appendChild(fallback);
                      }
                    }} 
                  />
                </div>
              </section>
            )}
            {videoUrl && (
              <section className="mb-8">
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-karate-black flex items-center justify-center relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={videoUrl} 
                    title={`Vídeo da Técnica ${tech.nameJp}`}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </section>
            )}
            <section>
              <h2 className="text-2xl font-bold mb-4 font-jp border-b border-neutral-100 pb-2">Descrição</h2>
              <p className="text-neutral-700 leading-relaxed text-lg">{tech.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 font-jp border-b border-neutral-100 pb-2 flex items-center gap-2">
                <CheckCircle2 className="text-green-600 w-6 h-6" />
                Passo a Passo
              </h2>
              <div className="space-y-4">
                {tech.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="w-8 h-8 shrink-0 bg-karate-dark text-white rounded-full flex items-center justify-center font-bold font-jp">
                      {i + 1}
                    </div>
                    <p className="text-neutral-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h2 className="text-xl font-bold mb-4 font-jp text-red-900 flex items-center gap-2">
                <XCircle className="text-red-600 w-5 h-5" />
                Erros Comuns
              </h2>
              <ul className="space-y-3">
                {tech.commonErrors.map((err, i) => (
                  <li key={i} className="flex gap-2 text-red-800 text-sm">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-karate-gold/10 p-6 rounded-xl border border-karate-gold/20">
              <h2 className="text-xl font-bold mb-3 font-jp text-karate-dark flex items-center gap-2">
                <Info className="text-karate-gold w-5 h-5" />
                Aplicação Prática
              </h2>
              <p className="text-sm text-neutral-700">{tech.application}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft, ExternalLink, ShieldAlert, Award, FileText, CheckCircle2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { graduationRequirements } from "../data/graduationRequirements";

export function BeltsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Header Institucional */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-karate-red/10 text-karate-red text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Diretriz Oficial JKA Brasil</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-jp text-neutral-900">
          Faixas e Graduações (Obi)
        </h2>
        <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
          Sequência oficial de 10º Kyu ao 5º Dan, alinhada rigorosamente ao programa técnico do Guia para Graduação Kyu/Dan da JKA Brasil.
        </p>

        {/* Nota de rodapé da fonte oficial */}
        <div className="inline-flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 px-4 py-2 rounded-xl border border-neutral-200">
          <span>Programa de graduação conforme <strong>Guia para Graduação Kyu/Dan — JKA Brasil</strong>.</span>
          <a 
            href="https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-karate-red hover:underline font-semibold inline-flex items-center gap-1"
          >
            Acessar guia oficial <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Lista de Graduações */}
      <div className="space-y-6">
        {graduationRequirements.map((req) => {
          const isHigherDan = ["black-2", "black-3", "black-4", "black-5"].includes(req.id);
          const hasTechnicalContent = (req.kihon && req.kihon.length > 0) || (req.kata && req.kata.length > 0) || (req.kumite && req.kumite.length > 0);

          return (
            <div 
              key={req.id} 
              id={`belt-${req.id}`}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:border-neutral-300 transition-all"
            >
              {/* Barra de identificação da faixa */}
              <div className="p-5 sm:p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex items-center justify-center border-2 border-neutral-300 shadow-sm"
                    style={{ 
                      backgroundColor: req.color,
                      color: req.color === "#FFFFFF" || req.color === "#FFD700" ? "#111" : "#fff" 
                    }}
                  >
                    {req.id.startsWith("black") ? (
                      <span className="text-white text-xs font-bold font-jp tracking-wider">段</span>
                    ) : (
                      <span className="text-xs font-bold font-jp">級</span>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold font-jp text-neutral-900">
                        Faixa {req.beltName}
                      </h3>
                      <span className="bg-neutral-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {req.level}
                      </span>
                    </div>
                    {req.meaning && (
                      <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                        {req.meaning}
                      </p>
                    )}
                  </div>
                </div>

                {/* Link da Fonte Oficial */}
                <div className="shrink-0 self-start sm:self-center">
                  <a
                    href={req.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-karate-red font-medium transition-colors bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-karate-red" />
                    <span>Fonte: {req.source.name.split("—")[0].trim()}</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>
              </div>

              {/* Corpo de Conteúdo Técnico */}
              <div className="p-5 sm:p-6 md:p-8 space-y-6">
                {/* Caso de Dans Superiores sem requisitos técnicos validados */}
                {isHigherDan && !hasTechnicalContent ? (
                  <div className="space-y-6">
                    {/* Mensagem obrigatória da SPEC */}
                    <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-600 text-sm flex items-start gap-3">
                      <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-neutral-800 font-semibold mb-0.5">Programa Técnico:</strong>
                        <span>Conteúdo técnico não cadastrado nesta versão.</span>
                      </div>
                    </div>

                    {/* Regras Administrativas Oficiais Confirmadas (2026) */}
                    {req.danRules && (
                      <div className="space-y-3 bg-amber-50/60 p-5 rounded-xl border border-amber-200/80">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          Regras Administrativas Oficiais Confirmadas (JKA Brasil 2026)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-neutral-700">
                          {req.danRules.previousGrade && (
                            <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                              <span className="text-neutral-500 block text-xs">Graduação Anterior Mínima:</span>
                              <strong className="font-semibold text-neutral-900">{req.danRules.previousGrade}</strong>
                            </div>
                          )}
                          {req.danRules.minimumTime && (
                            <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                              <span className="text-neutral-500 block text-xs">Carência Obrigatória:</span>
                              <strong className="font-semibold text-neutral-900">{req.danRules.minimumTime}</strong>
                            </div>
                          )}
                          {req.danRules.minimumAge && (
                            <div className="bg-white p-3 rounded-lg border border-amber-200/60">
                              <span className="text-neutral-500 block text-xs">Idade Mínima:</span>
                              <strong className="font-semibold text-neutral-900">{req.danRules.minimumAge}</strong>
                            </div>
                          )}
                        </div>
                        {req.danRules.notes && req.danRules.notes.length > 0 && (
                          <ul className="text-xs text-neutral-600 space-y-1 pt-1 list-disc list-inside">
                            {req.danRules.notes.map((n, i) => (
                              <li key={i}>{n}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* 10º Kyu ao 1º Dan — Programa Técnico Oficial Completo */
                  <div className="space-y-6">
                    {/* Seção 1: KIHON */}
                    {req.kihon && req.kihon.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-karate-red" />
                          Kihon (Fundamentos)
                        </h4>
                        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/70 space-y-2">
                          {req.kihon.map((kItem, kIdx) => (
                            <div key={kIdx} className="text-xs sm:text-sm text-neutral-800 font-mono flex items-start gap-2">
                              <span className="text-neutral-400 select-none">•</span>
                              <span className="leading-relaxed">{kItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Seção 2: KATA */}
                    {req.kata && req.kata.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Kata (Forma)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {req.kata.map((kataItem, kataIdx) => (
                            <span 
                              key={kataIdx}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs sm:text-sm font-bold font-mono"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              {kataItem}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Seção 3: KUMITE */}
                    {req.kumite && req.kumite.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          Kumite (Combate)
                        </h4>
                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 space-y-1.5">
                          {req.kumite.map((kumiteItem, kumiteIdx) => (
                            <div key={kumiteIdx} className="text-xs sm:text-sm text-blue-950 font-mono flex items-start gap-2">
                              <span className="text-blue-400 select-none">•</span>
                              <span className="leading-relaxed">{kumiteItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Observações Oficiais */}
                    {req.notes && req.notes.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 space-y-1">
                        <strong className="block text-neutral-700 font-semibold">Observações da Banca Examinadora:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {req.notes.map((noteItem, noteIdx) => (
                            <li key={noteIdx}>{noteItem}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Regras Administrativas de Dan (Ex: 1º Dan) */}
                    {req.danRules && (
                      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs sm:text-sm">
                        <h5 className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                          Regras Administrativas (JKA Brasil 2026):
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-800">
                          {req.danRules.previousGrade && (
                            <div><strong>Graduação anterior:</strong> {req.danRules.previousGrade}</div>
                          )}
                          {req.danRules.minimumTime && (
                            <div><strong>Carência:</strong> {req.danRules.minimumTime}</div>
                          )}
                          {req.danRules.minimumAge && (
                            <div><strong>Idade mínima:</strong> {req.danRules.minimumAge}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { ArrowLeft, ExternalLink, Award, FileText, CheckCircle2, Info, Clock, ShieldCheck, Trophy, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { graduationRequirements } from "../data/graduationRequirements";
import { getDanExamAdminRule } from "../data/jkaExamRules";
import { jkaReferences, JKA_DISCLAIMER } from "../data/jkaReferences";
import { competitionReferences, COMPETITION_GOVERNANCE_NOTICE } from "../data/jkaCompetitionRules";

export function BeltsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto pb-16">
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
        <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Sequência oficial de 10º Kyu ao 5º Dan. Programa técnico de Kihon, Kata e Kumite rigorosamente alinhado ao <strong>Guia para Graduação Kyu/Dan da JKA Brasil</strong>, com governança separada para regras administrativas de exame e referências de competição.
        </p>

        {/* Links rápidos de referência */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="inline-flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100 px-3.5 py-1.5 rounded-xl border border-neutral-200">
            <span>Programa Técnico: <strong>Guia Kyu/Dan JKA Brasil</strong></span>
            <a 
              href="https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-karate-red hover:underline font-semibold inline-flex items-center gap-1"
            >
              Guia oficial <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-neutral-600 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
            <span>Regras Administrativas de Dan: <strong>JKA Brasil 2026</strong></span>
            <a 
              href="https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-800 hover:underline font-semibold inline-flex items-center gap-1"
            >
              Edital 2026 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Lista de Graduações */}
      <div className="space-y-8">
        {graduationRequirements.map((req) => {
          const isDan = req.id.startsWith("black");
          const isHigherDan = ["black-2", "black-3", "black-4", "black-5"].includes(req.id);
          const hasTechnicalContent = (req.kihon && req.kihon.length > 0) || (req.kata && req.kata.length > 0) || (req.kumite && req.kumite.length > 0);
          const adminRule = isDan ? getDanExamAdminRule(req.id) : undefined;

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
                    {isDan ? (
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
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-karate-red font-medium transition-colors bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs"
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

                    {/* Observações Oficiais da Banca */}
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
                  </div>
                )}

                {/* Bloco Administrativo para Exames de Dan (Referência JKA Brasil 2026) */}
                {adminRule && (
                  <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-200/90 space-y-4 pt-4 mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900">
                            Regras Administrativas para Exame de Dan ({adminRule.danLevel})
                          </h4>
                        </div>
                        <p className="text-[11px] text-amber-800/80 mt-0.5">
                          Referência administrativa oficial JKA Brasil — <strong>{adminRule.sourceYear}</strong>. Consulte sempre o edital vigente antes da inscrição.
                        </p>
                      </div>

                      <a
                        href="https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-karate-red transition-colors underline shrink-0"
                      >
                        Edital oficial 2026 <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 shadow-2xs space-y-1">
                        <span className="text-[11px] text-neutral-500 font-medium block">Graduação Anterior Mínima:</span>
                        <strong className="text-neutral-900 text-xs sm:text-sm font-semibold block">{adminRule.previousGrade}</strong>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 shadow-2xs space-y-1">
                        <span className="text-[11px] text-neutral-500 font-medium block">Carência Obrigatória:</span>
                        <strong className="text-neutral-900 text-xs sm:text-sm font-semibold block">{adminRule.minimumTime}</strong>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 shadow-2xs space-y-1">
                        <span className="text-[11px] text-neutral-500 font-medium block">Idade Mínima Publicada:</span>
                        <strong className="text-neutral-900 text-xs sm:text-sm font-semibold block">
                          {adminRule.minimumAge ? adminRule.minimumAge : "Não informada na tabela oficial publicada"}
                        </strong>
                      </div>
                    </div>

                    {/* Cursos Oficiais (16 horas) */}
                    <div className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span className="text-xs font-bold text-amber-950">
                          Cursos Oficiais de Atualização Técnica ({adminRule.courseHoursRequired} horas)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {adminRule.courseNotes}
                      </p>
                      <span className="text-[10px] text-neutral-500 block italic">
                        * Requisito administrativo de elegibilidade para inscrição, não constituindo item técnico de Kihon/Kata/Kumite.
                      </span>
                    </div>

                    {/* Documentação */}
                    <div className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span className="text-xs font-bold text-amber-950">Documentação e Condições de Inscrição:</span>
                      </div>
                      <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
                        {adminRule.documentationRequirements.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                      {adminRule.regularizationNotes && (
                        <p className="text-[11px] text-amber-900/90 pt-1.5 border-t border-amber-100">
                          <strong>Regularização de Kyu:</strong> {adminRule.regularizationNotes}
                        </p>
                      )}
                    </div>

                    {/* Análise Curricular para Outras Federações (2º a 4º Dan) */}
                    {adminRule.crossFederationRules && (
                      <div className="bg-amber-100/60 p-4 rounded-xl border border-amber-300/80 space-y-1 text-xs text-amber-950">
                        <strong className="block font-bold">
                          Candidatos oriundos de outras federações ({adminRule.crossFederationRules.eligibleGrades.join(", ")}):
                        </strong>
                        <p className="leading-relaxed">
                          {adminRule.crossFederationRules.description}
                        </p>
                      </div>
                    )}

                    {/* Aviso Editorial Padrão JKA */}
                    <p className="text-[11px] text-neutral-500 italic pt-1">
                      {JKA_DISCLAIMER}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bloco de Governança e Referências Oficiais da JKA Brasil */}
      <section className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-karate-gold" />
            <span>Governança Técnica e Metadados</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-jp">
            Referências Oficiais JKA Brasil & Governança de Domínios
          </h3>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            No Dojo Digital Madeira Karate, mantemos a separação rigorosa entre três domínios fundamentais para assegurar a autenticidade e evitar confusões entre requisitos de treino e regras esportivas ou burocráticas:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Domínio 1 */}
          <div className="bg-neutral-800/80 p-5 rounded-2xl border border-neutral-700/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-karate-gold uppercase tracking-wider block">1. Domínio Técnico</span>
              <h4 className="text-base font-bold text-white">Programa de Graduação</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Conteúdo técnico oficial de Kihon, Kata e Kumite para cada Kyu/Dan. Define o que o karateca deve praticar e dominar.
              </p>
            </div>
            <a 
              href="https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-karate-gold hover:underline font-semibold pt-2"
            >
              Guia Kyu/Dan JKA Brasil <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Domínio 2 */}
          <div className="bg-neutral-800/80 p-5 rounded-2xl border border-neutral-700/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">2. Domínio Administrativo</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">Vigência 2026</span>
              </div>
              <h4 className="text-base font-bold text-white">Exame de Grau JKA</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Carência temporal, idade mínima publicada, 16h em cursos chancelados e documentação. Válidas conforme o edital anual vigente.
              </p>
            </div>
            <a 
              href="https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold pt-2"
            >
              Edital JKA 2026 (Maringá) <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Domínio 3 */}
          <div className="bg-neutral-800/80 p-5 rounded-2xl border border-neutral-700/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">3. Domínio Esportivo</span>
                <span className="bg-blue-400/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">Vigência 2026</span>
              </div>
              <h4 className="text-base font-bold text-white">Base de Competição</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Regulamentos de campeonatos com elegibilidade própria (ex: graduação mínima a partir de 4º Kyu). Nunca se confundem com requisitos de exame.
              </p>
            </div>
            <div className="space-y-1 pt-2">
              <a 
                href="https://jkabrasil.com.br/wp-content/uploads/2026/01/2-XIII-CAMPEONATO-PARANAENSE-DE-KARATE-DO-SHOTOKAN-JKA-2026-Regulamento-MARINGA-PR-.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline font-semibold block"
              >
                XIII Camp. Paranaense 2026 <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://jkabrasil.com.br/wp-content/uploads/2026/02/2.-COPA-80-ANOS-SHIHAN-YOCHIZO-MACHIDA-REGULAMENTO_rev2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline font-semibold block"
              >
                Copa 80 Anos Shihan Machida <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Nota sobre taxas financeiras e segurança editorial */}
        <div className="p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700 text-xs text-neutral-400 space-y-1.5">
          <p>
            <strong className="text-neutral-200">Nota sobre taxas e investimentos:</strong> Em conformidade com a governança da SPEC 07, o Dojo Digital não reproduz taxas financeiras no sistema como regras fixas, pois valores de inscrição e diplomação variam por cidade, ano e edital oficial da JKA Brasil.
          </p>
          <p className="italic text-neutral-400">
            {JKA_DISCLAIMER}
          </p>
        </div>
      </section>
    </div>
  );
}

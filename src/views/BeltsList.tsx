import { ArrowLeft, ExternalLink, Award, FileText, CheckCircle2, Info, Clock, ShieldCheck, Trophy, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { graduationRequirements } from "../data/graduationRequirements";
import { getDanExamAdminRule } from "../data/jkaExamRules";
import { jkaReferences, JKA_DISCLAIMER } from "../data/jkaReferences";
import { competitionReferences, COMPETITION_GOVERNANCE_NOTICE } from "../data/jkaCompetitionRules";
import { useLanguage } from "../i18n/LanguageContext";

export function BeltsList() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = language === "en"
    ? { back:"Back", official:"Official JKA Brazil Guideline", title:"Belts and Grades (Obi)", intro:"Official progression from 10th Kyu to 5th Dan. Technical Kihon, Kata and Kumite requirements follow the JKA Brasil Kyu/Dan grading guide, while administrative exam rules and competition references are governed separately.", techProgram:"Technical Program", guide:"Official guide", adminRules:"Dan Administrative Rules", notice:"For accuracy, detailed technical requirements and official administrative excerpts below are preserved in Portuguese exactly as published by JKA Brasil. We translate the navigation and explanatory interface, but do not alter official source wording without a validated translation.", belt:"Belt", source:"Source", program:"Technical Program", unavailable:"Technical content is not registered in this version.", fundamentals:"Fundamentals", form:"Form", combat:"Sparring", examinerNotes:"Examiner Notes" }
    : language === "ja"
    ? { back:"戻る", official:"JKA Brasil 公式指針", title:"帯・級段位 (Obi)", intro:"10級から五段までの公式な進級体系です。Kihon、Kata、Kumite の技術要件は JKA Brasil の級・段審査ガイドに基づき、審査運用規定や大会規定とは分けて管理しています。", techProgram:"技術課程", guide:"公式ガイド", adminRules:"段審査の運用規定", notice:"正確性を優先し、以下の詳細な技術要件と公式な運用文書の引用は、JKA Brasil が公開したポルトガル語原文のまま表示します。操作画面と説明部分は翻訳しますが、検証されていない翻訳で公式文言を変更しません。", belt:"帯", source:"出典", program:"技術課程", unavailable:"この版には技術内容が登録されていません。", fundamentals:"基本", form:"形", combat:"組手", examinerNotes:"審査員向け注記" }
    : { back:"Voltar", official:"Diretriz Oficial JKA Brasil", title:"Faixas e Graduações (Obi)", intro:"Sequência oficial de 10º Kyu ao 5º Dan. Programa técnico de Kihon, Kata e Kumite alinhado ao Guia para Graduação Kyu/Dan da JKA Brasil, com governança separada para regras administrativas de exame e referências de competição.", techProgram:"Programa Técnico", guide:"Guia oficial", adminRules:"Regras Administrativas de Dan", notice:"", belt:"Faixa", source:"Fonte", program:"Programa Técnico", unavailable:"Conteúdo técnico não cadastrado nesta versão.", fundamentals:"Fundamentos", form:"Forma", combat:"Combate", examinerNotes:"Observações da Banca Examinadora" };

  const ui = language === "en"
    ? {
        notice2026: "Official notice 2026",
        adminTitle: "Administrative Rules for Dan Examination",
        adminRef: "Official JKA Brasil administrative reference. Always check the current notice before registering.",
        previousGrade: "Minimum Previous Grade:",
        minimumTime: "Required Minimum Interval:",
        minimumAge: "Published Minimum Age:",
        notPublished: "Not stated in the published official table",
        courses: "Official Technical Update Courses",
        hours: "hours",
        courseHint: "* Administrative eligibility requirement for registration. It is not a technical Kihon/Kata/Kumite requirement.",
        documents: "Registration Documents and Conditions:",
        kyuRegularization: "Kyu Regularization:",
        crossFederation: "Candidates from other federations",
        governanceBadge: "Technical Governance & Metadata",
        governanceTitle: "Official JKA Brasil References & Domain Governance",
        governanceIntro: "Madeira Karate Digital Dojo keeps three domains clearly separated to preserve authenticity and avoid confusion between training requirements, administrative exam rules and competition regulations:",
        domainTechnical: "1. Technical Domain",
        technicalTitle: "Grading Program",
        technicalText: "Official Kihon, Kata and Kumite content for each Kyu/Dan, defining what the karateka should practice and master.",
        domainAdmin: "2. Administrative Domain",
        valid2026: "Valid for 2026",
        examTitle: "JKA Grading Examination",
        adminText: "Time requirements, published minimum age, endorsed course hours and documentation, according to the current annual notice.",
        domainSport: "3. Competition Domain",
        competitionTitle: "Competition Rules",
        competitionText: "Tournament regulations have their own eligibility rules and must not be confused with grading requirements.",
        feesTitle: "Note on fees and costs:",
        feesText: "In line with SPEC 07 governance, the Digital Dojo does not store financial fees as fixed rules because registration and diploma amounts may vary by city, year and official JKA Brasil notice."
      }
    : language === "ja"
    ? {
        notice2026: "2026年公式要項",
        adminTitle: "段審査の運用規定",
        adminRef: "JKA Brasil の公式運用資料です。申込前に必ず最新の要項をご確認ください。",
        previousGrade: "必要な前段階:",
        minimumTime: "必要な最低期間:",
        minimumAge: "公開されている最低年齢:",
        notPublished: "公開されている公式表には記載がありません",
        courses: "公式技術更新講習",
        hours: "時間",
        courseHint: "* 申込資格に関する運用要件であり、Kihon・Kata・Kumite の技術項目ではありません。",
        documents: "申込書類・条件:",
        kyuRegularization: "級の登録整理:",
        crossFederation: "他団体からの受審者",
        governanceBadge: "技術ガバナンス・メタデータ",
        governanceTitle: "JKA Brasil 公式資料と領域管理",
        governanceIntro: "Madeira Karate デジタル道場では、稽古要件、審査運用規定、大会規定を混同しないよう、3つの領域を明確に分けて管理しています。",
        domainTechnical: "1. 技術領域",
        technicalTitle: "昇級・昇段課程",
        technicalText: "各 Kyu/Dan に必要な Kihon、Kata、Kumite の公式技術内容です。",
        domainAdmin: "2. 運用領域",
        valid2026: "2026年適用",
        examTitle: "JKA 級・段審査",
        adminText: "必要期間、公開最低年齢、認定講習時間、必要書類など、年度ごとの要項に基づく運用条件です。",
        domainSport: "3. 競技領域",
        competitionTitle: "大会規定",
        competitionText: "大会には独自の参加資格があり、昇級・昇段審査の要件とは別に扱います。",
        feesTitle: "費用に関する注記:",
        feesText: "SPEC 07 の管理方針に従い、申込料や証書費用は地域、年度、JKA Brasil の公式要項によって変動するため、固定ルールとしてシステムに保存しません。"
      }
    : {
        notice2026: "Edital oficial 2026",
        adminTitle: "Regras Administrativas para Exame de Dan",
        adminRef: "Referência administrativa oficial JKA Brasil. Consulte sempre o edital vigente antes da inscrição.",
        previousGrade: "Graduação Anterior Mínima:",
        minimumTime: "Carência Obrigatória:",
        minimumAge: "Idade Mínima Publicada:",
        notPublished: "Não informada na tabela oficial publicada",
        courses: "Cursos Oficiais de Atualização Técnica",
        hours: "horas",
        courseHint: "* Requisito administrativo de elegibilidade para inscrição, não constituindo item técnico de Kihon/Kata/Kumite.",
        documents: "Documentação e Condições de Inscrição:",
        kyuRegularization: "Regularização de Kyu:",
        crossFederation: "Candidatos oriundos de outras federações",
        governanceBadge: "Governança Técnica e Metadados",
        governanceTitle: "Referências Oficiais JKA Brasil & Governança de Domínios",
        governanceIntro: "No Dojo Digital Madeira Karate, mantemos a separação rigorosa entre três domínios fundamentais para assegurar a autenticidade e evitar confusões entre requisitos de treino e regras esportivas ou burocráticas:",
        domainTechnical: "1. Domínio Técnico",
        technicalTitle: "Programa de Graduação",
        technicalText: "Conteúdo técnico oficial de Kihon, Kata e Kumite para cada Kyu/Dan. Define o que o karateca deve praticar e dominar.",
        domainAdmin: "2. Domínio Administrativo",
        valid2026: "Vigência 2026",
        examTitle: "Exame de Grau JKA",
        adminText: "Carência temporal, idade mínima publicada, 16h em cursos chancelados e documentação. Válidas conforme o edital anual vigente.",
        domainSport: "3. Domínio Esportivo",
        competitionTitle: "Base de Competição",
        competitionText: "Regulamentos de campeonatos com elegibilidade própria. Nunca se confundem com requisitos de exame.",
        feesTitle: "Nota sobre taxas e investimentos:",
        feesText: "Em conformidade com a governança da SPEC 07, o Dojo Digital não reproduz taxas financeiras no sistema como regras fixas, pois valores de inscrição e diplomação variam por cidade, ano e edital oficial da JKA Brasil."
      };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-5xl mx-auto pb-16">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {copy.back}
      </button>

      {/* Header Institucional */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-karate-red/10 text-karate-red text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>{copy.official}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-jp text-neutral-900">
          {copy.title}
        </h2>
        <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {copy.intro}
        </p>

        {/* Links rápidos de referência */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="inline-flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100 px-3.5 py-1.5 rounded-xl border border-neutral-200">
            <span>{copy.techProgram}: <strong>Guia Kyu/Dan JKA Brasil</strong></span>
            <a 
              href="https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-karate-red hover:underline font-semibold inline-flex items-center gap-1"
            >
              {copy.guide} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-neutral-600 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
            <span>{copy.adminRules}: <strong>JKA Brasil 2026</strong></span>
            <a 
              href="https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-800 hover:underline font-semibold inline-flex items-center gap-1"
            >
              {ui.notice2026} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {language !== "pt" && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          {copy.notice}
        </div>
      )}

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
                        {copy.belt} {req.beltName}
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
                    <span>{copy.source}: {req.source.name.split("—")[0].trim()}</span>
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
                        <strong className="block text-neutral-800 font-semibold mb-0.5">{copy.program}:</strong>
                        <span>{copy.unavailable}</span>
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
                          Kihon ({copy.fundamentals})
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
                          Kata ({copy.form})
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
                          Kumite ({copy.combat})
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
                        <strong className="block text-neutral-700 font-semibold">{copy.examinerNotes}:</strong>
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
                            {ui.adminTitle} ({adminRule.danLevel})
                          </h4>
                        </div>
                        <p className="text-[11px] text-amber-800/80 mt-0.5">
                          {ui.adminRef} <strong>{adminRule.sourceYear}</strong>
                        </p>
                      </div>

                      <a
                        href="https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-karate-red transition-colors underline shrink-0"
                      >
                        {ui.notice2026} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 shadow-2xs space-y-1">
                        <span className="text-[11px] text-neutral-500 font-medium block">{ui.previousGrade}</span>
                        <strong className="text-neutral-900 text-xs sm:text-sm font-semibold block">{adminRule.previousGrade}</strong>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 shadow-2xs space-y-1">
                        <span className="text-[11px] text-neutral-500 font-medium block">{ui.minimumTime}</span>
                        <strong className="text-neutral-900 text-xs sm:text-sm font-semibold block">{adminRule.minimumTime}</strong>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 shadow-2xs space-y-1">
                        <span className="text-[11px] text-neutral-500 font-medium block">{ui.minimumAge}</span>
                        <strong className="text-neutral-900 text-xs sm:text-sm font-semibold block">
                          {adminRule.minimumAge ? adminRule.minimumAge : ui.notPublished}
                        </strong>
                      </div>
                    </div>

                    {/* Cursos Oficiais (16 horas) */}
                    <div className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span className="text-xs font-bold text-amber-950">
                          {ui.courses} ({adminRule.courseHoursRequired} {ui.hours})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        {adminRule.courseNotes}
                      </p>
                      <span className="text-[10px] text-neutral-500 block italic">
                        {ui.courseHint}
                      </span>
                    </div>

                    {/* Documentação */}
                    <div className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span className="text-xs font-bold text-amber-950">{ui.documents}</span>
                      </div>
                      <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
                        {adminRule.documentationRequirements.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                      {adminRule.regularizationNotes && (
                        <p className="text-[11px] text-amber-900/90 pt-1.5 border-t border-amber-100">
                          <strong>{ui.kyuRegularization}</strong> {adminRule.regularizationNotes}
                        </p>
                      )}
                    </div>

                    {/* Análise Curricular para Outras Federações (2º a 4º Dan) */}
                    {adminRule.crossFederationRules && (
                      <div className="bg-amber-100/60 p-4 rounded-xl border border-amber-300/80 space-y-1 text-xs text-amber-950">
                        <strong className="block font-bold">
                          {ui.crossFederation} ({adminRule.crossFederationRules.eligibleGrades.join(", ")}):
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
            <span>{ui.governanceBadge}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-jp">
            {ui.governanceTitle}
          </h3>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            {ui.governanceIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Domínio 1 */}
          <div className="bg-neutral-800/80 p-5 rounded-2xl border border-neutral-700/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-karate-gold uppercase tracking-wider block">{ui.domainTechnical}</span>
              <h4 className="text-base font-bold text-white">{ui.technicalTitle}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {ui.technicalText}
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
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">{ui.domainAdmin}</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">{ui.valid2026}</span>
              </div>
              <h4 className="text-base font-bold text-white">{ui.examTitle}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {ui.adminText}
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
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">{ui.domainSport}</span>
                <span className="bg-blue-400/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">Vigência 2026</span>
              </div>
              <h4 className="text-base font-bold text-white">{ui.competitionTitle}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {ui.competitionText}
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
            <strong className="text-neutral-200">{ui.feesTitle}</strong> {ui.feesText}
          </p>
          <p className="italic text-neutral-400">
            {JKA_DISCLAIMER}
          </p>
        </div>
      </section>
    </div>
  );
}

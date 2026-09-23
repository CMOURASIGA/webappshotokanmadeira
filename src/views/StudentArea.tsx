import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  GraduationCap, 
  Play, 
  Star, 
  CheckCircle2, 
  BookOpen, 
  Shield, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  ArrowRight, 
  ListChecks, 
  StickyNote, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  Award,
  Smartphone,
  ShieldCheck,
  Info
} from "lucide-react";
import { useStudent, TechnicalNote } from "../contexts/StudentContext";
import { belts, katas, techniques } from "../data/mockData";
import { getBeltChecklistGroups } from "../data/graduationRequirements";

export function StudentArea() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "continue" | "favorites" | "exam" | "notes") || "continue";
  const [activeTab, setActiveTab] = useState<"continue" | "favorites" | "exam" | "notes">(initialTab);

  // Sync tab with URL parameter
  const handleTabChange = (tab: "continue" | "favorites" | "exam" | "notes") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const {
    recentStudies,
    lastStudy,
    clearHistory,
    kataMovementsProgress,
    getKataProgress,
    favorites,
    removeFavorite,
    selectedExamBeltId,
    setSelectedExamBeltId,
    toggleExamRequirement,
    isExamRequirementCompleted,
    getBeltExamProgress,
    technicalNotes,
    addTechnicalNote,
    updateTechnicalNote,
    deleteTechnicalNote
  } = useStudent();

  // Favorites filtering state
  const [favoriteFilter, setFavoriteFilter] = useState<"all" | "kata" | "technique">("all");

  const filteredFavorites = useMemo(() => {
    if (favoriteFilter === "all") return favorites;
    return favorites.filter(fav => fav.type === favoriteFilter);
  }, [favorites, favoriteFilter]);

  // Selected Belt for Exam Checklist
  const currentExamBelt = useMemo(() => {
    return belts.find(b => b.id === selectedExamBeltId) || belts[1]; // default yellow (9º Kyu)
  }, [selectedExamBeltId]);

  const examChecklistData = useMemo(() => {
    return getBeltChecklistGroups(currentExamBelt.id);
  }, [currentExamBelt.id]);

  const examProgress = getBeltExamProgress(currentExamBelt.id, examChecklistData.totalCheckable);

  // Note Modal / Form State
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteRelatedType, setNoteRelatedType] = useState<"none" | "kata" | "technique">("none");
  const [noteRelatedId, setNoteRelatedId] = useState("");

  const handleOpenNewNoteModal = () => {
    setEditingNoteId(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteRelatedType("none");
    setNoteRelatedId("");
    setIsNoteModalOpen(true);
  };

  const handleOpenEditNoteModal = (note: TechnicalNote) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteRelatedType(note.relatedItemType || "none");
    setNoteRelatedId(note.relatedItemId || "");
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    let relatedItemTitle: string | undefined = undefined;
    if (noteRelatedType === "kata") {
      const k = katas.find(item => item.id === noteRelatedId);
      relatedItemTitle = k ? k.name : undefined;
    } else if (noteRelatedType === "technique") {
      const t = techniques.find(item => item.id === noteRelatedId);
      relatedItemTitle = t ? t.nameJp : undefined;
    }

    if (editingNoteId) {
      updateTechnicalNote(editingNoteId, {
        title: noteTitle,
        content: noteContent,
        relatedItemType: noteRelatedType === "none" ? undefined : noteRelatedType,
        relatedItemId: noteRelatedType === "none" ? undefined : noteRelatedId,
        relatedItemTitle
      });
    } else {
      addTechnicalNote({
        title: noteTitle || "Anotação do Sensei",
        content: noteContent,
        relatedItemType: noteRelatedType === "none" ? undefined : noteRelatedType,
        relatedItemId: noteRelatedType === "none" ? undefined : noteRelatedId,
        relatedItemTitle
      });
    }

    setIsNoteModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Institucional da Área do Aluno */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white rounded-2xl p-6 sm:p-10 border border-neutral-800 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 opacity-5 text-[160px] sm:text-[200px] leading-none font-jp font-black pointer-events-none select-none translate-x-1/4 -translate-y-1/4 text-white">
          修練
        </div>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-karate-red/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-karate-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
            <GraduationCap className="w-4 h-4 text-karate-gold" />
            <span>Treinamento Autônomo & Metas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-jp tracking-tight text-white">
            Área do Aluno
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Acompanhe seu avanço técnico no Karate Shotokan, retome de onde parou, marque seus Katas favoritos e registre as correções individuais fornecidas pelo Sensei nos treinos presenciais.
          </p>
        </div>

        {/* Métricas e Resumo Rápido */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-neutral-800/80 relative z-10">
          <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5">
            <span className="text-xs text-neutral-400 block mb-1">Último Estudo</span>
            <span className="text-sm sm:text-base font-bold text-white truncate block">
              {lastStudy ? lastStudy.title : "Nenhum ainda"}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5">
            <span className="text-xs text-neutral-400 block mb-1">Favoritos Salvos</span>
            <span className="text-sm sm:text-base font-bold text-karate-gold flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-karate-gold" />
              {favorites.length}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5">
            <span className="text-xs text-neutral-400 block mb-1">Meta de Faixa</span>
            <span className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 truncate">
              <span 
                className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                style={{ backgroundColor: currentExamBelt.color }}
              />
              {currentExamBelt.name} ({examProgress.percentage}%)
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5">
            <span className="text-xs text-neutral-400 block mb-1">Caderno Técnico</span>
            <span className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <StickyNote className="w-4 h-4 text-emerald-400" />
              {technicalNotes.length} notas
            </span>
          </div>
        </div>

        {/* Aviso de Orientação sobre Armazenamento Local por Aparelho */}
        <div className="mt-6 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-karate-gold mt-0.5 sm:mt-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">Armazenamento Individual neste Aparelho</span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  Privado & Offline
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] sm:text-xs leading-relaxed">
                Suas anotações, favoritos e checklists ficam gravados diretamente na memória deste dispositivo (celular ou computador). Cada aluno mantém seus dados separados usando seu próprio aparelho.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Seletor de Abas da Área do Aluno */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-200">
        <button
          onClick={() => handleTabChange("continue")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "continue"
              ? "bg-neutral-900 text-white shadow-sm"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <Play className="w-4 h-4 text-karate-red" />
          <span>Continuar Estudando</span>
          {recentStudies.length > 0 && (
            <span className="bg-neutral-800 text-neutral-300 text-[10px] px-1.5 py-0.5 rounded-full">
              {recentStudies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("favorites")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "favorites"
              ? "bg-neutral-900 text-white shadow-sm"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <Star className="w-4 h-4 text-karate-gold fill-karate-gold" />
          <span>Favoritos</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === "favorites" ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"
          }`}>
            {favorites.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("exam")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "exam"
              ? "bg-neutral-900 text-white shadow-sm"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <ListChecks className="w-4 h-4 text-emerald-500" />
          <span>Checklist de Exame</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === "exam" ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"
          }`}>
            {examProgress.percentage}%
          </span>
        </button>

        <button
          onClick={() => handleTabChange("notes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "notes"
              ? "bg-neutral-900 text-white shadow-sm"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <StickyNote className="w-4 h-4 text-amber-500" />
          <span>Caderno de Anotações</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            activeTab === "notes" ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-600"
          }`}>
            {technicalNotes.length}
          </span>
        </button>
      </div>

      {/* 3. Conteúdo da Aba Ativa */}

      {/* ABA 1: CONTINUAR ESTUDANDO (HISTÓRICO RECENTE & PROGRESSO DE MOVIMENTOS) */}
      {activeTab === "continue" && (
        <div className="space-y-6">
          {lastStudy ? (
            <div className="bg-white rounded-2xl border-2 border-karate-red/30 p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-karate-red/10 text-karate-red text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {lastStudy.type === "kata" ? "Último Kata Estudado" : "Última Técnica Estudada"}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(lastStudy.timestamp).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold font-jp text-neutral-900">
                    {lastStudy.title}
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {lastStudy.subtitle}
                  </p>

                  {/* Barra de Progresso Visual de Movimentos (para Katas) */}
                  {lastStudy.type === "kata" && lastStudy.totalMovements && (
                    <div className="pt-2 space-y-1.5">
                      {(() => {
                        const progress = getKataProgress(lastStudy.id, lastStudy.totalMovements);
                        return (
                          <>
                            <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                              <span>Movimentos memorizados: {progress.completed} de {progress.total}</span>
                              <span className="text-karate-red font-bold">{progress.percentage}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                              <div 
                                className="h-full bg-karate-red rounded-full transition-all duration-500"
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <Link
                    to={lastStudy.type === "kata" ? `/katas/${lastStudy.id}` : `/techniques/${lastStudy.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-karate-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base group"
                  >
                    <span>Retomar Estudo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 my-6">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Play className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-neutral-900">
                  Nenhum estudo recente iniciado
                </h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Ao abrir qualquer Kata ou Técnica para treino, seu progresso será salvo automaticamente aqui para você retomar rapidamente.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/katas"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explorar Katas</span>
                </Link>
                <Link
                  to="/techniques"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-colors border border-neutral-200"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Explorar Técnicas</span>
                </Link>
              </div>
            </div>
          )}

          {/* Histórico Completo de Acessos Recentes */}
          {recentStudies.length > 1 && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span>Histórico de Treino Recente</span>
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-xs text-neutral-500 hover:text-karate-red font-medium transition-colors"
                >
                  Limpar Histórico
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentStudies.slice(1).map(item => {
                  const kataProgress = item.type === "kata" && item.totalMovements
                    ? getKataProgress(item.id, item.totalMovements)
                    : null;

                  return (
                    <Link
                      key={`${item.type}_${item.id}`}
                      to={item.type === "kata" ? `/katas/${item.id}` : `/techniques/${item.id}`}
                      className="group bg-white rounded-xl p-4 border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium mb-1.5">
                          <span className="uppercase font-bold tracking-wider text-karate-red">
                            {item.type === "kata" ? "Kata" : "Técnica"}
                          </span>
                          <span>
                            {new Date(item.timestamp).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short"
                            })}
                          </span>
                        </div>
                        <h4 className="font-bold text-neutral-900 text-sm group-hover:text-karate-red transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      {kataProgress && (
                        <div className="mt-3 pt-2.5 border-t border-neutral-100 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-neutral-500">
                            <span>{kataProgress.completed} de {kataProgress.total} mov.</span>
                            <span className="font-bold text-neutral-700">{kataProgress.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-neutral-700 rounded-full"
                              style={{ width: `${kataProgress.percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: FAVORITOS DO ALUNO */}
      {activeTab === "favorites" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Filtrar Favoritos:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFavoriteFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  favoriteFilter === "all"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Todos ({favorites.length})
              </button>
              <button
                onClick={() => setFavoriteFilter("kata")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  favoriteFilter === "kata"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Katas ({favorites.filter(f => f.type === "kata").length})
              </button>
              <button
                onClick={() => setFavoriteFilter("technique")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  favoriteFilter === "technique"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Técnicas ({favorites.filter(f => f.type === "technique").length})
              </button>
            </div>
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 my-6">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Star className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-neutral-900">
                  {favorites.length === 0 ? "Nenhum item favoritado ainda" : "Nenhum favorito encontrado para este filtro"}
                </h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Toque no ícone de estrela marcial nas fichas de Katas e Técnicas para reuni-los aqui para revisão rápida antes do treino presencial.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/katas"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver Katas</span>
                </Link>
                <Link
                  to="/techniques"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-colors border border-neutral-200"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Ver Técnicas</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map(fav => (
                <div
                  key={`${fav.type}_${fav.id}`}
                  className="group bg-white rounded-2xl p-5 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all flex flex-col justify-between relative"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {fav.categoryOrGroup}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFavorite(fav.id);
                        }}
                        className="text-karate-gold hover:text-neutral-400 p-1 rounded-full transition-colors"
                        title="Remover dos Favoritos"
                      >
                        <Star className="w-4 h-4 fill-karate-gold" />
                      </button>
                    </div>

                    <h4 className="font-bold text-base text-neutral-900 group-hover:text-karate-red transition-colors">
                      {fav.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {fav.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">
                      {fav.type === "kata" ? "Kata Oficial" : "Técnica JKA"}
                    </span>
                    <Link
                      to={fav.type === "kata" ? `/katas/${fav.id}` : `/techniques/${fav.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-karate-red hover:text-red-700 transition-colors"
                    >
                      <span>Abrir Ficha</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: CHECKLIST DE EXAME DE GRADUAÇÃO */}
      {activeTab === "exam" && (
        <div className="space-y-6">
          {/* Seletor de Faixa Pretendida */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-karate-red block mb-1">
                Autoavaliação Pedagógica
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-jp text-neutral-900">
                Requisitos para o Exame de Faixa
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Selecione a graduação que você está treinando para prestar exame e marque os conteúdos já dominados.
              </p>
            </div>

            {/* Carrossel / Grade de Faixas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
              {belts.map(belt => {
                const isSelected = belt.id === currentExamBelt.id;
                const bChecklist = getBeltChecklistGroups(belt.id);
                const prog = getBeltExamProgress(belt.id, bChecklist.totalCheckable);

                return (
                  <button
                    key={belt.id}
                    onClick={() => setSelectedExamBeltId(belt.id)}
                    className={`flex flex-col items-start p-3 rounded-xl min-w-[130px] border transition-all text-left shrink-0 ${
                      isSelected
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-neutral-400 shrink-0"
                        style={{ backgroundColor: belt.color }}
                      />
                      <span className="text-xs font-bold">{belt.name}</span>
                    </div>
                    <span className="text-[10px] opacity-75">{belt.level}</span>
                    <div className="w-full h-1 bg-neutral-200/50 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isSelected ? "bg-karate-gold" : "bg-neutral-600"}`}
                        style={{ width: `${bChecklist.totalCheckable > 0 ? prog.percentage : 0}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cartão de Detalhes da Faixa Selecionada & Checklist */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm border border-neutral-300 shrink-0"
                  style={{ backgroundColor: currentExamBelt.color, color: currentExamBelt.id === "white" || currentExamBelt.id === "yellow" ? "#111" : "#fff" }}
                >
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-jp text-neutral-900">
                      Faixa {currentExamBelt.name}
                    </h3>
                    <span className="bg-neutral-100 text-neutral-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {currentExamBelt.level}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 max-w-md">
                    {currentExamBelt.meaning}
                  </p>
                </div>
              </div>

              {/* Status do Progresso da Faixa */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 sm:min-w-[180px] text-right">
                <span className="text-xs text-neutral-500 block mb-0.5">Prontidão para Exame</span>
                <span className="text-2xl font-black text-neutral-900 font-mono">
                  {examChecklistData.totalCheckable > 0 ? `${examProgress.percentage}%` : "—"}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  {examChecklistData.totalCheckable > 0
                    ? `${examProgress.completed} de ${examChecklistData.totalCheckable} itens dominados`
                    : "Regras administrativas aplicáveis"}
                </span>
              </div>
            </div>

            {/* Lista Interativa de Requisitos do Exame Agrupados */}
            <div className="space-y-6">
              {examChecklistData.totalCheckable === 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-600 text-sm flex items-start gap-3">
                    <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-neutral-800 font-semibold mb-0.5">Programa Técnico:</strong>
                      <span>Conteúdo técnico não cadastrado nesta versão.</span>
                    </div>
                  </div>

                  {currentExamBelt.danRules && (
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs sm:text-sm">
                      <h5 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        Regras Administrativas Oficiais Confirmadas (JKA Brasil 2026):
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-800 pt-1">
                        {currentExamBelt.danRules.previousGrade && (
                          <div><strong>Graduação anterior:</strong> {currentExamBelt.danRules.previousGrade}</div>
                        )}
                        {currentExamBelt.danRules.minimumTime && (
                          <div><strong>Carência mínima:</strong> {currentExamBelt.danRules.minimumTime}</div>
                        )}
                        {currentExamBelt.danRules.minimumAge && (
                          <div><strong>Idade mínima:</strong> {currentExamBelt.danRules.minimumAge}</div>
                        )}
                      </div>
                      {currentExamBelt.danRules.notes && currentExamBelt.danRules.notes.length > 0 && (
                        <ul className="text-[11px] text-neutral-600 space-y-0.5 pt-1 list-disc list-inside">
                          {currentExamBelt.danRules.notes.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {examChecklistData.groups.map(group => (
                    <div key={group.category} className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-2">
                        <span 
                          className={`w-2 h-2 rounded-full ${
                            group.category === "kihon" 
                              ? "bg-karate-red" 
                              : group.category === "kata" 
                              ? "bg-amber-500" 
                              : "bg-blue-600"
                          }`} 
                        />
                        <span>{group.title}</span>
                      </h4>

                      <div className="grid gap-2">
                        {group.items.map(item => {
                          const isCompleted = isExamRequirementCompleted(item.id);

                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleExamRequirement(item.id)}
                              className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                                isCompleted
                                  ? "bg-emerald-50/70 border-emerald-300 text-neutral-900"
                                  : "bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200 text-neutral-700"
                              }`}
                            >
                              <button
                                type="button"
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isCompleted
                                    ? "bg-emerald-600 text-white"
                                    : "border-2 border-neutral-300 bg-white"
                                }`}
                              >
                                {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <span className={`text-xs sm:text-sm leading-snug font-medium block font-mono ${isCompleted ? "line-through text-neutral-400" : "text-neutral-900"}`}>
                                  {item.text}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Observações da Banca Examinadora (Texto informativo) */}
                  {examChecklistData.notes && examChecklistData.notes.length > 0 && (
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
                      <strong className="block text-neutral-800 font-semibold mb-1">
                        Observações da Banca Examinadora:
                      </strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {examChecklistData.notes.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Regras Administrativas de Dan (ex: 1º Dan) */}
                  {currentExamBelt.danRules && (
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5 text-xs text-neutral-700">
                      <strong className="block text-amber-900 font-bold uppercase tracking-wider text-[11px]">
                        Regras Administrativas (JKA Brasil 2026):
                      </strong>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                        {currentExamBelt.danRules.previousGrade && (
                          <div><strong>Graduação anterior:</strong> {currentExamBelt.danRules.previousGrade}</div>
                        )}
                        {currentExamBelt.danRules.minimumTime && (
                          <div><strong>Carência:</strong> {currentExamBelt.danRules.minimumTime}</div>
                        )}
                        {currentExamBelt.danRules.minimumAge && (
                          <div><strong>Idade mínima:</strong> {currentExamBelt.danRules.minimumAge}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 text-xs text-neutral-500 bg-amber-50 border border-amber-200/80 p-4 rounded-xl flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Lembrete Pedagógico:</strong> A autoavaliação serve para orientação do seu estudo individual. A autorização e aprovação oficial para exame de graduação são de exclusiva competência dos Senseis da Madeira Karate.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: CADERNO DE ANOTAÇÕES TÉCNICAS */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200">
            <div>
              <h2 className="text-lg font-bold font-jp text-neutral-900">
                Observações & Correções do Sensei
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Salve as orientações específicas recebidas durante o treino no dojo para revisar antes da próxima aula.
              </p>
            </div>

            <button
              onClick={handleOpenNewNoteModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-karate-red hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Anotação</span>
            </button>
          </div>

          {/* Dica de Armazenamento Local das Anotações */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 text-xs text-amber-900 flex items-start gap-3">
            <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-neutral-900 text-xs block">
                Caderno Pessoal salvo neste dispositivo
              </span>
              <p className="text-amber-800 text-[11px] sm:text-xs leading-relaxed">
                As anotações registradas aqui ficam salvas exclusivamente no navegador deste aparelho. Caso você troque de celular ou limpe o histórico do navegador, as anotações não serão migradas automaticamente.
              </p>
            </div>
          </div>

          {technicalNotes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 my-6">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <StickyNote className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-neutral-900">
                  Nenhuma anotação técnica registrada
                </h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Use este espaço para registrar correções de postura, respiração, kime ou ângulos passados pelo Sensei para não esquecer.
                </p>
              </div>
              <button
                onClick={handleOpenNewNoteModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-black transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Primeira Anotação</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalNotes.map(note => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm hover:border-neutral-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-neutral-900 font-jp line-clamp-1">
                        {note.title}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditNoteModal(note)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                          title="Editar Anotação"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTechnicalNote(note.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-karate-red hover:bg-red-50 transition-colors"
                          title="Excluir Anotação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {note.relatedItemTitle && (
                      <span className="inline-block bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {note.relatedItemType === "kata" ? "Kata: " : "Técnica: "}
                        {note.relatedItemTitle}
                      </span>
                    )}

                    <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 flex items-center justify-between">
                    <span>
                      Registrado em: {new Date(note.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                    {note.updatedAt > note.createdAt && (
                      <span>(Atualizado)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE ANOTAÇÃO TÉCNICA */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 font-jp">
                {editingNoteId ? "Editar Anotação do Sensei" : "Nova Anotação Técnica"}
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Título da Orientação
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Ex: Correção de postura no Heian Nidan"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red/30 focus:border-karate-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Vincular a:
                  </label>
                  <select
                    value={noteRelatedType}
                    onChange={(e) => {
                      setNoteRelatedType(e.target.value as "none" | "kata" | "technique");
                      setNoteRelatedId("");
                    }}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-karate-red"
                  >
                    <option value="none">Nenhum (Geral)</option>
                    <option value="kata">Kata</option>
                    <option value="technique">Técnica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Item Correspondente:
                  </label>
                  <select
                    disabled={noteRelatedType === "none"}
                    value={noteRelatedId}
                    onChange={(e) => setNoteRelatedId(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 disabled:opacity-50 focus:outline-none focus:border-karate-red"
                  >
                    <option value="">Selecione...</option>
                    {noteRelatedType === "kata" && katas.map(k => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                    {noteRelatedType === "technique" && techniques.map(t => (
                      <option key={t.id} value={t.id}>{t.nameJp} ({t.namePt})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Conteúdo da Correção / Dica <span className="text-karate-red">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Ex: No Kokutsu-Dachi, manter 70% do peso na perna traseira. Não avançar o tronco durante o Shuto Uke."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-karate-red/30 focus:border-karate-red"
                />
              </div>

              <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-neutral-100">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-neutral-400" />
                  Salva apenas neste aparelho
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-karate-red hover:bg-red-700 text-white transition-colors shadow-sm"
                  >
                    Salvar Anotação
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

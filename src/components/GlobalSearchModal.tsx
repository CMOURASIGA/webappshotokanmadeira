import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  X, 
  BookOpen, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  List, 
  ScrollText, 
  Camera, 
  Megaphone,
  History,
  Command
} from "lucide-react";
import { searchAllData, SearchResultItem, SearchCategory } from "../lib/searchIndex";
import { useAppData } from "../contexts/AppDataContext";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const CATEGORY_TABS: { key: "all" | SearchCategory; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "kata", label: "Katas" },
  { key: "technique", label: "Técnicas" },
  { key: "vocabulary", label: "Vocabulário" },
  { key: "belt", label: "Faixas" },
  { key: "dojokun", label: "Dojo Kun" },
  { key: "history", label: "História" },
  { key: "notice", label: "Avisos" },
  { key: "event", label: "Eventos" }
];

export function GlobalSearchModal({ isOpen, onClose, initialQuery = "" }: GlobalSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<"all" | SearchCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { notices, events } = useAppData();

  // Todos os resultados indexados em tempo real
  const allResults = useMemo(() => {
    return searchAllData(query, notices, events);
  }, [query, notices, events]);

  // Filtragem pela aba ativa
  const filteredResults = useMemo(() => {
    if (selectedCategory === "all") return allResults;
    return allResults.filter(item => item.category === selectedCategory);
  }, [allResults, selectedCategory]);

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    navigate(item.path);
  };

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Teclado: Escape fecha, Setas navegam, Enter seleciona
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Se não houver resultados filtrados, teclas de navegação e seleção não agem
      if (filteredResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const currentSelected = filteredResults[selectedIndex];
        if (currentSelected) {
          handleSelect(currentSelected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, filteredResults, selectedIndex]);

  // Garante que selectedIndex nunca ultrapasse o total de itens ao mudar filtros/query
  useEffect(() => {
    if (filteredResults.length === 0) {
      setSelectedIndex(0);
    } else if (selectedIndex >= filteredResults.length) {
      setSelectedIndex(filteredResults.length - 1);
    }
  }, [filteredResults.length, selectedIndex]);

  // Rola o item ativo para visualização ao navegar com o teclado
  useEffect(() => {
    if (!isOpen || filteredResults.length === 0) return;
    const activeEl = document.getElementById(`search-result-item-${selectedIndex}`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, isOpen, filteredResults.length]);

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case "kata": return <BookOpen className="w-4 h-4 text-karate-red" />;
      case "technique": return <Shield className="w-4 h-4 text-amber-600" />;
      case "belt": return <List className="w-4 h-4 text-blue-600" />;
      case "vocabulary": return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case "dojokun": return <ScrollText className="w-4 h-4 text-purple-600" />;
      case "history": return <History className="w-4 h-4 text-orange-600" />;
      case "notice": return <Megaphone className="w-4 h-4 text-rose-600" />;
      case "event": return <Camera className="w-4 h-4 text-teal-600" />;
      default: return <Search className="w-4 h-4 text-neutral-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 md:p-6 pt-12 sm:pt-16 md:pt-20 animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        role="dialog"
        aria-modal="true"
        aria-label="Busca Global Madeira Karate"
      >
        {/* Cabeçalho do Modal de Busca */}
        <div className="p-3 sm:p-4 border-b border-neutral-800 flex items-center gap-3 bg-neutral-900/90 sticky top-0 z-10">
          <Search className="w-5 h-5 text-karate-gold shrink-0 ml-1" />
          <input 
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={filteredResults.length > 0}
            aria-controls="search-results-list"
            aria-autocomplete="list"
            aria-activedescendant={filteredResults.length > 0 ? `search-result-item-${selectedIndex}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Buscar por técnica, kata, faixa, dojo kun, vocabulário..."
            className="flex-1 bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base outline-none pr-2 font-medium"
          />
          {query && (
            <button 
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white border border-neutral-700 rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-1 shrink-0"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Abas de Categorias (visíveis quando há query ou quando há resultados) */}
        {query.trim().length >= 2 && allResults.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-neutral-950/60 border-b border-neutral-800/80 overflow-x-auto no-scrollbar shrink-0">
            {CATEGORY_TABS.map(tab => {
              const count = tab.key === "all" 
                ? allResults.length 
                : allResults.filter(i => i.category === tab.key).length;

              if (tab.key !== "all" && count === 0) return null;

              const isSelected = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setSelectedCategory(tab.key);
                    setSelectedIndex(0);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? "bg-karate-red text-white font-bold shadow-sm"
                      : "bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1 rounded-full ${isSelected ? "bg-black/30" : "bg-neutral-900"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Área de Resultados / Sugestões */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 divide-y divide-neutral-800/40">
          {query.trim().length < 2 ? (
            /* Estado Inicial: Sugestões rápidas de pesquisa */
            <div className="p-4 sm:p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-800/80 border border-neutral-700 mx-auto flex items-center justify-center text-karate-gold">
                <Command className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base">Busca no Dojo Digital</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  Encontre instantaneamente Katas, Técnicas de Kihon, Faixas, Vocabulário tradicional, Dojo Kun, História e Avisos.
                </p>
              </div>

              {/* Termos Populares para clique direto */}
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold mb-2">Sugestões rápidas:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Heian Shodan", "Bassai Dai", "Zenkutsu", "Gedan Barai", "Sensei", "Faixa Preta", "Dojo Kun", "Funakoshi"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs bg-neutral-800/90 hover:bg-karate-red hover:text-white text-neutral-300 px-3 py-1.5 rounded-lg border border-neutral-700/60 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            /* Estado Vazio: Nenhum resultado encontrado */
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-800/60 border border-neutral-700 mx-auto flex items-center justify-center text-neutral-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-white font-medium text-sm sm:text-base">
                Nenhum resultado para "{query}"
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Verifique a digitação ou tente buscar por termos mais genéricos, como 
                <span className="text-karate-gold font-medium"> kata</span>, 
                <span className="text-karate-gold font-medium"> soco</span>, 
                <span className="text-karate-gold font-medium"> faixa</span> ou 
                <span className="text-karate-gold font-medium"> oss</span>.
              </p>
            </div>
          ) : (
            /* Lista de Resultados */
            <div id="search-results-list" role="listbox" className="space-y-1">
              {filteredResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    id={`search-result-item-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group p-3 sm:p-3.5 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 border ${
                      isSelected
                        ? "bg-neutral-800/95 border-karate-gold/70 ring-1 ring-karate-gold/60 shadow-lg"
                        : "border-transparent hover:bg-neutral-800/50"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2 rounded-lg border shrink-0 mt-0.5 transition-all ${
                        isSelected 
                          ? "bg-neutral-700/80 border-karate-gold/60 scale-105" 
                          : "bg-neutral-800 border-neutral-700/60 group-hover:scale-105"
                      }`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm sm:text-base transition-colors truncate ${
                            isSelected ? "text-karate-gold" : "text-white group-hover:text-karate-gold"
                          }`}>
                            {item.title}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${item.badgeClass}`}>
                            {item.categoryLabel}
                          </span>
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-neutral-400 font-medium mt-0.5 truncate">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 mt-2">
                      {isSelected && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-karate-gold/20 text-karate-gold border border-karate-gold/40">
                          ENTER ↵
                        </span>
                      )}
                      <ArrowRight className={`w-4 h-4 transition-all shrink-0 ${
                        isSelected 
                          ? "text-karate-gold translate-x-1" 
                          : "text-neutral-600 group-hover:text-white group-hover:translate-x-0.5"
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé de Ajuda */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 flex flex-wrap items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 text-[10px] font-mono">↑</kbd>
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 text-[10px] font-mono">↓</kbd>
              <span className="text-neutral-500">Navegar</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 text-[10px] font-mono">↵ Enter</kbd>
              <span className="text-neutral-500">Abrir</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 text-[10px] font-mono">ESC</kbd>
              <span className="text-neutral-500">Fechar</span>
            </span>
          </div>
          <span className="text-neutral-500">
            {filteredResults.length} {filteredResults.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>
      </div>
    </div>
  );
}

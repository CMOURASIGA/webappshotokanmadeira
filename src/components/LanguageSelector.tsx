import { useLanguage, type Language } from "../i18n/LanguageContext";

const options: Array<{ code: Language; flag: string; label: string; short: string }> = [
  { code: "pt", flag: "🇧🇷", label: "Português", short: "PT" },
  { code: "en", flag: "🇺🇸", label: "English", short: "EN" },
  { code: "ja", flag: "🇯🇵", label: "日本語", short: "日本語" }
];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-1" aria-label={t("language.label")}>
      {options.map(option => {
        const active = language === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            title={option.label}
            aria-label={option.label}
            aria-pressed={active}
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-bold transition-all ${active
              ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"}`}
          >
            <span aria-hidden="true" className="text-sm leading-none">{option.flag}</span>
            {!compact && <span>{option.short}</span>}
          </button>
        );
      })}
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export function History() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">{t("history.title")}</h2>
        <p className="text-neutral-500 text-lg">{t("history.subtitle")}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12">
        <div className="space-y-8 text-neutral-700 leading-relaxed text-lg">
          <section>
            <h3 className="text-2xl font-bold font-jp text-karate-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-karate-red rounded-sm inline-block"></span>
              {t("history.masterTitle")}
            </h3>
            <p className="mb-4">{t("history.masterP1")}</p>
            <p>{t("history.masterP2")}</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold font-jp text-karate-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#C8A24A] rounded-sm inline-block"></span>
              {t("history.meaningTitle")}
            </h3>
            <ul className="space-y-3 bg-neutral-50 p-6 rounded-xl border border-neutral-100 my-4">
              <li className="flex gap-3"><span className="font-bold text-karate-red min-w-[60px]">Sho (松)</span><span>{t("history.sho")}</span></li>
              <li className="flex gap-3"><span className="font-bold text-karate-red min-w-[60px]">To (濤)</span><span>{t("history.to")}</span></li>
              <li className="flex gap-3"><span className="font-bold text-karate-red min-w-[60px]">Kan (館)</span><span>{t("history.kan")}</span></li>
            </ul>
            <p>{t("history.meaningP")}</p>
          </section>

          <section>
            <h3 className="text-2xl font-bold font-jp text-karate-black mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#111111] rounded-sm inline-block"></span>
              {t("history.legacyTitle")}
            </h3>
            <p className="mb-4">{t("history.legacyP1")}</p>
            <p>{t("history.legacyP2")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

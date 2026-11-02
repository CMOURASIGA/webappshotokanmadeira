import { ArrowLeft, Calendar, MoveHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { useLanguage, type Language } from "../i18n/LanguageContext";

type ClassSession = {
  name: string;
  desc?: string;
  bg: string;
};

type ScheduleRow = {
  time: string;
  mon?: ClassSession;
  tue?: ClassSession;
  wed?: ClassSession;
  thu?: ClassSession;
  fri?: ClassSession;
  sat?: ClassSession;
};


function translateScheduleDesc(desc: string | undefined, language: Language): string | undefined {
  if (!desc) return desc;
  const table: Record<string, Record<Language, string>> = {
    "(Iniciante/Fundamentos)": { pt: "(Iniciante/Fundamentos)", en: "(Beginner/Fundamentals)", ja: "(初心者・基本)" },
    "(Livre)": { pt: "(Livre)", en: "(Open Class)", ja: "(一般)" },
    "(A partir dos 14 anos)": { pt: "(A partir dos 14 anos)", en: "(Ages 14+)", ja: "(14歳以上)" },
    "(Kids)": { pt: "(Kids)", en: "(Kids)", ja: "(キッズ)" },
    "(04 a 09 anos)": { pt: "(04 a 09 anos)", en: "(Ages 4–9)", ja: "(4〜9歳)" },
    "(Feminino)": { pt: "(Feminino)", en: "(Women)", ja: "(女性)" },
    "(10 a 14 anos)": { pt: "(10 a 14 anos)", en: "(Ages 10–14)", ja: "(10〜14歳)" },
    "(2 a 4 anos)": { pt: "(2 a 4 anos)", en: "(Ages 2–4)", ja: "(2〜4歳)" },
    "(Kata)": { pt: "(Kata)", en: "(Kata)", ja: "(形)" }
  };
  return table[desc]?.[language] || desc;
}

const scheduleData: ScheduleRow[] = [
  {
    time: "07:00",
    mon: { name: "Karate", desc: "(Iniciante/Fundamentos)", bg: "bg-white text-black" },
    wed: { name: "Karate", desc: "(Iniciante/Fundamentos)", bg: "bg-white text-black" },
    fri: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "07:30",
    tue: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
    thu: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
  },
  {
    time: "08:00",
    mon: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    tue: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    wed: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    thu: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    fri: { name: "MADEIRA TOTAL", desc: "EXPERIENCE", bg: "bg-black text-white" },
  },
  {
    time: "09:00",
    mon: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
    tue: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
    thu: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    fri: { name: "Karate", desc: "(Feminino)", bg: "bg-[#f054ba] text-white" },
    sat: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "10:00",
    mon: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
  },
  {
    time: "15:00",
    tue: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    thu: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "16:00",
    mon: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    tue: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    wed: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    thu: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
    fri: { name: "Karate", desc: "(10 a 14 anos)", bg: "bg-[#5fa2f0] text-black" },
  },
  {
    time: "17:00",
    mon: { name: "Yoga", desc: "", bg: "bg-[#ff5555] text-black" },
    wed: { name: "Yoga", desc: "", bg: "bg-[#ff5555] text-black" },
    fri: { name: "Yoga", desc: "", bg: "bg-[#ff5555] text-black" },
  },
  {
    time: "17:30",
    tue: { name: "Karate Baby", desc: "(2 a 4 anos)", bg: "bg-[#1c00c7] text-white" },
    thu: { name: "Karate Baby", desc: "(2 a 4 anos)", bg: "bg-[#1c00c7] text-white" },
  },
  {
    time: "18:00",
    mon: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Judô", desc: "(Kids)", bg: "bg-[#a652ff] text-white" },
    fri: { name: "Karate", desc: "(Kata)", bg: "bg-[#00c957] text-black" },
  },
  {
    time: "18:30",
    tue: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
    thu: { name: "Karate Kids", desc: "(04 a 09 anos)", bg: "bg-[#ffd54f] text-black" },
  },
  {
    time: "19:00",
    mon: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    wed: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    fri: { name: "MADEIRA TOTAL", desc: "EXPERIENCE", bg: "bg-black text-white" },
  },
  {
    time: "19:30",
    tue: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
    thu: { name: "Karate", desc: "(Livre)", bg: "bg-[#b1fc54] text-black" },
  },
  {
    time: "20:00",
    mon: { name: "Aikidô", desc: "", bg: "bg-[#c2c2c2] text-black" },
    wed: { name: "Aikidô", desc: "", bg: "bg-[#c2c2c2] text-black" },
  },
  {
    time: "20:30",
    tue: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
    thu: { name: "Jiu-Jitsu", desc: "(A partir dos 14 anos)", bg: "bg-[#d670d6] text-black" },
  },
  {
    time: "21:00",
    mon: { name: "Judô Adulto", desc: "", bg: "bg-[#a652ff] text-white" },
    wed: { name: "Judô Adulto", desc: "", bg: "bg-[#a652ff] text-white" },
  }
];

function ClassCell({ session }: { session?: ClassSession }) {
  const { language } = useLanguage();
  if (!session) {
    return <td className="border border-[#333333] bg-[#484848] p-2 min-w-[120px] h-20"></td>;
  }
  return (
    <td className={`border border-[#333333] p-2 text-center text-xs font-bold leading-tight min-w-[120px] h-20 ${session.bg}`}>
      <div className="flex flex-col items-center justify-center h-full">
        <span>{session.name}</span>
        {session.desc && <span className="text-[10px] font-normal mt-1">{translateScheduleDesc(session.desc, language)}</span>}
      </div>
    </td>
  );
}

export function Schedule() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<"mon" | "tue" | "wed" | "thu" | "fri" | "sat">("mon");
  const { config } = useAppData();
  const { t, language } = useLanguage();

  const days = [
    { key: "mon", label: t("day.mon") },
    { key: "tue", label: t("day.tue") },
    { key: "wed", label: t("day.wed") },
    { key: "thu", label: t("day.thu") },
    { key: "fri", label: t("day.fri") },
    { key: "sat", label: t("day.sat") },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-jp flex items-center gap-3">
            <Calendar className="w-8 h-8 text-karate-red" /> {t("schedule.title")}
          </h2>
          <p className="text-neutral-500 mt-2">{t("schedule.subtitle")}</p>
        </div>
      </div>

      {/* Mobile View - Lista Vertical por Dia */}
      <div className="md:hidden flex flex-col gap-6">
        {days.map((day) => {
          const dayClasses = scheduleData.filter((row) => row[day.key]);
          if (dayClasses.length === 0) return null;
          return (
            <div key={day.key} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="bg-[#e43a3a] text-white p-3 text-center font-bold text-lg uppercase tracking-wide">
                {day.label}
              </div>
              <div className="divide-y divide-neutral-200/60">
                {dayClasses.map((row, idx) => {
                  const session = row[day.key]!;
                  return (
                    <div key={idx} className="flex items-stretch min-h-[76px]">
                      <div className="w-20 bg-neutral-50 text-neutral-800 font-bold p-3 flex items-center justify-center shrink-0 border-r border-neutral-200/60">
                        {row.time}
                      </div>
                      <div className={`flex-1 p-3 flex flex-col justify-center ${session.bg}`}>
                        <span className="font-bold text-sm leading-tight">{session.name}</span>
                        {session.desc && <span className="text-[11px] mt-0.5 opacity-90">{translateScheduleDesc(session.desc, language)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col items-center justify-center gap-4 text-center">
          <img src={config.logo || undefined} alt="Madeira Artes Marciais Logo" className="w-16 h-16 object-contain" />
          <div>
            <p className="font-bold text-lg">Madeira Artes Marciais</p>
            <p className="text-sm text-neutral-600">{t("schedule.info")}: {config.whatsapp}</p>
            <p className="text-sm text-neutral-600">@madeirakarateshotokan</p>
          </div>
          <div className="text-xs text-neutral-500 italic mt-2">
            * {t("schedule.plans")}
          </div>
        </div>
      </div>

      {/* Desktop View - Tabela Horizontal */}
      <div className="hidden md:flex bg-white rounded-2xl shadow-sm border border-neutral-100 flex-col relative w-full overflow-hidden max-w-full">
        <div className="schedule-wrapper scrollbar-custom">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 w-20 sticky left-0 z-20 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.2)]">{t("day.time")}</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 min-w-[140px]">{t("day.mon")}</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 min-w-[140px]">{t("day.tue")}</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 min-w-[140px]">{t("day.wed")}</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 min-w-[140px]">{t("day.thu")}</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 min-w-[140px]">{t("day.fri")}</th>
                <th className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 min-w-[140px]">{t("day.sat")}</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, idx) => (
                <tr key={idx}>
                  <td className="bg-[#e43a3a] text-black font-bold border border-[#333333] p-3 text-center sticky left-0 z-10 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.2)]">{row.time}</td>
                  <ClassCell session={row.mon} />
                  <ClassCell session={row.tue} />
                  <ClassCell session={row.wed} />
                  <ClassCell session={row.thu} />
                  <ClassCell session={row.fri} />
                  <ClassCell session={row.sat} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={config.logo || undefined} alt="Madeira Artes Marciais Logo" className="w-16 h-16 object-contain" />
            <div>
              <p className="font-bold text-lg">Madeira Artes Marciais</p>
              <p className="text-sm text-neutral-600">INFORMAÇÕES: {config.whatsapp}</p>
              <p className="text-sm text-neutral-600">@madeirakarateshotokan</p>
            </div>
          </div>
          <div className="text-xs text-neutral-500 italic">
            * PLANOS NA RECEPÇÃO.
          </div>
        </div>
      </div>
    </div>
  );
}

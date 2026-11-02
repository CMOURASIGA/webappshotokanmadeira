import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { katas, belts } from "../data/mockData";
import { useAppData, Notice } from "../contexts/AppDataContext";
import { HomeHero } from "../components/home/HomeHero";
import { StudentQuickResumeSection } from "../components/home/StudentQuickResumeSection";
import { BeltProgressionTrack } from "../components/home/BeltProgressionTrack";
import { FundamentalKatasShowcase } from "../components/home/FundamentalKatasShowcase";
import { DojoAnnouncementsSection } from "../components/home/DojoAnnouncementsSection";
import { DojoKunSection } from "../components/home/DojoKunSection";
import { NoticeModal } from "../components/NoticeModal";
import { ChampionshipPromoBanner } from "../components/championship/ChampionshipPromoBanner";

export function Home() {
  const { notices, events, loading, eventsError } = useAppData();
  const { language } = useLanguage();
  const seoText = {
    pt: { heading: "Conheça o karatê além da prática", intro: "História, fundamentos e evolução do aluno fazem parte do aprendizado. Explore nossos conteúdos e conheça as atividades da academia.", links: ["História do Karatê Shotokan", "Kihon, kata, kumite e princípios", "Faixas e graduações", "Modalidades e aulas"], note: "Conteúdos educativos disponíveis em português." },
    en: { heading: "Learn the history behind karate", intro: "Technique, history and principles are part of the learning experience. Explore our Portuguese-language guides and academy information.", links: ["Shotokan karate history", "Kihon, kata, kumite and principles", "Belts and grading", "Martial arts and classes"], note: "The linked guides are currently available in Portuguese." },
    ja: { heading: "空手の歴史と精神を学ぶ", intro: "技術だけでなく、歴史や理念も学びの一部です。ポルトガル語の学習資料と道場の案内をご覧ください。", links: ["松濤館空手の歴史", "基本・形・組手と理念", "帯と昇級", "武道とクラス"], note: "リンク先の解説ページは現在ポルトガル語のみです。" },
  }[language];

  // State for opening NoticeModal directly from Home
  const [modalNotices, setModalNotices] = useState<Notice[]>([]);
  const [selectedNoticeIndex, setSelectedNoticeIndex] = useState<number | null>(null);

  const handleOpenNoticeModal = (noticeList: Notice[], index: number) => {
    setModalNotices(noticeList);
    setSelectedNoticeIndex(index);
  };

  const handleCloseNoticeModal = () => {
    setSelectedNoticeIndex(null);
  };

  const handleNavigateNoticeModal = (newIndex: number) => {
    setSelectedNoticeIndex(newIndex);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-16">
      {/* 1. Hero Editorial de Alta Fidelidade */}
      <HomeHero
        totalKatas={katas.length}
        totalBelts={belts.length}
        onScrollToBelts={() => scrollToSection("trilha-graduacao")}
        onScrollToAnnouncements={() => scrollToSection("mural-e-eventos")}
      />

      <section aria-label="Madeira Karate education" className="rounded-2xl border border-neutral-200 bg-white px-5 py-7 sm:px-8">
        <h2 className="text-2xl font-bold text-neutral-900">{seoText.heading}</h2>
        <p className="mt-2 text-neutral-600">{seoText.intro}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            "/historia-karate-shotokan/",
            "/fundamentos-karate/",
            "/faixas-graduacao-karate/",
            "/modalidades-artes-marciais/",
          ].map((href, i) => (
            <a key={href} href={href} className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-semibold text-neutral-800 hover:border-red-300 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700">{seoText.links[i]}</a>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-500">{seoText.note}</p>
      </section>

      {/* 2. Área do Aluno & Continuar Estudando */}
      <StudentQuickResumeSection />

      {/* Destaque do Campeonato Oficial (SPEC 08) */}
      <ChampionshipPromoBanner variant="home" />

      {/* 3. Trilha Visual de Graduação (Escala de Faixas) */}
      <BeltProgressionTrack belts={belts} />

      {/* 3. Vitrine de Katas Fundamentais */}
      <FundamentalKatasShowcase katas={katas} totalKatas={katas.length} />

      {/* 4. Painel de Comunicação Viva do Dojo (Avisos e Eventos) */}
      <DojoAnnouncementsSection
        notices={notices}
        events={events}
        loading={loading}
        eventsError={eventsError}
        onOpenNoticeModal={handleOpenNoticeModal}
      />

      {/* 5. Bloco de Ética Marcial (Dojo Kun) */}
      <DojoKunSection />

      {/* Modal Adaptativo de Avisos / Eventos */}
      {selectedNoticeIndex !== null && modalNotices.length > 0 && (
        <NoticeModal
          notices={modalNotices}
          currentIndex={selectedNoticeIndex}
          isOpen={selectedNoticeIndex !== null}
          onClose={handleCloseNoticeModal}
          onNavigate={handleNavigateNoticeModal}
        />
      )}
    </div>
  );
}

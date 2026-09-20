import { useState } from "react";
import { katas, belts } from "../data/mockData";
import { useAppData, Notice } from "../contexts/AppDataContext";
import { HomeHero } from "../components/home/HomeHero";
import { StudentQuickResumeSection } from "../components/home/StudentQuickResumeSection";
import { BeltProgressionTrack } from "../components/home/BeltProgressionTrack";
import { FundamentalKatasShowcase } from "../components/home/FundamentalKatasShowcase";
import { DojoAnnouncementsSection } from "../components/home/DojoAnnouncementsSection";
import { DojoKunSection } from "../components/home/DojoKunSection";
import { NoticeModal } from "../components/NoticeModal";

export function Home() {
  const { notices, events, loading, eventsError } = useAppData();

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

      {/* 2. Área do Aluno & Continuar Estudando */}
      <StudentQuickResumeSection />

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

import { useState, useEffect } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { NoticeModal } from "./NoticeModal";

let hasShownThisSession = false;

export function NoticePopup({ canShow = true }: { canShow?: boolean }) {
  const { notices, events, loading } = useAppData();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter items that are marked to show in the popup (both notices and events)
  const popupNotices = [...notices, ...events].filter(n => n.showPopup);

  useEffect(() => {
    // Only show if we've loaded data, we have notices to show, and we're allowed to show (splash screen finished)
    if (!loading && popupNotices.length > 0 && canShow) {
      if (!hasShownThisSession) {
        setIsOpen(true);
        hasShownThisSession = true;
      }
    }
  }, [loading, popupNotices.length, canShow]);

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <NoticeModal 
      notices={popupNotices}
      currentIndex={currentIndex}
      isOpen={isOpen}
      onClose={closePopup}
      onNavigate={setCurrentIndex}
    />
  );
}

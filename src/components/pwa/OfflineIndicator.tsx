import React from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-indicator"
      className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-neutral-900/95 text-white border border-amber-500/40 px-3.5 py-2 shadow-2xl backdrop-blur-md text-xs animate-in fade-in slide-in-from-bottom-2 duration-300"
      role="status"
      aria-live="polite"
    >
      <span className="flex h-2.5 w-2.5 relative shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
      </span>
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span className="font-medium text-neutral-200">
        Modo Offline — Navegando por dados em cache local
      </span>
    </div>
  );
};

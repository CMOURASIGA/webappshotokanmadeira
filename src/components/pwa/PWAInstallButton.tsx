import React, { useState } from "react";
import { Download, Share2, X, Smartphone, CheckCircle } from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { useLanguage } from "../../i18n/LanguageContext";

interface PWAInstallButtonProps {
  variant?: "header" | "sidebar" | "banner";
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = "header", 
  className = "" 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();
  const copy = language === "en"
    ? { title: "Install the Digital Dojo app on this device", installApp: "Install App", installMobile: "Install App on phone", bannerTitle: "Install Digital Dojo", bannerText: "Access Kata, techniques and announcements offline from your home screen.", installDevice: "Install on Device", iosTitle: "Install on iPhone / iPad", closeGuide: "Close guide", step1: <>In Safari, tap <strong>Share</strong> (<Share2 className="w-3 h-3 inline text-blue-400" /> in the bottom bar).</>, step2: <>Scroll down and tap <strong>"Add to Home Screen"</strong>.</>, step3: <>Confirm by tapping <strong>"Add"</strong> in the top-right corner.</>, created: "The official Dojo icon will be added to your iPhone.", understood: "Got it" }
    : language === "ja"
    ? { title: "この端末にデジタル道場アプリをインストール", installApp: "アプリをインストール", installMobile: "スマートフォンにインストール", bannerTitle: "デジタル道場をインストール", bannerText: "ホーム画面から形、技術、お知らせをオフラインでも確認できます。", installDevice: "端末にインストール", iosTitle: "iPhone / iPad にインストール", closeGuide: "ガイドを閉じる", step1: <>Safari で <strong>共有</strong> をタップします（下部バーの <Share2 className="w-3 h-3 inline text-blue-400" />）。</>, step2: <>下にスクロールして <strong>「ホーム画面に追加」</strong> をタップします。</>, step3: <>右上の <strong>「追加」</strong> をタップして確定します。</>, created: "道場の公式アイコンが iPhone に追加されます。", understood: "了解" }
    : { title: "Instalar App do Dojo Digital no dispositivo", installApp: "Instalar App", installMobile: "Instalar App no celular", bannerTitle: "Instale o Dojo Digital", bannerText: "Acesse katas, técnicas e avisos mesmo offline direto da sua tela inicial.", installDevice: "Instalar no Dispositivo", iosTitle: "Instalar no iPhone / iPad", closeGuide: "Fechar guia", step1: <>No navegador Safari, toque no botão <strong>Compartilhar</strong> (ícone <Share2 className="w-3 h-3 inline text-blue-400" /> na barra inferior).</>, step2: <>Role as opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</>, step3: <>Confirme no canto superior direito tocando em <strong>"Adicionar"</strong>.</>, created: "O ícone oficial do Dojo será criado no seu iPhone.", understood: "Entendido" };
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Se já estiver instalado em modo standalone, oculta
  if (isInstalled) {
    return null;
  }

  // Se não for instalável nem for iOS, não há ação nativa possível
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <>
      {variant === "header" && (
        <button
          id="pwa-install-header-btn"
          onClick={handleInstallClick}
          disabled={isInstalling}
          title={copy.title}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-karate-red hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all ${className}`}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{copy.installApp}</span>
        </button>
      )}

      {variant === "sidebar" && (
        <button
          id="pwa-install-sidebar-btn"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs font-medium text-white transition-all group ${className}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-karate-red/20 text-karate-red flex items-center justify-center group-hover:bg-karate-red group-hover:text-white transition-colors">
              <Download className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold">{copy.installMobile}</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">PWA</span>
        </button>
      )}

      {variant === "banner" && (
        <div 
          id="pwa-install-banner"
          className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg ${className}`}
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-karate-red/20 border border-karate-red/30 flex items-center justify-center text-karate-red shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{copy.bannerTitle}</h4>
              <p className="text-xs text-neutral-400">
                {copy.bannerText}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-karate-red hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{copy.installDevice}</span>
          </button>
        </div>
      )}

      {/* Modal Guia iOS */}
      {showIOSGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-karate-red">
                <Smartphone className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">{copy.iosTitle}</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                aria-label={copy.closeGuide}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <span className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">1</span>
                <div>{copy.step1}</div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <span className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">2</span>
                <div>{copy.step2}</div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <span className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">3</span>
                <div>{copy.step3}</div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-[11px] text-neutral-400 justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copy.created}</span>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition"
            >
              {copy.understood}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Papa from "papaparse";

type AppConfig = {
  whatsapp: string;
  pix: string;
  logo: string;
  googleAnalyticsId?: string;
  beltVideoUrl?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
};

export type Notice = {
  id: string;
  title: string;
  image: string;
  showPopup: boolean;
  link?: string;
  type: 'aviso' | 'evento';
};

type AppData = {
  config: AppConfig;
  products: Product[];
  notices: Notice[];
  events: Notice[];
  kataVideos: Record<string, string>;
  techniqueVideos: Record<string, string>;
  techniqueImages: Record<string, string>;
  loading: boolean;
};

const AppDataContext = createContext<AppData | undefined>(undefined);

const SHEET_ID = "1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM";

function extractCleanUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  try {
    let cleanString = rawUrl;
    const url = new URL(rawUrl);
    
    // 1. Remove Google redirect if present
    if (url.hostname === "www.google.com" && url.pathname === "/url") {
      const q = url.searchParams.get("q");
      if (q) cleanString = q;
    }

    const finalUrl = new URL(cleanString);
    
    // 2. Convert imgur.com/ID to i.imgur.com/ID.jpeg (direct image link required for <img> tags)
    if (finalUrl.hostname === "imgur.com" && finalUrl.pathname.length > 1) {
      return `https://i.imgur.com${finalUrl.pathname}.jpeg`;
    }

    return cleanString;
  } catch (e) {
    return rawUrl; // Return as-is if it's not a valid URL
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({
    config: {
      whatsapp: "5521973681109",
      pix: "21973681109",
      logo: "https://i.imgur.com/fECU6ud.png"
    },
    products: [],
    notices: [],
    events: [],
    kataVideos: {},
    techniqueVideos: {},
    techniqueImages: {},
    loading: true
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Config
        const configUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Configuracoes`;
        const configRes = await fetch(configUrl);
        const configCsv = await configRes.text();
        
        const parsedConfig = Papa.parse(configCsv, { header: true }).data as any[];
        const configObj: AppConfig = {
          whatsapp: "5521973681109", // default fallbacks
          pix: "21973681109",
          logo: "https://i.imgur.com/fECU6ud.png"
        };
        
        parsedConfig.forEach(row => {
          if (!row.chave) return;
          const key = row.chave.toLowerCase().trim();
          const value = (row.valor || "").trim();
          if (key === "whatsapp") configObj.whatsapp = value;
          if (key === "pix") configObj.pix = value;
          if (key === "logo" && value) configObj.logo = extractCleanUrl(value);
          if (key === "google_analytics_id" && value) configObj.googleAnalyticsId = value;
          if (key === "video_faixa" && value) configObj.beltVideoUrl = value;
        });

        // Fetch Products
        const productsUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Produtos`;
        const productsRes = await fetch(productsUrl);
        const productsCsv = await productsRes.text();
        
        const parsedProducts = Papa.parse(productsCsv, { header: true }).data as any[];
        const productsList: Product[] = parsedProducts
          .filter(row => row.id) // Ensure valid row
          .map(row => ({
            id: row.id,
            name: row.nome || row.name || "",
            description: row.descricao || row.description || "",
            price: parseFloat(row.preco || row.price || "0"),
            images: [row.imagem1, row.imagem2, row.imagem3]
              .filter(img => img && img.trim() !== "")
              .map(img => extractCleanUrl(img.trim()))
          }));

        // Fetch Notices (Avisos)
        let noticesList: Notice[] = [];
        try {
          const noticesUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Avisos`;
          const noticesRes = await fetch(noticesUrl);
          if (noticesRes.ok) {
            const noticesCsv = await noticesRes.text();
            const parsedNotices = Papa.parse(noticesCsv, { header: true }).data as any[];
            noticesList = parsedNotices
              .filter(row => row.id)
              .map(row => ({
                id: row.id,
                title: row.titulo || row.title || "",
                image: extractCleanUrl((row.imagem || row.image || "").trim()),
                showPopup: (row.mostrar_popup || "").toLowerCase().trim() === "sim",
                type: 'aviso'
              })).reverse(); // Reverse so the newest (bottom of sheet) comes first
          }
        } catch (err) {
          console.warn("Could not fetch Avisos sheet. It might not exist yet.", err);
        }

        // Fetch Events (Eventos)
        let eventsList: Notice[] = [];
        try {
          const eventsUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Eventos`;
          const eventsRes = await fetch(eventsUrl);
          if (eventsRes.ok) {
            const eventsCsv = await eventsRes.text();
            const parsedEvents = Papa.parse(eventsCsv, { header: true }).data as any[];
            eventsList = parsedEvents
              .filter(row => row.id)
              .map(row => ({
                id: row.id,
                title: row.titulo || row.title || "",
                image: extractCleanUrl((row.imagem || row.image || "").trim()),
                showPopup: (row.mostrar_popup || "").toLowerCase().trim() === "sim",
                link: (row.link_album || row.link || "").trim(),
                type: 'evento'
              })).reverse();
          }
        } catch (err) {
          console.warn("Could not fetch Eventos sheet. It might not exist yet.", err);
        }

        // Fetch Katas Videos
        let kataVideosMap: Record<string, string> = {};
        try {
          const katasUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Katas`;
          const katasRes = await fetch(katasUrl);
          if (katasRes.ok) {
            const katasCsv = await katasRes.text();
            const parsedKatas = Papa.parse(katasCsv, { header: true }).data as any[];
            parsedKatas.forEach(row => {
              if (row.id && row.video_url) {
                kataVideosMap[row.id.trim()] = row.video_url.trim();
              }
            });
          }
        } catch (err) {
          console.warn("Could not fetch Katas sheet. It might not exist yet.", err);
        }

        // Fetch Tecnicas Videos e Imagens
        let techniqueVideosMap: Record<string, string> = {};
        let techniqueImagesMap: Record<string, string> = {};
        try {
          const tecUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Tecnicas`;
          const tecRes = await fetch(tecUrl);
          if (tecRes.ok) {
            const tecCsv = await tecRes.text();
            const parsedTec = Papa.parse(tecCsv, { header: true }).data as any[];
            parsedTec.forEach(row => {
              if (row.id) {
                if (row.video_url) {
                  techniqueVideosMap[row.id.trim()] = row.video_url.trim();
                }
                if (row.imagem || row.image_url) {
                  techniqueImagesMap[row.id.trim()] = (row.imagem || row.image_url).trim();
                }
              }
            });
          }
        } catch (err) {
          console.warn("Could not fetch Tecnicas sheet. It might not exist yet.", err);
        }

        setData({
          config: configObj,
          products: productsList,
          notices: noticesList,
          events: eventsList,
          kataVideos: kataVideosMap,
          techniqueVideos: techniqueVideosMap,
          techniqueImages: techniqueImagesMap,
          loading: false
        });

        // Dynamically update the app icon (favicon) based on the loaded logo
        if (configObj.logo) {
          const iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
          if (iconLink) iconLink.href = configObj.logo;

          const appleIconLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
          if (appleIconLink) appleIconLink.href = configObj.logo;
        }
      } catch (error) {
        console.error("Failed to fetch data from sheets:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    }
    fetchData();
  }, []);

  return (
    <AppDataContext.Provider value={data}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { Layout } from "./components/Layout";
import { SplashScreen } from "./components/SplashScreen";
import { AppDataProvider } from "./contexts/AppDataContext";
import { StudentProvider } from "./contexts/StudentContext";
import { CartProvider } from "./contexts/CartContext";
import { NoticePopup } from "./components/NoticePopup";
import { Analytics } from "./components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { OfflineIndicator } from "./components/pwa/OfflineIndicator";

// Lazy loading & Code-splitting das views para otimização de FCP, LCP e bundle size
const Home = lazy(() => import("./views/Home").then(m => ({ default: m.Home })));
const Store = lazy(() => import("./views/Store").then(m => ({ default: m.Store })));
const KatasList = lazy(() => import("./views/KatasList").then(m => ({ default: m.KatasList })));
const KataDetail = lazy(() => import("./views/KataDetail").then(m => ({ default: m.KataDetail })));
const TechniquesList = lazy(() => import("./views/TechniquesList").then(m => ({ default: m.TechniquesList })));
const TechniqueDetail = lazy(() => import("./views/TechniqueDetail").then(m => ({ default: m.TechniqueDetail })));
const BeltsList = lazy(() => import("./views/BeltsList").then(m => ({ default: m.BeltsList })));
const DojoKun = lazy(() => import("./views/DojoKun").then(m => ({ default: m.DojoKun })));
const WhatIsKata = lazy(() => import("./views/WhatIsKata").then(m => ({ default: m.WhatIsKata })));
const Vocabulary = lazy(() => import("./views/Vocabulary").then(m => ({ default: m.Vocabulary })));
const History = lazy(() => import("./views/History").then(m => ({ default: m.History })));
const KataSeries = lazy(() => import("./views/KataSeries").then(m => ({ default: m.KataSeries })));
const Schedule = lazy(() => import("./views/Schedule").then(m => ({ default: m.Schedule })));
const Maintenance = lazy(() => import("./views/Maintenance").then(m => ({ default: m.Maintenance })));
const Mural = lazy(() => import("./views/Mural").then(m => ({ default: m.Mural })));
const Events = lazy(() => import("./views/Events").then(m => ({ default: m.Events })));
const StudentArea = lazy(() => import("./views/StudentArea").then(m => ({ default: m.StudentArea })));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="w-8 h-8 border-2 border-karate-red border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-medium text-neutral-400">Carregando seção...</span>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppDataProvider>
      <StudentProvider>
        <CartProvider>
          <VercelAnalytics />
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
          <NoticePopup canShow={!showSplash} />
          <OfflineIndicator />
          <HashRouter>
            <Analytics />
            <Layout>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/student-area" element={<StudentArea />} />
                  <Route path="/area-do-aluno" element={<StudentArea />} />
                  <Route path="/mural" element={<Mural />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/katas" element={<KatasList />} />
                  <Route path="/katas/:id" element={<KataDetail />} />
                  <Route path="/techniques" element={<TechniquesList />} />
                  <Route path="/techniques/:id" element={<TechniqueDetail />} />
                  <Route path="/belts" element={<BeltsList />} />
                  <Route path="/dojo-kun" element={<DojoKun />} />
                  <Route path="/what-is-kata" element={<WhatIsKata />} />
                  <Route path="/vocabulary" element={<Vocabulary />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/kata-series" element={<KataSeries />} />
                  <Route path="*" element={<Maintenance />} />
                </Routes>
              </Suspense>
            </Layout>
          </HashRouter>
        </CartProvider>
      </StudentProvider>
    </AppDataProvider>
  );
}

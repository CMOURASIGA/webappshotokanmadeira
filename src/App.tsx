/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Layout } from "./components/Layout";
import { SplashScreen } from "./components/SplashScreen";
import { Home } from "./views/Home";
import { Store } from "./views/Store";
import { KatasList } from "./views/KatasList";
import { KataDetail } from "./views/KataDetail";
import { TechniquesList } from "./views/TechniquesList";
import { TechniqueDetail } from "./views/TechniqueDetail";
import { BeltsList } from "./views/BeltsList";
import { DojoKun } from "./views/DojoKun";
import { WhatIsKata } from "./views/WhatIsKata";
import { Vocabulary } from "./views/Vocabulary";
import { History } from "./views/History";
import { KataSeries } from "./views/KataSeries";
import { Schedule } from "./views/Schedule";
import { Maintenance } from "./views/Maintenance";
import { Mural } from "./views/Mural";
import { AppDataProvider } from "./contexts/AppDataContext";
import { NoticePopup } from "./components/NoticePopup";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppDataProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <NoticePopup canShow={!showSplash} />
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mural" element={<Mural />} />
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
        </Layout>
      </HashRouter>
    </AppDataProvider>
  );
}

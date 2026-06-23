/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Layout } from "./components/Layout";
import { SplashScreen } from "./components/SplashScreen";
import { Home } from "./views/Home";
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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
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
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

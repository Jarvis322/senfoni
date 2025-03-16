import React, { Suspense } from "react";
import HakkimizdaClient from "@/components/HakkimizdaClient";
import { fetchLayoutSettings } from "@/services/layoutService";

export const dynamic = "force-dynamic";

async function HakkimizdaPage() {
  const layoutSettings = await fetchLayoutSettings();

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <HakkimizdaClient layoutSettings={layoutSettings} />
    </Suspense>
  );
}

export default HakkimizdaPage; 
import type { Metadata } from "next";
import Closing from "@/components/sections/import-export/closing/Closing";
import Directions from "@/components/sections/import-export/directions/Directions";
import Manifest from "@/components/sections/import-export/manifest/Manifest";
import Route from "@/components/sections/import-export/route/Route";
import VoyageStage from "@/components/sections/import-export/voyage/VoyageStage";

export const metadata: Metadata = {
  title: "Import & Export | Avvira Agro Industries",
  description:
    "Avvira Agro Industries imports and exports sulphur, urea and other farm and industrial materials, and handles the papers, freight and delivery.",
};

export default function ImportExportPage() {
  return (
    <main className="flex flex-1 flex-col">
      <VoyageStage />
      <Manifest />
      <Directions />
      <Route />
      <Closing />
    </main>
  );
}

"use client";

import { AlertTriangle } from "lucide-react";

export default function LegalDisclaimer() {
  return (
    <div className="bg-yellow-500/20 border-b border-yellow-500/50 text-yellow-500 px-4 py-2 text-xs relative z-50 flex items-start sm:items-center justify-center">
      <div className="flex items-start sm:items-center gap-2 max-w-7xl mx-auto flex-1">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          <strong className="font-bold">⚠️ TECHNOLOGISCHE MVP-DEMONSTRATION / TECHNOLOGICAL MVP DEMO:</strong>{" "}
          Diese Anwendung ist eine <strong className="font-bold">rein technologische Machbarkeitsstudie</strong> (Minimum Viable Product). 
          Es findet <strong className="font-bold">keine erlaubnispflichtige Anlagevermittlung, Anlageberatung oder Finanzdienstleistung</strong> gem. 
          § 2 Abs. 2 WpIG, KWG oder eWpG statt. Amanah PropTech besitzt <strong className="font-bold">keine BaFin-Lizenz und ist kein zugelassener Finanzdienstleister</strong>. 
          Alle angezeigten Immobilien, Token (<strong className="font-bold">Testnet Polygon Amoy</strong>), Renditen, Partnerlogos und Kennzahlen sind <strong className="font-bold">fiktiv und rein illustrativ</strong>. 
          Es wird kein echtes Kapital entgegengenommen. Keine der dargestellten Informationen stellt eine Aufforderung zur Anlage dar. /
          This application is a <strong className="font-bold">purely technological proof-of-concept</strong>. No regulated financial services are provided. 
          <strong className="font-bold">No BaFin license is held.</strong> All data, assets, yields, and partner references are simulated and illustrative only.
        </p>
      </div>
    </div>
  );
}

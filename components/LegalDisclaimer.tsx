"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function LegalDisclaimer() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-yellow-500/20 border-b border-yellow-500/50 text-yellow-500 px-4 py-2 text-xs relative z-50 flex items-start sm:items-center justify-between">
      <div className="flex items-start sm:items-center gap-2 max-w-7xl mx-auto flex-1">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
        <p className="leading-relaxed">
          <strong className="font-bold">TECHNOLOGICAL MVP DEMONSTRATION:</strong> Diese Anwendung ist eine rein technologische Präsentation (Minimum Viable Product). 
          Es findet <strong className="font-bold">keine erlaubnispflichtige Anlagevermittlung</strong> oder Anlageberatung gem. § 2 Abs. 2 WpIG oder KWG statt. 
          Alle angezeigten Immobilien, Token (<strong className="font-bold">Testnet Polygon Amoy</strong>) und Renditen sind simuliert. Es wird kein echtes Kapital entgegengenommen.
        </p>
      </div>
      <button onClick={() => setVisible(false)} className="p-1 hover:bg-yellow-500/20 rounded-lg ml-4 shrink-0 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

"use client";

import { Scale, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export function ShariaComparison() {
  return (
    <div className="bg-[#03362a] border border-[#064e3b] rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="w-6 h-6 text-[#c5a059]" />
        <h2 className="text-xl font-bold text-white">Ethik-Vergleich: Riba vs. Musharakah</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional */}
        <div className="bg-[#022c22]/50 border border-red-900/30 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-red-400">
             <AlertCircle className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">Bankdarlehen (Riba)</span>
          </div>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Zinszahlungen auf Fremdkapital</li>
            <li>• Risiko liegt primär beim Nehmer</li>
            <li>• Verzugszinsen bei Problemen</li>
            <li>• Reine Geld-zu-Geld Vermehrung</li>
          </ul>
        </div>
        
        {/* Sharia */}
        <div className="bg-[#c5a059]/5 border border-[#c5a059]/30 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-[#c5a059]">
             <CheckCircle2 className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">Amanah (Diminishing Musharakah)</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Partnerschaftliche Beteiligung</li>
            <li>• Geteiltes Risiko (Gewinn & Verlust)</li>
            <li>• Keine Zinsen, nur Ijarah (Miete)</li>
            <li>• Echter Sachwert-Besitz (Blockchain)</li>
          </ul>
        </div>
      </div>
      
      <div className="pt-4 border-t border-[#064e3b] flex items-center justify-between text-xs text-gray-500">
        <p>Geprüft nach AAOIFI Standard Nr. 12 & 9</p>
        <button className="text-[#c5a059] font-bold hover:underline">Download Fach-Whitepaper (PDF)</button>
      </div>
    </div>
  );
}

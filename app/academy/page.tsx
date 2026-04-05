"use client";

import { PlayCircle, ShieldCheck, FileText, Blocks, Building2, Lock, Landmark, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AcademyPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Amanah <span className="text-[#c5a059]">Academy</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Verstehen Sie die Technologie und die rechtliche Sicherheit hinter unseren eWpG-Immobilientoken. Künftig zu 100% BaFin- und Sharia-konform.
        </p>
      </div>

      {/* Video Section Mock */}
      <div className="bg-[#03362a] border border-[#064e3b]/50 rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
        {!isPlaying ? (
          <div className="relative aspect-video bg-black/40 flex items-center justify-center">
            {/* Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] to-[#03362a] opacity-80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            
            <div className="z-10 flex flex-col items-center">
              <PlayCircle className="w-20 h-20 text-[#c5a059] group-hover:scale-110 transition-transform duration-300" />
              <p className="mt-4 text-white font-medium tracking-wide">Video abspielen: Wie funktioniert Tokenisierung?</p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-black flex items-center justify-center border-b border-[#064e3b]">
            <p className="text-[#c5a059] animate-pulse">Video lädt... (Mock Player)</p>
          </div>
        )}
      </div>

      {/* Concept Explanation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Blocks className="w-6 h-6 text-[#c5a059]" /> Was ist Tokenisierung?
        </h2>
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          Tokenisierung bedeutet die digitale Stückelung echter Sachwerte (wie Immobilien) durch die Blockchain-Technologie. 
          Statt eine Immobilie für 10 Millionen Euro als Ganzes zu kaufen, wird ihr Wert in 10.000 digitale Anteile (Tokens) aufgeteilt. 
          Jeder Token repräsentiert einen Anteil am Eigentum und am Ijarah-Ertrag (Mieteinnahmen).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
           {[
             { icon: Building2, title: "Zweckgesellschaften (SPVs)", text: "Jede Immobilie wird rechtlich in eine eigenständige GmbH (SPV) ausgelagert, um Investoren vor Insolvenzen zu schützen." },
             { icon: FileText, title: "Elektronische Wertpapiere", text: "Nach dem eWpG (Deutschland) sind unsere Tokens rechtlich klassischen Wertpapieren völlig gleichgestellt und sicher." },
             { icon: ShieldCheck, title: "Sharia-Konformität", text: "Da echte Sachwerte hinterlegt sind, entsteht kein Zins (Riba). Sie partizipieren an echten Mietüberschüssen (Ijarah)." },
           ].map((feature, i) => (
             <div key={i} className="bg-[#022c22] border border-[#064e3b]/50 rounded-xl p-5 hover:border-[#c5a059]/50 transition-colors">
               <div className="w-10 h-10 bg-[#c5a059]/10 rounded-lg flex items-center justify-center mb-4">
                 <feature.icon className="w-5 h-5 text-[#c5a059]" />
               </div>
               <h3 className="font-bold text-white mb-2">{feature.title}</h3>
               <p className="text-xs text-gray-400">{feature.text}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Deep Dive Legal Framework */}
      <div className="bg-gradient-to-br from-[#03362a] to-[#022c22] border border-[#064e3b] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/5 blur-[100px] rounded-full" />
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
          <Landmark className="w-5 h-5 text-[#c5a059]" /> Rechtlicher Rahmen & Sicherheit
        </h2>
        <div className="space-y-4 relative z-10 text-sm text-gray-300">
           <p>
             <strong>Schritt 1: Gründung der Objektgesellschaft (SPV)</strong><br />
             Bevor ein Token gemintet wird, erwirbt die Amanah PropTech eine Immobilie und legt diese in eine eigens dafür gegründete Zweckgesellschaft (SPV) ein. Dies stellt sicher, dass das Immobilienvermögen rechtlich sauber vom operativen Geschäft getrennt ("ring-fenced") ist.
           </p>
           <p className="pt-2">
             <strong>Schritt 2: Eintragung ins Krytpowertpapierregister</strong><br />
             Wir nutzen das deutsche eWpG (Gesetz über elektronische Wertpapiere). Die BaFin-regulierte Kryptowertpapierregisterführung dokumentiert unwiderruflich, wem wie viele Token gehören. Dadurch wird die traditionelle Urkunde („Papier“) vollständig digitalisiert.
           </p>
           <p className="pt-2">
             <strong>Schritt 3: Token Minting & Ijarah (Miete)</strong><br />
             Die digitalen Anteilsrechte werden auf ihr Krypto-Wallet überschrieben. Monatlich werden die Mietüberschüsse der Immobilie (Ijarah) anteilig und zinsfrei direkt auf ihr Walletkonto (Fiat) ausgeschüttet.
           </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[#064e3b]/50 pt-6">
           <div className="flex items-center gap-2">
             <Lock className="w-4 h-4 text-green-400" />
             <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">100% Investor Protection</span>
           </div>
           <Link href="/invest" className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
             <CheckCircle2 className="w-4 h-4" /> Zum Primärmarkt verstanden
           </Link>
        </div>
      </div>

    </div>
  );
}

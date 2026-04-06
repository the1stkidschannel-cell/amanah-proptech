"use client";

import { useState } from "react";
import { ShieldCheck, Target, AlertTriangle, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: "q1",
    question: "Über welche Anlageprodukte haben Sie vertiefte Kenntnisse und/oder Markterfahrung?",
    options: [
      { id: "A", text: "Keine (ich habe bisher nur Sparbücher oder Tagesgeld genutzt)", points: 0 },
      { id: "B", text: "Aktien & ETFs", points: 2 },
      { id: "C", text: "Alternative Investments (Krypto, Private Equity, Immobilien-Mezzanine)", points: 5 },
    ]
  },
  {
    id: "q2",
    question: "Die auf Amanah PropTech angebotenen eWpG-Token (Genussrechte) bergen bestimmte Risiken. Welches Risiko ist für diese Anlageklasse typisch?",
    options: [
      { id: "A", text: "Kein Risiko, die Rendite ist staatlich garantiert.", points: 0 },
      { id: "B", text: "Totalverlustrisiko und mangelnde tägliche Liquidität (illiquider Markt).", points: 5 },
      { id: "C", text: "Währungsrisiko, da in USD abgerechnet wird.", points: 1 },
    ]
  },
  {
    id: "q3",
    question: "Was verstehen Sie unter dem Begriff 'Sharia-konforme Ijarah-Struktur'?",
    options: [
      { id: "A", text: "Zahlung eines fixen Nominalzinses auf ein Darlehen.", points: 0 },
      { id: "B", text: "Mietkauf- oder Pachtkonstruktion, bei der Erträge aus realer wirtschaftlicher Nutzung (Miete) entstehen.", points: 5 },
      { id: "C", text: "Ein Leerverkauf (Short-Selling) von Immobilien.", points: 0 },
    ]
  },
  {
    id: "q4",
    question: "Wie hoch ist Ihr geschätztes Nettovermögen (Liquide Mittel, exklusive selbstgenutzte Immobilie)?",
    options: [
      { id: "A", text: "< 50.000 €", points: 1 },
      { id: "B", text: "50.000 € - 500.000 € (Retail Investor)", points: 3 },
      { id: "C", text: "> 500.000 € (Mögliche Einstufung als Professioneller Kunde)", points: 5 },
    ]
  }
];

export default function MiFIDCompliancePage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (points: number) => {
    const newAnswers = { ...answers, [questions[currentQ].id]: points };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate Score
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      setScore(totalScore);
      setCompleted(true);
    }
  };

  const getProfileType = () => {
    if (score < 5) return "Ungeeignet (Execution Only Warning)";
    if (score >= 5 && score <= 12) return "Kleinanleger (Retail Client)";
    return "Professioneller Kunde (Professional Client)";
  };

  const getProfileDescription = () => {
    if (score < 5) return "Auf Basis Ihrer Angaben verfügen Sie nicht über ausreichende Kenntnisse. Etwaige Investments auf Amanah PropTech erfolgen auf eigenes, massiv erhöhtes Risiko.";
    if (score >= 5 && score <= 12) return "Sie verfügen über grundlegende Kenntnisse. Die angebotenen Anlageprodukte (eWpG Token) sind für Ihr Profil grundsätzlich angemessen, bergen jedoch Risiken.";
    return "Gemäß WpHG Einstufung verfügen Sie über Expertise und hohes Anlagekapital. Sie qualifizieren sich für Off-Market Deals und den VIP Institutional Zugang.";
  };

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up py-12">
        <div className="bg-[#03362a] border border-[#064e3b] rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 blur-[100px] pointer-events-none" />
          
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">MiFID II Einstufung abgeschlossen</h1>
          <p className="text-gray-400 mb-8">Ihr Risikoprofil wurde erfolgreich nach § 63 WpHG ermittelt und im Register gespeichert.</p>

          <div className="bg-[#022c22] border border-[#064e3b]/50 rounded-xl p-6 text-left mb-8 max-w-lg mx-auto">
             <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#064e3b]/30">
               <span className="text-gray-400 font-medium">Scoring-Wert</span>
               <span className="text-[#c5a059] font-bold text-xl">{score} / 20</span>
             </div>
             <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#064e3b]/30">
               <span className="text-gray-400 font-medium">Kundenkategorie (WpHG)</span>
               <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${score > 12 ? "bg-[#c5a059]/20 text-[#c5a059]" : score >= 5 ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"}`}>
                 {getProfileType()}
               </span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed italic">
               "{getProfileDescription()}"
             </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => router.push("/invest")} className="bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#c5a059]/20">
                Weiter zum Primärmarkt
             </button>
             {score > 12 && (
               <button onClick={() => router.push("/institutional")} className="bg-[#022c22] border border-[#c5a059] text-[#c5a059] px-8 py-3 rounded-xl font-bold hover:bg-[#c5a059]/10 transition-all">
                 VIP Institutional Portal
               </button>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up py-8">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-[#022c22] rounded-lg flex items-center justify-center border border-[#064e3b]">
          <Target className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Angemessenheitsprüfung (WpHG)</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest flex items-center">
             <Activity className="w-3 h-3 mr-1 text-green-400"/> Regulatory Compliance Engine
          </p>
        </div>
      </div>

      <div className="bg-[#022c22] border border-blue-500/20 rounded-xl p-4 flex items-start space-x-3 mb-8">
        <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-blue-400 mb-1">Gesetzliche Verpflichtung nach MiFID II</p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Als reglementierte Plattform sind wir gesetzlich verpflichtet, vor Ihrem ersten Investment Ihre Kenntnisse und Erfahrungen im Bereich Krypto-Assets und illiquiden Anlageprodukten (§ 63 WpHG) abzufragen, um eine sachgerechte Risikoeinstufung vorzunehmen.
          </p>
        </div>
      </div>

      <div className="bg-[#03362a] border border-[#064e3b] rounded-2xl p-6 lg:p-10 shadow-xl relative min-h-[400px]">
        
        <div className="flex justify-between items-center mb-8 border-b border-[#064e3b]/50 pb-4">
          <span className="text-gray-400 font-medium text-sm">Frage {currentQ + 1} von {questions.length}</span>
          <div className="flex gap-1">
             {questions.map((_, i) => (
               <div key={i} className={`h-1.5 w-8 rounded-full ${i <= currentQ ? "bg-[#c5a059]" : "bg-[#022c22]"}`} />
             ))}
          </div>
        </div>

        <h2 className="text-xl lg:text-2xl font-bold text-white mb-8">
          {questions[currentQ].question}
        </h2>

        <div className="space-y-4">
          {questions[currentQ].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectOption(opt.points)}
              className="w-full bg-[#022c22] hover:bg-[#064e3b]/40 border border-[#064e3b]/50 hover:border-[#c5a059]/50 rounded-xl p-5 text-left transition-all flex items-center group"
            >
              <div className="w-8 h-8 rounded-full bg-[#03362a] border border-[#064e3b] flex items-center justify-center mr-4 text-xs font-bold text-gray-400 group-hover:text-[#c5a059] group-hover:border-[#c5a059]">
                {opt.id}
              </div>
              <span className="text-gray-300 font-medium">{opt.text}</span>
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}

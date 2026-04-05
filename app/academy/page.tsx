"use client";

import Link from "next/link";
import { BookOpen, TrendingUp, ShieldCheck, Scale, ArrowRight, PlayCircle, BookMarked } from "lucide-react";

export default function AcademyPage() {
  const articles = [
    {
      id: "was-ist-ijarah",
      title: "Was ist Ijarah? So funktioniert islamkonforme Miete",
      category: "Sharia Basics",
      readTime: "5 Min",
      excerpt: "Ijarah ist das islamische Äquivalent zum Leasing oder Mieten. Erfahren Sie, warum es im Gegensatz zu herkömmlichen Krediten Riba-frei ist.",
      icon: Scale,
    },
    {
      id: "diminishing-musharakah",
      title: "Diminishing Musharakah: Eigentum statt Verschuldung",
      category: "Investment Strukturen",
      readTime: "8 Min",
      excerpt: "Wie funktioniert die 'abnehmende Partnerschaft'? Eine detaillierte Erklärung der Struktur hinter den Amanah PropTech Investments.",
      icon: TrendingUp,
    },
    {
      id: "ewpg-tokenization",
      title: "eWpG: Die rechtliche Grundlage der Tokenisierung",
      category: "Recht & Regulierung",
      readTime: "6 Min",
      excerpt: "Seit der Einführung des elektronischen Wertpapiergesetzes in Deutschland sind Krypto-Wertpapiere rechtssicher handelbar.",
      icon: ShieldCheck,
    },
    {
      id: "aaoifi-standards",
      title: "AAOIFI: Der Goldstandard im Islamic Finance",
      category: "Sharia Basics",
      readTime: "10 Min",
      excerpt: "Die Accounting and Auditing Organization for Islamic Financial Institutions setzt die weltweiten Standards für Halal-Investments.",
      icon: BookMarked,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[140%] bg-[#c5a059]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-[#064e3b] px-4 py-2 rounded-full text-sm font-medium text-[#c5a059] mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Amanah Academy</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Wissen ist der erste Schritt zum Halal-Vermögen.
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Lernen Sie die Grundlagen des Islamic Finance, verstehen Sie unsere Investment-Strukturen und bleiben Sie informiert über regulatorische Entwicklungen im PropTech-Sektor.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#c5a059]/20 flex items-center space-x-2">
              <PlayCircle className="w-5 h-5" />
              <span>Video-Kurs starten</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-white font-bold mb-4">Kategorien</h3>
            <div className="space-y-2">
              {["Alle Artikel", "Sharia Basics", "Investment Strukturen", "Recht & Regulierung", "Markt-Updates"].map((cat, i) => (
                <button
                  key={cat}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    i === 0 ? "bg-[#c5a059]/15 text-[#c5a059] font-medium" : "text-gray-400 hover:text-white hover:bg-[#03362a]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#03362a] to-[#022c22] border border-[#c5a059]/30 rounded-xl p-5 text-center">
            <h3 className="text-white font-bold mb-2">Bleiben Sie informiert</h3>
            <p className="text-xs text-gray-400 mb-4">Erhalten Sie regelmäßige Updates zu neuen Investment-Chancen und Islamic Finance Artikeln.</p>
            <input type="email" placeholder="E-Mail Adresse" className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059] mb-3" />
            <button className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
              Newsletter abonnieren
            </button>
          </div>
        </div>

        {/* Article Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6 hover:border-[#c5a059]/40 transition-all group flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">{article.category}</span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#c5a059] transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-400 mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <div className="mt-auto flex items-center text-sm font-medium text-white group-hover:text-[#c5a059] transition-colors">
                  <span>Artikel lesen</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="bg-[#03362a] border border-[#064e3b] hover:bg-[#064e3b]/50 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Mehr Artikel laden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

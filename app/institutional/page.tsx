"use client";

import { Building2, ShieldCheck, TrendingUp, Handshake, Lock, ChevronRight, FileText, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function InstitutionalPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl overflow-hidden relative">
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] bg-[#c5a059]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="p-8 lg:p-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-[#d4af37]/30 px-4 py-2 rounded-full text-sm font-bold text-[#d4af37] mb-6 shadow-lg shadow-[#d4af37]/10">
              <Building2 className="w-4 h-4" />
              <span>Family Office & Institutionelle Investoren</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Exklusiver Zugang für Private Wealth.
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Ab 500.000 € Investmentvolumen bieten wir dedizierte SPV-Deals, tiefgehende White-Label Sharia Audits und bevorzugten Zugang (Pre-Market) zu europäischen Core-Immobilien.
            </p>
            <Link href="/institutional/dashboard" className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-[#c5a059]/20 flex items-center space-x-2 inline-flex">
              <Handshake className="w-5 h-5" />
              <span>Zum Family Office Dashboard</span>
            </Link>
          </div>
          
          <div className="bg-[#022c22]/80 backdrop-blur-md border border-[#c5a059]/30 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-[#064e3b]/50 pb-4">Institutional Dealflow</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Regulatory & Compliance</h4>
                  <p className="text-xs text-gray-400 mt-1">Strikte eWpG Umsetzung. Krypto-Verwahr-Lizenzen (BaFin) für rechtssicheres Asset Management ohne Kontrahentenrisiko.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#c5a059]/10 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#c5a059]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Private Placement</h4>
                  <p className="text-xs text-gray-400 mt-1">Ausschließlicher Zugriff auf Off-Market Mezzanine-Tranchen und Diminishing Musharakah Konstrukte.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Dedicated Data Rooms</h4>
                  <p className="text-xs text-gray-400 mt-1">Rohdaten-Zugriff für Ihre Due-Diligence (JLL/Cushman Gutachten, Sharia AI Raw Logs, Ijarah-Kalkulationen).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Institutional Deals */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Private Placements (Pre-Launch)</h2>
            <p className="text-gray-400">Exklusiv ab 500k € Allokation.</p>
          </div>
          <button className="text-[#c5a059] hover:underline text-sm font-medium flex items-center">
            Vollständigen Dealroom öffnen <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { name: "Global Logistics Hub Leipzig", vol: "€ 45.000.000", yield: "5.8%", type: "Logistik", img: "wohnquartier.png" },
            { name: "Tech Campus Isar-Süd", vol: "€ 120.000.000", yield: "4.9%", type: "Quartier", img: "stadtresidenz.png" }
          ].map((deal, i) => (
            <div key={i} className="bg-[#03362a] border-2 border-[#1e293b] hover:border-[#c5a059]/50 rounded-xl overflow-hidden transition-all group flex">
              <div className="w-1/3 relative bg-gray-900 border-r border-[#1e293b]">
                 <Image src={`/images/${deal.img}`} alt={deal.name} fill className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
                 <div className="absolute top-2 left-2 bg-[#d4af37] text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">NDA Required</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-white text-lg group-hover:text-[#c5a059] transition-colors">{deal.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{deal.type}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Projektvolumen</p>
                    <p className="font-bold text-white">{deal.vol}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Target Ijarah Return</p>
                    <p className="font-bold text-[#c5a059]">{deal.yield}</p>
                  </div>
                </div>
                
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-white transition-colors w-max">
                  <FileText className="w-4 h-4" /> <span>Executive Summary (PDF) anfragen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

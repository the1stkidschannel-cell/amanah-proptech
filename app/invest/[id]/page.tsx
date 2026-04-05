"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  FileText,
  Scale,
  CheckCircle,
  Calendar,
  Layers,
  ParkingCircle,
  Zap,
  Ruler,
  Users,
  Lock,
  Download,
  ChevronDown,
  ChevronUp,
  Info,
  Wallet,
  ExternalLink,
  Database
} from "lucide-react";
import { getPropertyById } from "@/lib/properties";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const property = getPropertyById(params.id as string);
  const [investAmount, setInvestAmount] = useState(5000);
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
        <Building2 className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Immobilie nicht gefunden</h2>
        <p className="text-gray-400 mb-6">Das angeforderte Investment existiert nicht.</p>
        <button onClick={() => router.push("/invest")} className="text-[#c5a059] hover:underline flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zum Primärmarkt</span>
        </button>
      </div>
    );
  }

  const tokensForAmount = Math.floor(investAmount / property.tokenPrice);
  const annualReturn = Math.round(investAmount * (property.yield / 100));
  const monthlyReturn = Math.round(annualReturn / 12);
  const ownershipPercent = ((investAmount / property.targetVolume) * 100).toFixed(3);

  const handleInvest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          propertyId: property.id,
          propertyName: property.name,
          amount: tokensForAmount, 
          investorAddress: "0xAm4n4hPr0pT3chDemoUser123" 
        }),
      });
      const data = await res.json();
      
      setLoading(false);
      setToast(`Alhamdulillah! ${tokensForAmount} ${property.tokenSymbol}-Token gemintet. Tx: ${data.onChainTx?.substring(0, 10)}...`);
      setTimeout(() => setToast(""), 6000);
    } catch (e) {
      setLoading(false);
      setToast("Fehler bei der Krypto-Übertragung.");
    }
  };

  const docTypeIcons = {
    legal: FileText,
    financial: TrendingUp,
    sharia: ShieldCheck,
  };

  const docsToShow = showAllDocs ? property.documents : property.documents.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Back nav */}
      <button
        onClick={() => router.push("/invest")}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Zurück zum Primärmarkt</span>
      </button>

      {/* Hero */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl overflow-hidden">
        <div className="relative h-56 lg:h-72">
          <Image src={property.image} alt={property.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03362a] via-transparent to-transparent" />
          {/* Status badge */}
          <div className="absolute top-4 right-4 bg-[#064e3b]/90 text-[#d4af37] text-xs font-bold px-4 py-1.5 rounded-full flex items-center space-x-1.5 backdrop-blur-sm z-10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Funding aktiv</span>
          </div>
          {/* Sharia badge */}
          <div className="absolute top-4 left-4 bg-green-600/90 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center space-x-1.5 backdrop-blur-sm z-10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AAOIFI Compliant</span>
          </div>
        </div>

        <div className="p-6 lg:p-8 -mt-8 relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{property.name}</h1>
          <p className="flex items-center space-x-1.5 text-gray-400 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{property.location} · {property.type}</span>
          </p>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Reserviert: <span className="text-white font-semibold">{property.funded}%</span></span>
              <span className="text-gray-400">Ziel: <span className="text-white font-semibold">{new Intl.NumberFormat("de-DE").format(property.targetVolume)} €</span></span>
            </div>
            <div className="w-full bg-[#022c22] rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-[#c5a059] to-[#d4af37] h-3 rounded-full transition-all relative" style={{ width: `${property.funded}%` }}>
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1.5">
              <span>{new Intl.NumberFormat("de-DE").format(Math.round(property.targetVolume * property.funded / 100))} € reserviert</span>
              <span>{new Intl.NumberFormat("de-DE").format(property.targetVolume - Math.round(property.targetVolume * property.funded / 100))} € verfügbar</span>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#022c22] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rendite p.a.</p>
              <p className="text-xl font-bold text-[#d4af37]">{property.yield} %</p>
            </div>
            <div className="bg-[#022c22] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Token Preis</p>
              <p className="text-xl font-bold text-white">{property.tokenPrice} €</p>
            </div>
            <div className="bg-[#022c22] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Wohneinheiten</p>
              <p className="text-xl font-bold text-white">{property.units} WE</p>
            </div>
            <div className="bg-[#022c22] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Haltefrist</p>
              <p className="text-xl font-bold text-white">{property.holdingPeriod}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Investmentübersicht</h2>
            <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{property.description}</p>

            <div className="mt-6 space-y-2">
              {property.highlights.map((h, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-300">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Object details */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Objektdaten</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Ruler, label: "Wohnfläche", value: `${new Intl.NumberFormat("de-DE").format(property.livingArea)} m²` },
                { icon: Layers, label: "Grundstück", value: `${new Intl.NumberFormat("de-DE").format(property.plotArea)} m²` },
                { icon: Calendar, label: "Baujahr", value: property.yearBuilt.toString() },
                { icon: Building2, label: "Etagen", value: property.floors.toString() },
                { icon: Zap, label: "Energieeffizienz", value: property.energyRating },
                { icon: ParkingCircle, label: "Stellplätze", value: property.parkingSpaces.toString() },
                { icon: Users, label: "Vermietungsquote", value: `${property.occupancyRate}%` },
                { icon: Wallet, label: "Monatsmiete", value: `${new Intl.NumberFormat("de-DE").format(property.monthlyRent)} €` },
                { icon: TrendingUp, label: "Netto-Jahresertrag", value: `${new Intl.NumberFormat("de-DE").format(property.annualNetIncome)} €` },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-[#022c22] rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-[#c5a059]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharia Structure */}
          <div className="bg-[#03362a] border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-bold text-white">Sharia-Struktur</h2>
            </div>
            <div className="bg-[#022c22] rounded-lg p-4 border-l-2 border-green-500/40">
              <p className="text-sm text-gray-300 leading-relaxed italic font-serif">{property.shariaStructure}</p>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1"><Scale className="w-3.5 h-3.5" /><span>AAOIFI Standards</span></span>
              <span className="flex items-center space-x-1"><ShieldCheck className="w-3.5 h-3.5" /><span>Pre-Fatwa Level</span></span>
              <span className="flex items-center space-x-1"><Lock className="w-3.5 h-3.5" /><span>eWpG §4 konform</span></span>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Investmentdokumente</h2>
            <div className="space-y-3">
              {docsToShow.map((doc, i) => {
                const DocIcon = docTypeIcons[doc.type];
                return (
                  <div key={i} className="flex items-center justify-between bg-[#022c22] rounded-lg p-4 hover:bg-[#022c22]/70 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.type === "sharia" ? "bg-green-500/10" : doc.type === "financial" ? "bg-[#c5a059]/10" : "bg-blue-500/10"
                      }`}>
                        <DocIcon className={`w-5 h-5 ${
                          doc.type === "sharia" ? "text-green-400" : doc.type === "financial" ? "text-[#c5a059]" : "text-blue-400"
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc.description}</p>
                      </div>
                    </div>
                    <button className="text-gray-500 group-hover:text-[#c5a059] transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
            {property.documents.length > 3 && (
              <button
                onClick={() => setShowAllDocs(!showAllDocs)}
                className="mt-3 text-sm text-[#c5a059] hover:underline flex items-center space-x-1 mx-auto"
              >
                {showAllDocs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showAllDocs ? "Weniger anzeigen" : `Alle ${property.documents.length} Dokumente anzeigen`}</span>
              </button>
            )}
          </div>

          {/* Blockchain & Security Proof */}
          <div className="bg-[#03362a] border border-[#c5a059]/40 rounded-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-[#c5a059]/5 blur-[80px] rounded-full pointer-events-none" />
             <div className="flex items-center space-x-2 mb-4 relative z-10">
               <Database className="w-5 h-5 text-[#c5a059]" />
               <h2 className="text-lg font-bold text-white">Blockchain-Transparenz (eWpG)</h2>
             </div>
             
             <p className="text-sm text-gray-300 mb-6 relative z-10 leading-relaxed">
               Ihr Investment ist zu 100% On-Chain verifizierbar und insolvenzsicher in der Zweckgesellschaft (SPV) verankert. Die BaFin-konformen Anleihebedingungen sind unveränderlich als Datei-Hash (IPFS) auf dem Smart Contract verewigt.
             </p>
             
             <div className="space-y-4 relative z-10">
                <div className="bg-[#022c22] rounded-lg p-4 border border-[#064e3b]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                   <div>
                     <p className="text-xs text-green-400 font-semibold mb-1 uppercase tracking-wider">ERC-3643 Smart Contract</p>
                     <p className="text-sm font-mono text-white">0x9E7a...4fB2 (Polygon POS)</p>
                   </div>
                   <button className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-medium transition-colors bg-[#03362a] px-3 py-2 rounded-md border border-[#064e3b]">
                     <ExternalLink className="w-3.5 h-3.5" /> Auf Polygonscan prüfen
                   </button>
                </div>
                
                <div className="bg-[#022c22] rounded-lg p-4 border border-[#064e3b]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                   <div>
                     <p className="text-xs text-[#c5a059] font-semibold mb-1 uppercase tracking-wider">IPFS Metadaten (Basisinformationsblatt)</p>
                     <p className="text-sm font-mono text-white tracking-tight">QmXrEwG9p8Y...Zp2xL</p>
                   </div>
                   <button className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs font-medium transition-colors bg-[#03362a] px-3 py-2 rounded-md border border-[#064e3b]">
                     <ExternalLink className="w-3.5 h-3.5" /> Dokumenten-Hash laden
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Investment Card (sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-[#03362a] border border-[#c5a059]/30 rounded-xl p-6 lg:sticky lg:top-8">
            <h3 className="text-lg font-bold text-white mb-1">Jetzt investieren</h3>
            <p className="text-xs text-gray-500 mb-6">Tokenisierte Genussrechte nach eWpG</p>

            {/* Amount slider */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-semibold text-gray-300">Betrag</label>
                <span className="text-2xl font-bold text-[#d4af37]">
                  {new Intl.NumberFormat("de-DE").format(investAmount)} €
                </span>
              </div>
              <input
                type="range"
                min={property.minInvest}
                max={property.maxInvest}
                step={500}
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{new Intl.NumberFormat("de-DE").format(property.minInvest)} €</span>
                <span>{new Intl.NumberFormat("de-DE").format(property.maxInvest)} €</span>
              </div>
            </div>

            {/* Investment breakdown */}
            <div className="bg-[#022c22] rounded-xl p-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Token ({property.tokenSymbol})</span>
                <span className="text-white font-medium">{tokensForAmount} Stück</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Eigentumsanteil</span>
                <span className="text-white font-medium">{ownershipPercent} %</span>
              </div>
              <div className="border-t border-[#064e3b]/30 my-1" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monatsertrag (Ijarah)</span>
                <span className="text-green-400 font-medium">~{new Intl.NumberFormat("de-DE").format(monthlyReturn)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Jahresertrag (Ijarah)</span>
                <span className="text-green-400 font-medium">~{new Intl.NumberFormat("de-DE").format(annualReturn)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rendite p.a.</span>
                <span className="text-[#d4af37] font-bold">{property.yield} %</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleInvest}
              disabled={loading}
              className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#c5a059]/20 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span>Kauf bestätigen</span>
                </>
              )}
            </button>

            {/* Trust */}
            <div className="mt-4 flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>Verschlüsselt & DSGVO-konform</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span className="flex items-center space-x-1"><ShieldCheck className="w-3 h-3" /><span>eWpG</span></span>
                <span className="flex items-center space-x-1"><Scale className="w-3 h-3" /><span>AAOIFI</span></span>
                <span className="flex items-center space-x-1"><Info className="w-3 h-3" /><span>ECSP</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-start space-x-3 animate-fade-in-up max-w-md">
          <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

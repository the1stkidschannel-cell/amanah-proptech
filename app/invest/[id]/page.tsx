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
  Database,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { getPropertyById, Property } from "@/lib/firebase/properties";
import { useLanguage } from "@/context/LanguageContext";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, dir } = useLanguage();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProp, setLoadingProp] = useState(true);

  // Fetch property from Firestore
  useState(() => {
    let _mounted = true;
    (async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (id) {
          const prop = await getPropertyById(id);
          if (_mounted) {
            setProperty(prop);
            setLoadingProp(false);
          }
        }
      } catch (e) {
        console.error(e);
        if (_mounted) setLoadingProp(false);
      }
    })();
    return () => { _mounted = false; };
  });

  const [investAmount, setInvestAmount] = useState(5000);
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (loadingProp) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
        <Loader2 className="w-16 h-16 text-[#c5a059] mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-white mb-2">Portfolio Loading...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up" dir={dir}>
        <Building2 className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Not Found</h2>
        <p className="text-gray-400 mb-6">Investment does not exist.</p>
        <button onClick={() => router.push("/invest")} className="text-[#c5a059] hover:underline flex items-center space-x-1">
          <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>Back to Market</span>
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
      setToast(`Alhamdulillah! ${tokensForAmount} ${property.tokenSymbol} Tokens minted. Tx: ${data.onChainTx?.substring(0, 10)}...`);
      setTimeout(() => setToast(""), 6000);
    } catch (e) {
      setLoading(false);
      setToast("Error in On-Chain Settlement.");
    }
  };

  const docTypeIcons = {
    legal: FileText,
    financial: TrendingUp,
    sharia: ShieldCheck,
  };

  const docsToShow = showAllDocs ? property.documents : property.documents.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in-up" dir={dir}>
      {/* Back nav */}
      <button
        onClick={() => router.push("/invest")}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span>Primary Market</span>
      </button>

      {/* Hero */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-56 lg:h-80">
          <Image src={property.image} alt={property.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03362a] via-transparent to-transparent" />
          {/* Status badge */}
          <div className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} bg-[#064e3b]/90 text-[#d4af37] text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center space-x-1.5 backdrop-blur-sm z-10 uppercase tracking-widest border border-[#c5a059]/30`}>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Funding active</span>
          </div>
          {/* Sharia badge */}
          <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} bg-green-600/90 text-white text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center space-x-1.5 backdrop-blur-sm z-10 uppercase tracking-widest`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AAOIFI Compliant</span>
          </div>
        </div>

        <div className="p-6 lg:p-10 -mt-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{property.name}</h1>
              <p className="flex items-center space-x-1.5 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{property.location} · {property.type}</span>
              </p>
            </div>
            <div className="bg-[#022c22] border border-[#064e3b] px-4 py-2 rounded-xl flex items-center gap-3">
               <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">ISIN (eWpG)</p>
                  <p className="text-sm font-mono text-[#c5a059]">DE000A3G2M11</p>
               </div>
               <Database className="w-5 h-5 text-blue-400 opacity-50" />
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400 font-medium uppercase tracking-wider">Reserved: <span className="text-white font-bold">{property.funded}%</span></span>
              <span className="text-gray-400 font-medium uppercase tracking-wider">Target: <span className="text-white font-bold">{new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.targetVolume)} €</span></span>
            </div>
            <div className="w-full bg-[#022c22] rounded-full h-4 overflow-hidden border border-[#064e3b]/30">
              <div className="bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#c5a059] h-full rounded-full transition-all relative" style={{ width: `${property.funded}%` }}>
                <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">
              <span>{new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(Math.round(property.targetVolume * property.funded / 100))} € allocated</span>
              <span>{new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.targetVolume - Math.round(property.targetVolume * property.funded / 100))} € remaining</span>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#022c22] border border-[#064e3b]/30 rounded-2xl p-5 text-center transition-all hover:border-[#c5a059]/40">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Expected ROI p.a.</p>
              <p className="text-2xl font-bold text-[#d4af37]">{property.yield} %</p>
            </div>
            <div className="bg-[#022c22] border border-[#064e3b]/30 rounded-2xl p-5 text-center transition-all hover:border-[#c5a059]/40">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Token Price</p>
              <p className="text-2xl font-bold text-white">{property.tokenPrice} €</p>
            </div>
            <div className="bg-[#022c22] border border-[#064e3b]/30 rounded-2xl p-5 text-center transition-all hover:border-[#c5a059]/40">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Units</p>
              <p className="text-2xl font-bold text-white">{property.units} WE</p>
            </div>
            <div className="bg-[#022c22] border border-[#064e3b]/30 rounded-2xl p-5 text-center transition-all hover:border-[#c5a059]/40">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Holding Period</p>
              <p className="text-2xl font-bold text-white">{property.holdingPeriod}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-8 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Info className="w-5 h-5 text-[#c5a059]" />
               {t('invest')} Overview
            </h2>
            <p className="text-gray-300 leading-loose text-sm whitespace-pre-line">{property.description}</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.highlights.map((h, i) => (
                <div key={i} className="flex items-start space-x-3 bg-[#022c22]/50 p-3 rounded-xl border border-[#064e3b]/20">
                  <CheckCircle className={`w-4 h-4 text-green-400 mt-0.5 shrink-0 ${dir === 'rtl' ? 'ml-3' : ''}`} />
                  <span className="text-xs text-gray-300 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Object details */}
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-8">
             <h2 className="text-lg font-bold text-white mb-6">Asset Specification</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: Ruler, label: "Living Area", value: `${new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.livingArea)} m²` },
                { icon: Layers, label: "Plot Area", value: `${new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.plotArea)} m²` },
                { icon: Calendar, label: "Year Built", value: property.yearBuilt.toString() },
                { icon: Building2, label: "Floors", value: property.floors.toString() },
                { icon: Zap, label: "Energy Rating", value: property.energyRating },
                { icon: ParkingCircle, label: "Parking", value: property.parkingSpaces.toString() },
                { icon: Users, label: "Occupancy", value: `${property.occupancyRate}%` },
                { icon: Wallet, label: "Monthly Rent", value: `${new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.monthlyRent)} €` },
                { icon: TrendingUp, label: "Annual Net", value: `${new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.annualNetIncome)} €` },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-[#022c22] rounded-xl flex items-center justify-center shrink-0 border border-[#064e3b]/40 ${dir === 'rtl' ? 'ml-4' : ''}`}>
                    <item.icon className="w-5 h-5 text-[#c5a059]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharia Structure */}
          <div className="bg-[#03362a] border border-green-500/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
               <ShieldCheck className="w-32 h-32 text-green-400" />
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <ShieldCheck className="w-6 h-6 text-green-400" />
              <h2 className="text-lg font-bold text-white">Sharia Governance</h2>
            </div>
            <div className="bg-[#022c22]/80 backdrop-blur-md rounded-2xl p-6 border-l-4 border-green-500/50 shadow-inner">
              <p className="text-sm text-gray-200 leading-loose italic font-serif">{property.shariaStructure}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <span className="flex items-center space-x-2"><Scale className="w-4 h-4 text-green-500" /><span>AAOIFI Standards</span></span>
              <span className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-green-500" /><span>Fatwa Certified</span></span>
              <span className="flex items-center space-x-2"><Lock className="w-4 h-4 text-green-500" /><span>eWpG Non-Debt</span></span>
            </div>
          </div>
        </div>

        {/* Right Column: Investment Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#03362a] border border-[#c5a059]/40 rounded-2xl p-8 lg:sticky lg:top-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Participate</h3>
            <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold">Tokenized Genussrechte (eWpG)</p>

            {/* Amount picker */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Investment Amount</label>
                <span className="text-3xl font-bold text-[#d4af37]">
                  {new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(investAmount)} €
                </span>
              </div>
              <input
                type="range"
                min={property.minInvest}
                max={property.maxInvest}
                step={500}
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                className="w-full h-2 bg-[#022c22] rounded-lg appearance-none cursor-pointer accent-[#c5a059]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-bold uppercase">
                <span>Min: {new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.minInvest)} €</span>
                <span>Max: {new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(property.maxInvest)} €</span>
              </div>
            </div>

            {/* Compound Mode Toggle (Task 063) */}
            <div className="bg-[#022c22] rounded-2xl p-5 mb-8 border border-[#c5a059]/20 flex items-center justify-between group cursor-pointer hover:border-[#c5a059]/40 transition-all">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059]/20 transition-colors">
                     <RefreshCcw className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-white mb-0.5">Compound Mode</p>
                     <p className="text-[10px] text-gray-500 uppercase tracking-tight">Auto-Reinvest Ijarah Returns</p>
                  </div>
               </div>
               <div className="w-10 h-5 bg-[#03362a] rounded-full p-1 border border-[#064e3b]">
                  <div className="w-3 h-3 bg-gray-600 rounded-full" />
               </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Allocated Tokens</span>
                <span className="text-white font-bold">{tokensForAmount} {property.tokenSymbol}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Ownership Share</span>
                <span className="text-white font-bold">{ownershipPercent} %</span>
              </div>
              <div className="h-px bg-[#064e3b]/30" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Monthly Ijarah (Est.)</span>
                <span className="text-green-400 font-bold">+{new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(monthlyReturn)} €</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Annual Ijarah (Est.)</span>
                <span className="text-green-400 font-bold">+{new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US').format(annualReturn)} €</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              <button
                onClick={handleInvest}
                disabled={loading}
                className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] font-black py-5 rounded-2xl transition-all shadow-xl shadow-[#c5a059]/20 flex items-center justify-center space-x-3 disabled:opacity-60 text-sm uppercase tracking-widest"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span>Purchase Commit (Tx)</span>
                  </>
                )}
              </button>

              <button
                onClick={async () => {
                   setIsDownloading(true);
                   try {
                     const response = await fetch(`/api/properties/${property.id}/pitch-deck`);
                     if (!response.ok) throw new Error('PDF generation failed');
                     const blob = await response.blob();
                     const url = window.URL.createObjectURL(blob);
                     const a = document.createElement('a');
                     a.href = url;
                     a.download = `Amanah_Institutional_Expose_${property.name.replace(/\s+/g, '_')}.pdf`;
                     document.body.appendChild(a);
                     a.click();
                     window.URL.revokeObjectURL(url);
                     a.remove();
                   } catch (err) {
                     console.error("Downloader Error:", err);
                   }
                   setIsDownloading(false);
                }}
                disabled={isDownloading}
                className="w-full bg-transparent border-2 border-[#064e3b] hover:border-[#c5a059] text-gray-400 hover:text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center space-x-3 disabled:opacity-60 text-sm uppercase tracking-widest"
              >
                {isDownloading ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   <>
                     <Download className="w-5 h-5" />
                     <span>Investment Exposé (PDF)</span>
                   </>
                )}
              </button>
            </div>

            {/* Compliance Footer */}
            <p className="mt-8 text-[9px] text-gray-600 leading-normal text-center uppercase tracking-tighter">
               Electronic securities pursuant to §4 Electronic Securities Act (eWpG). 
               Brokerage as a tied agent of a licensed financial institution.
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-50 bg-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-start space-x-4 animate-fade-in-up max-w-lg border border-green-400/30`}>
          <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <p className="text-sm font-bold tracking-tight">{toast}</p>
        </div>
      )}
    </div>
  );
}

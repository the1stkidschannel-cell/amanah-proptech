"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, TrendingUp, ShieldCheck, ArrowRight, Filter, Search, SlidersHorizontal, CheckCircle, Loader2 } from "lucide-react";
import { getLiveProperties, Property } from "@/lib/firebase/properties";

export default function InvestPage() {
  const [filterType, setFilterType] = useState<string>("Alle");
  const [filterYield, setFilterYield] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInstitutionalOnly, setShowInstitutionalOnly] = useState(false);

  // Load live properties from Firestore on mount
  useState(() => {
    let _mounted = true;
    (async () => {
      try {
        const liveProps = await getLiveProperties();
        if (_mounted) {
          setProperties(liveProps);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (_mounted) setLoading(false);
      }
    })();
    return () => { _mounted = false; };
  });

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // In firebase we set "location" or "city" string so we use location here
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "Alle" || p.type.includes(filterType);
      const matchYield = p.yield >= filterYield;
      const matchInstitutional = !showInstitutionalOnly || p.targetVolume >= 5000000 || p.isInstitutional;
      return matchSearch && matchType && matchYield && matchInstitutional;
    });
  }, [search, filterType, filterYield, showInstitutionalOnly, properties]);

  const uniqueTypes = ["Alle", "Mehrfamilienhaus", "Wohnanlage", "Bürogebäude", "Geschäftshaus"];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">Primärmarkt</h1>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm">
            Investieren Sie in tokenisierte Immobilien-SPVs – Genussrechte nach eWpG.
          </p>
        </div>
        
        {/* Search & Mobile Filter Toggle */}
        <div className="flex w-full lg:w-auto items-center gap-2">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Stadt oder Projekt suchen..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#03362a] border border-[#064e3b]/80 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#c5a059]"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-[#03362a] border border-[#064e3b] p-2.5 rounded-lg text-gray-400 hover:text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#064e3b]/40">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#c5a059]" /> Filter
              </h3>
              <button onClick={() => {setFilterType("Alle"); setFilterYield(0); setSearch("");}} className="text-xs text-gray-400 hover:text-white">
                Zurücksetzen
              </button>
            </div>

            {/* Asset Class Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Asset Klasse</h4>
              <div className="space-y-2">
                {uniqueTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filterType === type ? 'bg-[#c5a059] border-[#c5a059]' : 'border-[#064e3b] group-hover:border-[#c5a059]'}`}>
                      {filterType === type && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${filterType === type ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{type}</span>
                    <input type="radio" className="hidden" checked={filterType === type} onChange={() => setFilterType(type)} />
                  </label>
                ))}
              </div>
            </div>

            {/* Yield Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Min. Rendite</h4>
                <span className="text-sm font-bold text-[#c5a059]">&gt;{filterYield.toFixed(1)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="6" 
                step="0.1" 
                value={filterYield} 
                onChange={(e) => setFilterYield(parseFloat(e.target.value))} 
                className="w-full accent-[#c5a059]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>6%</span>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-[#064e3b]/40">
               <div className="flex items-center justify-between p-2 bg-[#022c22] rounded-lg border border-[#c5a059]/20 mb-3 cursor-pointer" onClick={() => setShowInstitutionalOnly(!showInstitutionalOnly)}>
                  <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">Institutional Assets</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${showInstitutionalOnly ? 'bg-[#c5a059]' : 'bg-gray-800'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${showInstitutionalOnly ? 'left-4.5' : 'left-0.5'}`} />
                  </div>
               </div>
               <div className="flex items-center gap-2 p-2 bg-[#022c22] rounded-lg border border-[#064e3b]/30">
                  <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                  <p className="text-[10px] text-gray-400 leading-tight">Alle {filteredProperties.length} Projekte sind 100% BaFin & AAOIFI geprüft.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="lg:col-span-3">
          {loading ? (
             <div className="flex flex-col items-center justify-center p-32">
                <Loader2 className="w-10 h-10 text-[#c5a059] animate-spin mb-4" />
                <p className="text-gray-400">Lade Live-Projekte aus dem Blockchain-Register...</p>
             </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-12 text-center">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white mb-2">Keine Projekte gefunden</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                Mit Ihren aktuellen Filtereinstellungen ({filterType !== "Alle" ? filterType : ""}, &gt;{filterYield}% Rendite) wurden keine passenden Immobilien gefunden.
              </p>
              <button 
                onClick={() => {setFilterType("Alle"); setFilterYield(0); setSearch("");}}
                className="mt-6 text-[#c5a059] hover:underline font-medium text-sm"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((p) => (
                <Link
                  key={p.id}
                  href={`/invest/${p.id}`}
                  className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl overflow-hidden hover:border-[#c5a059]/30 transition-all group block shadow-lg"
                >
                  {/* Header image */}
                  <div className="h-48 relative bg-gray-900 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03362a] via-[#03362a]/20 to-transparent" />
                    
                    {/* Status & Sharia Badges */}
                    <div className="absolute top-3 right-3 bg-[#064e3b]/90 backdrop-blur-sm text-[#d4af37] text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 z-10">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span>{p.status === "Live" ? "Funding aktiv" : "Geschlossen"}</span>
                    </div>
                    <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center space-x-1 z-10">
                      <ShieldCheck className="w-3 h-3" />
                      <span>AAOIFI</span>
                    </div>
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1">{p.name}</h3>
                      <p className="text-xs text-gray-300 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{p.location} · {p.type}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center divide-x divide-[#064e3b]/40 bg-[#022c22] rounded-lg py-2">
                       <div>
                        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">Volumen</p>
                        <p className="text-[11px] sm:text-sm font-bold text-white">{(p.targetVolume / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">Rendite</p>
                        <p className="text-[11px] sm:text-sm font-bold text-[#d4af37]">{p.yield}%</p>
                      </div>
                      <div>
                        <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">Laufzeit</p>
                        <p className="text-[11px] sm:text-sm font-bold text-white">{p.holdingPeriod.split(" ")[0]}J</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5 px-1">
                        <span>Funded: <strong className="text-white">{p.funded}%</strong></span>
                        <span>ab <strong className="text-white">{new Intl.NumberFormat("de-DE").format(p.minInvest)} €</strong></span>
                      </div>
                      <div className="w-full bg-[#022c22] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#c5a059] to-[#d4af37] h-1.5 rounded-full transition-all"
                          style={{ width: `${p.funded}%` }}
                        />
                      </div>
                    </div>

                    <div className="w-full border border-[#064e3b] text-white text-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center space-x-2 group-hover:bg-[#c5a059] group-hover:border-[#c5a059]">
                      <span>Details & Investieren</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

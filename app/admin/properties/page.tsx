"use client";

import { useEffect, useState } from "react";
import { Building2, TrendingUp, Users, MapPin, Search, Plus, ExternalLink, MoreVertical, Edit3 } from "lucide-react";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In production, this would fetch from Firebase
  const fetchProperties = async () => {
    setIsLoading(true);
    // Simulation of property fetch
    setTimeout(() => {
      setProperties([
        { id: "spv-rhein-ruhr-001", name: "Wohnpark Rhein-Ruhr", city: "Duisburg", yield: "4.8%", occupancy: "98%", status: "LIVE" },
        { id: "spv-muenchen-ost-002", name: "Stadtresidenz München-Ost", city: "München", yield: "4.2%", occupancy: "100%", status: "LIVE" },
      ]);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold text-blue-400 mb-3">
            <Building2 className="w-3 h-3" />
            <span>Asset Management Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Live Properties
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Verwalten Sie Ihre SPVs und tokenisierten Immobilien. Pflegen Sie Berichte und aktualisieren Sie die Performance-KPIs für Ihre Investoren.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = "/admin/properties/create"}
          className="bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Neues Asset anlegen
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Gesamtwert (AUM)</p>
           <p className="text-2xl font-bold text-white">€ 64.200.000</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Durchschn. Rendite</p>
           <p className="text-2xl font-bold text-green-400">4.5% p.a.</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Aktive Investoren</p>
           <p className="text-2xl font-bold text-white">1.242</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Asset-Klasse</p>
           <p className="text-2xl font-bold text-[#c5a059]">Sharia-eWpG</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-lg text-xs font-bold bg-[#c5a059] text-[#022c22]">Live Assets</button>
           <button className="px-4 py-2 rounded-lg text-xs font-bold text-gray-400 hover:bg-[#064e3b]">Drafts</button>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
           <input type="text" placeholder="Assets suchen..." className="w-full bg-[#022c22] border border-[#064e3b] text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#c5a059]"/>
        </div>
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="p-20 text-center">
             <Building2 className="w-8 h-8 text-[#064e3b] animate-pulse mx-auto mb-4" />
             <p className="text-gray-400">Assets werden synchronisiert...</p>
          </div>
        ) : (
          properties.map((prop) => (
            <div key={prop.id} className="bg-[#03362a]/50 border border-[#064e3b]/40 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center group hover:border-[#c5a059]/40 transition-all shadow-sm">
               <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="bg-[#022c22] p-3 rounded-xl border border-[#064e3b]">
                   <Building2 className="w-6 h-6 text-[#c5a059]" />
                 </div>
                 <div>
                   <h3 className="font-bold text-white group-hover:text-[#c5a059] transition-colors">{prop.name}</h3>
                   <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {prop.city}</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-6 md:py-0 w-full md:w-auto text-center md:text-left px-4">
                 <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Rendite</p>
                    <p className="text-sm font-bold text-white">{prop.yield}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Belegung</p>
                    <p className="text-sm font-bold text-white">{prop.occupancy}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                    <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20">{prop.status}</span>
                 </div>
                 <div className="hidden lg:block">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Asset ID</p>
                    <p className="text-[10px] font-medium text-gray-400">{prop.id.slice(0, 12)}...</p>
                 </div>
               </div>

               <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => window.location.href = `/admin/properties/${prop.id}`}
                    className="flex-1 md:flex-none px-4 py-2 bg-[#022c22] border border-[#064e3b] text-white text-xs font-bold rounded-xl hover:border-[#c5a059]/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Performance verwalten
                  </button>
                  <button className="p-2 text-gray-500 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

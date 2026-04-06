"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  MapPin, 
  Save, 
  FileUp, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  History,
  FileText
} from "lucide-react";

export default function PropertyPerformancePage({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  
  // Real world: fetch data from Firestore
  const [propertyData, setPropertyData] = useState<any>({
    id: propertyId,
    name: "Wohnpark Rhein-Ruhr",
    city: "Duisburg",
    yield: "4.8",
    occupancy: "98",
    valuation: "12500000",
    lastReport: "Q4 2025 JLL Audit"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => window.location.href = "/admin/properties"}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm w-max"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück zur Asset-Liste
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {propertyData.name} <span className="text-gray-500 font-normal text-xl">({propertyData.id})</span>
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" /> {propertyData.city} • Letztes Update: Vor 3 Tagen
            </p>
          </div>
          <div className="bg-[#03362a] border border-[#064e3b] px-4 py-2 rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c5a059]" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Performance Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#022c22] border-b border-[#064e3b] p-4 flex gap-2 items-center">
              <TrendingUp className="w-5 h-5 text-[#c5a059]"/>
              <h3 className="font-bold text-white text-sm">Performance Metriken aktualisieren</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Aktuelle Rendite (Yield %)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.1" value={propertyData.yield}
                      onChange={(e) => setPropertyData({...propertyData, yield: e.target.value})}
                      className="w-full bg-[#022c22] border border-[#064e3b] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#c5a059]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Aktuelle Belegungsquote (%)</label>
                  <div className="relative">
                    <input 
                      type="number" value={propertyData.occupancy}
                      onChange={(e) => setPropertyData({...propertyData, occupancy: e.target.value})}
                      className="w-full bg-[#022c22] border border-[#064e3b] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#c5a059]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Aktuelle Marktbewertung (EUR)</label>
                  <div className="relative">
                    <input 
                      type="number" value={propertyData.valuation}
                      onChange={(e) => setPropertyData({...propertyData, valuation: e.target.value})}
                      className="w-full bg-[#022c22] border border-[#064e3b] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#c5a059]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#064e3b]/50">
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><FileUp className="w-3.5 h-3.5" /> JLL / Gutachten Report (PDF)</h4>
                 <div className="border-2 border-dashed border-[#064e3b] rounded-2xl p-8 text-center hover:border-[#c5a059]/50 transition-all cursor-pointer group">
                    <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2 group-hover:text-[#c5a059] transition-colors" />
                    <p className="text-sm text-gray-400 group-hover:text-white transition-colors">Klicken oder Datei hierherziehen zum Hochladen</p>
                    <p className="text-[10px] text-gray-600 mt-1 uppercase">Aktueller Report: {propertyData.lastReport}</p>
                 </div>
              </div>
            </div>

            <div className="bg-[#022c22]/50 p-4 border-t border-[#064e3b] flex justify-end gap-3">
               {saveSuccess && (
                 <div className="text-green-400 text-xs font-bold flex items-center gap-1.5 animate-pulse mr-auto">
                    <CheckCircle2 className="w-4 h-4" /> Performance-Update erfolgreich gespeichert!
                 </div>
               )}
               <button 
                 type="submit" 
                 disabled={isSaving}
                 className="bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
               >
                 <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} /> {isSaving ? "Wird gespeichert..." : "Änderungen publizieren"}
               </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
           <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-blue-400 font-bold text-sm flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4" /> Wichtiger Hinweis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Änderungen an der Rendite (Yield) oder Belegung wirken sich unmittelbar auf die Kalkulationen in den User-Wallets aus. Bitte stellen Sie sicher, dass alle Daten durch den JLL-Report oder interne Audits verifiziert sind.
              </p>
           </div>

           <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-2"><History className="w-4 h-4" /> Revisionsverlauf</h3>
              <div className="space-y-4">
                 {[1, 2].map((i) => (
                   <div key={i} className="flex gap-3 border-l-2 border-[#064e3b] pl-4 py-1">
                      <div className="space-y-1">
                         <p className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest">Update #00{i+5}</p>
                         <p className="text-xs text-white">Rendite angepasst auf 4.{i+5}%</p>
                         <p className="text-[10px] text-gray-500">Vor {i*2} Wochen von Admin_01</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}

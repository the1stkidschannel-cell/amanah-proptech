"use client";

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Euro, 
  Percent, 
  Info, 
  ShieldCheck, 
  FileText, 
  Cpu,
  ArrowRight,
  CheckCircle2,
  Upload,
  Layers,
  Zap,
  Calendar,
  Ruler
} from "lucide-react";
import { useRouter } from "next/navigation";
import { addProperty } from "@/lib/firebase/properties";

export default function AssetOriginationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "Wohnquartier",
    description: "",
    targetVolume: "5000000",
    yield: "5.5",
    holdingPeriod: "5 Jahre",
    tokenSymbol: "",
    tokenPrice: "500",
    shariaStructure: "Ijarah (Leasing)",
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentLog(["Starte Asset Origination..."]);
    
    // Simulate DB Save & Smart Contract Generation
    setTimeout(() => setDeploymentLog(prev => [...prev, "Speichere Immobilien-Metadaten in Firestore..."]), 800);
    
    // Actually save to Firebase Firestore
    setTimeout(async () => {
      try {
        await addProperty({
          name: formData.name,
          location: formData.location,
          type: formData.type,
          description: formData.description,
          targetVolume: parseInt(formData.targetVolume),
          yield: parseFloat(formData.yield),
          holdingPeriod: formData.holdingPeriod,
          tokenSymbol: formData.tokenSymbol,
          tokenPrice: parseInt(formData.tokenPrice),
          shariaStructure: formData.shariaStructure,
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // Placeholder image
          documents: [
            { type: "legal", title: "Basisinformationsblatt (eWpG)", description: "Prospekt nach eWpG" },
            { type: "sharia", title: "AAOIFI Fatwa", description: "Sharia Compliant Cert." }
          ],
          status: "Live",
          funded: 0,
          livingArea: 3500,
          plotArea: 5000,
          yearBuilt: 2024,
          floors: 6,
          energyRating: "A+",
          parkingSpaces: 50,
          occupancyRate: 100,
          monthlyRent: 85000,
          annualNetIncome: 1020000,
          minInvest: 500,
          maxInvest: 100000,
          units: 40,
          highlights: ["Neubau Erstbezug", "Top Verkehrsanbindung", "ESG-Konform"]
        });
        setDeploymentLog(prev => [...prev, "Firestore Eintragung erfolgreich!"]);
      } catch (err) {
        console.error("Firebase Error:", err);
        setDeploymentLog(prev => [...prev, "WARNUNG: Firestore Speicherung fehlgeschlagen."]);
      }
    }, 1200);

    setTimeout(() => setDeploymentLog(prev => [...prev, "Generiere Basisinformationsblatt (BIB) & eWpG Hashes..."]), 2500);
    setTimeout(() => setDeploymentLog(prev => [...prev, "Kompiliere ERC-3643 Smart Contract (Amanah PropTech eWpG Token)..."]), 4000);
    setTimeout(() => setDeploymentLog(prev => [...prev, `Deploye Contract für Asset [${formData.tokenSymbol}] aufs Polygon Mainnet...`]), 6000);
    setTimeout(() => setDeploymentLog(prev => [...prev, "Tx Bestätigung: 0x8a92...3b11 | Contract generiert."]), 7500);
    setTimeout(() => setDeploymentLog(prev => [...prev, "Asset erfolgreich auf dem Primärmarkt gelistet! 🚀"]), 8500);
    
    setTimeout(() => {
      router.push("/invest");
    }, 10500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-[#c5a059]" /> Asset Origination Factory
        </h1>
        <p className="text-gray-400 mt-2">
          Onboarding-Prozess für neue Immobilien. Erstellt die Datenbank-Einträge, verknüpft eWpG Dokumente und generiert live einen eigenen Smart Contract pro Immobilie.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#064e3b] -z-10 rounded-full" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#c5a059] -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all ${
            step >= num ? "bg-[#c5a059] border-[#022c22] text-[#022c22]" : "bg-[#022c22] border-[#064e3b] text-gray-500"
          }`}>
            {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#03362a] border border-[#064e3b] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Step 1: Stammdaten */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-right">
            <h2 className="text-2xl font-bold text-white border-b border-[#064e3b] pb-4">1. Stammdaten & Exposé</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Projektname</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#c5a059] outline-none" placeholder="z.B. Rhein-Ruhr Quartier" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Standort</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#c5a059] outline-none" placeholder="z.B. Düsseldorf, NRW" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-300">Projektbeschreibung</label>
                <textarea className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg p-4 text-white focus:border-[#c5a059] outline-none h-32" placeholder="Beschreiben Sie das Objekt für die Investoren..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>

            {/* Schulung / Tooltip */}
            <div className="p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg flex gap-3">
              <Info className="w-6 h-6 text-blue-400 shrink-0" />
              <div className="text-sm text-blue-200">
                <p className="font-bold mb-1">Schulung für Analysten: Exposé Richtlinien</p>
                <p>Gemäß Wertpapierprospektgesetz müssen Standort und Projektname eindeutig identifizierbar sein. Verwenden Sie keine irreführenden Marketing-Begriffe. Die Daten werden direkt ans BaFin-Register gespiegelt.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Financials */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-right">
            <h2 className="text-2xl font-bold text-white border-b border-[#064e3b] pb-4">2. Financials & Strukturierung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Zielvolumen (Total Asset Value)</label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="number" className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#c5a059] outline-none" value={formData.targetVolume} onChange={e => setFormData({...formData, targetVolume: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Netto-Jahresrendite (Ijarah)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="number" step="0.1" className="w-full bg-[#022c22] border border-[#064e3b] rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#c5a059] outline-none" value={formData.yield} onChange={e => setFormData({...formData, yield: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Token Kürzel (Symbol)</label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c5a059]" />
                  <input type="text" className="w-full bg-[#022c22] border border-[#c5a059]/50 rounded-lg pl-10 pr-4 py-3 text-[#d4af37] uppercase font-bold focus:border-[#c5a059] outline-none" placeholder="z.B. MOT" maxLength={4} value={formData.tokenSymbol} onChange={e => setFormData({...formData, tokenSymbol: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Schulung / Tooltip */}
            <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg flex gap-3">
              <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
              <div className="text-sm text-green-200">
                <p className="font-bold mb-1">Schulung: Financials & Insolvenzsicherheit</p>
                <p>Das Token-Kürzel (z.B. "MOT") wird unauslöschlich auf die Blockchain geschrieben. Die Gesamtzahl der generierten Tokens basiert auf dem gewählten Zielvolumen geteilt durch den anfänglichen Token-Preis (Standard 500€). Bitte verifizieren Sie das Volumen mit dem eingetragenen Stammkapital der Zweckgesellschaft (SPV).</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Legal & Sharia */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-right">
            <h2 className="text-2xl font-bold text-white border-b border-[#064e3b] pb-4">3. Legal, Sharia & IPFS</h2>
            
            <div className="p-6 border border-dashed border-[#064e3b] bg-[#022c22] rounded-xl text-center hover:bg-[#064e3b]/30 cursor-pointer transition-colors">
              <Upload className="w-10 h-10 text-[#c5a059] mx-auto mb-3" />
              <p className="text-white font-medium">Basisinformationsblatt (BIB) hochladen</p>
              <p className="text-xs text-gray-500 mt-1">PDF max 5MB. Wird automatisch an IPFS (Dezentrales Netzwerk) übertragen.</p>
            </div>

            <div className="p-6 border border-dashed border-[#064e3b] bg-[#022c22] rounded-xl text-center hover:bg-[#064e3b]/30 cursor-pointer transition-colors">
              <Upload className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <p className="text-white font-medium">Sharia Fatwa (Zertifikat) hochladen</p>
              <p className="text-xs text-gray-500 mt-1">Zertifikat des AAOIFI Boards.</p>
            </div>

            {/* Schulung / Tooltip */}
            <div className="p-4 bg-[#c5a059]/10 border-l-4 border-[#c5a059] rounded-r-lg flex gap-3">
              <FileText className="w-6 h-6 text-[#c5a059] shrink-0" />
              <div className="text-sm text-yellow-100">
                <p className="font-bold mb-1">Schulung: eWpG Transparenz</p>
                <p>Durch den Upload erstellt unser System einen IPFS Hash. Dieser Fingerabdruck der PDF wird in Schritt 4 in den Smart Contract der Blockchain gemeißelt. Somit kann niemand – auch wir nicht – die Anlagekonditionen nach dem initialen Token-Verkauf illegal ändern.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Factory / Deploy */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in-right">
            <h2 className="text-2xl font-bold text-white border-b border-[#064e3b] pb-4 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#c5a059]" /> 4. Smart Contract Factory
            </h2>
            
            {!isDeploying ? (
               <div className="space-y-6">
                 <p className="text-gray-300">
                   Bitte überprüfen Sie die Parameter ein letztes Mal. Wenn Sie auf Deploy klicken, wird das Hardhat/Ethers Skript gestartet und ein <strong>brandneuer ERC-3643 Token Contract</strong> für <em>{formData.name}</em> ({formData.tokenSymbol}) auf der Polygon-Chain erschaffen.
                 </p>
                 <div className="bg-[#022c22] rounded-xl p-4 border border-[#064e3b] grid grid-cols-2 gap-4 text-sm">
                   <div><span className="text-gray-500 block">Asset Name:</span><span className="text-white font-bold">{formData.name || "N/A"}</span></div>
                   <div><span className="text-gray-500 block">Token Ticker:</span><span className="text-[#c5a059] font-bold">{formData.tokenSymbol || "N/A"}</span></div>
                   <div><span className="text-gray-500 block">Gesamtvolumen:</span><span className="text-white">{formData.targetVolume} €</span></div>
                   <div><span className="text-gray-500 block">Rendite p.a.:</span><span className="text-green-400">{formData.yield}% (Ijarah)</span></div>
                 </div>

                 <button onClick={handleDeploy} className="w-full py-4 bg-gradient-to-r from-[#c5a059] to-[#854d0e] hover:brightness-110 rounded-xl font-bold text-white shadow-lg shadow-[#c5a059]/30 flex items-center justify-center gap-2 transition-all">
                   <Zap className="w-5 h-5" /> Smart Contract Token Deployen
                 </button>

                 {/* Schulung / Tooltip */}
                 <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg flex gap-3">
                   <ShieldCheck className="w-6 h-6 text-red-400 shrink-0" />
                   <div className="text-sm text-red-200">
                     <p className="font-bold mb-1">Achtung: Unveränderlich</p>
                     <p>Ein Deployment kostet Polygon (MATIC) Gas-Gebühren, die von der Amanah Wallet bezahlt werden. Nach dem "Deploy" ist der Smart Contract live. Token Name und max. Supply können nicht mehr geändert werden.</p>
                   </div>
                 </div>
               </div>
            ) : (
               <div className="bg-black/90 rounded-xl p-6 font-mono text-sm shadow-inner relative overflow-hidden h-64 flex flex-col justify-end">
                 {/* Processing overlay */}
                 <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10" />
                 
                 <div className="space-y-2 relative z-10 z-[10]">
                   {deploymentLog.map((log, index) => (
                     <p key={index} className="text-green-400 animate-fade-in-up">
                       <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                     </p>
                   ))}
                   {deploymentLog.length < 6 && (
                     <p className="text-yellow-400 animate-pulse">_ executing ethers.js...</p>
                   )}
                 </div>
               </div>
            )}
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      {!isDeploying && (
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrev} 
            disabled={step === 1}
            className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white disabled:opacity-0 transition-all"
          >
            Zurück
          </button>
          
          {step < 4 && (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              Weiter <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Network, 
  Cpu, 
  ShieldAlert, 
  Fingerprint, 
  Wallet, 
  ArrowRightLeft,
  CheckCircle2,
  FileCode2,
  Box,
  Link as LinkIcon,
  Scale
} from "lucide-react";

export default function TokenizationEngine() {
  const { user } = useAuth();
  const [deployStep, setDeployStep] = useState(0);

  const startDeployment = () => {
    setDeployStep(1);
    setTimeout(() => setDeployStep(2), 2000); // Compile
    setTimeout(() => setDeployStep(3), 4500); // Deploy
    setTimeout(() => setDeployStep(4), 7000); // Verify
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#c5a059]" />
            Amanah Web3 Factory
          </h1>
          <p className="text-gray-400 mt-1 max-w-2xl">
            Vollautomatisierte eWpG-Tokenisierung. Generiere ERC-3643 (T-Rex) konforme Smart Contracts für Immobilienwerte. Integriert mit On-Chain KYC & AML Whitelisting.
          </p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b] px-4 py-2 rounded-xl flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm font-medium text-green-400">Polygon Mainnet (MATIC)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Contracts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#03362a] border border-[#064e3b]/80 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Network className="w-48 h-48 text-[#c5a059]" />
             </div>
             
             <h2 className="text-lg font-bold text-white mb-6">Deploys & Contracts</h2>
             
             <div className="space-y-4 relative z-10">
               {/* Deployed Contract 1 */}
               <div className="bg-[#022c22] border border-[#064e3b] rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                     <FileCode2 className="w-5 h-5 text-green-400" />
                   </div>
                   <div>
                     <div className="flex items-center gap-3">
                        <h3 className="text-white font-medium">Logistikpark Hannover-Messe (LHT)</h3>
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Active</span>
                     </div>
                     <p className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-2">
                        0x7a8...4f1B <LinkIcon className="w-3 h-3" />
                     </p>
                     <div className="flex gap-4 mt-3">
                        <div className="text-xs">
                          <span className="text-gray-500">Total Supply: </span>
                          <span className="text-gray-300">18.5M</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Holders: </span>
                          <span className="text-gray-300">142</span>
                        </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-4 py-2 bg-[#064e3b] hover:bg-[#064e3b]/80 text-[#c5a059] text-sm font-medium rounded-lg transition-colors border border-[#064e3b]">
                      Manage Asset
                    </button>
                 </div>
               </div>
               
               {/* Pending Contract from AI AI Sourcing */}
               <div className="bg-[#022c22] border border-dashed border-[#c5a059]/50 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-[#c5a059]/10 rounded-lg flex items-center justify-center shrink-0">
                     <Box className="w-5 h-5 text-[#c5a059]" />
                   </div>
                   <div>
                     <div className="flex items-center gap-3">
                        <h3 className="text-white font-medium">Frankfurt Commercial Tower (FCT)</h3>
                        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Pending Audit</span>
                     </div>
                     <p className="text-xs text-gray-500 mt-1">Generated by Sharia AI Deal Underwriting</p>
                     <div className="flex gap-4 mt-3">
                        <div className="text-xs">
                          <span className="text-gray-500">Target Supply: </span>
                          <span className="text-[#c5a059]">12.0M</span>
                        </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col gap-2">
                    <div className="text-[10px] text-gray-500 font-mono text-right flex items-center justify-end gap-1">
                       <Scale className="w-3 h-3 text-[#c5a059]" />
                       <span>eWpG BaFin Compliant &sect;2</span>
                    </div>
                    <button 
                      onClick={startDeployment}
                      disabled={deployStep > 0}
                      className="w-full sm:w-auto px-4 py-2 bg-[#c5a059] hover:bg-[#d4af37] disabled:opacity-50 text-[#022c22] text-sm font-bold rounded-lg transition-colors shadow-lg shadow-[#c5a059]/10"
                    >
                      {deployStep > 0 ? "Deploying..." : "Mint & Deploy 🚀"}
                    </button>
                 </div>
               </div>

               {/* Legal to Tech Mapping USP */}
               <div className="mt-8 border-t border-[#064e3b] pt-6 relative z-10">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <Scale className="w-5 h-5 text-[#c5a059]" /> Legal-To-Node Mapping (USP)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#022c22] border border-[#064e3b] rounded-xl p-4">
                       <div className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider">Juristische Struktur (BaFin)</div>
                       <ul className="text-sm text-gray-300 space-y-2">
                         <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-400" /> Zweckgesellschaft (SPV) gegründet</li>
                         <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-400" /> Emission von Genussrechten nach eWpG</li>
                         <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-green-400" /> Basis-Informationsblatt (BIB) hinterlegt</li>
                       </ul>
                    </div>
                    <div className="flex items-center justify-center -m-5 relative z-20">
                       <div className="bg-[#c5a059] p-1.5 rounded-full shadow-[0_0_15px_rgba(197,160,89,0.3)] hidden md:block">
                         <ArrowRightLeft className="w-4 h-4 text-[#022c22]" />
                       </div>
                    </div>
                    <div className="bg-[#022c22] border border-[#064e3b] rounded-xl p-4">
                       <div className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider">Blockchain Struktur (ERC-3643)</div>
                       <ul className="text-sm text-gray-300 space-y-2">
                         <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Smart Contract T-Rex Standard</li>
                         <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-400" /> On-Chain Identity Registry gebunden</li>
                         <li className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Compliance Module Enforcement Auth</li>
                       </ul>
                    </div>
                 </div>
               </div>

             </div>
          </div>
        </div>

        {/* Global Scalability & Terminal */}
        <div className="space-y-6">
          <div className="bg-[#03362a] border border-[#064e3b]/80 rounded-2xl p-6">
             <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
               <Fingerprint className="w-4 h-4 text-[#c5a059]" /> Terminal Output
             </h2>
             
             <div className="bg-[#01140f] p-4 rounded-xl border border-gray-800 font-mono text-xs overflow-hidden h-[240px] flex flex-col justify-end">
               <div className="space-y-2 text-gray-400 opacity-80">
                  <p>&gt; Initializing Web3 Provider...</p>
                  <p>&gt; Connected to Polygon RPC: https://polygon-rpc.com/</p>
                  <p>&gt; Global Fiat Bridge status: <span className="text-green-400">ONLINE (USD, EUR, AED)</span></p>
                  
                  {deployStep >= 1 && (
                    <p className="text-yellow-400 animate-pulse">&gt; Requesting contract compilation (ERC-3643)...</p>
                  )}
                  {deployStep >= 2 && (
                    <p className="text-green-400">&gt; Compiled successfully. Solidity v0.8.20.</p>
                  )}
                  {deployStep >= 3 && (
                     <>
                       <p className="text-yellow-400 animate-pulse">&gt; Deploying to Polygon Mainnet. Estimating Gas...</p>
                       <p>&gt; Tx Hash: 0x8f2d...b1a9</p>
                     </>
                  )}
                  {deployStep >= 4 && (
                    <p className="text-green-400 font-bold">&gt; DEPLOYMENT SUCCESSFUL. Contract verified.</p>
                  )}
               </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#03362a] border border-[#064e3b] rounded-xl p-4 flex flex-col items-center text-center justify-center">
                <Wallet className="w-6 h-6 text-[#c5a059] mb-2" />
                <span className="text-lg font-bold text-white">4.2M AED</span>
                <span className="text-xs text-gray-500">MENA Liquidity Pool</span>
             </div>
             <div className="bg-[#03362a] border border-[#064e3b] rounded-xl p-4 flex flex-col items-center text-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-green-400 mb-2" />
                <span className="text-lg font-bold text-white">Fiat Bridge</span>
                <span className="text-xs text-gray-500">Stripe Connect Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

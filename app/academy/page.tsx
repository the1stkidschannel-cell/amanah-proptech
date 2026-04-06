"use client";

import { PlayCircle, ShieldCheck, FileText, Blocks, Building2, Lock, Landmark, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ShariaComparison } from "@/components/academy/ShariaComparison";
import { useLanguage } from "@/context/LanguageContext";

export default function AcademyPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t, dir } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up pb-12" dir={dir}>
      
      {/* Header */}
      <div className="text-center space-y-4 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
          Amanah <span className="text-[#c5a059]">Academy</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
          {t('academy_subtitle')}
        </p>
      </div>

      {/* Video Section Mock */}
      <div className="mx-4 sm:mx-0 bg-[#03362a] border border-[#064e3b]/50 rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
        {!isPlaying ? (
          <div className="relative aspect-video bg-black/40 flex items-center justify-center">
            {/* Thumbnail Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] to-[#03362a] opacity-80" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            
            <div className="z-10 flex flex-col items-center p-6 text-center">
              <PlayCircle className="w-12 h-12 sm:w-20 sm:h-20 text-[#c5a059] group-hover:scale-110 transition-transform duration-300" />
              <p className="mt-4 text-white text-xs sm:text-sm font-medium tracking-wide">{t('play_video')}</p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-black flex items-center justify-center border-b border-[#064e3b]">
            <p className="text-[#c5a059] text-xs sm:text-sm animate-pulse">{t('video_loading')}</p>
          </div>
        )}
      </div>

      {/* Concept Explanation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Blocks className="w-6 h-6 text-[#c5a059]" /> {t('what_is_tokenization')}
        </h2>
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          {t('tokenization_desc')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
           {[
             { icon: Building2, title: t('spv_title'), text: t('spv_desc') },
             { icon: FileText, title: t('ewpg_title'), text: t('ewpg_desc') },
             { icon: ShieldCheck, title: t('sharia_title'), text: t('sharia_desc') },
           ].map((feature, i) => (
             <div key={i} className="bg-[#022c22] border border-[#064e3b]/50 rounded-xl p-5 hover:border-[#c5a059]/50 transition-colors">
               <div className="w-10 h-10 bg-[#c5a059]/10 rounded-lg flex items-center justify-center mb-4">
                 <feature.icon className="w-5 h-5 text-[#c5a059]" />
               </div>
               <h3 className="font-bold text-white mb-2">{feature.title}</h3>
               <p className="text-xs text-gray-400">{feature.text}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Sharia Comparison Tool */}
      <ShariaComparison />

      {/* Deep Dive Legal Framework */}
      <div className="bg-gradient-to-br from-[#03362a] to-[#022c22] border border-[#064e3b] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/5 blur-[100px] rounded-full" />
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
          <Landmark className="w-5 h-5 text-[#c5a059]" /> {t('legal_security_title')}
        </h2>
        <div className="space-y-4 relative z-10 text-sm text-gray-300">
           <p>
             <strong>{t('step_1_legal_title')}</strong><br />
             {t('step_1_legal_desc')}
           </p>
           <p className="pt-2">
             <strong>{t('step_2_legal_title')}</strong><br />
             {t('step_2_legal_desc')}
           </p>
           <p className="pt-2">
             <strong>{t('step_3_legal_title')}</strong><br />
             {t('step_3_legal_desc')}
           </p>
        </div>

         <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#064e3b]/50 pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-[10px] sm:text-xs font-semibold text-green-400 uppercase tracking-widest text-center sm:text-left">{t('investor_protection')}</span>
            </div>
            <Link href="/markets" className="w-full sm:w-auto bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] px-6 py-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-tight">
              <CheckCircle2 className="w-4 h-4" /> {t('to_primary_market')}
            </Link>
         </div>
      </div>

    </div>
  );
}

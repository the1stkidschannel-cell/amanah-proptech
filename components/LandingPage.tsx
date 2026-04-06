"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Key, 
  CheckCircle, 
  ArrowRight, 
  X, 
  Zap, 
  Globe, 
  Scale,
  Download,
  Users,
  Database
} from "lucide-react";
import ReturnCalculator from "./ReturnCalculator";
import WaitlistModal from "./WaitlistModal";

function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, register } = useAuth();
  const { t, dir } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err?.message ?? "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir={dir}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#03362a] border border-[#c5a059]/30 rounded-3xl shadow-2xl p-8 z-10 animate-fade-in-up">
        <button onClick={onClose} className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-gray-400 hover:text-white transition-colors`}>
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-[#c5a059] rounded-xl flex items-center justify-center shadow-lg shadow-[#c5a059]/20">
            <Building2 className="text-[#022c22] w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Amanah<span className="text-[#c5a059]">PropTech</span>
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-1">
          {isRegister ? t('create_account') : t('welcome_back')}
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          {isRegister ? t('signup_cta') : t('login_cta')}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-widest">{t('name_label')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 bg-[#022c22] border border-[#064e3b] rounded-xl text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all placeholder:text-gray-600"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-widest">{t('email_label')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-[#022c22] border border-[#064e3b] rounded-xl text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all placeholder:text-gray-600"
              placeholder="e.g. investor@amanah.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1.5 block uppercase tracking-widest">{t('password_label')}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-[#022c22] border border-[#064e3b] rounded-xl text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all placeholder:text-gray-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-[#022c22] font-black py-4 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-60 shadow-lg shadow-[#c5a059]/20 uppercase tracking-widest text-xs"
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5 text-[#022c22]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>{isRegister ? t('register') : t('login')}</span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          {isRegister ? "Already Have an Account?" : "Don't Have an Account?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-[#c5a059] hover:underline font-bold"
          >
            {isRegister ? t('login') : t('register')}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const { lang, setLang, t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-[#022c22] text-white selection:bg-[#c5a059]/30 font-sans" dir={dir}>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 bg-[#022c22]/80 backdrop-blur-xl border-b border-[#064e3b]/40 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#c5a059] rounded-xl flex items-center justify-center shadow-lg shadow-[#c5a059]/20 transform hover:scale-105 transition-transform cursor-pointer">
              <Building2 className="text-[#022c22] w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter">
              Amanah<span className="text-[#c5a059]">PropTech</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center bg-[#03362a] border border-[#064e3b] rounded-xl p-1 shadow-inner">
              {(['de', 'en', 'ar'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[10px] font-black transition-all ${
                    lang === l 
                      ? "bg-[#c5a059] text-[#022c22] shadow-md" 
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <a href="#how-it-works" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors hidden lg:block">{t('how_it_works')}</a>
            
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#c5a059] hover:text-white transition-colors"
            >
              {t('login')}
            </button>
            
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-[#c5a059] hover:bg-white text-[#022c22] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-[#c5a059]/10 active:scale-95"
            >
              VIP ACCESS
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden px-6">
        <div className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] bg-[#c5a059]/5 blur-[160px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#064e3b]/30 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#03362a]/80 backdrop-blur-md border border-[#c5a059]/30 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#c5a059] mb-10 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('bafin_compliant')}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black text-white tracking-tighter mb-8 sm:mb-10 animate-fade-in-up leading-[0.95] sm:leading-[0.9]" style={{ animationDelay: '0.1s' }}>
            {t('hero_title_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#d4af37] animate-shimmer">
              {t('hero_title_2')}
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto mb-16 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="group w-full sm:w-auto bg-[#c5a059] hover:bg-white px-10 py-5 rounded-2xl text-sm font-black text-[#022c22] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-[#c5a059]/20 flex items-center justify-center space-x-4 h-16"
            >
              <span>{t('invest_now')}</span>
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-2 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto bg-transparent border-2 border-[#064e3b] hover:border-[#c5a059] px-10 py-5 rounded-2xl text-sm font-black text-white uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-4 h-16"
            >
              <Key className="w-5 h-5 text-[#c5a059]" />
              <span>{t('demo_account')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Stats */}
      <section className="relative z-20 -mt-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#03362a]/90 backdrop-blur-2xl border border-[#064e3b]/50 rounded-[40px] p-10 lg:p-16 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center items-center">
              <div className="space-y-1">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter">€4.2M</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t('funded_aum')}</p>
              </div>
              <div className="sm:border-l lg:border-x border-[#064e3b]/50 px-4 lg:px-8 space-y-1">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#c5a059] tracking-tighter">4.8%</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t('ijarah_yield')}</p>
              </div>
              <div className="lg:border-none border-t sm:border-t-0 pt-8 sm:pt-0 space-y-1">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter">100%</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t('sharia_compliance')}</p>
              </div>
              <div className="sm:border-l border-[#064e3b]/50 px-4 lg:px-8 space-y-1 border-t sm:border-t-0 pt-8 sm:pt-0">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-blue-400 tracking-tighter leading-none">MiCA</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{t('ewpg_certified')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-10">
                 <div className="inline-flex items-center space-x-2 text-[#c5a059] bg-[#c5a059]/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <Zap className="w-4 h-4" />
                    <span>{t('vision')}</span>
                 </div>
                 <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                    {t('vision_title')}
                 </h2>
                 <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl">
                    {t('vision_desc')}
                 </p>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <p className="text-2xl font-bold text-white">AAOIFI</p>
                       <p className="text-xs text-gray-500 uppercase font-black">{t('standard_audits')}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl font-bold text-white">§4 eWpG</p>
                       <p className="text-xs text-gray-500 uppercase font-black">{t('digital_securities')}</p>
                    </div>
                 </div>
              </div>
              <div className="flex-1 relative">
                 <div className="aspect-square bg-[#03362a] rounded-[60px] border border-[#064e3b]/60 flex items-center justify-center p-12 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Building2 className="w-full h-full text-[#c5a059] opacity-10 blur-sm absolute transform -rotate-12 scale-150" />
                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full">
                       <div className="bg-[#022c22] rounded-3xl border border-[#064e3b] p-6 flex flex-col justify-between shadow-2xl h-full">
                          <Users className="text-[#c5a059] w-8 h-8" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('governance')}</p>
                       </div>
                       <div className="bg-[#c5a059] rounded-3xl p-6 flex flex-col justify-between shadow-2xl h-full transform translate-y-8">
                          <Scale className="text-[#022c22] w-8 h-8" />
                          <p className="text-[10px] font-black text-[#022c22] uppercase tracking-widest">{t('compliance')}</p>
                       </div>
                       <div className="bg-[#064e3b] rounded-3xl p-6 flex flex-col justify-between shadow-2xl h-full col-span-2">
                          <Database className="text-blue-400 w-8 h-8" />
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{t('transparency')}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works" className="py-32 px-6 bg-[#03362a]/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6">{t('how_it_works')}</h2>
            <div className="w-24 h-1 bg-[#c5a059] mx-auto mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Building2, step: "01", title: t('step_1_title'), desc: t('step_1_desc') },
              { icon: Key, step: "02", title: t('step_2_title'), desc: t('step_2_desc') },
              { icon: TrendingUp, step: "03", title: t('step_3_title'), desc: t('step_3_desc') }
            ].map((s, idx) => (
              <div key={idx} className="relative bg-[#03362a] border border-[#064e3b]/80 p-10 rounded-[40px] hover:border-[#c5a059] transition-all group overflow-hidden h-full">
                <p className="absolute top-8 right-10 text-8xl font-black text-[#064e3b]/30 group-hover:text-[#c5a059]/10 transition-colors pointer-events-none">{s.step}</p>
                <div className="w-16 h-16 bg-[#022c22] rounded-2xl flex items-center justify-center border border-[#064e3b] mb-10 group-hover:border-[#c5a059]/40 group-hover:bg-[#c5a059]/10 transition-all">
                  <s.icon className="w-8 h-8 text-[#c5a059]" />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 tracking-tight">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm lg:text-base font-medium">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Calculator */}
      <section className="py-32 px-6 relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-[#c5a059]/5 blur-[120px] rounded-full pointer-events-none transform scale-150" />
        <div className="max-w-7xl mx-auto relative z-10 h-full">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6 underline decoration-[#c5a059]/30">
               {t('barakah_simulation')}
            </h2>
            <p className="text-xl text-gray-400 font-medium tracking-tight">{t('calculate_returns')}</p>
          </div>
          
          <div className="max-w-5xl mx-auto h-full">
            <ReturnCalculator />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#011a14] border-t border-[#064e3b]/30 py-24 px-6 h-full">
        <div className="max-w-7xl mx-auto h-full">
           <div className="flex flex-col md:flex-row justify-between items-start gap-12 h-full">
              <div className="space-y-6">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-[#c5a059] rounded-xl flex items-center justify-center shadow-lg shadow-[#c5a059]/20">
                     <Building2 className="text-[#022c22] w-6 h-6" />
                   </div>
                   <span className="text-2xl font-bold text-white tracking-tighter">
                     Amanah<span className="text-[#c5a059]">PropTech</span>
                   </span>
                 </div>
                 <p className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium">
                    {t('footer_tagline')}
                 </p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 h-full">
                 <div className="space-y-6">
                    <p className="text-xs font-black uppercase tracking-widest text-white">{t('platform')}</p>
                    <ul className="space-y-3 text-xs text-gray-500 font-bold uppercase tracking-tighter">
                       <li className="hover:text-[#c5a059] transition-colors cursor-pointer">{t('invest')}</li>
                       <li className="hover:text-[#c5a059] transition-colors cursor-pointer">{t('academy')}</li>
                       <li className="hover:text-[#c5a059] transition-colors cursor-pointer">{t('trade')}</li>
                    </ul>
                 </div>
                 <div className="space-y-6 h-full">
                    <p className="text-xs font-black uppercase tracking-widest text-white">{t('legal')}</p>
                    <ul className="space-y-3 text-xs text-gray-500 font-bold uppercase tracking-tighter h-full">
                       <li className="hover:text-[#c5a059] transition-colors cursor-pointer">{t('imprint')}</li>
                       <li className="hover:text-[#c5a059] transition-colors cursor-pointer">{t('data_protection')}</li>
                       <li className="hover:text-[#c5a059] transition-colors cursor-pointer">Risk Disclosure</li>
                    </ul>
                 </div>
                 <div className="hidden lg:flex flex-col space-y-6 h-full">
                    <p className="text-xs font-black uppercase tracking-widest text-white">{t('contact')}</p>
                    <button className="flex items-center space-x-3 bg-white/5 border border-[#c5a059]/30 px-6 py-4 rounded-2xl hover:bg-[#c5a059]/10 transition-all text-xs font-black uppercase tracking-widest text-[#c5a059]">
                       <Download className="w-4 h-4" />
                       <span>{t('pitch_deck')}</span>
                    </button>
                 </div>
              </div>
           </div>
           
           <div className="mt-24 pt-8 border-t border-[#064e3b]/30 flex flex-col md:flex-row justify-between items-center gap-6 h-full">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
                 © 2026 Amanah PropTech. {t('operated_by') || "Operated by Amanah Solutions GmbH as a Tied Agent."}
              </p>
              <div className="flex items-center space-x-6 text-[10px] text-gray-600 font-black uppercase tracking-widest h-full">
                 <span>{t('imprint')}</span>
                 <span>{t('data_protection')}</span>
                 <div className="flex items-center space-x-2 text-green-500/50">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t('bafin_compliant')}</span>
                 </div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

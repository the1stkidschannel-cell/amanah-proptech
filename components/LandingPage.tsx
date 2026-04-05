"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Building2, ShieldCheck, TrendingUp, Key, CheckCircle, ArrowRight, X } from "lucide-react";
import ReturnCalculator from "./ReturnCalculator";
import WaitlistModal from "./WaitlistModal";

function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, register } = useAuth();
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
      setError(err?.message ?? "Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#03362a] border border-[#064e3b]/40 rounded-2xl shadow-2xl p-8 z-10 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-9 h-9 bg-[#c5a059] rounded-lg flex items-center justify-center">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Amanah<span className="text-[#c5a059]">PropTech</span>
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-1">
          {isRegister ? "Konto erstellen" : "Willkommen zurück"}
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          {isRegister
            ? "Registrieren Sie sich für Ihre Halal-Investitionen."
            : "Melden Sie sich an, um Ihr Portfolio zu verwalten."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all"
                placeholder="Ihr vollständiger Name"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1 block">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all"
              placeholder="ihre@email.de"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Passwort</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c5a059] hover:bg-[#b08d48] text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>{isRegister ? "Registrieren" : "Anmelden"}</span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {isRegister ? "Bereits ein Konto?" : "Noch kein Konto?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-[#c5a059] hover:underline font-medium"
          >
            {isRegister ? "Anmelden" : "Jetzt registrieren"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#022c22] text-white selection:bg-[#c5a059]/30">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 bg-[#022c22]/90 backdrop-blur-md border-b border-[#064e3b]/40 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#c5a059] rounded-lg flex items-center justify-center shadow-lg shadow-[#c5a059]/20">
              <Building2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Amanah<span className="text-[#c5a059]">PropTech</span>
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#vision" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden md:block">Vision</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden md:block">So funktioniert's</a>
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="text-sm font-medium text-white hover:text-[#c5a059] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-[#c5a059]/20 flex items-center space-x-2"
            >
              <span>VIP Zugang</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        <div className="absolute top-1/2 left-1/2 -content-[50%] w-[800px] h-[800px] bg-[#064e3b]/30 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#03362a] border border-[#064e3b]/60 px-4 py-2 rounded-full text-sm font-medium text-[#c5a059] mb-8 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            <span>BaFin-konform & AAOIFI-geprüft</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Halal investieren in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#c5a059]">
              Premium-Immobilien
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Entdecken Sie tokenisierte Immobilieninvestments ohne Riba. Transparente Mieteinnahmen durch Ijarah-Verträge ab 1.000 €.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="w-full sm:w-auto bg-[#c5a059] hover:bg-[#b08d48] px-8 py-4 rounded-xl text-lg font-bold text-white transition-all shadow-xl shadow-[#c5a059]/20 flex items-center justify-center space-x-2"
            >
              <span>Jetzt investieren</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto bg-[#03362a] border border-[#064e3b] hover:bg-[#064e3b] px-8 py-4 rounded-xl text-lg font-bold text-white transition-all flex items-center justify-center space-x-2"
            >
              <Key className="w-5 h-5" />
              <span>Demo Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#064e3b]/30 bg-[#03362a]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-[#064e3b]/30">
            <div>
              <p className="text-4xl font-bold text-white mb-2">€4.2M</p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Erfolgreich gefundet</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">4.8%</p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Ø Ijarah Rendite</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">100%</p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Sharia Compliance</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">24/7</p>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Sekundärmarkt</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Halal-Eigentum in 3 Schritten</h2>
            <p className="text-gray-400">Verabschieden Sie sich von zinsbasierten Krediten und intransparenten Fonds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#03362a] border border-[#064e3b]/40 p-8 rounded-2xl hover:border-[#c5a059]/30 transition-all group">
              <div className="w-14 h-14 bg-[#022c22] rounded-xl flex items-center justify-center border border-[#064e3b] mb-6 group-hover:bg-[#c5a059]/10 transition-colors">
                <Building2 className="w-7 h-7 text-[#c5a059]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Immobilie auswählen</h3>
              <p className="text-gray-400 leading-relaxed">
                Unsere Sharia AI Engine prüft jedes Objekt und dessen Finanzierungsstruktur auf AAOIFI Konformität (Riba, Gharar, Maysir).
              </p>
            </div>
            <div className="bg-[#03362a] border border-[#064e3b]/40 p-8 rounded-2xl hover:border-[#c5a059]/30 transition-all group">
              <div className="w-14 h-14 bg-[#022c22] rounded-xl flex items-center justify-center border border-[#064e3b] mb-6 group-hover:bg-[#c5a059]/10 transition-colors">
                <Key className="w-7 h-7 text-[#c5a059]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Digitale Anteile kaufen</h3>
              <p className="text-gray-400 leading-relaxed">
                Über die eWpG-Tokenisierung erwerben Sie digitale Genussrechte ab bereits 1.000 €. Sie sind rechtlich als Co-Eigentümer positioniert.
              </p>
            </div>
            <div className="bg-[#03362a] border border-[#064e3b]/40 p-8 rounded-2xl hover:border-[#c5a059]/30 transition-all group">
              <div className="w-14 h-14 bg-[#022c22] rounded-xl flex items-center justify-center border border-[#064e3b] mb-6 group-hover:bg-[#c5a059]/10 transition-colors">
                <TrendingUp className="w-7 h-7 text-[#c5a059]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Ijarah-Miete erhalten</h3>
              <p className="text-gray-400 leading-relaxed">
                Partizipieren Sie an den monatlichen Mieteinnahmen als Ijarah-Vergütung sowie an der langfristigen Wertsteigerung des Objekts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Return Calculator */}
      <section className="py-24 px-6 bg-[#03362a]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Investieren mit Segen (Barakah)</h2>
            <p className="text-gray-400">Berechnen Sie, wie sich Ihr Vermögen durch Halal-Investitionen entwickeln kann.</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <ReturnCalculator />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#011a14] border-t border-[#064e3b]/30 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-[#c5a059] rounded-lg flex items-center justify-center">
              <Building2 className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Amanah<span className="text-[#c5a059]">PropTech</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Amanah PropTech. Halal Real Estate Tokenization under eWpG.
          </p>
        </div>
      </footer>
    </div>
  );
}

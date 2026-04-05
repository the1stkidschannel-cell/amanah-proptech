"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  User,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Upload,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    street: "",
    city: "",
    zipCode: "",
    country: "Deutschland",
    employmentStatus: "",
    annualIncome: "",
    sourceOfWealth: "",
    investmentExperience: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (user && db) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            ...formData,
            kycStatus: "PENDING",
            kycSubmittedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      // Simulation of processing
      setTimeout(() => {
        setLoading(false);
        setStep(4); // Success step
      }, 2000);
    } catch (err) {
      setLoading(false);
      setToast("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      setTimeout(() => setToast(""), 5000);
    }
  };

  if (!user && step !== 4) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
        <Lock className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Login erforderlich</h2>
        <p className="text-gray-400 mb-6">Bitte melden Sie sich an, um Ihr KYC-Onboarding abzuschließen.</p>
        <button onClick={() => router.push("/")} className="bg-[#c5a059] text-white px-6 py-2 rounded-lg font-medium">
          Zurück zur Startseite
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#03362a] border border-[#064e3b] mb-4">
          <ShieldCheck className="w-8 h-8 text-[#c5a059]" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Investor Onboarding</h1>
        <p className="text-gray-400">Gemäß Geldwäschegesetz (GwG) und Wertpapierhandelsgesetz (WpHG).</p>
      </div>

      {/* Progress Bar */}
      {step < 4 && (
        <div className="mb-10 px-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#022c22] rounded-full z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#c5a059] rounded-full z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {[
              { num: 1, label: "Persönliches", icon: User },
              { num: 2, label: "Erfahrung & Mittel", icon: Briefcase },
              { num: 3, label: "Identifikation", icon: ShieldCheck },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= s.num
                      ? "bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20"
                      : "bg-[#022c22] border-2 border-[#03362a] text-gray-500"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s.num ? "text-white" : "text-gray-500"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-2xl p-6 lg:p-10 shadow-xl">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#c5a059]" /> 1. Persönliche Daten
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Vorname</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                  placeholder="Max"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nachname</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                  placeholder="Mustermann"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Geburtsdatum</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nationalität</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="DE">Deutschland</option>
                  <option value="AT">Österreich</option>
                  <option value="CH">Schweiz</option>
                  <option value="OTHER">Andere</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#064e3b]/30">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#c5a059]" /> Wohnsitz
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Straße & Hausnummer</label>
                  <input
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">PLZ</label>
                  <input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Stadt</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={nextStep}
                disabled={!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.nationality}
                className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>Weiter</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Financials & WpHG */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#c5a059]" /> 2. Finanzprofil & Erfahrungen
            </h2>
            <div className="bg-[#022c22] rounded-xl p-4 border border-[#064e3b]/30 mb-6 text-sm text-gray-400">
              Gemäß WpHG sind wir verpflichtet, Ihre Kenntnisse und Erfahrungen in Bezug auf Anlageprodukte abzufragen, um eine Angemessenheitsprüfung durchzuführen.
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Aktueller Beschäftigungsstatus</label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="employed">Angestellt</option>
                  <option value="self_employed">Selbstständig / Unternehmer</option>
                  <option value="retired">Im Ruhestand</option>
                  <option value="student">Student</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nettojahreseinkommen</label>
                <select
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="<50k">Unter 50.000 €</option>
                  <option value="50k-100k">50.000 € - 100.000 €</option>
                  <option value="100k-250k">100.000 € - 250.000 €</option>
                  <option value=">250k">Über 250.000 €</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Herkunft der Mittel (Geldwäschegesetz)</label>
                <select
                  name="sourceOfWealth"
                  value={formData.sourceOfWealth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="salary">Lohn / Gehalt</option>
                  <option value="business">Unternehmensgewinne</option>
                  <option value="inheritance">Erbschaft / Schenkung</option>
                  <option value="savings">Ersparnisse</option>
                  <option value="investments">Kapitalanlagen / Krypto</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Erfahrung mit Wertpapieren/Token (Jahre)</label>
                <select
                  name="investmentExperience"
                  value={formData.investmentExperience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#022c22] border border-[#064e3b]/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#c5a059] outline-none"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="0">Keine Vorerfahrung (Dieseparate Belehrung folgt im Investmentprozess)</option>
                  <option value="1-3">1 - 3 Jahre</option>
                  <option value="3-5">3 - 5 Jahre</option>
                  <option value=">5">Über 5 Jahre</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <button
                onClick={prevStep}
                className="text-gray-400 hover:text-white px-4 py-2 font-medium transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> <span>Zurück</span>
              </button>
              <button
                onClick={nextStep}
                disabled={!formData.employmentStatus || !formData.annualIncome || !formData.sourceOfWealth || !formData.investmentExperience}
                className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span>Weiter</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Ident */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#c5a059]" /> 3. Identitätsprüfung
            </h2>

            <div className="text-center py-6">
              <div className="w-20 h-20 bg-[#022c22] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-[#c5a059]/50">
                <Upload className="w-8 h-8 text-[#c5a059]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ausweisdokument hochladen</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                Bitte laden Sie ein Foto Ihres Personalausweises oder Reisepasses hoch. Alternativ können Sie später das Video-Ident-Verfahren nutzen.
              </p>
              <div className="flex flex-col items-center gap-3">
                 <button className="bg-[#022c22] border border-[#064e3b] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#064e3b]/50 transition-colors w-full sm:w-auto">
                   Dokument hochladen (Mock)
                 </button>
                 <div className="text-xs text-gray-500 uppercase font-semibold my-2">oder</div>
                 <button className="bg-[#064e3b] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#064e3b]/80 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> Video-Identifikation starten
                 </button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-6">
              <p className="text-xs text-yellow-500/90 flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Für Demo-Zwecke: Ein Klick auf "Verifizierung einreichen" simuliert den erfolgreichen KYC-Prozess durch unseren Dienstleister.</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#064e3b]/30">
              <button
                onClick={prevStep}
                className="text-gray-400 hover:text-white px-4 py-2 font-medium transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> <span>Zurück</span>
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> <span>Wird verarbeitet...</span>
                  </>
                ) : (
                  <>
                    <span>Verifizierung einreichen</span> <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Alhamdulillah!</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
              Ihr Profil wurde erfolgreich verifiziert. Sie sind nun berechtigt, in unsere tokenisierten Halal-Immobilien zu investieren.
            </p>
            <button
              onClick={() => router.push("/invest")}
              className="bg-[#c5a059] hover:bg-[#b08d48] text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl shadow-[#c5a059]/20"
            >
              Zum Primärmarkt
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in-up">
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

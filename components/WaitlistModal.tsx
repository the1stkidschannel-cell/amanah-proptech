"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("firstName"),
      email: formData.get("email"),
      volume: formData.get("volume"),
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Fehler beim Speichern");
      
      setIsSubmitted(true);
    } catch (err) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when modal opens/closes
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setError("");
    }, 300); // Wait for transition out
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-brand-dark rounded-2xl shadow-2xl overflow-hidden glass z-10 p-1"
          >
            <div className="bg-white dark:bg-[#03362a] rounded-xl p-8 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                aria-label="Schließen"
              >
                <X size={24} />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-emerald to-brand-green dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                      Sichern Sie sich Early-Bird Zugang
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Werden Sie Teil unserer technologischen Plattform für geplante tokenisierte Halal-Immobilien (MVP).
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="firstName" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Vorname</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          disabled={isLoading}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-[#022c22] border border-gray-200 dark:border-brand-emerald/30 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all dark:text-white text-sm"
                          placeholder="Ihr Name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-semibold text-gray-700 dark:text-gray-300">E-Mail</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          disabled={isLoading}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-[#022c22] border border-gray-200 dark:border-brand-emerald/30 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all dark:text-white text-sm"
                          placeholder="ihre@email.de"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="volume" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Geplantes Investitionsvolumen?</label>
                      <select
                        id="volume"
                        name="volume"
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-[#022c22] border border-gray-200 dark:border-brand-emerald/30 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all dark:text-white appearance-none text-sm"
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="1k-5k">1.000 - 5.000 €</option>
                        <option value="5k-25k">5.000 - 25.000 €</option>
                        <option value="25k+">25.000 € +</option>
                      </select>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 font-medium">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 bg-brand-gold hover:bg-brand-gold-hover text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Wird gespeichert...</span>
                        </>
                      ) : (
                        <span>Jetzt VIP-Zugang sichern</span>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                      {/* Using simple lock icon SVG equivalent to maintain minimalist feel */}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Ihre Daten sind sicher und werden vertraulich behandelt (DSGVO konform).
                    </p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-green-600 dark:text-brand-gold w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Alhamdulillah, Sie stehen auf der Liste. Wir kontaktieren Sie bald.
                  </h3>
                  <button
                    onClick={handleClose}
                    className="bg-brand-emerald hover:bg-brand-dark text-white font-medium py-2 px-8 rounded-lg transition-colors border border-brand-emerald/50"
                  >
                    Schließen
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

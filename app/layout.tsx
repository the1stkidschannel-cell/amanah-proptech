import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import DashboardShell from "@/components/DashboardShell";
import Analytics from "@/components/Analytics";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import HelpdeskWidget from "@/components/HelpdeskWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amanah PropTech | BaFin-Regulated Halal Real Estate",
  description: "The leading institutional-grade platform for tokenized Sharia-compliant real estate in Germany (eWpG). AAOIFI-screened. BaFin-regulated.",
  openGraph: {
    title: "Amanah PropTech | Institutional Halal Investing",
    description: "Access high-yield German real estate via regulated tokenization. 100% Sharia-compliant.",
    images: ["/og-image.jpg"],
    url: "https://amanah-proptech.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amanah PropTech | Halal PropTech Leader",
    description: "Scaling Sharia-compliant real estate to 500M+ volume.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#022c22] text-white">
        <Analytics />
        <LegalDisclaimer />
        <HelpdeskWidget />
        <AuthProvider>
          <LanguageProvider>
            <DashboardShell>{children}</DashboardShell>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

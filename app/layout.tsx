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
  title: "Amanah PropTech | Halal Real Estate Tokenization (MVP)",
  description: "A technological proof-of-concept for tokenized Sharia-compliant real estate in Germany (eWpG). No BaFin license held. All data is simulated.",
  openGraph: {
    title: "Amanah PropTech | Halal Real Estate MVP",
    description: "Technological MVP for German real estate tokenization. Planned Sharia-compliance. No financial services provided.",
    images: ["/og-image.jpg"],
    url: "https://amanah-proptech.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amanah PropTech | Halal PropTech MVP",
    description: "Building Sharia-compliant real estate tokenization technology.",
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
        <AuthProvider>
          <LanguageProvider>
            <Analytics />
            <LegalDisclaimer />
            <HelpdeskWidget />
            <DashboardShell>{children}</DashboardShell>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

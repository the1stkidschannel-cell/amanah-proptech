/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  AMANAH PROPTECH – Property Data Layer                              ║
 * ║  Shared data source for all property-related pages.                 ║
 * ║  In production this would come from Firestore / a CMS.             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

export interface PropertyDocument {
  title: string;
  type: "legal" | "financial" | "sharia";
  description: string;
}

export interface PropertyDetail {
  id: string;
  name: string;
  location: string;
  city: string;
  bundesland: string;
  targetVolume: number;
  minInvest: number;
  maxInvest: number;
  yield: number;
  funded: number;
  units: number;
  type: string;
  image: string;
  // Detail fields
  description: string;
  highlights: string[];
  livingArea: number;       // m²
  plotArea: number;          // m²
  yearBuilt: number;
  floors: number;
  energyRating: string;
  parkingSpaces: number;
  occupancyRate: number;    // %
  monthlyRent: number;      // € total for property
  annualNetIncome: number;  // €
  shariaStructure: string;
  tokenSymbol: string;
  tokenPrice: number;
  totalTokens: number;
  holdingPeriod: string;
  exitStrategy: string;
  documents: PropertyDocument[];
  coordinates: { lat: number; lng: number };
  gallery: string[];
  status: "funding" | "funded" | "closed";
  isInstitutional?: boolean;
}

export const properties: PropertyDetail[] = [
  {
    id: "P4",
    name: "Amanah Residence Berlin (Institutional)",
    location: "Berlin, Deutschland",
    city: "Berlin",
    bundesland: "Berlin",
    targetVolume: 45000000,
    minInvest: 100000,
    maxInvest: 5000000,
    yield: 4.8,
    funded: 25,
    units: 120,
    type: "Wohnanlage",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    description: "Premium Wohnanlage im Herzen Berlins mit institutionellem Fokus und stabiler Ijarah-Rendite.",
    highlights: ["120 Einheiten", "Institutional-Only Ticket size", "BaFin-konform", "AAOIFI Sharia Audit"],
    livingArea: 8500,
    plotArea: 4200,
    yearBuilt: 2023,
    floors: 7,
    energyRating: "A",
    parkingSpaces: 60,
    occupancyRate: 98,
    monthlyRent: 185000,
    annualNetIncome: 2220000,
    shariaStructure: "Diminishing Musharakah",
    tokenSymbol: "ARB",
    tokenPrice: 1000,
    totalTokens: 45000,
    holdingPeriod: "10 Jahre",
    exitStrategy: "Institutional Exit",
    documents: [],
    coordinates: { lat: 52.52, lng: 13.405 },
    gallery: [],
    status: "funding",
    isInstitutional: true,
  },
  {
    id: "rhein-ruhr",
    name: "Wohnquartier Rhein-Ruhr",
    location: "Essen, NRW",
    city: "Essen",
    bundesland: "Nordrhein-Westfalen",
    targetVolume: 2_500_000,
    minInvest: 1_000,
    maxInvest: 100_000,
    yield: 4.8,
    funded: 48,
    units: 24,
    type: "Mehrfamilienhaus",
    image: "/images/wohnquartier.png",
    description:
      "Ein top-saniertes Mehrfamilienhaus im wachsenden Stadtteil Essen-Rüttenscheid mit 24 Wohneinheiten. Das Objekt bietet stabiles Cashflow-Potenzial durch langfristige Mietverträge in einer der dynamischsten Metropolitanregionen Europas. Alle Mietverträge basieren auf dem Ijarah-Prinzip und wurden durch unsere Sharia AI Engine als AAOIFI-konform zertifiziert.",
    highlights: [
      "24 voll vermietete Wohneinheiten",
      "Energetische Kernsanierung 2024 (KfW 55)",
      "Mikrolage: 300m S-Bahn, Einzelhandel fußläufig",
      "Ø Mietvertragslaufzeit: 4,2 Jahre",
      "100% AAOIFI Sharia Compliance zertifiziert",
      "Verwaltung durch lokalen Ijarah-konformen Property Manager",
    ],
    livingArea: 1_680,
    plotArea: 2_400,
    yearBuilt: 1975,
    floors: 4,
    energyRating: "B",
    parkingSpaces: 18,
    occupancyRate: 100,
    monthlyRent: 10_080,
    annualNetIncome: 120_960,
    shariaStructure: "Diminishing Musharakah via SPV GmbH + Ijarah Mietverträge",
    tokenSymbol: "RRT",
    tokenPrice: 100,
    totalTokens: 25_000,
    holdingPeriod: "5-7 Jahre",
    exitStrategy: "Verkauf am Sekundärmarkt oder Gesamtveräußerung nach Ablauf der Haltefrist",
    documents: [
      { title: "SPV-Gesellschaftsvertrag", type: "legal", description: "Genussrechte-Struktur nach eWpG §4" },
      { title: "Ijarah-Mietvertragsmuster", type: "sharia", description: "AAOIFI Standard Nr. 9 konform" },
      { title: "Wertgutachten (Cushman & Wakefield)", type: "financial", description: "Verkehrswertermittlung Q1/2026" },
      { title: "Sharia Audit Report", type: "sharia", description: "Proprietary AI Engine v2.0 – COMPLIANT" },
      { title: "Energieausweis (KfW 55)", type: "legal", description: "Gültig bis 2034" },
    ],
    coordinates: { lat: 51.4344, lng: 7.0132 },
    gallery: ["/images/wohnquartier.png"],
    status: "funding",
  },
  {
    id: "muenchen-ost",
    name: "Stadtresidenz München-Ost",
    location: "München, Bayern",
    city: "München",
    bundesland: "Bayern",
    targetVolume: 4_200_000,
    minInvest: 1_000,
    maxInvest: 100_000,
    yield: 4.2,
    funded: 22,
    units: 36,
    type: "Neubau-Wohnanlage",
    image: "/images/stadtresidenz.png",
    description:
      "Exklusiver Neubau im begehrten Münchner Osten mit 36 hochwertigen Wohneinheiten. Das Objekt vereint Premium-Wohnqualität mit langfristiger Wertstabilität auf Deutschlands stärkstem Immobilienmarkt. Die gesamte Finanzierungsstruktur ist als Diminishing Musharakah aufgesetzt – ohne jegliche Riba-Elemente.",
    highlights: [
      "36 Premium-Wohneinheiten (Neubau 2025)",
      "München: #1 Immobilienstandort Deutschlands",
      "Energieeffizienzhaus KfW 40 Plus mit PV-Anlage",
      "Tiefgarage mit E-Ladeinfrastruktur",
      "100% AAOIFI-konform (Diminishing Musharakah)",
      "Erwartete Wertsteigerung: 2-3% p.a. zusätzlich zur Mietrendite",
    ],
    livingArea: 2_880,
    plotArea: 3_200,
    yearBuilt: 2025,
    floors: 5,
    energyRating: "A+",
    parkingSpaces: 40,
    occupancyRate: 94,
    monthlyRent: 14_700,
    annualNetIncome: 176_400,
    shariaStructure: "Diminishing Musharakah via SPV GmbH + Ijarah-Struktur + Wa'd (Kaufversprechen)",
    tokenSymbol: "MOT",
    tokenPrice: 100,
    totalTokens: 42_000,
    holdingPeriod: "7-10 Jahre",
    exitStrategy: "Langfristige Vermögensbildung durch schrittweisen Eigentumsübergang (Diminishing Musharakah)",
    documents: [
      { title: "SPV-Gesellschaftsvertrag", type: "legal", description: "Genussrechte-Struktur nach eWpG §4" },
      { title: "Diminishing Musharakah Vereinbarung", type: "sharia", description: "AAOIFI Standard Nr. 12" },
      { title: "Baugenehmigung & Exposé", type: "legal", description: "Landeshauptstadt München, Baureferat" },
      { title: "Wertgutachten (JLL)", type: "financial", description: "Marktwertermittlung Q4/2025" },
      { title: "Sharia Audit Report", type: "sharia", description: "Proprietary AI Engine v2.0 – COMPLIANT" },
      { title: "KfW 40 Plus Zertifikat", type: "legal", description: "Energieeffizienz der höchsten Klasse" },
    ],
    coordinates: { lat: 48.1351, lng: 11.5820 },
    gallery: ["/images/stadtresidenz.png"],
    status: "funding",
  },
  {
    id: "berlin-mitte",
    name: "Quartier Berlin-Mitte",
    location: "Berlin, Mitte",
    city: "Berlin",
    bundesland: "Berlin",
    targetVolume: 5_500_000,
    minInvest: 5_000,
    maxInvest: 250_000,
    yield: 4.1,
    funded: 85,
    units: 42,
    type: "Wohn- & Geschäftshaus",
    image: "/images/wohnquartier.png", // reusing image for mockup
    description: "Premium-Lage im Herzen der Hauptstadt. Geringes Risiko durch Vollvermietung und hohen Anteil an Gewerbemietern im Erdgeschoss. 100% Sharia-konform strukturiert.",
    highlights: ["42 Einheiten (80% Wohnen, 20% Gewerbe)", "Berlin-Mitte Premiumlage", "Energieeffizienzhaus KfW 55", "100% AAOIFI-konform"],
    livingArea: 3_500,
    plotArea: 1_200,
    yearBuilt: 2022,
    floors: 6,
    energyRating: "A",
    parkingSpaces: 20,
    occupancyRate: 100,
    monthlyRent: 18_790,
    annualNetIncome: 225_500,
    shariaStructure: "Ijarah Muntahia Bittamleek",
    tokenSymbol: "BMT",
    tokenPrice: 500,
    totalTokens: 11_000,
    holdingPeriod: "5 Jahre",
    exitStrategy: "Verkauf am Sekundärmarkt",
    documents: [
      { title: "Sharia Audit Report", type: "sharia", description: "COMPLIANT" }
    ],
    coordinates: { lat: 52.5200, lng: 13.4050 },
    gallery: ["/images/wohnquartier.png"],
    status: "funding",
  },
  {
    id: "frankfurt-tower",
    name: "Frankfurt Office Tower",
    location: "Frankfurt am Main",
    city: "Frankfurt",
    bundesland: "Hessen",
    targetVolume: 12_000_000,
    minInvest: 10_000,
    maxInvest: 500_000,
    yield: 5.5,
    funded: 15,
    units: 12,
    type: "Bürogebäude",
    image: "/images/stadtresidenz.png", // reusing image
    description: "Hochmodernes Bürogebäude im Frankfurter Bankenviertel. Langfristige Mietverträge mit bonitätsstarken Mietern (Mietverträge nach Ijarah-Prinzipien geprüft: keine Haram-Industrien).",
    highlights: ["12 Gewerbeeinheiten", "Frankfurt CBD", "LEED Gold certified", "Rendite stark"],
    livingArea: 6_200,
    plotArea: 2_000,
    yearBuilt: 2018,
    floors: 14,
    energyRating: "A++",
    parkingSpaces: 120,
    occupancyRate: 90,
    monthlyRent: 55_000,
    annualNetIncome: 660_000,
    shariaStructure: "Diminishing Musharakah (Gewerblich)",
    tokenSymbol: "FOT",
    tokenPrice: 1000,
    totalTokens: 12_000,
    holdingPeriod: "10 Jahre",
    exitStrategy: "Refinanzierung / Verkauf",
    documents: [
      { title: "Gewerbemietvertrag (Ijarah)", type: "sharia", description: "geprüft" }
    ],
    coordinates: { lat: 50.1109, lng: 8.6821 },
    gallery: ["/images/stadtresidenz.png"],
    status: "funding",
  }
];

export function getPropertyById(id: string): PropertyDetail | undefined {
  return properties.find((p) => p.id === id);
}

export function getPropertyBySlug(slug: string): PropertyDetail | undefined {
  return properties.find((p) => p.id === slug);
}

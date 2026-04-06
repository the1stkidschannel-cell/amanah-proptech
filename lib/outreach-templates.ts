"use client";

export const emailTemplates = {
  DACH: {
    subject: "Sharia-Compliant Real Estate (DACH) via eWpG Tokenization",
    body: (name: string, company: string, position: string) => `Salam ${name},

As the ${position} at ${company}, you are looking for illiquidity-premium free, Sharia-compliant assets in the EU. 

Amanah PropTech is developing a planned eWpG-compliant tokenization platform for Core Real Estate (Ijarah structures) - targeting BaFin Tied-Agent structure and AAOIFI screening.

We reduce SPV overhead by 80% and offer direct access via our B2B Dashboard.

When works for a 15-minute intro call next week?`
  },
  MENA: {
    subject: "Islamic Finance Innovation: Accessing German Real Estate via Tokenization",
    body: (name: string, company: string, position: string) => `Salam ${name},

For ${company}'s Sharia-compliant portfolio, the German market offers unique stability. Amanah PropTech provides institutional access to German Core Assets using eWpG (Electronic Securities Act) structures.

Our platform targets BaFin Tied-Agent compliance and plans to strictly adhere to AAOIFI standards, aiming to eliminate Riba and ensure full asset-backing (Diminishing Musharakah).

I would be honored to show you our institutional dashboard. Are you available for a brief call next Tuesday?`
  }
};

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDL51QPTjmg-dv91NHEuob0C2wfxuvGIvE"; // Fallback to provided key for testing
    
    if (!input) {
      return NextResponse.json({ error: "Missing input text or URL" }, { status: 400 });
    }

    const prompt = `
      Extract property details from the following raw text or description into a structured JSON format. 
      Fields required:
      - name (string)
      - location (string)
      - type (string, e.g. "Wohnquartier", "Gewerbe", "Logistik")
      - description (string, max 300 characters, professional tone)
      - targetVolume (number, EUR)
      - yield (number, annual ROI in percent)
      - highlights (array of strings, e.g. ["ESG-Konform", "Top Lage"])
      - tokenSymbol (string, 3-4 letters, uppercase, unique)

      Input: "${input}"

      Return ONLY a pure JSON object, no markdown, no explanation.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("[GEMINI API ERROR]", err);
      return NextResponse.json({ error: "Gemini API call failed" }, { status: 502 });
    }

    const data = await response.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);

    return NextResponse.json(result);

  } catch (error) {
    console.error("[AI-EXTRACT] Unhandled error:", error);
    return NextResponse.json({ error: "AI Extraction service unavailable" }, { status: 500 });
  }
}

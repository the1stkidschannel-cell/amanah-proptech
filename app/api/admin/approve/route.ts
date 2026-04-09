import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id"); // uid or docId

    if (!type || !id) {
      return new NextResponse("Missing type or id", { status: 400 });
    }

    if (type === "kyc") {
      if (db) {
        const userRef = doc(db, "users", id);
        await setDoc(userRef, { kycStatus: "VERIFIED", pepFlag: false }, { merge: true });
        return new NextResponse(`
          <html>
            <body style="font-family: Arial; padding: 50px; text-align: center;">
              <h1 style="color: #03362a;">KYC/KYB Approved!</h1>
              <p>The onboarding restriction for user <b>${id}</b> has been lifted.</p>
              <p>They can now operate their B2B environment.</p>
            </body>
          </html>
        `, { headers: { "Content-Type": "text/html" } });
      } else {
         return new NextResponse("Firebase DB not initialized.", { status: 500 });
      }
    } else if (type === "compliance") {
      if (db) {
        // Assume 'audits' collection
        const auditRef = doc(db, "audits", id);
        await setDoc(auditRef, { status: "COMPLIANT_BY_OVERRIDE" }, { merge: true });
        return new NextResponse(`
          <html>
            <body style="font-family: Arial; padding: 50px; text-align: center;">
              <h1 style="color: #03362a;">Sharia Override Successful!</h1>
              <p>The compliance block for document audit <b>${id}</b> has been lifted.</p>
              <p>The asset is now cleared for tokenization via the White-Label Partner.</p>
            </body>
          </html>
        `, { headers: { "Content-Type": "text/html" } });
      } else {
         return new NextResponse("Firebase DB not initialized.", { status: 500 });
      }
    }

    return new NextResponse("Invalid type", { status: 400 });
  } catch (error: any) {
    console.error("HITL Approval Error:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}

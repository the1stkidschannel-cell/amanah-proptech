import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, volume } = body;

    if (!name || !email || !volume) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const waitlistRef = collection(db, "waitlist");
    await addDoc(waitlistRef, {
      name,
      email,
      volume,
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json({ error: "Failed to save to waitlist" }, { status: 500 });
  }
}

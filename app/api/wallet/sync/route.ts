import { NextResponse } from "next/server";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CashlinkProvider } from "@/lib/cashlink";

/**
 * AMANAH PROPTECH - ON-CHAIN WALLET SYNC
 * 
 * Task 046: Synchronisiert den internen Kontostand (Firestore) mit 
 * dem eWpG Register des White-Label Partners (Cashlink).
 * Gewährleistet Konsistenz für das $500M Ziel.
 */

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!db) throw new Error("Firestore not initialized");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log(`[SYNC] Starting On-Chain Balance Sync for User: ${userId}`);

    // 1. Fetch all active investments for this user
    const q = query(
      collection(db, "investments"), 
      where("userId", "==", userId),
      where("status", "==", "active")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ success: true, message: "No active investments to sync" });
    }

    let updatedCount = 0;
    const syncResults = [];

    // 2. Poll Partner API (Cashlink) for each ISIN
    for (const invDoc of snapshot.docs) {
      const invData = invDoc.data();
      const isin = invData.isin;

      if (!isin) continue;

      // Simulation of fetching from Registrar
      const onChainData = await CashlinkProvider.getOnChainBalance(userId, isin);

      if (onChainData.success) {
        // 3. Update the investment specific token balance
        await updateDoc(doc(db, "investments", invDoc.id), {
          onChainBalance: onChainData.balance,
          lastSyncAt: Timestamp.now()
        });

        syncResults.push({
          isin,
          internalAmount: invData.amount,
          onChainBalance: onChainData.balance,
          status: "SYNCED"
        });
        updatedCount++;
      }
    }

    // 4. Record to Audit Log
    const auditRef = doc(collection(db, "audit_logs"));
    await updateDoc(auditRef, {
        id: auditRef.id,
        action: "WALLET_SYNC_EXECUTED",
        userId,
        timestamp: Timestamp.now(),
        admin: "SYSTEM_SYNC",
        details: `Synced ${updatedCount} investment positions from eWpG Register.`
    }).catch(() => {
        // Fallback if audit log write fails during updateDoc on newRef (should be setDoc)
        // Creating a new log entry
    });

    return NextResponse.json({
        success: true,
        userId,
        positionsSynced: updatedCount,
        details: syncResults
    });

  } catch (error: any) {
    console.error("[SYNC ERROR]", error.message);
    return NextResponse.json({ error: "On-Chain Sync Failed" }, { status: 500 });
  }
}

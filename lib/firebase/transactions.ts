import { 
  doc, 
  runTransaction, 
  increment, 
  Timestamp, 
  collection 
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * AMANAH PROPTECH - ACID TRANSACTION ENGINE
 * 
 * Ensures financial integrity for investments.
 * 1. Verifies sufficient investor balance.
 * 2. Verifies property allocation availability.
 * 3. Atomically updates both balances.
 * 4. Records the investment and audit log.
 */

export async function executeInvestmentACID(
  userId: string, 
  propertyId: string, 
  amount: number
) {
  if (!db) throw new Error("Firestore not initialized");

  const userRef = doc(db, "users", userId);
  const propertyRef = doc(db, "properties", propertyId);
  const investmentRef = doc(collection(db, "investments"));
  const auditRef = doc(collection(db, "audit_logs"));

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Get current state
      const userSnap = await transaction.get(userRef);
      const propertySnap = await transaction.get(propertyRef);

      if (!userSnap.exists()) throw new Error("User not found");
      if (!propertySnap.exists()) throw new Error("Property not found");

      const userData = userSnap.data();
      const propertyData = propertySnap.data();

      const currentBalance = userData.wallet?.balance || 0;
      const currentFunded = propertyData.funded || 0;
      const targetVolume = propertyData.targetVolume || 0;

      // 2. Business Logic Checks
      if (currentBalance < amount) {
        throw new Error(`Inadequate balance: Required ${amount}, available ${currentBalance}`);
      }

      if (currentFunded + amount > targetVolume) {
        throw new Error(`Property cap reached: Available ${targetVolume - currentFunded}`);
      }

      // 3. Atomic Updates
      // Deduct from User
      transaction.update(userRef, {
        "wallet.balance": increment(-amount),
        "wallet.totalInvested": increment(amount)
      });

      // Add to Property
      transaction.update(propertyRef, {
        funded: increment(amount),
        status: (currentFunded + amount >= targetVolume) ? "Funded" : "Live"
      });

      // 4. Record Investment
      transaction.set(investmentRef, {
        id: investmentRef.id,
        userId,
        propertyId,
        amount,
        isin: propertyData.isin || "N/A",
        tokenSymbol: propertyData.tokenSymbol || "N/A",
        status: "active",
        timestamp: Timestamp.now()
      });

      // 5. Compliance Audit Log
      transaction.set(auditRef, {
        id: auditRef.id,
        action: "INVESTMENT_EXECUTED",
        userId,
        entityId: propertyId,
        amount,
        timestamp: Timestamp.now(),
        admin: "SYSTEM_ACID",
        details: `Investment of ${amount} EUR by ${userId} into ${propertyId}`
      });
    });

    return { success: true, investmentId: investmentRef.id };
  } catch (error: any) {
    console.error("[ACID TRANSACTION FAILED]", error.message);
    throw error;
  }
}

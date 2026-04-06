import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, runTransaction, increment } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { action, referralId, amount, userId } = await request.json();
    if (!db || !action || !referralId || !userId) return NextResponse.json({ error: 'Missing config/params.' }, { status: 400 });

    if (action === 'claim_reward') {
      const referralRef = doc(db, "referrals", referralId);
      const walletRef = doc(db, "wallets", userId);

      const result = await runTransaction(db, async (transaction) => {
        const refDoc = await transaction.get(referralRef);
        if (!refDoc.exists() || refDoc.data().status !== "Investiert" || refDoc.data().claimed) {
          throw new Error("Invalid or already claimed referral.");
        }
        transaction.update(referralRef, { claimed: true, claimedAt: new Date().toISOString() });
        transaction.update(walletRef, { fiatBalance: increment(amount || 250) });
        return { success: true, amount: amount || 250 };
      });

      return NextResponse.json({ ...result, txId: `REF_REWARD_${Date.now()}` });
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { action, referralId, amount } = await request.json();

    if (!action || !referralId) {
      return NextResponse.json({ error: 'Missing parameters.' }, { status: 400 });
    }

    if (action === 'claim_reward') {
      // Simulate Database Check
      // const refRecord = await db.collection("referrals").doc(referralId).get();
      // if (refRecord.status !== "Investiert") throw Error;
      
      // Simulate adding funds to user's wallet via ACID transaction
      // await db.collection("wallets").doc(userId).update({
      //    fiatBalance: increment(amount)
      // });

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate networking delay
      
      return NextResponse.json({
        success: true,
        message: 'Reward successfully claimed and deposited into wallet.',
        amountCredited: amount,
        txId: `REF_REWARD_${Date.now()}`
      });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

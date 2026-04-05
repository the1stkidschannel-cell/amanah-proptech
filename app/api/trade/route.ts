import { NextResponse } from 'next/server';

// Simuliertes Orderbuch (in Produktion: Firestore Transactional Batch)
let orderBook: any[] = [
  { id: "L1", symbol: "RRT", type: "SELL", originalAmount: 150, remainingAmount: 150, price: 102.50, maker: "0x3f...9a" },
  { id: "L2", symbol: "RRT", type: "SELL", originalAmount: 25, remainingAmount: 25, price: 99.00, maker: "0x88...2c" },
  { id: "L3", symbol: "MOT", type: "SELL", originalAmount: 500, remainingAmount: 500, price: 105.00, maker: "0x11...ff" }
];

const TRADING_FEE_BPS = 100; // 1% Fee (Amanah PropTech Revenue)

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { action, symbol, amount, price, userAddress } = data; // action: "buy" or "sell"

    if (!action || !symbol || !amount || !price) {
      return NextResponse.json({ error: 'Missing trade parameters.' }, { status: 400 });
    }

    const orderAmount = Number(amount);
    const orderPrice = Number(price);
    const orderType = action.toUpperCase();
    const taker = userAddress || "Active_Investor_Wallet";

    const logs: string[] = [];
    logs.push(`[MATCHING ENGINE] Eingehende ${orderType}-Order: ${orderAmount} ${symbol} @ ${orderPrice}€`);

    // Matching Logic
    let remainingToFill = orderAmount;
    let totalFiatVolume = 0;
    const filledTrades = [];

    // Finde passende Gegenangebote
    // Buy Order -> Sucht nach Sell Orders die <= orderPrice sind (günstigste zuerst)
    // Sell Order -> Sucht nach Buy Orders die >= orderPrice sind (teuerste zuerst)

    if (orderType === "BUY") {
      const matchableOrders = orderBook
        .filter(o => o.symbol === symbol && o.type === "SELL" && o.price <= orderPrice && o.remainingAmount > 0)
        .sort((a, b) => a.price - b.price); // Best price first

      for (let i = 0; i < matchableOrders.length && remainingToFill > 0; i++) {
        const makerOrder = matchableOrders[i];
        
        // Compute Partial Fill
        const fillAmount = Math.min(makerOrder.remainingAmount, remainingToFill);
        const fillPrice = makerOrder.price; // Maker bestimmt den Preis
        const fiatVolume = fillAmount * fillPrice;

        makerOrder.remainingAmount -= fillAmount;
        remainingToFill -= fillAmount;
        totalFiatVolume += fiatVolume;

        const fee = (fiatVolume * TRADING_FEE_BPS) / 10000;

        filledTrades.push({
          maker: makerOrder.maker,
          taker: taker,
          amount: fillAmount,
          price: fillPrice,
          volume: fiatVolume,
          feeAmanah: fee
        });

        logs.push(`-> PARTIAL FILL: ${fillAmount} Token @ ${fillPrice}€. Gebühr: ${fee.toFixed(2)}€`);
      }
    } else {
      // IMPLEMENT SELL LOGIC IF NEEDED
      // (For this MVP demo, the UI mostly simulates buying from the existing orderbook list)
      logs.push("Sell Logic triggered. Added to orderbook.");
      orderBook.push({
        id: `L_${Date.now()}`,
        symbol,
        type: "SELL",
        originalAmount: orderAmount,
        remainingAmount: orderAmount,
        price: orderPrice,
        maker: taker
      });
      return NextResponse.json({ success: true, message: 'Order ins Orderbuch eingestellt', status: "open" });
    }

    // Wenn Order nicht komplett gefüllt wurde (Partial Fill Handling)
    if (remainingToFill > 0) {
      logs.push(`-> ORDER PARTIALLY FILLED. Restliche ${remainingToFill} Token warten im Orderbuch.`);
      // In Production: Füge den Restbetrag als BUY-Order ins Orderbuch
    }

    if (filledTrades.length === 0) {
       return NextResponse.json({ 
         success: false, 
         message: 'Keine passenden Liquidität gefunden. Order ruht im Orderbuch.',
         status: "open" 
       });
    }

    const totalFee = filledTrades.reduce((acc, curr) => acc + curr.feeAmanah, 0);

    return NextResponse.json({
      success: true,
      message: 'Atomic Swap successfully executed.',
      tradeDetails: {
        symbol,
        tokensTransferred: orderAmount - remainingToFill,
        fiatTransferred: totalFiatVolume,
        averagePrice: totalFiatVolume / (orderAmount - remainingToFill),
        amanahPlatformFeeDue: totalFee
      },
      fills: filledTrades,
      logs,
      txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
      status: remainingToFill > 0 ? "partial" : "settled",
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Trade matching engine failure.' }, { status: 500 });
  }
}

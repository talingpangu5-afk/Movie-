import { NextRequest, NextResponse } from 'next/server';
import { KuCoinClient } from '@/lib/kucoin';

export async function POST(req: NextRequest) {
  try {
    const { symbol, side, amount } = await req.json();

    if (!symbol || !side || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const kucoin = new KuCoinClient();
    
    // Process trade using market order
    // For 'buy', amount is the funds (e.g. USDT)
    // For 'sell', amount is the size (e.g. BTC)
    const result = await kucoin.createMarketOrder(
      symbol, 
      side as 'buy' | 'sell', 
      side === 'buy' ? amount.toString() : undefined,
      side === 'sell' ? amount.toString() : undefined
    );

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error: any) {
    console.error('Trading API Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

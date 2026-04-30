import { NextResponse } from 'next/server';
import { KuCoinClient } from '@/lib/kucoin';

export async function GET() {
  try {
    const kucoin = new KuCoinClient();
    const result = await kucoin.getMarketAllTickers();
    
    if (result && result.data && result.data.ticker) {
      // Sort by volume or specific relevant coins
      const filteredTickers = result.data.ticker
        .filter((t: any) => t.symbol.endsWith('-USDT'))
        .slice(0, 50);

      return NextResponse.json({ success: true, data: filteredTickers });
    }
    return NextResponse.json({ success: false, error: 'No data returned' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch market data' }, { status: 500 });
  }
}

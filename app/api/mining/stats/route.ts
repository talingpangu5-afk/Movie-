import { NextRequest, NextResponse } from 'next/server';
import { KuCoinClient } from '@/lib/kucoin';

// Simple rate limiting in-memory (per server instance)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10;

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip) || 0;

    // Basic Rate Limiting
    if (now - lastRequest < (RATE_LIMIT_WINDOW / MAX_REQUESTS)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    rateLimitMap.set(ip, now);

    const kucoin = new KuCoinClient();
    
    // In a real SaaS, we would authenticate the user's session here.
    // For this implementation, we connect the dashboard to the backend KuCoin layer.
    
    const [ticker, accounts] = await Promise.all([
      kucoin.getTicker('BTC-USDT'),
      kucoin.getAccountBalance().catch(() => ({ data: [] })) // Fallback if no valid key yet
    ]);

    // Format the response for the frontend
    return NextResponse.json({
      success: true,
      data: {
        price: ticker.data?.price || '0',
        accounts: accounts.data || [],
        timestamp: now
      }
    });

  } catch (error: any) {
    console.error('Mining API Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

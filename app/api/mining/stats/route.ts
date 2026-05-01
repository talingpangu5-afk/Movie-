import { NextRequest, NextResponse } from 'next/server';
import { KuCoinClient } from '@/lib/kucoin';

// Simple rate limiting and caching in-memory (per server instance)
const rateLimitMap = new Map<string, number>();
const cache = {
  data: null as any,
  timestamp: 0
};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 30; // Increased from 10
const CACHE_TTL = 10000; // 10 seconds

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const now = Date.now();
    
    // 1. Check Rate Limit
    const lastRequest = rateLimitMap.get(ip) || 0;
    if (now - lastRequest < (RATE_LIMIT_WINDOW / MAX_REQUESTS)) {
      // If we have cached data, return it even if rate limited (optional but friendly)
      if (cache.data && now - cache.timestamp < CACHE_TTL * 3) {
         return NextResponse.json({ success: true, data: cache.data, fromCache: true });
      }
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    rateLimitMap.set(ip, now);

    // 2. Check Cache
    if (cache.data && now - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cache.data, fromCache: true });
    }

    const kucoin = new KuCoinClient();
    
    // 3. Fetch Data from KuCoin
    try {
      const [tickerRes, accountsRes] = await Promise.all([
        kucoin.getTicker('BTC-USDT').catch(err => {
          console.warn('KuCoin Ticker Fetch Error:', err.message);
          return { data: { price: cache.data?.price || '85000' } };
        }),
        kucoin.getAccountBalance().catch(err => {
          console.warn('KuCoin Balance Fetch Error:', err.message);
          return { data: [] };
        })
      ]);

      const formattedData = {
        price: tickerRes?.data?.price || '0',
        accounts: accountsRes?.data || [],
        timestamp: now
      };

      // 4. Update Cache (only if valid price)
      if (formattedData.price !== '0') {
        cache.data = formattedData;
        cache.timestamp = now;
      }

      return NextResponse.json({
        success: true,
        data: formattedData
      });
    } catch (apiError: any) {
      console.error('KuCoin Integration Error:', apiError.message);
      return NextResponse.json({ 
        success: false, 
        error: 'Exchange link failure',
        data: cache.data // Fallback to stale cache if possible
      }, { status: 502 });
    }

  } catch (error: any) {
    console.error('Mining API Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

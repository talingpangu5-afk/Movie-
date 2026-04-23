import crypto from 'crypto';

/**
 * KuCoin API Authentication Helper
 * Implements the security logic required to sign requests on the server side.
 */
export class KuCoinClient {
  private apiKey: string;
  private apiSecret: string;
  private apiPassphrase: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KUCOIN_API_KEY || '';
    this.apiSecret = process.env.KUCOIN_API_SECRET || '';
    this.apiPassphrase = process.env.KUCOIN_API_PASSPHRASE || '';
    this.baseUrl = process.env.KUCOIN_BASE_URL || 'https://api.kucoin.com';

    if (!this.apiKey || !this.apiSecret || !this.apiPassphrase) {
      console.warn('KuCoin API credentials missing in environment variables.');
    }
  }

  private getSignature(timestamp: number, method: string, endpoint: string, body: string = ''): string {
    const strForSign = timestamp + method + endpoint + body;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(strForSign)
      .digest('base64');
  }

  private getPassphraseSignature(): string {
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(this.apiPassphrase)
      .digest('base64');
  }

  /**
   * Performs a signed GET request to KuCoin
   */
  async get(endpoint: string) {
    const timestamp = Date.now();
    const method = 'GET';
    const signature = this.getSignature(timestamp, method, endpoint);
    const passphraseSign = this.getPassphraseSignature();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'KC-API-KEY': this.apiKey,
        'KC-API-SIGN': signature,
        'KC-API-TIMESTAMP': timestamp.toString(),
        'KC-API-PASSPHRASE': passphraseSign,
        'KC-API-KEY-VERSION': '2',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.msg || 'KuCoin API Error');
    }

    return response.json();
  }

  /**
   * Performs a signed POST request to KuCoin
   */
  async post(endpoint: string, body: object) {
    const timestamp = Date.now();
    const method = 'POST';
    const bodyStr = JSON.stringify(body);
    const signature = this.getSignature(timestamp, method, endpoint, bodyStr);
    const passphraseSign = this.getPassphraseSignature();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'KC-API-KEY': this.apiKey,
        'KC-API-SIGN': signature,
        'KC-API-TIMESTAMP': timestamp.toString(),
        'KC-API-PASSPHRASE': passphraseSign,
        'KC-API-KEY-VERSION': '2',
        'Content-Type': 'application/json',
      },
      body: bodyStr,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.msg || 'KuCoin API Error');
    }

    return response.json();
  }

  /**
   * Create a new Market Order
   */
  async createMarketOrder(symbol: string, side: 'buy' | 'sell', funds?: string, size?: string) {
    const clientOid = crypto.randomBytes(16).toString('hex');
    const body: any = {
      clientOid,
      side,
      symbol,
      type: 'market',
    };

    if (side === 'buy' && funds) body.funds = funds;
    if (side === 'sell' && size) body.size = size;

    return this.post('/api/v1/orders', body);
  }

  /**
   * Fetch Spot Account Balance
   */
  async getAccountBalance() {
    return this.get('/api/v1/accounts');
  }

  /**
   * Fetch Market Ticker for BTC-USDT
   */
  async getTicker(symbol: string = 'BTC-USDT') {
    const response = await fetch(`${this.baseUrl}/api/v1/market/orderbook/level1?symbol=${symbol}`);
    return response.json();
  }
}

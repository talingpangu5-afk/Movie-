import { NextResponse } from 'next/server';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '754e50aeb0587d8fba132d342fe5bd13';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  // Remove endpoint from params to forward the rest
  const forwardParams = new URLSearchParams(searchParams);
  forwardParams.delete('endpoint');
  forwardParams.set('api_key', API_KEY);

  try {
    const url = `${TMDB_API_BASE_URL}${endpoint}?${forwardParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour on the server
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `TMDB responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('TMDB Proxy Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch from TMDB' },
      { status: 502 }
    );
  }
}

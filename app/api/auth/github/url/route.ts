import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientOrigin = searchParams.get('origin');
  
  const clientId = process.env.GITHUB_CLIENT_ID;
  const appUrl = clientOrigin || (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || '').replace(/\/$/, '');

  if (!clientId || !appUrl) {
    return NextResponse.json({ error: 'GitHub configuration missing (Client ID or App URL)' }, { status: 500 });
  }

  const redirectUri = `${appUrl}/api/auth/github/callback`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo read:user',
    response_type: 'code',
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}

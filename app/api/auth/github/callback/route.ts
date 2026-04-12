import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'GitHub credentials not configured' }, { status: 500 });
  }

  // Derive the redirect_uri from the current request URL (it must match exactly what was sent to /authorize)
  const currentUrl = new URL(request.url);
  const redirectUri = `${currentUrl.origin}${currentUrl.pathname}`;

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Movie-World-App',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('GitHub Token Exchange Failed:', errorText);
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    console.log('GitHub Token Response received:', { ...tokenData, access_token: '***' });

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // Store token in a cookie
    const cookieStore = await cookies();
    cookieStore.set('github_access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Return the success HTML that communicates with the opener
    return new NextResponse(
      `
      <html>
        <body style="background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GITHUB_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/developer';
            }
          </script>
          <div style="text-align: center;">
            <h1 style="color: #e50914;">Success!</h1>
            <p>GitHub connected. This window will close automatically.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

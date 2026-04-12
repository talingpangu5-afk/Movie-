import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated with GitHub' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=10', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Movie-World-App',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired or invalid
        cookieStore.delete('github_access_token');
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }
      throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    return NextResponse.json(repos);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated with GitHub' }, { status: 401 });
  }

  try {
    const { name, description, isPrivate } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
    }

    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Movie-World-App',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub Create Repo Error:', data);
      return NextResponse.json({ 
        error: data.message || 'Failed to create repository',
        details: data.errors 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

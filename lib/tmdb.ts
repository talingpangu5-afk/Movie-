const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
// Hardcoded for build stability in this environment
const API_KEY = '754e50aeb0587d8fba132d342fe5bd13';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTRlNTBhZWIwNTg3ZDhmYmExMzJkMzQyZmU1YmQxMyIsIm5iZiI6MTc3NTgzNTc2Ni41MjgsInN1YiI6IjY5ZDkxYTc2YTEwNDk3MDdhNjM1NzYxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BJYDW9ifIGfZM7-vzVV5qbzLW2COdRkfjqQcVVbjjSk';

// Simple in-memory cache for details and trailers
const apiCache = new Map<string, any>();

export interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
  };
  videos: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
}

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}, useCache: boolean = false) {
  const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const cacheKey = url.toString();
  if (useCache && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const token = BEARER_TOKEN;
  
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Use standard browser cache for non-dynamic data
    cache: useCache ? 'force-cache' : 'no-store',
    next: useCache ? { revalidate: 3600 } : undefined // Cache for 1 hour for details
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('TMDB API error: Unauthorized. Check your API keys.');
      return { results: [] };
    }
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  const data = await response.json();
  if (useCache) {
    apiCache.set(cacheKey, data);
  }
  return data;
}

export const tmdb = {
  getTrending: (page: number = 1) => fetchTMDB('/trending/movie/day', { page: page.toString() }),
  getTrendingTV: (page: number = 1) => fetchTMDB('/trending/tv/day', { page: page.toString() }),
  getNowPlaying: (page: number = 1) => fetchTMDB('/movie/now_playing', { page: page.toString() }),
  getPopular: (page: number = 1) => fetchTMDB('/movie/popular', { page: page.toString() }),
  getPopularTV: (page: number = 1) => fetchTMDB('/tv/popular', { page: page.toString() }),
  getTopRated: (page: number = 1) => fetchTMDB('/movie/top_rated', { page: page.toString() }),
  getTopRatedTV: (page: number = 1) => fetchTMDB('/tv/top_rated', { page: page.toString() }),
  getUpcoming: (page: number = 1) => fetchTMDB('/movie/upcoming', { page: page.toString() }),
  search: (query: string, page: number = 1) => fetchTMDB('/search/multi', { query, page: page.toString() }),
  getMovieDetails: (id: string) => fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos' }, true),
  getMultipleMovieDetails: async (ids: number[]) => {
    const promises = ids.map(id => fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos' }, true));
    return Promise.all(promises);
  },
  getImageUrl: (path: string, size: string = 'original') => 
    path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-movie.jpg',
};

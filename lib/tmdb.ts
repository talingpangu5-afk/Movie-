const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
// Hardcoded for build stability in this environment
const API_KEY = '754e50aeb0587d8fba132d342fe5bd13';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTRlNTBhZWIwNTg3ZDhmYmExMzJkMzQyZmU1YmQxMyIsIm5iZiI6MTc3NTgzNTc2Ni41MjgsInN1YiI6IjY5ZDkxYTc2YTEwNDk3MDdhNjM1NzYxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BJYDW9ifIGfZM7-vzVV5qbzLW2COdRkfjqQcVVbjjSk';

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

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
  try {
    const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  
    const token = BEARER_TOKEN;
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time data
    });
  
    if (!response.ok) {
      if (response.status === 401) {
        console.error('TMDB API error: Unauthorized. Check your API keys.');
        return { results: [] };
      }
      // Log error but return empty results to prevent crash
      console.warn(`TMDB API warning: ${response.status} ${response.statusText} at ${endpoint}`);
      return { results: [] };
    }
  
    return await response.json();
  } catch (error) {
    console.error('TMDB Fetch Error:', error);
    // Return empty results instead of throwing to prevent component crashes
    return { results: [] };
  }
}

const MOCK_UPCOMING = [
  {
    id: 1,
    title: "Mission: Impossible - Dead Reckoning Part Two",
    poster_path: "/placeholder.jpg",
    backdrop_path: "/placeholder.jpg",
    vote_average: 8.5,
    release_date: "2026-05-23",
    overview: "Ethan Hunt and his IMF team embark on their most dangerous mission yet.",
    genre_ids: [28, 53]
  },
  {
    id: 2,
    title: "Beyond the Spider-Verse",
    poster_path: "/placeholder.jpg",
    backdrop_path: "/placeholder.jpg",
    vote_average: 9.0,
    release_date: "2026-06-15",
    overview: "Miles Morales returns for the next chapter of the Oscar-winning Spider-Verse saga.",
    genre_ids: [16, 28, 12]
  },
  {
    id: 3,
    title: "Star Wars: New Jedi Order",
    poster_path: "/placeholder.jpg",
    backdrop_path: "/placeholder.jpg",
    vote_average: 7.8,
    release_date: "2026-12-18",
    overview: "Rey builds a new Jedi Order fifteen years after the events of The Rise of Skywalker.",
    genre_ids: [12, 28, 878]
  }
];

export const tmdb = {
  getTrending: (page: number = 1) => fetchTMDB('/trending/movie/day', { page: page.toString() }),
  getTrendingTV: (page: number = 1) => fetchTMDB('/trending/tv/day', { page: page.toString() }),
  getNowPlaying: (page: number = 1) => fetchTMDB('/movie/now_playing', { page: page.toString() }),
  getPopular: (page: number = 1) => fetchTMDB('/movie/popular', { page: page.toString() }),
  getPopularTV: (page: number = 1) => fetchTMDB('/tv/popular', { page: page.toString() }),
  getTopRated: (page: number = 1) => fetchTMDB('/movie/top_rated', { page: page.toString() }),
  getTopRatedTV: (page: number = 1) => fetchTMDB('/tv/top_rated', { page: page.toString() }),
  getUpcoming: async (page: number = 1) => {
    const data = await fetchTMDB('/movie/upcoming', { page: page.toString() });
    if (!data.results || data.results.length === 0) {
      return { results: MOCK_UPCOMING };
    }
    return data;
  },
  getByGenre: (genreId: number, page: number = 1) => fetchTMDB('/discover/movie', { with_genres: genreId.toString(), page: page.toString() }),
  getTVShows: (page: number = 1) => fetchTMDB('/discover/tv', { page: page.toString() }),
  search: (query: string, page: number = 1) => fetchTMDB('/search/multi', { query, page: page.toString() }),
  getMovieDetails: (id: string) => fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos' }),
  getMultipleMovieDetails: async (ids: number[]) => {
    try {
      const promises = ids.map(id => fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos' }));
      return await Promise.all(promises);
    } catch (error) {
      return [];
    }
  },
  getImageUrl: (path: string, size: string = 'original') => 
    path && path !== '/placeholder.jpg' ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop',
};

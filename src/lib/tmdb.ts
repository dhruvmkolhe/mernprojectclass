const BASE = "http://localhost:5000/api/tmdb";
const IMG = "https://image.tmdb.org/t/p";

export const imageUrl = (path: string | null, size: "w300" | "w500" | "w780" | "original" = "w500") =>
  path ? `${IMG}/${size}${path}` : "/placeholder.svg";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
}

interface TMDBResponse {
  results: Movie[];
}

const fetchTMDB = async (endpoint: string, params: Record<string, string> = {}): Promise<Movie[]> => {
  const url = new URL(`${BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("TMDB fetch failed");
  const data: TMDBResponse = await res.json();
  return data.results;
};

const fetchTMDBRaw = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const url = new URL(`${BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("TMDB fetch failed");
  return res.json();
};

export const getTrending = () => fetchTMDB("/trending/movie/week");
export const getPopular = () => fetchTMDB("/movie/popular");
export const getTopRated = () => fetchTMDB("/movie/top_rated");
export const getUpcoming = () => fetchTMDB("/movie/upcoming");
export const getByGenre = (genreId: number) =>
  fetchTMDB("/discover/movie", { with_genres: String(genreId), sort_by: "popularity.desc" });
export const searchMovies = (query: string) =>
  fetchTMDB("/search/movie", { query });

export const getMovieDetail = (id: number) =>
  fetchTMDBRaw<MovieDetail>(`/movie/${id}`);

export const getMovieCredits = (id: number) =>
  fetchTMDBRaw<{ cast: CastMember[] }>(`/movie/${id}/credits`).then((d) => d.cast.slice(0, 12));

export const getMovieVideos = (id: number) =>
  fetchTMDBRaw<{ results: Video[] }>(`/movie/${id}/videos`).then((d) =>
    d.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ?? d.results.find((v) => v.site === "YouTube") ?? null
  );

export const getWatchProviders = (id: number) =>
  fetchTMDBRaw<{ results: Record<string, { link?: string; flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[] }> }>(`/movie/${id}/watch/providers`).then((d) => {
    // Merge all regions, dedup by provider_id
    const allRegions = Object.values(d.results);
    const dedup = (arr: WatchProvider[]) => {
      const seen = new Set<number>();
      return arr.filter((p) => { if (seen.has(p.provider_id)) return false; seen.add(p.provider_id); return true; });
    };
    const flatrate = dedup(allRegions.flatMap((r) => r.flatrate || []));
    const rent = dedup(allRegions.flatMap((r) => r.rent || []));
    const buy = dedup(allRegions.flatMap((r) => r.buy || []));
    const link = allRegions.find((r) => r.link)?.link;
    return (flatrate.length || rent.length || buy.length) ? { flatrate, rent, buy, link } : null;
  });

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
] as const;

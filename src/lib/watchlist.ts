import { type Movie } from "@/lib/tmdb";

const API_BASE = "http://localhost:5000/api";
const USER_ID = "guest"; // Hardcoded user id

let localWatchlist: Movie[] = [];
let isLoaded = false;

export const loadWatchlist = async () => {
  try {
    const res = await fetch(`${API_BASE}/watchlist/${USER_ID}`);
    if (res.ok) {
      localWatchlist = await res.json();
      isLoaded = true;
      window.dispatchEvent(new Event("watchlist-updated"));
    }
  } catch (err) {
    console.error("Failed to load watchlist from backend:", err);
  }
};

// Initiate load
loadWatchlist();

export const getWatchlist = (): Movie[] => {
  return localWatchlist;
};

export const isInWatchlist = (movieId: number): boolean => {
  return localWatchlist.some((m) => m.id === movieId);
};

export const toggleWatchlist = async (movie: Movie) => {
  const exists = localWatchlist.some((m) => m.id === movie.id);
  // Optimistic update
  localWatchlist = exists 
    ? localWatchlist.filter((m) => m.id !== movie.id) 
    : [...localWatchlist, movie];
  window.dispatchEvent(new Event("watchlist-updated"));

  try {
    await fetch(`${API_BASE}/watchlist/${USER_ID}/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie }),
    });
  } catch (err) {
    console.error("Failed to sync with backend:", err);
    // Reload from backend on error
    loadWatchlist();
  }
  
  return !exists;
};

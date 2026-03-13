import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import MovieCard from "@/components/MovieCard";
import MovieDetailModal from "@/components/MovieDetailModal";
import GenreTabs from "@/components/GenreTabs";
import { getTrending, getPopular, getTopRated, getUpcoming, getByGenre, searchMovies, GENRES, type Movie } from "@/lib/tmdb";
import { getWatchlist } from "@/lib/watchlist";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
    const handler = () => setWatchlist(getWatchlist());
    window.addEventListener("watchlist-updated", handler);
    return () => window.removeEventListener("watchlist-updated", handler);
  }, []);

  const trending = useQuery({ queryKey: ["trending"], queryFn: getTrending });
  const popular = useQuery({ queryKey: ["popular"], queryFn: getPopular });
  const topRated = useQuery({ queryKey: ["topRated"], queryFn: getTopRated });
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: getUpcoming });

  const genreQuery = useQuery({
    queryKey: ["genre-filter", activeGenre],
    queryFn: () => getByGenre(activeGenre!),
    enabled: !!activeGenre,
  });

  const search = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const heroMovie = trending.data?.[0] ?? null;
  const handleSearch = (query: string) => { setSearchQuery(query); setShowWatchlist(false); setActiveGenre(null); };
  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);

  const renderGrid = (title: string, movies: Movie[], isLoading?: boolean) => (
    <div className="pt-28 px-6 min-h-screen bg-background">
      <h2 className="font-display text-3xl text-foreground mb-6 tracking-wide">{title}</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-md bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />)}
          {movies.length === 0 && (
            <p className="col-span-full text-muted-foreground text-center py-20 font-body">
              {title.includes("WATCHLIST") ? "Your watchlist is empty. Click the ♥ on any movie to add it!" : "No movies found."}
            </p>
          )}
        </div>
      )}
    </div>
  );

  // Search view
  if (searchQuery) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
        <GenreTabs activeGenre={activeGenre} onGenreChange={(id) => { setActiveGenre(id); setSearchQuery(""); }} showWatchlist={showWatchlist} onToggleWatchlist={() => { setShowWatchlist(!showWatchlist); setSearchQuery(""); }} watchlistCount={watchlist.length} />
        {renderGrid(`RESULTS FOR "${searchQuery.toUpperCase()}"`, search.data ?? [], search.isLoading)}
        <MovieDetailModal movie={selectedMovie} open={!!selectedMovie} onClose={() => setSelectedMovie(null)} />
      </div>
    );
  }

  // Watchlist view
  if (showWatchlist) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
        <GenreTabs activeGenre={activeGenre} onGenreChange={(id) => { setActiveGenre(id); setShowWatchlist(false); setSearchQuery(""); }} showWatchlist={showWatchlist} onToggleWatchlist={() => { setShowWatchlist(!showWatchlist); setSearchQuery(""); }} watchlistCount={watchlist.length} />
        {renderGrid("MY WATCHLIST", watchlist)}
        <MovieDetailModal movie={selectedMovie} open={!!selectedMovie} onClose={() => setSelectedMovie(null)} />
      </div>
    );
  }

  // Genre filter view
  if (activeGenre) {
    const genreName = GENRES.find((g) => g.id === activeGenre)?.name?.toUpperCase() ?? "GENRE";
    return (
      <div className="min-h-screen bg-background">
        <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
        <GenreTabs activeGenre={activeGenre} onGenreChange={(id) => { setActiveGenre(id); setSearchQuery(""); }} showWatchlist={showWatchlist} onToggleWatchlist={() => { setShowWatchlist(!showWatchlist); setSearchQuery(""); }} watchlistCount={watchlist.length} />
        {renderGrid(genreName, genreQuery.data ?? [], genreQuery.isLoading)}
        <MovieDetailModal movie={selectedMovie} open={!!selectedMovie} onClose={() => setSelectedMovie(null)} />
      </div>
    );
  }

  // Default home view
  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
      <GenreTabs activeGenre={activeGenre} onGenreChange={(id) => { setActiveGenre(id); setSearchQuery(""); }} showWatchlist={showWatchlist} onToggleWatchlist={() => { setShowWatchlist(!showWatchlist); setSearchQuery(""); }} watchlistCount={watchlist.length} />
      <div className="pt-28">
        <HeroSection movies={trending.data ?? []} onMovieSelect={handleMovieClick} />
      </div>

      <div className="-mt-16 relative z-10">
        <MovieRow title="TRENDING NOW" movies={trending.data ?? []} isLoading={trending.isLoading} onMovieClick={handleMovieClick} />
        <MovieRow title="POPULAR" movies={popular.data ?? []} isLoading={popular.isLoading} onMovieClick={handleMovieClick} />
        <MovieRow title="TOP RATED" movies={topRated.data ?? []} isLoading={topRated.isLoading} onMovieClick={handleMovieClick} />
        <MovieRow title="COMING SOON" movies={upcoming.data ?? []} isLoading={upcoming.isLoading} onMovieClick={handleMovieClick} />
      </div>

      <MovieDetailModal movie={selectedMovie} open={!!selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
};

export default Index;

import { Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { type Movie, imageUrl } from "@/lib/tmdb";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    setInWatchlist(isInWatchlist(movie.id));
    const handler = () => setInWatchlist(isInWatchlist(movie.id));
    window.addEventListener("watchlist-updated", handler);
    return () => window.removeEventListener("watchlist-updated", handler);
  }, [movie.id]);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <div
      className="relative flex-shrink-0 w-[160px] md:w-[200px] cinema-card-hover cursor-pointer group"
      onClick={() => onClick?.(movie)}
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-secondary">
        <img
          src={imageUrl(movie.poster_path, "w300")}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Watchlist button */}
        <button
          onClick={handleWatchlistClick}
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200 ${
            inWatchlist
              ? "bg-primary text-primary-foreground opacity-100"
              : "bg-background/60 text-foreground opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart className={`h-4 w-4 ${inWatchlist ? "fill-current" : ""}`} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="font-body font-semibold text-sm text-foreground leading-tight mb-1">{movie.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-xs text-muted-foreground">{movie.vote_average.toFixed(1)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

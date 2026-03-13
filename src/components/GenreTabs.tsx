import { useRef, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { GENRES } from "@/lib/tmdb";

interface GenreTabsProps {
  activeGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
  showWatchlist: boolean;
  onToggleWatchlist: () => void;
  watchlistCount: number;
}

const GenreTabs = ({ activeGenre, onGenreChange, showWatchlist, onToggleWatchlist, watchlistCount }: GenreTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 3) setHasDragged(true);
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    if (!scrollRef.current) return;
    setIsDragging(false);
    scrollRef.current.style.cursor = "grab";
    scrollRef.current.style.userSelect = "";
  }, []);

  const handleClick = useCallback((e: React.MouseEvent, callback: () => void) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    callback();
  }, [hasDragged]);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border/20">
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex items-center gap-1.5 px-6 py-2.5 overflow-x-auto scrollbar-hide cursor-grab"
      >
        <button
          onClick={(e) => handleClick(e, () => { onGenreChange(null); if (showWatchlist) onToggleWatchlist(); })}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-wide uppercase transition-all duration-200 ${
            !activeGenre && !showWatchlist
              ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          All
        </button>

        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={(e) => handleClick(e, () => { onGenreChange(genre.id); if (showWatchlist) onToggleWatchlist(); })}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-wide uppercase transition-all duration-200 ${
              activeGenre === genre.id && !showWatchlist
                ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {genre.name}
          </button>
        ))}

        <div className="flex-shrink-0 w-px h-5 bg-border/40 mx-2" />

        <button
          onClick={(e) => handleClick(e, onToggleWatchlist)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-wide uppercase transition-all duration-200 flex items-center gap-1.5 ${
            showWatchlist
              ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Heart className={`h-3 w-3 ${showWatchlist ? "fill-primary-foreground" : ""}`} />
          Watchlist
          {watchlistCount > 0 && (
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] leading-none font-bold ${
              showWatchlist ? "bg-primary-foreground/20" : "bg-primary/80 text-primary-foreground"
            }`}>
              {watchlistCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenreTabs;

import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { type Movie, imageUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

interface HeroSectionProps {
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
}

const HeroSection = ({ movies, onMovieSelect }: HeroSectionProps) => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const featured = movies.slice(0, 8);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % featured.length), [current, featured.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + featured.length) % featured.length), [current, featured.length, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, featured.length]);

  if (!featured.length) {
    return <div className="h-[70vh] bg-secondary animate-pulse" />;
  }

  const movie = featured[current];

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden group">
      {/* Background images with crossfade */}
      {featured.map((m, i) => (
        <img
          key={m.id}
          src={imageUrl(m.backdrop_path, "original")}
          alt={m.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 cinema-gradient" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-20 md:pb-28 max-w-2xl">
        <h1
          key={movie.id}
          className="font-display text-5xl md:text-7xl text-foreground leading-none mb-4 tracking-wide animate-fade-in"
        >
          {movie.title}
        </h1>
        <p
          key={`desc-${movie.id}`}
          className="text-sm md:text-base text-secondary-foreground line-clamp-3 mb-6 font-body animate-fade-in"
        >
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <Button size="lg" className="gap-2 font-body font-semibold">
            <Play className="h-5 w-5 fill-current" /> Play
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 font-body font-semibold"
            onClick={() => onMovieSelect?.(movie)}
          >
            <Info className="h-5 w-5" /> More Info
          </Button>
        </div>
      </div>

      {/* Navigation arrows */}
      {featured.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/40 hover:bg-background/70 rounded-full p-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/40 hover:bg-background/70 rounded-full p-2 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-foreground/30 hover:bg-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;

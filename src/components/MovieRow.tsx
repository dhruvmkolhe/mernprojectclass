import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import MovieCard from "./MovieCard";
import { type Movie } from "@/lib/tmdb";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  onMovieClick?: (movie: Movie) => void;
}

const MovieRow = ({ title, movies, isLoading, onMovieClick }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="relative px-6 mb-8">
      <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3 tracking-wide">{title}</h2>

      <div className="group relative">
        <button onClick={() => scroll("left")} className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>

        <div ref={rowRef} className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[160px] md:w-[200px] aspect-[2/3] rounded-md bg-secondary animate-pulse" />
              ))
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />)}
        </div>

        <button onClick={() => scroll("right")} className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;

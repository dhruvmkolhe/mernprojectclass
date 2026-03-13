import { useQuery } from "@tanstack/react-query";
import { X, Star, Clock, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getMovieDetail, getMovieCredits, getMovieVideos, getWatchProviders, imageUrl, type Movie } from "@/lib/tmdb";


interface MovieDetailModalProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

const MovieDetailModal = ({ movie, open, onClose }: MovieDetailModalProps) => {
  const movieId = movie?.id;

  const detail = useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: () => getMovieDetail(movieId!),
    enabled: !!movieId && open,
  });

  const credits = useQuery({
    queryKey: ["movieCredits", movieId],
    queryFn: () => getMovieCredits(movieId!),
    enabled: !!movieId && open,
  });

  const video = useQuery({
    queryKey: ["movieVideo", movieId],
    queryFn: () => getMovieVideos(movieId!),
    enabled: !!movieId && open,
  });

  const providers = useQuery({
    queryKey: ["watchProviders", movieId],
    queryFn: () => getWatchProviders(movieId!),
    enabled: !!movieId && open,
  });

  if (!movie) return null;

  const d = detail.data;
  const trailer = video.data;
  const wp = providers.data;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="!flex !flex-col max-w-3xl p-0 bg-card border-border overflow-hidden gap-0 max-h-[90vh]" aria-describedby={undefined}>
        <VisuallyHidden><DialogTitle>{movie.title}</DialogTitle></VisuallyHidden>
        {/* Backdrop header */}
        <div className="relative h-[280px] md:h-[340px] flex-shrink-0">
          <img
            src={imageUrl(movie.backdrop_path, "w780")}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-background/60 rounded-full p-1.5 text-foreground hover:bg-background transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-wide leading-none">
              {movie.title}
            </h2>
            {d?.tagline && (
              <p className="text-muted-foreground text-sm italic mt-2 font-body">{d.tagline}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground font-body">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                {movie.vote_average.toFixed(1)}
              </span>
              {d?.runtime != null && d.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {d.runtime >= 60 ? `${Math.floor(d.runtime / 60)}h ` : ""}{d.runtime % 60}m
                </span>
              )}
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {movie.release_date.slice(0, 4)}
                </span>
              )}
            </div>
            {d?.genres && (
              <div className="flex flex-wrap gap-2 mt-3">
                {d.genres.map((g) => (
                  <span key={g.id} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-sm font-body">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Synopsis */}
            <div>
              <h3 className="font-display text-xl text-foreground tracking-wide mb-2">SYNOPSIS</h3>
              <p className="text-sm text-secondary-foreground leading-relaxed font-body">{movie.overview}</p>
            </div>

            {/* Where to Watch */}
            {wp && (wp.flatrate || wp.rent || wp.buy) && (
              <div>
                <h3 className="font-display text-xl text-foreground tracking-wide mb-3">WHERE TO WATCH</h3>
                <div className="space-y-3">
                  {wp.flatrate && wp.flatrate.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wider">Stream</p>
                      <div className="flex flex-wrap gap-2">
                        {wp.flatrate.map((p) => (
                          <a key={p.provider_id} href={wp.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-sm hover:bg-accent transition-colors">
                            <img src={imageUrl(p.logo_path, "w300")} alt={p.provider_name} className="w-6 h-6 rounded-sm" />
                            <span className="text-xs font-body text-foreground">{p.provider_name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {wp.rent && wp.rent.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wider">Rent</p>
                      <div className="flex flex-wrap gap-2">
                        {wp.rent.map((p) => (
                          <a key={p.provider_id} href={wp.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-sm hover:bg-accent transition-colors">
                            <img src={imageUrl(p.logo_path, "w300")} alt={p.provider_name} className="w-6 h-6 rounded-sm" />
                            <span className="text-xs font-body text-foreground">{p.provider_name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {wp.buy && wp.buy.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wider">Buy</p>
                      <div className="flex flex-wrap gap-2">
                        {wp.buy.map((p) => (
                          <a key={p.provider_id} href={wp.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-sm hover:bg-accent transition-colors">
                            <img src={imageUrl(p.logo_path, "w300")} alt={p.provider_name} className="w-6 h-6 rounded-sm" />
                            <span className="text-xs font-body text-foreground">{p.provider_name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground font-body mt-2">Powered by JustWatch</p>
              </div>
            )}

            {trailer && (
              <div>
                <h3 className="font-display text-xl text-foreground tracking-wide mb-2">TRAILER</h3>
                <div className="aspect-video rounded-md overflow-hidden bg-secondary">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                    title={trailer.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Cast */}
            {credits.data && credits.data.length > 0 && (
              <div>
                <h3 className="font-display text-xl text-foreground tracking-wide mb-3">CAST</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {credits.data.map((person) => (
                    <div key={person.id} className="text-center">
                      <div className="aspect-square rounded-full overflow-hidden bg-secondary mx-auto w-16 h-16 mb-1">
                        {person.profile_path ? (
                          <img
                            src={imageUrl(person.profile_path, "w300")}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg font-display">
                            {person.name[0]}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-foreground font-semibold font-body truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground font-body truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailModal;

import { Search, Film } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Navbar = ({ onSearch, searchQuery }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Sync: if parent clears searchQuery, close the search bar
  useEffect(() => {
    if (!searchQuery) {
      setSearchOpen(false);
      setQuery("");
    }
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background">
      <div className="flex items-center gap-2">
        <Film className="h-8 w-8 text-primary" />
        <span className="font-display text-3xl text-foreground tracking-wider">CINEVERSE</span>
      </div>

      <div className="flex items-center gap-4">
        {searchOpen ? (
          <form onSubmit={handleSubmit} className="flex items-center bg-secondary/80 border border-border rounded-sm overflow-hidden animate-fade-in">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none w-48 md:w-64"
            />
            <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); onSearch(""); }} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
              ✕
            </button>
          </form>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

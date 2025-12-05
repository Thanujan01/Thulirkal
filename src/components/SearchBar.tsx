import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string, seed?: number) => void; // Add seed parameter
  placeholder?: string;
  searchSeed?: number; // Optional seed for random ordering
}

export const SearchBar = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search products...",
  searchSeed
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentSeed, setCurrentSeed] = useState<number | undefined>(searchSeed);

  // Generate or use a seed for random ordering
  const getSearchSeed = () => {
    // If seed is provided, use it
    if (searchSeed !== undefined) return searchSeed;
    
    // If we already have a seed for this session, use it
    if (currentSeed !== undefined) return currentSeed;
    
    // Generate a new seed based on current time
    const newSeed = Date.now();
    setCurrentSeed(newSeed);
    return newSeed;
  };

  const handleSearch = () => {
    if (onSearch) {
      const seed = getSearchSeed();
      onSearch(value, seed); // Pass the seed along with search query
    }
    // remove focus so the bar doesn't stay 'held'
    if (inputRef.current) inputRef.current.blur();
  };

  // Reset seed when search query changes
  useEffect(() => {
    if (value) {
      // Generate a new seed for new search queries
      const newSeed = Date.now();
      setCurrentSeed(newSeed);
    }
  }, [value]);

  return (
    <div className="w-full max-w-full mx-auto py-1 px-1 sm:px-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="pl-10 pr-12 h-12 bg-card shadow-sm border-border focus:ring-2 focus:ring-primary/20"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Button size="sm" className="h-8 px-2" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
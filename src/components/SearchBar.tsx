import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, onSearch, placeholder = "Search products..." }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = () => {
    if (onSearch) onSearch(value);
    // remove focus so the bar doesn't stay 'held'
    if (inputRef.current) inputRef.current.blur();
  };

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

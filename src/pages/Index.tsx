import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { SlidesHero } from "@/components/SlidesHero";
import { Product } from "@/types/product";
import { getAllProducts } from "@/utils/products";
import { searchProducts } from "@/utils/search";
import { Facebook, Instagram, MessageCircle, ChevronDown } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/config/constants";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);

  // Initialize search from URL query `q` and keep it synced when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchQuery(q);
  }, [location.search]);

  const handleSearch = (q: string) => {
    // update URL so search persists across navigation
    navigate({ pathname: location.pathname, search: q ? `?q=${encodeURIComponent(q)}` : "" });
  };
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Close category dropdown when clicking outside
  useEffect(() => {
    if (!isCategoryOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryOpen]);

  // Get all products
  const allProducts: Product[] = useMemo(() => getAllProducts(), []);

  // Shuffle products for random display
  const shuffledProducts = useMemo(() => {
    return [...allProducts].sort(() => Math.random() - 0.5);
  }, [allProducts]);

  // Filter and rank products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return shuffledProducts;
    
    // Use search utility to get ranked results (best matches first)
    return searchProducts(shuffledProducts, searchQuery);
  }, [searchQuery, shuffledProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Slides Section (text then product images slideshow) */}
      <SlidesHero />

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />

      {/* Categories & Social Media Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-4 py-2 flex items-center justify-between">
          <div className="relative" ref={categoryMenuRef}>
            <Button
              className="gap-2 font-bold text-white bg-amber-500 hover:bg-orange-300 border border-orange-600"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              Categories
              <ChevronDown className="h-4 w-4" />
            </Button>
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-lg w-40">
                <CategoryDropdown mobile onLinkClick={() => setIsCategoryOpen(false)} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.TIKTOK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-green-500 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="container mx-auto pb-12">
        <h2 className="text-3xl font-serif font-bold text-center mb-5">
          {searchQuery ? "Search Results" : ""}
        </h2>
        <ProductGrid 
          products={filteredProducts}
          emptyMessage={searchQuery ? "No products match your search" : "No products available"}
        />
      </section>
    </div>
  );
};

export default Index;

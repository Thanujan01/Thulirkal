import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { SlidesHero } from "@/components/SlidesHero";
import { Product } from "@/types/product";
import { getAllProducts } from "@/utils/products";
import { searchProducts } from "@/utils/search";
import { Facebook, Instagram, MessageCircle, ChevronDown, Menu } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/config/constants";

// Home Page Layout Configuration - Manually adjust for pixel-perfect alignment
const LAYOUT_CONFIG = {
  // Category & Social Bar Section Padding
  SECTION_PADDING_TOP: "8px",    // Vertical padding at the top of the bar
  SECTION_PADDING_BOTTOM: "8px", // Vertical padding at the bottom of the bar
  SECTION_PADDING_LEFT: "8px",  // Horizontal padding on the left
  SECTION_PADDING_RIGHT: "16px", // Horizontal padding on the right

  // Category Button Specific Alignment
  CATEGORY_BUTTON_MARGIN_LEFT: "0px", // Specifically moves the button from the left

  // Spacing between Carousel and Products
  PRODUCT_SECTION_MARGIN_TOP: "0px",  // Adjust the gap between carousel and products
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);
  const shuffledProductsRef = useRef<Product[]>([]);

  // Home page refresh control: only refresh after 10 minutes, manual refresh, or browser reopen
  useEffect(() => {
    const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
    const STORAGE_KEY = "homePageLastRefresh";
    const SHUFFLED_PRODUCTS_KEY = "homePageShuffledProducts";

    const checkRefresh = () => {
      const lastRefresh = localStorage.getItem(STORAGE_KEY);
      const cachedShuffled = localStorage.getItem(SHUFFLED_PRODUCTS_KEY);
      const now = Date.now();

      if (!lastRefresh || !cachedShuffled) {
        // First visit or browser reopened - shuffle products
        const shuffled = [...getAllProducts()].sort(() => Math.random() - 0.5);
        shuffledProductsRef.current = shuffled;
        localStorage.setItem(STORAGE_KEY, now.toString());
        localStorage.setItem(SHUFFLED_PRODUCTS_KEY, JSON.stringify(shuffled));
        return;
      }

      const timeSinceLastRefresh = now - parseInt(lastRefresh, 10);

      if (timeSinceLastRefresh >= REFRESH_INTERVAL) {
        // 10 minutes have passed - reshuffle
        const shuffled = [...getAllProducts()].sort(() => Math.random() - 0.5);
        shuffledProductsRef.current = shuffled;
        localStorage.setItem(STORAGE_KEY, now.toString());
        localStorage.setItem(SHUFFLED_PRODUCTS_KEY, JSON.stringify(shuffled));
      } else {
        // Use cached shuffled products
        try {
          const parsed = JSON.parse(cachedShuffled);
          if (Array.isArray(parsed)) {
            shuffledProductsRef.current = parsed;
          }
        } catch (e) {
          // If parsing fails, reshuffle
          const shuffled = [...getAllProducts()].sort(() => Math.random() - 0.5);
          shuffledProductsRef.current = shuffled;
          localStorage.setItem(SHUFFLED_PRODUCTS_KEY, JSON.stringify(shuffled));
        }
      }
    };

    checkRefresh();

    // Listen for manual refresh (F5, Ctrl+R, etc.)
    const handleBeforeUnload = () => {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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

  // Use cached shuffled products (refreshed based on time/conditions)
  const shuffledProducts = useMemo(() => {
    if (shuffledProductsRef.current.length === 0) {
      // Fallback: shuffle if ref is empty
      return [...allProducts].sort(() => Math.random() - 0.5);
    }
    return shuffledProductsRef.current;
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
        <div
          className="container mx-auto flex items-center justify-between"
          style={{
            paddingTop: LAYOUT_CONFIG.SECTION_PADDING_TOP,
            paddingBottom: LAYOUT_CONFIG.SECTION_PADDING_BOTTOM,
            paddingLeft: LAYOUT_CONFIG.SECTION_PADDING_LEFT,
            paddingRight: LAYOUT_CONFIG.SECTION_PADDING_RIGHT,
          }}
        >
          <div
            className="relative"
            ref={categoryMenuRef}
            style={{ marginLeft: LAYOUT_CONFIG.CATEGORY_BUTTON_MARGIN_LEFT }}
          >
            <Button
              className="gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 font-medium"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <Menu className="h-4 w-4" />
              All Categories
              <ChevronDown className="h-4 w-4" />
            </Button>
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-lg">
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

      {/* Category Carousel */}
      <CategoryCarousel />

      {/* Products Section */}
      <section
        className="container mx-auto pb-12"
        style={{ marginTop: LAYOUT_CONFIG.PRODUCT_SECTION_MARGIN_TOP }}
      >

        <ProductGrid
          products={filteredProducts}
          emptyMessage={searchQuery ? "No products match your search" : "No products available"}
        />
      </section>
    </div>
  );
};

export default Index;

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProductGrid } from "@/components/ProductGrid";
import { Product } from "@/types/product";
import { getProductsByCategory } from "@/utils/products";
import { CATEGORIES } from "@/config/constants";
import { searchProducts } from "@/utils/search";

const Jewelries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  const handleSearch = (q: string) => {
    navigate({ pathname: location.pathname, search: q ? `?q=${encodeURIComponent(q)}` : '' });
  };

  const allProducts: Product[] = useMemo(() => getProductsByCategory(CATEGORIES.JEWELRIES.slug), []);

  // Shuffle products for random display (only when not searching)
  const shuffledProducts = useMemo(() => {
    return [...allProducts].sort(() => Math.random() - 0.5);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return shuffledProducts;
    
    // Use search utility to get ranked results (best matches first)
    return searchProducts(shuffledProducts, searchQuery);
  }, [searchQuery, shuffledProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          Back
        </Button>
      </div>

      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Jewelries</h1>
          <p className="text-lg text-muted-foreground mt-2">Discover our curated jewelries collection</p>
        </div>
      </section>

      <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />

      <section className="container mx-auto pb-12">
        <ProductGrid
          products={filteredProducts}
          emptyMessage={searchQuery ? "No jewelries match your search" : "No jewelries available"}
        />
      </section>
    </div>
  );
};

export default Jewelries;

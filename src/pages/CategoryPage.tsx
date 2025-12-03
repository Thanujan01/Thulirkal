import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProductGrid } from "@/components/ProductGrid";
import { Product } from "@/types/product";
import { CATEGORIES } from "@/config/constants";
import { getProductsByCategory } from "@/utils/products";
import { searchProducts } from "@/utils/search";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
  }, [location.search]);

  const handleSearch = (q: string) => {
    navigate({ pathname: location.pathname, search: q ? `?q=${encodeURIComponent(q)}` : '' });
  };

  const categoryMap: Record<string, { products: Product[]; title: string }> = {
    [CATEGORIES.JEWELRIES.slug]: { products: getProductsByCategory(CATEGORIES.JEWELRIES.slug), title: CATEGORIES.JEWELRIES.title },
    [CATEGORIES.RESIN_ARTS.slug]: { products: getProductsByCategory(CATEGORIES.RESIN_ARTS.slug), title: CATEGORIES.RESIN_ARTS.title },
    [CATEGORIES.FLOWER_VASES.slug]: { products: getProductsByCategory(CATEGORIES.FLOWER_VASES.slug), title: CATEGORIES.FLOWER_VASES.title },
    [CATEGORIES.HAND_CRAFTS.slug]: { products: getProductsByCategory(CATEGORIES.HAND_CRAFTS.slug), title: CATEGORIES.HAND_CRAFTS.title },
    [CATEGORIES.PHOTO_FRAMES.slug]: { products: getProductsByCategory(CATEGORIES.PHOTO_FRAMES.slug), title: CATEGORIES.PHOTO_FRAMES.title },
  };

  const categoryData = categorySlug ? categoryMap[categorySlug] : null;

  const filteredProducts = useMemo(() => {
    if (!categoryData) return [];
    if (!searchQuery.trim()) return categoryData.products;

    // Use search utility to get ranked results (best matches first)
    return searchProducts(categoryData.products, searchQuery);
  }, [searchQuery, categoryData]);

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Category Header */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground animate-fade-in">
            {categoryData.title}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Explore our collection of {categoryData.title.toLowerCase()}
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />

      {/* Products */}
      <section className="container mx-auto pb-12">
        <ProductGrid
          products={filteredProducts}
          emptyMessage={searchQuery ? "No products match your search" : "No products in this category yet"}
        />

        {/* Back button at end of category page: redirect to home */}
        <div className="mt-8 flex justify-end">
          <Button
            variant="ghost"
            className="bg-accent text-accent-foreground"
            onClick={() => navigate('/') }
          >
            Back to Home
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;

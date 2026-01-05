import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { getWhatsAppLink } from "@/lib/cart";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { findProductById, getProductsByCategory, getAllProducts } from "@/utils/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardMobile } from "@/components/ProductCardMobile";
import { Product } from "@/types/product";

const CONFIG = {
  PRODUCT_NAME_SIZE: "18px", // Manually adjust viewed product name size here
  PRODUCT_PRICE_SIZE: "24px", // Manually adjust viewed product price size here
};

const ProductView = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const { addToCart } = useCart();

  const product = findProductById(productId);

  // Get related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    // Map category name to slug
    const categorySlugMap: Record<string, string> = {
      "Jewelries": "jewelries",
      "Resin Arts": "resin-arts",
      "Flower Vases": "flower-vases",
      "Hand Crafts": "hand-crafts",
      "Photo Frames": "photo-frames",
    };

    const categorySlug = categorySlugMap[product.category] || product.category.toLowerCase().replace(/\s+/g, "-");
    const categoryProducts = getProductsByCategory(categorySlug);

    return categoryProducts
      .filter((p) => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // Show up to 10 related products
  }, [product]);

  // Get other products (20 random products excluding current and related)
  const otherProducts = useMemo(() => {
    if (!product) return [];

    const allProducts = getAllProducts();
    const excludeIds = [product.id, ...relatedProducts.map((p) => p.id)];

    return allProducts
      .filter((p) => !excludeIds.includes(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 20); // Show 20 random products
  }, [product, relatedProducts]);

  // Prevent refresh on back navigation and preserve scroll position
  useEffect(() => {
    // Check if this is a back navigation by comparing with previous productId
    const previousProductId = sessionStorage.getItem("lastViewedProductId");
    const isBackNavigation = previousProductId === productId && !isInitialMount.current;

    if (isInitialMount.current) {
      // First load - scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      isInitialMount.current = false;
      sessionStorage.setItem("lastViewedProductId", productId || "");
    } else if (!isBackNavigation) {
      // New product navigation - scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      sessionStorage.setItem("lastViewedProductId", productId || "");
    }
    // If it's a back navigation, don't scroll (preserve scroll position)
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWhatsApp = () => {
    const link = getWhatsAppLink(product);
    window.open(link, "_blank");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null; // reset previous
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const changeImage = (newIndex: number) => {
    const total = product.images.length;
    if (newIndex === selectedImageIndex) return;
    // normalize index
    const idx = (newIndex + total) % total;
    setSelectedImageIndex(idx);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 40; // px required for a swipe
    const total = product.images.length;
    if (delta > threshold) {
      // swiped left -> NEXT image
      changeImage((selectedImageIndex + 1) % total);
    } else if (delta < -threshold) {
      // swiped right -> PREVIOUS image
      changeImage((selectedImageIndex - 1 + total) % total);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ===== SPACING VARIABLES - ADJUST THESE VALUES AS NEEDED =====
  const SECTION_SPACING = {
    // Vertical spacing between main sections (in Tailwind classes)
    mainToRelated: "mt-4",        // Reduced from mt-12 (3rem to 1rem) - Gap between main product details and related products
    relatedToOther: "mt-4",       // Reduced from mt-8 (2rem to 1rem) - Gap between related products and other products

    // Horizontal spacing for product grids
    gridGap: {
      mobile: "gap-1.5",           // Gap between product cards on mobile
      desktop: "gap-4 md:gap-6", // Gap between product cards on desktop
    },

    // Padding within sections
    sectionPadding: {
      top: "pt-4",               // Reduced from pt-8 (2rem to 1rem) - Top padding for sections
      bottom: "pb-0",            // Bottom padding for sections
    },

    // Margin for headings
    headingMargin: {
      related: "mb-4",           // Reduced from mb-6 (1.5rem to 1rem) - Margin below "Related Products" heading
      other: "mb-3",             // Reduced from mb-8 (2rem to 1rem) - Margin below "Other Products" heading
    }
  };
  // ===== END SPACING VARIABLES =====

  return (
    <div className="min-h-screen bg-background">
      {product && (
        <SEO
          title={`${product.name}`}
          description={product.description}
          image={product.images[0]}
          type="product"
          schema={{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "Thulirkal"
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "price": product.price,
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition"
            },
            "sku": product.id,
            "category": product.category,
            "material": product.material,
            "weight": product.weight
          }}
        />
      )}
      <Navbar />
      <div className="container mx-auto px-2.5 py-2">
        <div className="space-y-0.5">
          {/* Image Gallery */}
          <div className="space-y-2">
            <div
              className="rounded-lg overflow-hidden bg-muted shadow-card touch-pan-y h-71 sm:h-[28rem] md:h-[32rem]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex h-full w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
              >
                {product.images.map((img, idx) => (
                  <div key={idx} className="w-full flex-shrink-0 h-full">
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => changeImage(index)}
                  className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-transform hover:scale-105 ${selectedImageIndex === index ? "border-primary shadow-soft" : "border-border"
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details below gallery */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-m text-muted-foreground font-medium">
                {product.category}
              </span>
            </div>
            <h1
              className="font-serif font-bold"
              style={{ fontSize: CONFIG.PRODUCT_NAME_SIZE }}
            >
              {product.name}
            </h1>
            <div
              className="font-bold text-primary"
              style={{ fontSize: CONFIG.PRODUCT_PRICE_SIZE }}
            >
              Rs.{product.price.toFixed(2)}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2.5">Description</h2>
              <p className="text-muted-foreground leading-relaxed text-justify">
                {product.description}
              </p>
            </div>

            {/* Product Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Specifications</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  <span className="font-medium">Size: </span>
                  <span>{product.size ?? "—"}</span>
                </div>
                <div>
                  <span className="font-medium">Weight: </span>
                  <span>{product.weight ?? "—"}</span>
                </div>
                <div>
                  <span className="font-medium">Material: </span>
                  <span>{product.material ?? "—"}</span>
                </div>
                <div>
                  <span className="font-medium">Customizable: </span>
                  <span>{product.customizable ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="font-medium">ID: </span>
                  <span>{product.sellerId.toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-medium">Delivery Fee: </span>
                  <span>{product.deliveryFee != null ? `Rs.${product.deliveryFee.toFixed(2)}` : "—"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row flex-wrap gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 gap-2 h-10"
                size="lg"
              >
                <ShoppingCart className="h-6 w-6" />
                Add to Cart
              </Button>
              <Button
                onClick={handleWhatsApp}
                className="flex-1 gap-2 h-10 bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Buy using WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className={`${SECTION_SPACING.mainToRelated} ${SECTION_SPACING.sectionPadding.top} ${SECTION_SPACING.sectionPadding.bottom} border-t border-border`}>
              <h2 className={`text-2xl md:text-3xl font-serif font-bold ${SECTION_SPACING.headingMargin.related}`}>
                Related Products
              </h2>
              {/* Mobile: Horizontal scroll - USING ProductCardMobile COMPONENT */}
              <div className="sm:hidden overflow-x-auto pb-2 px-0 scrollbar-hide">
                <div className={`flex ${SECTION_SPACING.gridGap.mobile} min-w-max`}>
                  {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="flex-shrink-0 w-40">
                      <ProductCardMobile product={relatedProduct} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop: Grid layout */}
              <div className={`hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${SECTION_SPACING.gridGap.desktop}`}>
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}

          {/* Other Products Section */}
          {otherProducts.length > 0 && (
            <div className={`${SECTION_SPACING.relatedToOther} ${SECTION_SPACING.sectionPadding.top} ${SECTION_SPACING.sectionPadding.bottom} border-t border-border`}>
              <h2 className={`text-2xl md:text-3xl font-serif font-bold ${SECTION_SPACING.headingMargin.other}`}>
                Other Products
              </h2>

              {/* Mobile: Two horizontal scroll sections - USING ProductCardMobile COMPONENT */}
              <div className="sm:hidden">
                {/* First scroll section - First 10 products */}
                <div className="overflow-x-auto pb-2 px-0 scrollbar-hide mb-3">
                  <div className={`flex ${SECTION_SPACING.gridGap.mobile} min-w-max`}>
                    {otherProducts.slice(0, 10).map((otherProduct) => (
                      <div key={otherProduct.id} className="flex-shrink-0 w-40">
                        <ProductCardMobile product={otherProduct} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Second scroll section - Next 10 products */}
                <div className="overflow-x-auto pb-4 px-0 scrollbar-hide">
                  <div className={`flex ${SECTION_SPACING.gridGap.mobile} min-w-max`}>
                    {otherProducts.slice(10, 20).map((otherProduct) => (
                      <div key={otherProduct.id} className="flex-shrink-0 w-40">
                        <ProductCardMobile product={otherProduct} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop: Grid layout - 2 rows of 10 products each */}
              <div className="hidden sm:block">
                {/* First row - 10 products */}
                <div className={`grid grid-cols-5 md:grid-cols-5 lg:grid-cols-10 ${SECTION_SPACING.gridGap.desktop} mb-4 md:mb-6`}>
                  {otherProducts.slice(0, 10).map((otherProduct) => (
                    <ProductCard key={otherProduct.id} product={otherProduct} />
                  ))}
                </div>
                {/* Second row - 10 products */}
                <div className={`grid grid-cols-5 md:grid-cols-5 lg:grid-cols-10 ${SECTION_SPACING.gridGap.desktop}`}>
                  {otherProducts.slice(10, 20).map((otherProduct) => (
                    <ProductCard key={otherProduct.id} product={otherProduct} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;
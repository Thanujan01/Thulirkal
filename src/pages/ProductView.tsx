import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { getWhatsAppLink } from "@/lib/cart";
import { toast } from "@/hooks/use-toast";
import { findProductById } from "@/utils/products";

const ProductView = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const { addToCart } = useCart();

  const product = findProductById(productId);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-5">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="rounded-lg overflow-hidden bg-muted shadow-card touch-pan-y h-64 sm:h-96 md:aspect-square"
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

            <div className="flex items-center gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => changeImage(index)}
                  className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-transform hover:scale-105 ${
                    selectedImageIndex === index ? "border-primary shadow-soft" : "border-border"
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

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-m text-muted-foreground font-medium">
                {product.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              {product.name}
            </h1>
            <div className="text-3xl font-bold text-primary mb-6">
              Rs.{product.price.toFixed(2)}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed text-justify">
                {product.description}
              </p>
            </div>

            {/* Product Specifications (shown below description and above actions) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Product Specifications</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  <span className="font-medium">Size: </span>
                  <span>{product.size ?? "—"}</span>
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

            {/* Action Buttons: side-by-side on mobile and desktop; larger touch targets on mobile */}
            <div className="flex flex-row flex-wrap gap-3 mt-auto">
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
        </div>
      </div>
    </div>
  );
};

export default ProductView;

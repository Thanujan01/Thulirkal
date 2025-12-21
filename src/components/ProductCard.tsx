import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";

const CONFIG = {
  PRODUCT_NAME_SIZE: "16px", // Manually adjust product name size here
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rating = product.rating ?? 4.5;
  const sold = product.sold ?? 0;
  // Add to Cart removed from product listing cards; kept on ProductView page

  // WhatsApp/chat removed from product listing cards; kept on ProductView page

  return (
    <Link to={`/product/${product.id}`} state={{ from: 'search' }}>
      <Card className="group overflow-hidden hover-lift shadow-card">
        <div
          className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
          onMouseEnter={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
        >
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-primary w-4" : "bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>
        <CardContent className="p-3">
          <h3
            className="font-sans font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors"
            style={{ fontSize: CONFIG.PRODUCT_NAME_SIZE }}
          >
            {product.name}
          </h3>
          <p className="text-lg font-bold text-primary">Rs.{product.price.toFixed(2)}</p>

          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-xs">{rating.toFixed(1)}</span>
            </div>
            <div className="text-xs">{sold} sold</div>
          </div>
        </CardContent>
        {/* Footer removed from listing cards (actions live on product detail page) */}
      </Card>
    </Link>
  );
};

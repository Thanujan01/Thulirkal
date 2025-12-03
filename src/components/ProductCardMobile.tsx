import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";

interface ProductCardMobileProps {
  product: Product;
}

export const ProductCardMobile = ({ product }: ProductCardMobileProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rating = product.rating ?? 4.5;
  const sold = product.sold ?? 0;

  return (
    <Link to={`/product/${product.id}`} state={{ from: 'search' }}>
      <Card className="overflow-hidden shadow-card">
        <div
          className="relative w-full h-32 bg-muted overflow-hidden"
          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
        >
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-3 py-2">
          <h3 className="font-sans font-medium text-sm line-clamp-1">{product.name}</h3>
          <div className="mt-1">
            <div className="text-sm font-semibold text-primary">Rs.{product.price.toFixed(2)}</div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
              <div className="text-xs">{sold} sold</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

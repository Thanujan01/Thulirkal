import { Product } from "@/types/product";

export const flowerVases: Product[] = [
  {
    id: "fv-001",
    name: "Ceramic Minimalist Vase",
    price: 800.00,
    description: "Elegant handcrafted ceramic vase with smooth matte finish. Perfect for both fresh and dried flowers. Modern minimalist design complements any home decor.",
    rating: 4.6,
    sold: 144,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
      "https://images.unsplash.com/photo-1582138705260-f2ae4ab35e95?w=800&q=80",
      "https://images.unsplash.com/photo-1603503364272-6e28e98c9a8a?w=800&q=80"
    ],
    category: "Flower Vases"
    ,
    sellerId: "SE012",
    size: "25 cm",
    weight: "650 g",
    material: "Ceramic",
    customizable: false,
    deliveryFee: 200
  }
];


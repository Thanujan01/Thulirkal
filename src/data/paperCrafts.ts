import { Product } from "@/types/product";

export const paperCrafts: Product[] = [
  {
    id: "pc-001",
    name: "Handmade Greeting Card Set",
    price: 450.00,
    description: "Beautiful set of 5 handcrafted greeting cards with intricate paper designs. Perfect for special occasions and heartfelt messages. Each card is unique and made with premium quality paper.",
    rating: 4.7,
    sold: 230,
    images: [
      "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80",
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80"
    ],
    category: "Hand Crafts"
    ,
    sellerId: "SE016",
    size: "A6 (approx)",
    weight: "150 g",
    material: "Premium Paper",
    customizable: true,
    deliveryFee: 120
  }
  
];


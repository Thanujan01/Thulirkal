import { Product } from "@/types/product";

export const photoFrames: Product[] = [
  {
    id: "pf-001",
    name: "Wooden Rustic Photo Frame",
    price: 550.00,
    description: "Handcrafted wooden photo frame with rustic finish. Available in 5x7 inch size. Natural wood grain adds warmth to your cherished memories.",
    rating: 4.5,
    sold: 82,
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80",
      "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?w=800&q=80",
      "https://images.unsplash.com/photo-1582138705260-f2ae4ab35e95?w=800&q=80"
    ],
    category: "Photo Frames"
    ,
    sellerId: "SE020",
    size: "5x7 inch",
    weight: "450 g",
    material: "Wood",
    customizable: false,
    deliveryFee: 120
  }
];


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
    material: "Premium Paper",
    customizable: true,
    deliveryFee: 120
  },
  {
    id: "pc-002",
    name: "3D Paper Wall Art",
    price: 1200.00,
    description: "Stunning 3D paper art piece perfect for wall decoration. Features intricate layered design with beautiful color combinations. Ready to hang.",
    rating: 4.6,
    sold: 98,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80",
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80"
    ],
    category: "Hand Crafts"
    ,
    sellerId: "SE017",
    size: "30x30 cm",
    material: "Paper / Cardstock",
    customizable: false,
    deliveryFee: 200
  },
  {
    id: "pc-003",
    name: "Origami Decoration Set",
    price: 650.00,
    description: "Set of 10 colorful origami decorations including cranes, flowers, and butterflies. Perfect for home decoration or special events.",
    rating: 4.5,
    sold: 142,
    images: [
      "https://images.unsplash.com/photo-1578608712688-36b5be8823dc?w=800&q=80",
      "https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=800&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80"
    ],
    category: "Hand Crafts"
    ,
    sellerId: "SE018",
    size: "Varies",
    material: "Paper",
    customizable: false,
    deliveryFee: 150
  },
  {
    id: "pc-004",
    name: "Paper Flower Bouquet",
    price: 850.00,
    description: "Everlasting paper flower bouquet with realistic details. Beautiful arrangement of roses and lilies that never wilts. Perfect gift for any occasion.",
    rating: 4.8,
    sold: 310,
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=800&q=80",
      "https://images.unsplash.com/photo-1508897015243-5a6c3c9920f1?w=800&q=80"
    ],
    category: "Hand Crafts"
    ,
    sellerId: "SE019",
    size: "30 cm bouquet",
    material: "Paper",
    customizable: true,
    deliveryFee: 180
  }
];


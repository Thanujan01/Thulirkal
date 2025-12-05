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
  },
  {
    id: "pf-002",
    name: "Boho Macrame Photo Frame",
    price: 750.00,
    description: "Unique macrame-adorned photo frame combining wood and woven cotton. Perfect for bohemian-style decor. Stands freely or can be wall-mounted.",
    rating: 4.6,
    sold: 110,
    images: [
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80",
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
      "https://images.unsplash.com/photo-1607023941360-6d1dcb3f6253?w=800&q=80"
    ],
    category: "Photo Frames"
    ,
    sellerId: "SE021",
    size: "6x8 inch",
    weight: "380 g",
    material: "Wood / Cotton Macrame",
    customizable: true,
    deliveryFee: 150
  },
  {
    id: "pf-003",
    name: "Resin Art Photo Frame",
    price: 900.00,
    description: "Stunning photo frame with resin art border featuring ocean wave patterns. Each frame is unique with swirling colors. Holds 4x6 inch photos.",
    rating: 4.8,
    sold: 67,
    images: [
      "https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?w=800&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80"
    ],
    category: "Photo Frames"
    ,
    sellerId: "SE022",
    size: "4x6 inch",
    weight: "420 g",
    material: "Resin / Wood",
    customizable: false,
    deliveryFee: 130
  },
  {
    id: "pf-004",
    name: "Multi-Opening Collage Frame",
    price: 1200.00,
    description: "Elegant multi-opening frame holding 4 photos (4x6 inch each). Perfect for displaying family memories or creating a photo gallery wall.",
    rating: 4.4,
    sold: 45,
    images: [
      "https://images.unsplash.com/photo-1585521113522-b8f8e3e90465?w=800&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80"
    ],
    category: "Photo Frames"
    ,
    sellerId: "SE023",
    size: "Multiple (4 x 4x6 inch)",
    weight: "850 g",
    material: "Wood",
    customizable: false,
    deliveryFee: 200
  }
];


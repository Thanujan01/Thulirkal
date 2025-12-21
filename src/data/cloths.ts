import { Product } from "@/types/product";

export const cloths: Product[] = [
    {
        id: "cl1",
        name: "Handmade Saree Blouse Design - Elegant Silk Pattern",
        price: 3500.00,
        description: "Exquisite handmade saree blouse featuring intricate embroidery and premium silk fabric. Custom-tailored to provide a perfect fit and elegant look for weddings and special occasions. Comfortable, breathable, and designed with traditional craftsmanship.",
        images: [
            "/head.png",
            "/slide.png"
        ],
        category: "Cloths",
        sellerId: "SE002",
        rating: 4.8,
        sold: 12,
        size: "Custom",
        weight: "250 g",
        material: "Silk",
        customizable: true,
        deliveryFee: 200
    },
    {
        id: "cl2",
        name: "Traditional Cotton Kurti for Women - Handwoven",
        price: 1850.00,
        description: "Stylish and comfortable handwoven cotton kurti, perfect for casual wear and summer outings. Features unique patterns created by skilled artisans. Lightweight, skin-friendly, and durable fabric that gets softer with every wash.",
        images: [
            "/slide.png",
            "/head.png"
        ],
        category: "Cloths",
        sellerId: "SE002",
        rating: 4.6,
        sold: 45,
        size: "M, L, XL",
        weight: "200 g",
        material: "Cotton",
        customizable: true,
        deliveryFee: 180
    }
];

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  sellerId: string;
  // Optional product specifications
  size?: string;
  material?: string;
  customizable?: boolean;
  // Per-product delivery fee (admin-editable). Currency: LKR
  deliveryFee?: number;
  rating?: number;
  sold?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 
  | "Jewelries"
  | "Resin Arts"
  | "Flower Vases"
  | "Hand Crafts"
  | "Photo Frames";

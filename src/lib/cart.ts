import { Product, CartItem } from "@/types/product";
import { CART_CONFIG, WHATSAPP_CONFIG } from "@/config/constants";

const CART_STORAGE_KEY = CART_CONFIG.STORAGE_KEY;

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return [];
    const parsed = JSON.parse(cartData);
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error("Error parsing cart data:", error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
};

export const addToCart = (product: Product): CartItem[] => {
  // Validate product before adding
  if (!product || !product.id || typeof product.price !== "number" || product.price < 0) {
    console.error("Invalid product data");
    return getCart();
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

export const updateQuantity = (productId: string, quantity: number): CartItem[] => {
  // Validate inputs
  if (!productId || typeof quantity !== "number" || quantity < 0 || !Number.isInteger(quantity)) {
    console.error("Invalid quantity update parameters");
    return getCart();
  }

  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    // Set reasonable maximum quantity limit
    item.quantity = Math.min(quantity, 999);
    saveCart(cart);
  }
  
  return cart;
};

export const clearCart = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getWhatsAppLink = (product: Product, phoneNumber: string = WHATSAPP_CONFIG.DEFAULT_PHONE_NUMBER): string => {
  // Validate phone number format (digits only, optional leading +)
  const cleanPhone = phoneNumber.replace(/^\+/, "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 8) {
    console.error("Invalid phone number format");
    return "";
  }

  // Validate product
  if (!product || !product.id) {
    console.error("Invalid product data");
    return "";
  }

  const delivery = product.deliveryFee != null ? product.deliveryFee : 0;
  const total = (product.price + delivery).toFixed(2);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productLink = `${baseUrl}/product/${encodeURIComponent(product.id)}`;
  const message = `Hi! I'm interested in this product:\n\nName: ${product.name}\nPrice: Rs.${product.price.toFixed(2)}\nDelivery: Rs.${delivery.toFixed(2)}\nTotal (incl. delivery): Rs.${total}\nProduct Link: ${productLink}\n\nPlease let me know the availability.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const getWhatsAppLinkForCart = (
  cart: CartItem[],
  baseUrl: string = typeof window !== "undefined" ? window.location.origin : "",
  phoneNumber: string = WHATSAPP_CONFIG.DEFAULT_PHONE_NUMBER
): string => {
  // Validate phone number
  const cleanPhone = phoneNumber.replace(/^\+/, "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 8) {
    console.error("Invalid phone number format");
    return "";
  }

  if (!cart || cart.length === 0) {
    const msg = `Hi! I would like to chat about your products.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  }

  const lines: string[] = [];
  lines.push("Hi! I'd like to order the following items:");
  lines.push("");
  
  cart.forEach((item, idx) => {
    const productLink = `${baseUrl}/product/${encodeURIComponent(item.id)}`;
    const subtotal = (item.price * item.quantity).toFixed(2);
    lines.push(`${idx + 1}. ${item.name}`);
    lines.push(`   Quantity: ${item.quantity} x Rs.${item.price.toFixed(2)}`);
    lines.push(`   Subtotal: Rs.${subtotal}`);
    lines.push(`   Product Link: ${productLink}`);
    lines.push("");
  });
  
  // Determine delivery fee: if more than one distinct product, fixed fee. If only one distinct product, use that product's deliveryFee (admin-set).
  let deliveryFee = 0;
  if (cart.length > 1) {
    deliveryFee = CART_CONFIG.MULTI_ITEM_DELIVERY_FEE;
  } else if (cart.length === 1) {
    deliveryFee = cart[0].deliveryFee != null ? cart[0].deliveryFee : 0;
  }

  const subtotalNum = getCartTotal(cart);
  const grandTotal = (subtotalNum + deliveryFee).toFixed(2);

  lines.push(`Total Price: Rs.${subtotalNum.toFixed(2)}`);
  lines.push(`Delivery Fee: Rs.${deliveryFee.toFixed(2)}`);
  lines.push("");
  lines.push(`Grand Total (incl. delivery): Rs.${grandTotal}`);
  lines.push("");
  lines.push("Delivery Address:");
  lines.push("Phone:");
  lines.push("");
  lines.push("Please confirm availability and next steps. Thank you!");

  const message = lines.join("\n");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

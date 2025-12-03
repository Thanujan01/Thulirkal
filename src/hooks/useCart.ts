import { useState, useEffect } from "react";
import { CartItem, Product } from "@/types/product";
import { getCart, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, updateQuantity as updateQuantityUtil, getCartTotal } from "@/lib/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
    
    const handleCartUpdate = () => {
      setCart(getCart());
    };
    
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const addToCart = (product: Product) => {
    const updatedCart = addToCartUtil(product);
    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = removeFromCartUtil(productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = updateQuantityUtil(productId, quantity);
    setCart(updatedCart);
  };

  const cartTotal = getCartTotal(cart);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  };
};

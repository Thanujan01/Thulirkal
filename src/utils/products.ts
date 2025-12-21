/**
 * Product data aggregation utilities
 * Centralized product data management
 */

import { jewelries } from "@/data/jewelries";
import { resinArts } from "@/data/resinArts";
import { flowerVases } from "@/data/flowerVases";
import { paperCrafts } from "@/data/paperCrafts";
import { photoFrames } from "@/data/photoFrames";
import { cloths } from "@/data/cloths";
import { Product } from "@/types/product";

/**
 * Get all products from all categories
 */
export const getAllProducts = (): Product[] => {
  return [...jewelries, ...resinArts, ...flowerVases, ...paperCrafts, ...photoFrames, ...cloths];
};

/**
 * Find a product by ID
 * @param productId - The product ID to search for
 * @returns The product if found, undefined otherwise
 */
export const findProductById = (productId: string | undefined): Product | undefined => {
  if (!productId || typeof productId !== "string") {
    return undefined;
  }

  // Sanitize productId to prevent injection
  const sanitizedId = productId.trim();
  if (sanitizedId.length === 0 || sanitizedId.length > 50) {
    return undefined;
  }

  const allProducts = getAllProducts();
  return allProducts.find((p) => p.id === sanitizedId);
};

/**
 * Get products by category
 */
export const getProductsByCategory = (categorySlug: string): Product[] => {
  const categoryMap: Record<string, Product[]> = {
    "jewelries": jewelries,
    "resin-arts": resinArts,
    "flower-vases": flowerVases,
    "hand-crafts": paperCrafts,
    "photo-frames": photoFrames,
    "cloths": cloths,
  };

  return categoryMap[categorySlug] || [];
};


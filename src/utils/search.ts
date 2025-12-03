/**
 * Search utilities for product filtering and ranking
 */

import { Product } from "@/types/product";

export interface SearchResult {
  product: Product;
  score: number;
  matchType: "exact-name" | "name-prefix" | "name-contains" | "description" | "category";
}

/**
 * Check if product name starts with any prefix of the query
 * This allows progressive matching: "jewels" matches "j", "je", "jew", etc.
 */
const matchesProgressivePrefix = (name: string, query: string): number => {
  const lowerName = name.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Check if name starts with query (exact prefix match)
  if (lowerName.startsWith(lowerQuery)) {
    return lowerQuery.length; // Return length of matched prefix
  }
  
  // Check if name starts with any prefix of the query
  // For "jewels", check "j", "je", "jew", "jewe", "jewel", "jewels"
  for (let i = 1; i < lowerQuery.length; i++) {
    const prefix = lowerQuery.substring(0, i);
    if (lowerName.startsWith(prefix)) {
      return i; // Return length of matched prefix
    }
  }
  
  return 0; // No prefix match
};

/**
 * Calculate search score for a product based on query
 * Higher score = better match (shown first)
 */
const calculateSearchScore = (
  product: Product,
  query: string
): { score: number; matchType: SearchResult["matchType"] } => {
  const lowerQuery = query.toLowerCase().trim();
  const lowerName = product.name.toLowerCase();
  const lowerDescription = product.description.toLowerCase();
  const lowerCategory = product.category.toLowerCase();

  // Exact name match (highest priority)
  if (lowerName === lowerQuery) {
    return { score: 1000, matchType: "exact-name" };
  }

  // Name starts with query (exact prefix match - high priority)
  if (lowerName.startsWith(lowerQuery)) {
    // Longer prefix matches get higher score
    const prefixLength = lowerQuery.length;
    return { score: 500 + prefixLength, matchType: "name-prefix" };
  }

  // Progressive prefix match (name starts with any prefix of query)
  // Example: query "jewels" matches product "jewelry" (starts with "j", "je", "jew", "jewe", "jewel")
  const progressiveMatch = matchesProgressivePrefix(lowerName, lowerQuery);
  if (progressiveMatch > 0) {
    // Score based on how much of the query was matched
    return { score: 400 + progressiveMatch, matchType: "name-prefix" };
  }

  // Name contains query (medium priority)
  if (lowerName.includes(lowerQuery)) {
    // Earlier in the name = higher score
    const position = lowerName.indexOf(lowerQuery);
    return { score: 300 - position, matchType: "name-contains" };
  }

  // Description contains query (lower priority)
  if (lowerDescription.includes(lowerQuery)) {
    // Earlier in description = higher score
    const position = lowerDescription.indexOf(lowerQuery);
    return { score: 100 - position, matchType: "description" };
  }

  // Category contains query (lowest priority)
  if (lowerCategory.includes(lowerQuery)) {
    return { score: 50, matchType: "category" };
  }

  return { score: 0, matchType: "exact-name" };
};

/**
 * Search and rank products based on query
 * Returns products sorted by relevance (best matches first)
 */
export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) {
    return products;
  }

  const lowerQuery = query.toLowerCase().trim();

  // Calculate scores for all products
  const results: SearchResult[] = products
    .map((product) => {
      const { score, matchType } = calculateSearchScore(product, lowerQuery);
      return { product, score, matchType };
    })
    .filter((result) => result.score > 0); // Only include matching products

  // Sort by score (descending) - best matches first
  results.sort((a, b) => b.score - a.score);

  // Return products in order of relevance
  return results.map((result) => result.product);
};

/**
 * Check if a product matches the search query
 */
export const productMatchesQuery = (product: Product, query: string): boolean => {
  if (!query.trim()) return true;

  const lowerQuery = query.toLowerCase().trim();
  const lowerName = product.name.toLowerCase();
  const lowerDescription = product.description.toLowerCase();
  const lowerCategory = product.category.toLowerCase();

  return (
    lowerName.includes(lowerQuery) ||
    lowerDescription.includes(lowerQuery) ||
    lowerCategory.includes(lowerQuery)
  );
};


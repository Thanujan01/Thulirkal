/**
 * Application-wide constants and configuration
 * Centralized for easy maintenance and security
 */

// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  DEFAULT_PHONE_NUMBER: "94769823735",
  PLACEHOLDER_PHONE_NUMBER: "1234567890", // For development/testing
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/thulirkal",
  INSTAGRAM: "https://instagram.com/thulirkal",
  TIKTOK: "https://tiktok.com/@thulirkal",
  PINTEREST: "https://in.pinterest.com/thulirkal",
  LINKEDIN: "https://www.linkedin.com/company/thulirkal",
  WHATSAPP: `https://wa.me/${WHATSAPP_CONFIG.DEFAULT_PHONE_NUMBER}`,
} as const;

// Cart Configuration
export const CART_CONFIG = {
  STORAGE_KEY: "handmade-products-cart",
  MULTI_ITEM_DELIVERY_FEE: 300, // Fixed delivery fee for multiple items
} as const;

// Application URLs
export const APP_URLS = {
  HOME: "/",
  CART: "/cart",
  ABOUT: "/about",
  CONTACT: "/contact",
  JEWELRIES: "/jewelries",
} as const;

// Category Configuration
export const CATEGORIES = {
  JEWELRIES: { slug: "jewelries", title: "Jewelries" },
  RESIN_ARTS: { slug: "resin-arts", title: "Resin Arts" },
  FLOWER_VASES: { slug: "flower-vases", title: "Flower Vases" },
  HAND_CRAFTS: { slug: "hand-crafts", title: "Hand Crafts" },
  PHOTO_FRAMES: { slug: "photo-frames", title: "Photo Frames" },
  CLOTHS: { slug: "cloths", title: "Cloths" },
} as const;


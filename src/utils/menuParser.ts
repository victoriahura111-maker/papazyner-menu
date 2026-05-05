// ============================================
// PAPAZYNER'S - MENU PARSER UTILITY
// ============================================

import menuData from '@/data/menu.json';
import type { MenuData, MenuItem, MenuCategory } from './types';

/**
 * Validates and returns the menu data.
 * Falls back to an empty structure if validation fails.
 */
export function getMenuData(): MenuData {
  try {
    if (!menuData || !menuData.categories || !Array.isArray(menuData.categories)) {
      console.warn('Menu data is missing or malformed. Using fallback.');
      return getFallbackMenu();
    }

    // Validate each category
    const validCategories = menuData.categories
      .filter((cat: MenuCategory) => cat && cat.id && cat.name && Array.isArray(cat.items) && cat.items.length > 0)
      .map((cat: MenuCategory) => ({
        ...cat,
        items: cat.items.filter(validateMenuItem),
      }))
      .filter((cat: MenuCategory) => cat.items.length > 0);

    if (validCategories.length === 0) {
      console.warn('No valid categories found. Using fallback.');
      return getFallbackMenu();
    }

    return {
      restaurant: menuData.restaurant || getFallbackRestaurant(),
      categories: validCategories,
    };
  } catch (error) {
    console.error('Failed to parse menu data:', error);
    return getFallbackMenu();
  }
}

/**
 * Validates a single menu item has required fields.
 */
function validateMenuItem(item: MenuItem): boolean {
  if (!item || !item.id || !item.name || typeof item.price !== 'number') {
    console.warn('Skipping invalid menu item:', item?.name || 'unknown');
    return false;
  }

  // Ensure image has a fallback
  if (!item.image || item.image.trim() === '') {
    item.image = '/images/placeholder.jpg';
  }

  // Validate variations if present
  if (item.variations) {
    item.variations = item.variations.filter(
      (v) => v && v.label && typeof v.price === 'number'
    );
  }

  return true;
}

/**
 * Returns a fallback menu structure for error states.
 */
function getFallbackMenu(): MenuData {
  return {
    restaurant: getFallbackRestaurant(),
    categories: [
      {
        id: 'fallback',
        name: 'Menu',
        icon: '🍽️',
        items: [
          {
            id: 'placeholder',
            name: 'Menu Coming Soon',
            price: 0,
            image: '/images/placeholder.jpg',
            description: 'Our full menu will be available shortly.',
          },
        ],
      },
    ],
  };
}

function getFallbackRestaurant() {
  return {
    name: "Papazyner's",
    tagline: 'Quality of Real Taste',
    address: '24, Ogunsiji street, Allen Avenue, Ikeja Lagos',
    phone: '08032775719',
    whatsappNumber: '2348032775719',
    website: 'https://www.papazyners.com',
    social: {
      facebook: '@papazyners',
      twitter: '@papazyners',
      instagram: '@papazyners',
    },
  };
}

/**
 * Converts an item name to an image filename path.
 * Example: "Smokky Jollof Rice" → "/images/smokky-jollof-rice.jpg"
 */
export function itemNameToImagePath(name: string): string {
  if (!name) return '/images/placeholder.jpg';

  const slug = name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '');

  return `/images/${slug}.jpg`;
}

/**
 * Formats a price in Naira.
 */
export function formatNaira(price: number): string {
  if (typeof price !== 'number' || isNaN(price)) return '₦0';
  return `₦${price.toLocaleString('en-NG')}`;
}

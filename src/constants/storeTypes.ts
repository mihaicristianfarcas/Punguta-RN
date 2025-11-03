import { StoreType } from '../types/Store';

export const STORE_TYPE_DEFAULTS: Record<
  StoreType,
  { categoryIds: string[]; icon: string; color: string }
> = {
  [StoreType.GROCERY]: {
    categoryIds: ['produce', 'dairy', 'meat', 'bakery', 'beverages', 'frozen', 'pantry', 'snacks'],
    icon: 'cart',
    color: '#34C759',
  },
  [StoreType.PHARMACY]: {
    categoryIds: ['personal-care', 'medicine', 'vitamins', 'first-aid', 'beauty'],
    icon: 'medkit',
    color: '#FF3B30',
  },
  [StoreType.HARDWARE]: {
    categoryIds: ['tools', 'hardware', 'paint', 'electrical', 'plumbing', 'garden'],
    icon: 'hammer',
    color: '#FF9500',
  },
  [StoreType.HYPERMARKET]: {
    categoryIds: ['beverages', 'snacks', 'dairy', 'bakery', 'personal-care'],
    icon: 'storefront',
    color: '#007AFF',
  },
};

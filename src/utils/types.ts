// ============================================
// PAPAZYNER'S - TYPE DEFINITIONS
// ============================================

export interface MenuItemVariation {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  includes?: string[];
  variations?: MenuItemVariation[];
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  website: string;
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

export interface MenuData {
  restaurant: RestaurantInfo;
  categories: MenuCategory[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variationLabel?: string;
  specialInstructions?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string; variationLabel?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; variationLabel?: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export interface OrderCustomer {
  name: string;
  phone: string;
  location: string;
  notes?: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: CartItem[];
  total: number;
  timestamp: number;
  status: 'pending' | 'sent' | 'failed';
  method: 'whatsapp' | 'direct';
}

export type CheckoutStep = 'cart-review' | 'details' | 'confirm' | 'processing' | 'success';

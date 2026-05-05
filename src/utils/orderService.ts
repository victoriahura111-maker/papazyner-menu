// ============================================
// PAPAZYNER'S - ORDER SERVICE
// ============================================

import type { Order, OrderCustomer, CartItem } from './types';

const GOOGLE_SHEETS_URL = '';
const ORDER_HISTORY_KEY = 'pz_order_history';
const MAX_ORDER_HISTORY = 50;

/**
 * Generates a unique order ID in the format PZ-{timestamp}-{4 random hex chars}.
 * Example: PZ-1714939200-AX92
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const randomHex = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  return `PZ-${timestamp}-${randomHex}`;
}

/**
 * Saves an order to localStorage history.
 * Maintains a maximum of MAX_ORDER_HISTORY orders, newest first.
 */
export function saveOrderToHistory(order: Order): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getOrderHistory();
    existing.unshift(order);

    // Trim to max
    if (existing.length > MAX_ORDER_HISTORY) {
      existing.splice(MAX_ORDER_HISTORY);
    }

    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(existing));
  } catch (error) {
    console.warn('Failed to save order to history:', error);
  }
}

/**
 * Retrieves all saved orders from localStorage, newest first.
 */
export function getOrderHistory(): Order[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ORDER_HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed as Order[];
  } catch {
    console.warn('Failed to load order history from localStorage.');
    return [];
  }
}

/**
 * Sends order data to Google Sheets via a Google Apps Script URL.
 * Fire-and-forget — never throws, always returns a result object.
 * If GOOGLE_SHEETS_URL is empty, returns success immediately (no-op).
 */
export async function sendToGoogleSheets(order: Order): Promise<{ success: boolean; error?: string }> {
  if (!GOOGLE_SHEETS_URL) {
    return { success: true };
  }

  try {
    // Format items as a human-readable string
    const itemsString = order.items
      .map((item) => {
        const label = item.variationLabel ? ` (${item.variationLabel})` : '';
        return `${item.quantity}x ${item.name}${label}`;
      })
      .join(', ');

    const payload = {
      orderId: order.id,
      timestamp: new Date(order.timestamp).toISOString(),
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      customerLocation: order.customer.location,
      items: itemsString,
      total: order.total,
      notes: order.customer.notes || '',
      method: order.method,
    };

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: `Google Sheets responded with status ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.warn('Google Sheets submission failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Creates a new Order object with a generated ID and timestamp.
 */
export function createOrder(
  customer: OrderCustomer,
  items: CartItem[],
  total: number,
  method: 'whatsapp' | 'direct'
): Order {
  return {
    id: generateOrderId(),
    customer,
    items,
    total,
    timestamp: Date.now(),
    status: 'pending',
    method,
  };
}

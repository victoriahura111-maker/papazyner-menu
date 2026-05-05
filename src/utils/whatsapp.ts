// ============================================
// PAPAZYNER'S - WHATSAPP SERVICE
// ============================================

import type { CartItem, OrderCustomer } from './types';
import menuData from '@/data/menu.json';

const RESTAURANT_WHATSAPP = menuData.restaurant?.whatsappNumber || '2348032775719';

// ──────────────────────────────────────────────
//  NEW API (used by CheckoutModal.tsx etc.)
// ──────────────────────────────────────────────

/**
 * Generates a formatted WhatsApp order message.
 * Uses exact format specified in the design document.
 */
export function generateWhatsAppMessage(
  customer: OrderCustomer,
  items: CartItem[],
  total: number,
  orderId: string
): string {
  const currencyFormatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });

  const itemLines = items.map((item) => {
    const itemLabel = item.variationLabel
      ? `${item.name} (${item.variationLabel})`
      : item.name;
    const lineTotal = item.price * item.quantity;
    return `${item.quantity}x ${itemLabel} — ${currencyFormatter.format(lineTotal)}`;
  });

  const formattedTotal = currencyFormatter.format(total);
  const notes = customer.notes && customer.notes.trim() ? customer.notes.trim() : 'None';

  const message = [
    '🥩 *New Order for Papazyner\'s*',
    '',
    `*Customer:* ${customer.name}`,
    `*Phone:* ${customer.phone}`,
    `*Location:* ${customer.location}`,
    '',
    '*Order:*',
    ...itemLines,
    '',
    `*Total: ${formattedTotal}*`,
    '',
    `*Order ID:* ${orderId}`,
    '',
    `*Notes:* ${notes}`,
  ].join('\n');

  return message;
}

/**
 * Cleans a Nigerian phone number to international format (234XXXXXXXXXX).
 */
function cleanPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('0')) {
    return '234' + digits.slice(1);
  }
  if (!digits.startsWith('234')) {
    return '234' + digits;
  }
  return digits;
}

/**
 * Generates a WhatsApp wa.me link with the encoded message.
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const cleaned = cleanPhoneNumber(phoneNumber);
  if (!cleaned) return '';
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp with the order message in a new tab.
 * Returns success/failure for error handling (popup blockers, etc.).
 *
 * Supports TWO signatures via TypeScript overloads:
 *   1. (phoneNumber, message) — used by CheckoutModal
 *   2. (items, subtotal, customerName?, specialInstructions?) — legacy CheckoutView
 */
export function openWhatsApp(phoneNumber: string, message: string): { success: boolean; error?: string };
export function openWhatsApp(items: CartItem[], subtotal: number, customerName?: string, specialInstructions?: string): void;
export function openWhatsApp(
  phoneNumberOrItems: string | CartItem[],
  messageOrSubtotal: string | number,
  customerName?: string,
  specialInstructions?: string
): { success: boolean; error?: string } | void {
  // Signature 1: (phoneNumber, message)
  if (typeof phoneNumberOrItems === 'string') {
    const link = generateWhatsAppLink(phoneNumberOrItems, messageOrSubtotal as string);
    if (!link) {
      return { success: false, error: 'Invalid phone number' };
    }
    const newWindow = window.open(link, '_blank');
    if (!newWindow) {
      return { success: false, error: 'Popup blocked' };
    }
    return { success: true };
  }

  // Signature 2: (items, subtotal, customerName?, specialInstructions?)
  const items = phoneNumberOrItems;
  const subtotal = messageOrSubtotal as number;
  const message = buildLegacyOrderMessage(items, subtotal, customerName, specialInstructions);
  const link = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(link, '_blank');
}

/**
 * Copies text to the system clipboard.
 * Returns success/failure — never throws.
 */
export async function copyToClipboard(
  text: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.warn('Clipboard write failed:', error);
    return { success: false, error: 'Clipboard access denied' };
  }
}

// ──────────────────────────────────────────────
//  LEGACY COMPATIBILITY (used by CheckoutView.tsx)
// ──────────────────────────────────────────────

/**
 * Builds a plain-text order message in the legacy format.
 */
function buildLegacyOrderMessage(
  items: CartItem[],
  subtotal: number,
  customerName?: string,
  specialInstructions?: string
): string {
  const itemLines = items.map((item) => {
    const variationStr = item.variationLabel ? ` (${item.variationLabel})` : '';
    return `${item.quantity}x ${item.name}${variationStr} (₦${(item.price * item.quantity).toLocaleString('en-NG')})`;
  });

  const header = customerName
    ? `Hello Papazyner's, this is ${customerName}. I'd like to order:`
    : `Hello Papazyner's, I'd like to order:`;

  const note = specialInstructions ? `\n\nNote: ${specialInstructions}` : '';

  return `${header}\n\n${itemLines.join('\n')}\n\nTotal: ₦${subtotal.toLocaleString('en-NG')}${note}\n\nPlease confirm availability and delivery time.`;
}

/**
 * Copies the formatted order to clipboard (legacy API for CheckoutView.tsx).
 * Returns boolean for simple success/failure check.
 */
export async function copyOrderToClipboard(
  items: CartItem[],
  subtotal: number,
  customerName?: string,
  specialInstructions?: string
): Promise<boolean> {
  const message = buildLegacyOrderMessage(items, subtotal, customerName, specialInstructions);
  const result = await copyToClipboard(message);
  return result.success;
}

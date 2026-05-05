// ============================================
// PAPAZYNER'S - WHATSAPP SERVICE
// ============================================

import type { CartItem, OrderCustomer } from './types';

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
 * - Strips all non-digit characters
 * - Replaces leading '0' with '234'
 * - Prepends '234' if missing
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
 */
export function openWhatsApp(
  phoneNumber: string,
  message: string
): { success: boolean; error?: string } {
  const link = generateWhatsAppLink(phoneNumber, message);
  if (!link) {
    return { success: false, error: 'Invalid phone number' };
  }

  const newWindow = window.open(link, '_blank');
  if (!newWindow) {
    return { success: false, error: 'Popup blocked' };
  }

  return { success: true };
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

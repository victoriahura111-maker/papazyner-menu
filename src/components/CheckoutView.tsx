// ============================================
// PAPAZYNER'S - CHECKOUT VIEW COMPONENT
// ============================================

import React, { useState } from 'react';
import type { CartItem } from '@/utils/types';
import { formatNaira } from '@/utils/menuParser';
import { openWhatsApp, copyOrderToClipboard } from '@/utils/whatsapp';

interface CheckoutViewProps {
  items: CartItem[];
  subtotal: number;
  onBack: () => void;
  onOrderComplete: () => void;
}

export default function CheckoutView({
  items,
  subtotal,
  onBack,
  onOrderComplete,
}: CheckoutViewProps) {
  const [customerName, setCustomerName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [copied, setCopied] = useState(false);

  const handleWhatsAppOrder = () => {
    openWhatsApp(
      items,
      subtotal,
      customerName.trim() || undefined,
      specialInstructions.trim() || undefined
    );
    onOrderComplete();
  };

  const handleCopy = async () => {
    const success = await copyOrderToClipboard(
      items,
      subtotal,
      customerName.trim() || undefined,
      specialInstructions.trim() || undefined
    );
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate preview of the WhatsApp message
  const previewItems = items.map((item) => {
    const variationStr = item.variationLabel ? ` (${item.variationLabel})` : '';
    return `${item.quantity}x ${item.name}${variationStr} — ${formatNaira(item.price * item.quantity)}`;
  });

  return (
    <div className="checkout animate-fade-in">
      <div className="checkout-header">
        <button className="back-btn" onClick={onBack} aria-label="Back to cart">
          ← Back
        </button>
        <h2 className="checkout-title script">Checkout</h2>
      </div>

      {/* Order Summary */}
      <section className="checkout-section">
        <h3 className="section-title">Order Summary</h3>
        <div className="order-items">
          {items.map((item, i) => (
            <div key={i} className="order-item">
              <span className="order-item-qty">{item.quantity}x</span>
              <span className="order-item-name">
                {item.name}
                {item.variationLabel && (
                  <em className="order-item-var"> ({item.variationLabel})</em>
                )}
              </span>
              <span className="order-item-price">
                {formatNaira(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="gold-divider" />
        <div className="order-total">
          <span>Total</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
      </section>

      {/* Customer Details */}
      <section className="checkout-section">
        <h3 className="section-title">Your Details (Optional)</h3>
        <div className="form-group">
          <label htmlFor="customerName" className="form-label">
            Your Name
          </label>
          <input
            id="customerName"
            type="text"
            className="form-input"
            placeholder="e.g. Tunde"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="instructions" className="form-label">
            Special Instructions
          </label>
          <textarea
            id="instructions"
            className="form-textarea"
            placeholder="e.g. Extra spicy, no onions, deliver to gate..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            maxLength={200}
            rows={3}
          />
        </div>
      </section>

      {/* Message Preview */}
      <section className="checkout-section">
        <h3 className="section-title">Message Preview</h3>
        <div className="message-preview">
          <div className="message-bubble">
            <p className="message-greeting">
              {customerName.trim()
                ? `Hello Papazyner's, this is ${customerName.trim()}. I'd like to order:`
                : "Hello Papazyner's, I'd like to order:"}
            </p>
            <ul className="message-items">
              {previewItems.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <p className="message-total">Total: {formatNaira(subtotal)}</p>
            {specialInstructions.trim() && (
              <p className="message-note">Note: {specialInstructions.trim()}</p>
            )}
            <p className="message-footer">Please confirm availability and delivery time.</p>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="checkout-actions">
        <button className="whatsapp-btn" onClick={handleWhatsAppOrder}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          Order via WhatsApp
        </button>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy Order'}
        </button>
      </div>

      <style jsx>{`
        .checkout {
          padding: var(--space-md, 16px);
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 120px;
        }
        .checkout-header {
          display: flex;
          align-items: center;
          gap: var(--space-md, 16px);
          margin-bottom: var(--space-lg, 24px);
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--color-gold, #D4AF37);
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0;
          transition: color var(--transition-fast, 150ms ease);
        }
        .back-btn:hover {
          color: var(--color-gold-light, #E8C84A);
        }
        .checkout-title {
          font-size: 1.5rem;
          color: var(--color-gold, #D4AF37);
        }
        .checkout-section {
          margin-bottom: var(--space-lg, 24px);
        }
        .section-title {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted, #999999);
          margin-bottom: var(--space-sm, 8px);
        }

        /* Order Items */
        .order-items {
          background: var(--color-bg-elevated, #1A1A1A);
          border-radius: var(--radius-md, 8px);
          padding: var(--space-md, 16px);
          border: 1px solid rgba(212, 175, 55, 0.15);
        }
        .order-item {
          display: flex;
          gap: 8px;
          padding: 6px 0;
          font-size: 0.85rem;
        }
        .order-item-qty {
          font-weight: 700;
          color: var(--color-gold, #D4AF37);
          min-width: 28px;
        }
        .order-item-name {
          flex: 1;
          color: var(--color-text-primary, #FFFFFF);
        }
        .order-item-var {
          color: var(--color-text-muted, #999999);
          font-size: 0.78rem;
        }
        .order-item-price {
          font-weight: 600;
          color: var(--color-text-secondary, #E0E0E0);
          text-align: right;
        }
        .order-total {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-body);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-gold, #D4AF37);
        }

        /* Form */
        .form-group {
          margin-bottom: var(--space-md, 16px);
        }
        .form-label {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-secondary, #E0E0E0);
          margin-bottom: 4px;
        }
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          background: var(--color-bg-elevated, #1A1A1A);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: var(--radius-sm, 4px);
          color: var(--color-text-primary, #FFFFFF);
          font-family: var(--font-body);
          font-size: 0.9rem;
          transition: border-color var(--transition-fast, 150ms ease);
          resize: vertical;
        }
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-gold, #D4AF37);
        }
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: var(--color-text-muted, #999999);
        }

        /* Message Preview */
        .message-preview {
          background: #1B2A1B;
          border-radius: var(--radius-md, 8px);
          padding: var(--space-md, 16px);
          border: 1px solid rgba(37, 211, 102, 0.2);
        }
        .message-bubble {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #D1E7D1;
          line-height: 1.6;
        }
        .message-greeting {
          margin-bottom: 8px;
        }
        .message-items {
          list-style: none;
          padding: 0;
          margin: 8px 0;
        }
        .message-items li {
          padding: 2px 0;
          padding-left: 8px;
        }
        .message-total {
          font-weight: 700;
          margin-top: 6px;
          color: #25D366;
        }
        .message-note {
          font-style: italic;
          margin-top: 4px;
          opacity: 0.8;
        }
        .message-footer {
          margin-top: 6px;
          opacity: 0.7;
        }

        /* Action Buttons */
        .checkout-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm, 8px);
        }
        .whatsapp-btn {
          width: 100%;
          padding: 14px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: var(--radius-md, 8px);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all var(--transition-fast, 150ms ease);
        }
        .whatsapp-btn:hover,
        .whatsapp-btn:focus-visible {
          background: #1DB954;
          outline: none;
          box-shadow: 0 0 20px rgba(37, 211, 102, 0.4);
        }
        .whatsapp-btn:active {
          transform: scale(0.98);
        }
        .copy-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md, 8px);
          color: var(--color-text-secondary, #E0E0E0);
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast, 150ms ease);
        }
        .copy-btn:hover {
          border-color: var(--color-gold, #D4AF37);
          color: var(--color-gold, #D4AF37);
        }
      `}</style>
    </div>
  );
}

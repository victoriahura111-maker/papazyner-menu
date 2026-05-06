// ============================================
// PAPAZYNER'S - CART DRAWER COMPONENT
// Quick view slide-over with link to full cart
// ============================================

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import type { CartItem } from '@/utils/types';
import { formatNaira } from '@/utils/menuParser';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  onUpdateQuantity: (id: string, variationLabel: string | undefined, qty: number) => void;
  onRemoveItem: (id: string, variationLabel?: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  subtotal,
  totalItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        drawerRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab' && drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, a, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;

  return (
    <div className="drawer-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="drawer"
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title script">Your Order</h2>
          <div className="drawer-header-actions">
            {!isEmpty && (
              <button className="clear-btn" onClick={onClearCart} aria-label="Clear cart">
                Clear
              </button>
            )}
            <button className="close-btn" onClick={onClose} aria-label="Close cart">
              ✕
            </button>
          </div>
        </div>

        {/* Empty State */}
        {isEmpty && (
          <div className="empty-cart">
            <span className="empty-icon">🛒</span>
            <p className="empty-text">Your cart is empty</p>
            <p className="empty-sub">Browse the menu and add items to get started!</p>
          </div>
        )}

        {/* Cart Items */}
        {!isEmpty && (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <div key={item.id + (item.variationLabel || '')} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    {item.variationLabel && (
                      <span className="cart-item-variation">{item.variationLabel}</span>
                    )}
                    <span className="cart-item-price">
                      {formatNaira(item.price)} each
                    </span>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.variationLabel, item.quantity - 1)
                      }
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        onUpdateQuantity(item.id, item.variationLabel, item.quantity + 1)
                      }
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                    <span className="cart-item-total">
                      {formatNaira(item.price * item.quantity)}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id, item.variationLabel)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Link to full cart page */}
              <Link href="/cart" className="view-full-cart" onClick={onClose}>
                View Full Cart →
              </Link>
            </div>

            {/* Footer with Total & Checkout */}
            <div className="drawer-footer">
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Items ({totalItems})</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="gold-divider" style={{ margin: 'var(--space-3) 0' }} />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
              </div>
              <button className="checkout-btn" onClick={onCheckout}>
                Order via WhatsApp
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{ marginLeft: 8 }}
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </button>
            </div>
          </>
        )}

        <style jsx>{`
          .drawer-overlay {
            position: fixed;
            inset: 0;
            background: var(--color-bg-overlay);
            z-index: var(--z-drawer);
            display: flex;
            justify-content: flex-end;
            animation: fadeIn 0.2s ease;
          }
          .drawer {
            width: 100%;
            max-width: 420px;
            height: 100%;
            background: var(--color-bg);
            border-left: 2px solid var(--color-gold);
            display: flex;
            flex-direction: column;
            animation: slideInRight 0.3s var(--transition-base);
            outline: none;
          }
          .drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-5) var(--space-6);
            border-bottom: 1px solid var(--color-border);
            flex-shrink: 0;
          }
          .drawer-title {
            font-size: var(--text-xl);
            color: var(--color-gold);
          }
          .drawer-header-actions {
            display: flex;
            gap: var(--space-2);
            align-items: center;
          }
          .clear-btn {
            background: none;
            border: none;
            color: var(--color-text-muted);
            font-size: var(--text-xs);
            cursor: pointer;
            padding: 4px 8px;
            transition: color var(--transition-fast);
            border-radius: var(--radius-sm);
          }
          .clear-btn:hover {
            color: var(--color-red);
          }
          .close-btn {
            background: none;
            border: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            width: 32px;
            height: 32px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: var(--text-base);
            transition: all var(--transition-fast);
          }
          .close-btn:hover {
            border-color: var(--color-gold);
            color: var(--color-gold);
          }

          /* Empty State */
          .empty-cart {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-8);
            text-align: center;
          }
          .empty-icon {
            font-size: 4rem;
            margin-bottom: var(--space-4);
          }
          .empty-text {
            font-size: var(--text-lg);
            color: var(--color-text-secondary);
            font-weight: var(--weight-medium);
          }
          .empty-sub {
            font-size: var(--text-sm);
            color: var(--color-text-muted);
            margin-top: var(--space-1);
          }

          /* Items */
          .drawer-items {
            flex: 1;
            overflow-y: auto;
            padding: var(--space-4);
          }
          .cart-item {
            padding: var(--space-4);
            margin-bottom: var(--space-2);
            background: var(--color-bg-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
          }
          .cart-item-info {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 6px;
            margin-bottom: var(--space-2);
          }
          .cart-item-name {
            font-family: var(--font-script);
            font-size: var(--text-md);
            color: var(--color-text-primary);
          }
          .cart-item-variation {
            font-size: var(--text-xs);
            color: var(--color-gold);
            background: rgba(212, 175, 55, 0.12);
            padding: 1px 8px;
            border-radius: var(--radius-full);
          }
          .cart-item-price {
            font-size: var(--text-xs);
            color: var(--color-text-muted);
            width: 100%;
          }
          .cart-item-actions {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .qty-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--color-border-strong);
            color: var(--color-gold);
            width: 32px;
            height: 32px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: var(--text-md);
            transition: all var(--transition-fast);
            flex-shrink: 0;
          }
          .qty-btn:hover {
            background: var(--color-gold);
            color: var(--color-text-inverse);
            border-color: var(--color-gold);
          }
          .qty-display {
            font-weight: var(--weight-bold);
            font-size: var(--text-base);
            color: var(--color-text-primary);
            min-width: 28px;
            text-align: center;
          }
          .cart-item-total {
            font-weight: var(--weight-bold);
            font-size: var(--text-sm);
            color: var(--color-gold);
            margin-left: auto;
            margin-right: var(--space-2);
          }
          .remove-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            opacity: 0.45;
            color: var(--color-text-muted);
            transition: all var(--transition-fast);
            border-radius: var(--radius-sm);
            display: flex;
          }
          .remove-btn:hover {
            opacity: 1;
            color: var(--color-red);
            background: rgba(227, 30, 36, 0.08);
          }

          /* View Full Cart Link */
          .view-full-cart {
            display: block;
            text-align: center;
            padding: var(--space-3);
            margin-top: var(--space-2);
            color: var(--color-gold);
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            text-decoration: none;
            border-radius: var(--radius-md);
            border: 1px dashed var(--color-border-strong);
            transition: all var(--transition-fast);
          }
          .view-full-cart:hover {
            background: rgba(212, 175, 55, 0.06);
            border-style: solid;
          }

          /* Footer */
          .drawer-footer {
            padding: var(--space-5) var(--space-6);
            border-top: 1px solid var(--color-border);
            flex-shrink: 0;
            background: var(--color-bg);
          }
          .cart-summary {
            margin-bottom: var(--space-4);
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: var(--text-sm);
            color: var(--color-text-secondary);
          }
          .summary-row.total {
            font-size: var(--text-lg);
            font-weight: var(--weight-bold);
            color: var(--color-gold);
          }
          .checkout-btn {
            width: 100%;
            padding: 14px;
            background: var(--color-gold);
            color: var(--color-text-inverse);
            border: none;
            border-radius: var(--radius-md);
            font-size: var(--text-sm);
            font-weight: var(--weight-bold);
            text-transform: uppercase;
            letter-spacing: var(--tracking-wide);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
          }
          .checkout-btn:hover,
          .checkout-btn:focus-visible {
            background: var(--color-gold-light);
            outline: none;
            box-shadow: var(--shadow-gold);
          }
          .checkout-btn:active {
            transform: scale(0.98);
          }
        `}</style>
      </div>
    </div>
  );
}

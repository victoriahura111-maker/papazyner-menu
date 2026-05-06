// ============================================
// PAPAZYNER'S - CART PAGE
// Full-page cart view, mobile responsive
// ============================================

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { CartItem } from '@/utils/types';
import { formatNaira } from '@/utils/menuParser';
import { useCart } from '@/hooks/useCart';
import { openWhatsApp } from '@/utils/whatsapp';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getMenuData } from '@/utils/menuParser';

export default function CartPage() {
  const menu = useMemo(() => getMenuData(), []);
  const { restaurant } = menu;

  const {
    items,
    totalItems,
    subtotal,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [errors, setErrors] = useState<{ name?: string; phone?: string; location?: string }>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const topRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    topRef.current?.focus();
  }, []);

  // Scroll to form when showing checkout
  useEffect(() => {
    if (showCheckoutForm) {
      const formEl = document.getElementById('checkout-form');
      formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showCheckoutForm]);

  const handlePlaceOrder = () => {
    const newErrors: typeof errors = {};
    if (!customerName.trim()) newErrors.name = 'Name is required';
    else if (customerName.trim().length < 2) newErrors.name = 'Name too short';
    if (!customerPhone.trim()) newErrors.phone = 'Phone is required';
    else if (customerPhone.replace(/\D/g, '').length < 11) newErrors.phone = 'Enter valid 11-digit number';
    if (!customerLocation.trim()) newErrors.location = 'Location is required';
    else if (customerLocation.trim().length < 5) newErrors.location = 'Location too short';

    setTouched({ name: true, phone: true, location: true });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Use legacy openWhatsApp with items/customer info
    openWhatsApp(items, subtotal, customerName.trim(), specialInstructions.trim() || undefined);
    setOrderPlaced(true);
    clearCart();
  };

  const handleClearCart = () => {
    if (confirm('Remove all items from your cart?')) {
      clearCart();
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-name gothic">Papazyner's</h1>
          <p className="loading-tagline script">Loading your cart...</p>
          <div className="processing-spinner" />
        </div>
        <style jsx>{`
          .loading-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: var(--color-bg);
          }
          .loading-content { text-align: center; }
          .loading-name {
            font-size: var(--text-3xl);
            color: var(--color-gold);
            margin-bottom: var(--space-1);
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          }
          .loading-tagline {
            font-size: var(--text-lg);
            color: var(--color-text-secondary);
            margin-bottom: var(--space-8);
          }
        `}</style>
      </div>
    );
  }

  const isEmpty = items.length === 0;
  const hasOrdered = orderPlaced && isEmpty;

  return (
    <>
      <Head>
        <title>Cart | Papazyner's</title>
        <meta name="description" content="Review your Papazyner's order" />
      </Head>

      <div className="cart-page" ref={topRef} tabIndex={-1}>
        {/* Header */}
        <Header
          restaurantName={restaurant.name}
          tagline={restaurant.tagline}
          cartCount={totalItems}
        />

        <main className="cart-main container">
          {/* Back to Menu */}
          <nav className="cart-nav">
            <Link href="/" className="back-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Menu
            </Link>
            <h1 className="cart-title script">Your Cart</h1>
            {!isEmpty && (
              <button className="clear-link" onClick={handleClearCart}>
                Clear All
              </button>
            )}
          </nav>

          <div className="gold-divider" />

          {/* ============ ORDER SUCCESS STATE ============ */}
          {hasOrdered && (
            <div className="success-banner animate-scale-in">
              <div className="success-check">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <circle cx="32" cy="32" r="30" stroke="var(--color-green)" strokeWidth="4" fill="none" />
                  <path d="M18 32L28 42L46 22" stroke="var(--color-green)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="success-heading script">Order Sent!</h2>
              <p className="success-text">
                Your order has been sent via WhatsApp. We will confirm shortly.
              </p>
              <Link href="/" className="btn btn--primary btn--lg" style={{ marginTop: 'var(--space-6)' }}>
                Continue Shopping
              </Link>
            </div>
          )}

          {/* ============ EMPTY CART STATE ============ */}
          {isEmpty && !hasOrdered && (
            <div className="empty-state animate-fade-in">
              <span className="empty-icon">🛒</span>
              <h2 className="empty-title script">Your cart is empty</h2>
              <p className="empty-text">
                Looks like you haven't added anything yet. Browse our menu to find something delicious!
              </p>
              <Link href="/" className="btn btn--primary btn--lg" style={{ marginTop: 'var(--space-6)' }}>
                Browse Menu
              </Link>
            </div>
          )}

          {/* ============ CART ITEMS ============ */}
          {!isEmpty && (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id + (item.variationLabel || '')}
                    item={item}
                    onUpdateQty={(qty) => updateQuantity(item.id, item.variationLabel, qty)}
                    onRemove={() => removeItem(item.id, item.variationLabel)}
                  />
                ))}
              </div>

              {/* ============ ORDER SUMMARY ============ */}
              <section className="cart-summary-section">
                <h3 className="section-label">Order Summary</h3>
                <div className="summary-card">
                  <div className="summary-row">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  <div className="summary-row muted">
                    <span>Delivery</span>
                    <span>To be confirmed</span>
                  </div>
                  <div className="gold-divider" style={{ margin: 'var(--space-3) 0' }} />
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                </div>
              </section>

              {/* ============ CHECKOUT FORM ============ */}
              {!showCheckoutForm ? (
                <button
                  className="btn btn--primary btn--lg checkout-trigger"
                  onClick={() => setShowCheckoutForm(true)}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <section id="checkout-form" className="checkout-form-section animate-slide-up">
                  <h3 className="section-label">Your Details</h3>
                  <p className="section-hint">Fill in your details to place the order via WhatsApp.</p>

                  <div className="form-group">
                    <label htmlFor="cart-name" className="form-label">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="cart-name"
                      type="text"
                      className={`form-input${touched.name && errors.name ? ' form-input--error' : ''}`}
                      placeholder="e.g. Tunde Adewale"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, name: true }));
                        if (!customerName.trim()) setErrors((p) => ({ ...p, name: 'Name is required' }));
                        else if (customerName.trim().length < 2) setErrors((p) => ({ ...p, name: 'Name too short' }));
                        else setErrors((p) => ({ ...p, name: undefined }));
                      }}
                      maxLength={50}
                      autoComplete="name"
                    />
                    {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cart-phone" className="form-label">
                      Phone Number <span className="required-star">*</span>
                    </label>
                    <input
                      id="cart-phone"
                      type="tel"
                      className={`form-input${touched.phone && errors.phone ? ' form-input--error' : ''}`}
                      placeholder="e.g. 08032775719"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, phone: true }));
                        const digits = customerPhone.replace(/\D/g, '');
                        if (!customerPhone.trim()) setErrors((p) => ({ ...p, phone: 'Phone is required' }));
                        else if (digits.length < 11) setErrors((p) => ({ ...p, phone: 'Enter valid 11-digit number' }));
                        else setErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      maxLength={15}
                      autoComplete="tel"
                    />
                    {touched.phone && errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cart-location" className="form-label">
                      Delivery Location <span className="required-star">*</span>
                    </label>
                    <input
                      id="cart-location"
                      type="text"
                      className={`form-input${touched.location && errors.location ? ' form-input--error' : ''}`}
                      placeholder="e.g. 15 Adeola Odeku, Ikeja"
                      value={customerLocation}
                      onChange={(e) => setCustomerLocation(e.target.value)}
                      onBlur={() => {
                        setTouched((p) => ({ ...p, location: true }));
                        if (!customerLocation.trim()) setErrors((p) => ({ ...p, location: 'Location is required' }));
                        else if (customerLocation.trim().length < 5) setErrors((p) => ({ ...p, location: 'Location too short' }));
                        else setErrors((p) => ({ ...p, location: undefined }));
                      }}
                      maxLength={200}
                      autoComplete="street-address"
                    />
                    {touched.location && errors.location && <span className="form-error">{errors.location}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cart-instructions" className="form-label">
                      Special Instructions <span className="optional-hint">(optional)</span>
                    </label>
                    <textarea
                      id="cart-instructions"
                      className="form-textarea"
                      placeholder="e.g. Extra spicy, no onions, deliver to gate..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      maxLength={200}
                      rows={3}
                    />
                  </div>

                  <button
                    className="btn btn--green btn--lg whatsapp-btn"
                    onClick={handlePlaceOrder}
                    style={{ width: '100%' }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    Order via WhatsApp
                  </button>

                  <button
                    className="btn btn--ghost"
                    onClick={() => setShowCheckoutForm(false)}
                    style={{ width: '100%', marginTop: 'var(--space-2)' }}
                  >
                    Cancel
                  </button>
                </section>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <Footer restaurant={restaurant} />

        {/* Floating Cart Badge (mobile) — links back to menu when cart has items */}
        {!isEmpty && !hasOrdered && (
          <div className="floating-summary">
            <span className="floating-item-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            <span className="floating-total">{formatNaira(subtotal)}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: var(--z-base);
        }

        .cart-main {
          flex: 1;
          padding-top: var(--space-6);
          padding-bottom: var(--space-16);
        }

        /* --- Navigation --- */
        .cart-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-gold);
          font-size: var(--text-sm);
          font-weight: var(--weight-semibold);
          transition: color var(--transition-fast);
          padding: var(--space-2) 0;
        }
        .back-link:hover,
        .back-link:focus-visible {
          color: var(--color-gold-light);
        }
        .cart-title {
          font-size: var(--text-2xl);
          color: var(--color-gold);
          margin: 0;
          flex: 1;
          text-align: center;
          order: -1;
          width: 100%;
        }
        .clear-link {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: var(--text-xs);
          font-weight: var(--weight-medium);
          cursor: pointer;
          padding: var(--space-2);
          transition: color var(--transition-fast);
        }
        .clear-link:hover {
          color: var(--color-red);
        }

        /* --- Empty State --- */
        .empty-state,
        .success-banner {
          text-align: center;
          padding: var(--space-12) var(--space-4);
        }
        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--space-4);
        }
        .empty-title {
          font-size: var(--text-2xl);
          color: var(--color-gold);
          margin-bottom: var(--space-2);
        }
        .empty-text {
          color: var(--color-text-muted);
          font-size: var(--text-base);
          max-width: 320px;
          margin: 0 auto;
          line-height: var(--leading-relaxed);
        }

        /* --- Success Banner --- */
        .success-check {
          margin-bottom: var(--space-4);
        }
        .success-heading {
          font-size: var(--text-2xl);
          color: var(--color-gold);
          margin-bottom: var(--space-2);
        }
        .success-text {
          color: var(--color-text-secondary);
          font-size: var(--text-base);
          max-width: 320px;
          margin: 0 auto;
          line-height: var(--leading-relaxed);
        }

        /* --- Cart Items --- */
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        /* --- Summary Section --- */
        .cart-summary-section {
          margin-bottom: var(--space-6);
        }
        .section-label {
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          color: var(--color-text-muted);
          margin-bottom: var(--space-3);
        }
        .section-hint {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--space-4);
        }
        .summary-card {
          background: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          padding: 4px 0;
        }
        .summary-row.muted {
          color: var(--color-text-muted);
          font-size: var(--text-xs);
        }
        .summary-row.total {
          font-size: var(--text-lg);
          font-weight: var(--weight-bold);
          color: var(--color-gold);
        }

        /* --- Checkout Trigger --- */
        .checkout-trigger {
          width: 100%;
        }

        /* --- Checkout Form --- */
        .checkout-form-section {
          margin-top: var(--space-6);
          background: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
        }
        .required-star {
          color: var(--color-red);
        }
        .optional-hint {
          color: var(--color-text-muted);
          font-weight: var(--weight-normal);
          font-size: var(--text-xs);
        }
        .whatsapp-btn {
          margin-top: var(--space-4);
        }

        /* --- Floating Summary (mobile) --- */
        .floating-summary {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(13, 13, 13, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--color-border-strong);
          padding: var(--space-3) var(--space-4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: var(--z-sticky);
        }
        .floating-item-count {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          font-weight: var(--weight-medium);
        }
        .floating-total {
          font-size: var(--text-md);
          font-weight: var(--weight-bold);
          color: var(--color-gold);
        }

        /* --- Responsive --- */
        @media (min-width: 600px) {
          .cart-nav {
            flex-wrap: nowrap;
          }
          .cart-title {
            order: 0;
            width: auto;
            flex: 0 1 auto;
          }
          .summary-card {
            padding: var(--space-6);
          }
          .floating-summary {
            display: none;
          }
        }

        @media (min-width: 768px) {
          .cart-items {
            gap: var(--space-4);
          }
        }
      `}</style>
    </>
  );
}

// ============================================
// CART ITEM ROW — Inline sub-component
// ============================================

function CartItemRow({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item-row">
      {/* Image */}
      <div className="cart-item-img">
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="cart-item-img-placeholder script">
            {item.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        {item.variationLabel && (
          <span className="cart-item-variation">{item.variationLabel}</span>
        )}
        <span className="cart-item-unit-price">{formatNaira(item.price)} each</span>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-qty">
        <button
          className="qty-btn"
          onClick={() => onUpdateQty(item.quantity - 1)}
          aria-label={`Decrease ${item.name} quantity`}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => onUpdateQty(item.quantity + 1)}
          aria-label={`Increase ${item.name} quantity`}
        >
          +
        </button>
      </div>

      {/* Line Total */}
      <div className="cart-item-total">{formatNaira(lineTotal)}</div>

      {/* Remove */}
      <button
        className="cart-item-remove"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      <style jsx>{`
        .cart-item-row {
          display: grid;
          grid-template-columns: 72px 1fr auto;
          grid-template-rows: auto auto;
          gap: var(--space-2) var(--space-3);
          align-items: center;
          background: var(--color-bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-3);
          transition: border-color var(--transition-fast);
        }
        .cart-item-row:hover {
          border-color: var(--color-border-strong);
        }

        /* Image */
        .cart-item-img {
          grid-row: 1 / 3;
          width: 72px;
          height: 72px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--color-bg-elevated);
          flex-shrink: 0;
        }
        .cart-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-3xl);
          color: var(--color-gold);
          opacity: 0.3;
          background: linear-gradient(135deg, #1A1A1A, #222);
        }

        /* Details */
        .cart-item-details {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: var(--space-1) var(--space-2);
        }
        .cart-item-name {
          font-family: var(--font-script);
          font-size: var(--text-md);
          color: var(--color-text-primary);
          margin: 0;
          line-height: var(--leading-tight);
        }
        .cart-item-variation {
          font-size: var(--text-xs);
          color: var(--color-gold);
          background: rgba(212, 175, 55, 0.12);
          padding: 1px 8px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }
        .cart-item-unit-price {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          width: 100%;
        }

        /* Quantity */
        .cart-item-qty {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border-strong);
          background: rgba(255, 255, 255, 0.04);
          color: var(--color-gold);
          font-size: var(--text-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .qty-btn:hover:not(:disabled) {
          background: var(--color-gold);
          color: var(--color-text-inverse);
          border-color: var(--color-gold);
        }
        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .qty-value {
          min-width: 28px;
          text-align: center;
          font-weight: var(--weight-bold);
          font-size: var(--text-base);
          color: var(--color-text-primary);
        }

        /* Line Total */
        .cart-item-total {
          font-weight: var(--weight-bold);
          font-size: var(--text-sm);
          color: var(--color-gold);
          text-align: right;
          white-space: nowrap;
        }

        /* Remove */
        .cart-item-remove {
          grid-column: 3;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: var(--space-1);
          opacity: 0.5;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          justify-self: end;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
        }
        .cart-item-remove:hover {
          opacity: 1;
          color: var(--color-red);
          background: rgba(227, 30, 36, 0.08);
        }

        @media (min-width: 480px) {
          .cart-item-row {
            grid-template-columns: 80px 1fr auto auto auto;
            grid-template-rows: 1fr;
            padding: var(--space-4);
          }
          .cart-item-img {
            grid-row: 1;
            width: 80px;
            height: 80px;
          }
          .cart-item-details {
            grid-row: 1;
          }
          .cart-item-qty {
            grid-row: 1;
          }
          .cart-item-total {
            grid-row: 1;
          }
          .cart-item-remove {
            grid-row: 1;
            grid-column: auto;
          }
        }

        @media (min-width: 600px) {
          .cart-item-row {
            grid-template-columns: 96px 1fr auto auto 40px;
          }
          .cart-item-img {
            width: 96px;
            height: 96px;
          }
        }
      `}</style>
    </div>
  );
}

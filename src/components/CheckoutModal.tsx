// ============================================
// PAPAZYNER'S - CHECKOUT MODAL COMPONENT
// ============================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { CartItem, CheckoutStep, Order } from '@/utils/types';
import { formatNaira } from '@/utils/menuParser';
import menuData from '@/data/menu.json';
import { createOrder, saveOrderToHistory, sendToGoogleSheets } from '@/utils/orderService';
import {
  generateWhatsAppMessage,
  openWhatsApp,
  copyToClipboard,
} from '@/utils/whatsapp';
import OrderSuccess from '@/components/OrderSuccess';

const WHATSAPP_NUMBER = menuData.restaurant?.whatsappNumber || '2348032775719';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onOrderComplete: (order: Order) => void;
  onClearCart: () => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  location?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onOrderComplete,
  onClearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('cart-review');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [whatsappFailed, setWhatsappFailed] = useState(false);
  const [clipboardCopied, setClipboardCopied] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [clipboardError, setClipboardError] = useState<string | undefined>();

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setStep('cart-review');
      setName('');
      setPhone('');
      setLocation('');
      setNotes('');
      setErrors({});
      setTouched({});
      setWhatsappFailed(false);
      setClipboardCopied(false);
      setCurrentOrder(null);
      setClipboardError(undefined);

      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (step === 'processing') return; // Don't close during processing
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, step]);

  // --- Validation ---
  const validateName = useCallback((value: string): string | undefined => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  }, []);

  const validatePhone = useCallback((value: string): string | undefined => {
    if (!value.trim()) return 'Phone number is required';
    const digits = value.replace(/\D/g, '');
    if (digits.length < 11) return 'Phone number must be at least 11 digits';
    return undefined;
  }, []);

  const validateLocation = useCallback((value: string): string | undefined => {
    if (!value.trim()) return 'Location is required';
    if (value.trim().length < 5) return 'Location must be at least 5 characters';
    return undefined;
  }, []);

  const handleBlur = useCallback(
    (field: string, value: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      let error: string | undefined;
      switch (field) {
        case 'name':
          error = validateName(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        case 'location':
          error = validateLocation(value);
          break;
      }
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateName, validatePhone, validateLocation]
  );

  const isDetailsValid = (): boolean => {
    return !validateName(name) && !validatePhone(phone) && !validateLocation(location);
  };

  // --- Order Processing ---
  const processWhatsAppOrder = useCallback(async () => {
    setStep('processing');
    setWhatsappFailed(false);
    setClipboardCopied(false);
    setClipboardError(undefined);

    const customer = {
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      notes: notes.trim() || undefined,
    };

    const order = createOrder(customer, cartItems, cartTotal, 'whatsapp');
    setCurrentOrder(order);

    // Always save to localStorage first — never lose an order
    saveOrderToHistory(order);

    // Fire-and-forget Google Sheets
    sendToGoogleSheets(order).catch(() => {
      // Silently ignore — already saved to localStorage
    });

    // Generate WhatsApp message and try to open
    const message = generateWhatsAppMessage(customer, cartItems, cartTotal, order.id);
    const result = openWhatsApp(WHATSAPP_NUMBER, message);

    if (!result.success) {
      setWhatsappFailed(true);
      // Still notify completion
      onOrderComplete(order);
      onClearCart();
      return;
    }

    onOrderComplete(order);
    onClearCart();
  }, [name, phone, location, notes, cartItems, cartTotal, onOrderComplete, onClearCart]);

  const processDirectOrder = useCallback(async () => {
    setStep('processing');

    const customer = {
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      notes: notes.trim() || undefined,
    };

    const order = createOrder(customer, cartItems, cartTotal, 'direct');
    setCurrentOrder(order);

    // Always save to localStorage first
    saveOrderToHistory(order);

    // Fire-and-forget Google Sheets
    sendToGoogleSheets(order).catch(() => {
      // Silently ignore
    });

    setStep('success');
    onOrderComplete(order);
    onClearCart();
  }, [name, phone, location, notes, cartItems, cartTotal, onOrderComplete, onClearCart]);

  const handleClipboardCopy = async () => {
    if (!currentOrder) return;
    const customer = {
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      notes: notes.trim() || undefined,
    };
    const message = generateWhatsAppMessage(customer, cartItems, cartTotal, currentOrder.id);
    const result = await copyToClipboard(message);
    if (result.success) {
      setClipboardCopied(true);
      setTimeout(() => setClipboardCopied(false), 3000);
    } else {
      setClipboardError(result.error);
    }
  };

  // --- Render Helpers ---
  const renderCartReview = () => (
    <>
      <div className="modal-body">
        <h3 className="checkout-section-title">Review Your Order</h3>
        <div className="order-summary">
          {cartItems.map((item) => {
            const itemLabel = item.variationLabel
              ? `${item.name} (${item.variationLabel})`
              : item.name;
            const lineTotal = item.price * item.quantity;
            return (
              <div key={item.id + (item.variationLabel || '')} className="order-summary-item">
                <span className="order-summary-item-info">
                  <span className="order-summary-item-qty">{item.quantity}x</span>
                  <span className="order-summary-item-name">{itemLabel}</span>
                </span>
                <span className="order-summary-item-price">{formatNaira(lineTotal)}</span>
              </div>
            );
          })}
          <div className="gold-divider" />
          <div className="order-summary-total">
            <span>Total</span>
            <span>{formatNaira(cartTotal)}</span>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="checkout-btn checkout-btn--secondary" onClick={onClose}>
          ← Back
        </button>
        <button
          className="checkout-btn checkout-btn--primary"
          onClick={() => setStep('details')}
        >
          Continue
        </button>
      </div>
    </>
  );

  const renderDetails = () => {
    // Check all fields on continue attempt
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    const locErr = validateLocation(location);

    return (
      <>
        <div className="modal-body">
          <h3 className="checkout-section-title">Your Details</h3>

          <div className="checkout-form-group">
            <label htmlFor="checkout-name" className="checkout-form-label">
              Name <span className="checkout-form-required">*</span>
            </label>
            <input
              id="checkout-name"
              type="text"
              className={`checkout-form-input${touched.name && errors.name ? ' checkout-form-input--error' : ''}`}
              placeholder="e.g. Tunde Adewale"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur('name', name)}
              maxLength={50}
              autoComplete="name"
            />
            {touched.name && errors.name && (
              <span className="checkout-form-error">{errors.name}</span>
            )}
          </div>

          <div className="checkout-form-group">
            <label htmlFor="checkout-phone" className="checkout-form-label">
              Phone Number <span className="checkout-form-required">*</span>
            </label>
            <input
              id="checkout-phone"
              type="tel"
              className={`checkout-form-input${touched.phone && errors.phone ? ' checkout-form-input--error' : ''}`}
              placeholder="e.g. 08032775719"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => handleBlur('phone', phone)}
              maxLength={15}
              autoComplete="tel"
            />
            {touched.phone && errors.phone && (
              <span className="checkout-form-error">{errors.phone}</span>
            )}
          </div>

          <div className="checkout-form-group">
            <label htmlFor="checkout-location" className="checkout-form-label">
              Location / Address <span className="checkout-form-required">*</span>
            </label>
            <input
              id="checkout-location"
              type="text"
              className={`checkout-form-input${touched.location && errors.location ? ' checkout-form-input--error' : ''}`}
              placeholder="e.g. 15 Adeola Odeku, Ikeja"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => handleBlur('location', location)}
              maxLength={200}
              autoComplete="street-address"
            />
            {touched.location && errors.location && (
              <span className="checkout-form-error">{errors.location}</span>
            )}
          </div>

          <div className="checkout-form-group">
            <label htmlFor="checkout-notes" className="checkout-form-label">
              Notes (Optional)
            </label>
            <textarea
              id="checkout-notes"
              className="checkout-form-input"
              placeholder="e.g. Extra spicy, no onions, deliver to gate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={200}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="checkout-btn checkout-btn--secondary"
            onClick={() => setStep('cart-review')}
          >
            ← Back
          </button>
          <button
            className="checkout-btn checkout-btn--primary"
            onClick={() => {
              setTouched({ name: true, phone: true, location: true });
              setErrors({ name: nameErr, phone: phoneErr, location: locErr });
              if (!nameErr && !phoneErr && !locErr) {
                setStep('confirm');
              }
            }}
            disabled={!name.trim() || !phone.trim() || !location.trim()}
          >
            Continue
          </button>
        </div>
      </>
    );
  };

  const renderConfirm = () => (
    <>
      <div className="modal-body">
        <h3 className="checkout-section-title">Confirm Your Order</h3>

        {/* Customer Info Summary */}
        <div className="order-summary">
          <h4 className="checkout-subtitle">Customer Details</h4>
          <div className="order-summary-item">
            <span>Name</span>
            <span>{name.trim()}</span>
          </div>
          <div className="order-summary-item">
            <span>Phone</span>
            <span>{phone.trim()}</span>
          </div>
          <div className="order-summary-item">
            <span>Location</span>
            <span>{location.trim()}</span>
          </div>
          {notes.trim() && (
            <div className="order-summary-item">
              <span>Notes</span>
              <span>{notes.trim()}</span>
            </div>
          )}
        </div>

        {/* Order Items Summary */}
        <div className="order-summary" style={{ marginTop: 'var(--space-md)' }}>
          <h4 className="checkout-subtitle">Order Items</h4>
          {cartItems.map((item) => {
            const itemLabel = item.variationLabel
              ? `${item.name} (${item.variationLabel})`
              : item.name;
            const lineTotal = item.price * item.quantity;
            return (
              <div key={item.id + (item.variationLabel || '')} className="order-summary-item">
                <span className="order-summary-item-info">
                  <span className="order-summary-item-qty">{item.quantity}x</span>
                  <span className="order-summary-item-name">{itemLabel}</span>
                </span>
                <span className="order-summary-item-price">{formatNaira(lineTotal)}</span>
              </div>
            );
          })}
          <div className="gold-divider" />
          <div className="order-summary-total">
            <span>Total</span>
            <span>{formatNaira(cartTotal)}</span>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          className="checkout-btn checkout-btn--secondary"
          onClick={() => setStep('details')}
        >
          ← Back
        </button>
        <button
          className="checkout-btn checkout-btn--whatsapp"
          onClick={processWhatsAppOrder}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            style={{ marginRight: 8 }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          Order via WhatsApp
        </button>
        <button
          className="checkout-btn checkout-btn--primary"
          onClick={processDirectOrder}
        >
          Place Order (No WhatsApp)
        </button>
      </div>
    </>
  );

  const renderProcessing = () => (
    <div className="modal-body" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
      <div className="processing-spinner" />
      <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>
        Processing your order...
      </p>
      {whatsappFailed && (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <p style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-text-muted)' }}>
            WhatsApp couldn't be opened automatically.
          </p>
          <button
            className="checkout-btn checkout-btn--whatsapp"
            onClick={handleClipboardCopy}
          >
            {clipboardCopied ? '✓ Copied to Clipboard!' : '📋 Copy Order to Clipboard'}
          </button>
          {clipboardError && (
            <p className="checkout-form-error" style={{ marginTop: 'var(--space-sm)' }}>
              {clipboardError}
            </p>
          )}
        </div>
      )}
    </div>
  );

  // --- Main Render ---
  if (!isOpen) return null;

  const stepLabels: Record<CheckoutStep, string> = {
    'cart-review': 'Cart Review',
    'details': 'Details',
    'confirm': 'Confirm',
    'processing': 'Processing',
    'success': 'Success',
  };

  const stepOrder: CheckoutStep[] = ['cart-review', 'details', 'confirm'];

  return (
    <div className="modal-overlay" onClick={step === 'processing' ? undefined : onClose} aria-hidden="true">
      <div
        className="modal-card"
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title script">Checkout</h2>
          {step !== 'processing' && (
            <button className="modal-close-btn" onClick={onClose} aria-label="Close checkout">
              ✕
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 'processing' && step !== 'success' && (
          <div className="step-indicator">
            {stepOrder.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`step-indicator__step${step === s ? ' step-indicator__step--active' : ''}${stepOrder.indexOf(step) > i ? ' step-indicator__step--completed' : ''}`}>
                  <span className="step-indicator__number">
                    {stepOrder.indexOf(step) > i ? '✓' : i + 1}
                  </span>
                  <span className="step-indicator__label">{stepLabels[s]}</span>
                </div>
                {i < stepOrder.length - 1 && (
                  <div className={`step-indicator__line${stepOrder.indexOf(step) > i ? ' step-indicator__line--completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Step Content */}
        {step === 'cart-review' && renderCartReview()}
        {step === 'details' && renderDetails()}
        {step === 'confirm' && renderConfirm()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && currentOrder && (
          <OrderSuccess order={currentOrder} onClose={onClose} />
        )}
      </div>

      <style jsx>{`
        .checkout-section-title {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin-bottom: var(--space-md);
        }
        .checkout-subtitle {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-gold);
          margin-bottom: var(--space-sm);
        }
        .checkout-form-required {
          color: var(--color-red);
        }
        .order-summary-total {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-body);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-gold);
        }
        .order-summary-item-info {
          display: flex;
          gap: 6px;
          align-items: baseline;
          flex: 1;
        }
        .order-summary-item-qty {
          font-weight: 700;
          color: var(--color-gold);
          min-width: 24px;
        }
        .order-summary-item-name {
          color: var(--color-text-primary);
        }
        .order-summary-item-price {
          font-weight: 600;
          color: var(--color-text-secondary);
          text-align: right;
          flex-shrink: 0;
        }
        .modal-title {
          font-size: 1.4rem;
          color: var(--color-gold);
        }
        .modal-close-btn {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--color-text-secondary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .modal-close-btn:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
      `}</style>
    </div>
  );
}

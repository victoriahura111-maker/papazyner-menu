// ============================================
// PAPAZYNER'S - MAIN PAGE (INDEX)
// ============================================

import React, { useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import type { MenuItem, MenuCategory, Order } from '@/utils/types';
import { getMenuData, formatNaira } from '@/utils/menuParser';
import { useCart } from '@/hooks/useCart';

// Components
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import MenuCard from '@/components/MenuCard';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';

// View states
type ViewState = 'menu' | 'checkout';

export default function Home() {
  // --- Data ---
  const menuData = useMemo(() => getMenuData(), []);
  const { restaurant, categories } = menuData;

  // --- Cart ---
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

  // --- UI State ---
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id || ''
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState<ViewState>('menu');
  const [menuVisible, setMenuVisible] = useState(false);

  // Show menu after cart loads to prevent flash
  React.useEffect(() => {
    if (isLoaded) {
      setMenuVisible(true);
      // Set initial category from URL hash if present
      const hash = window.location.hash?.replace('#', '');
      if (hash && categories.some((c) => c.id === hash)) {
        setActiveCategory(hash);
      }
    }
  }, [isLoaded, categories]);

  // --- Handlers ---
  const handleAddToCart = useCallback(
    (item: MenuItem, variationLabel?: string) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        variationLabel,
      });
    },
    [addItem]
  );

  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    setView('checkout');
  }, []);

  const handleCheckoutClose = useCallback(() => {
    setView('menu');
  }, []);

  const handleOrderComplete = useCallback((_order: Order) => {
    setView('menu');
  }, []);

  // Check if an item is in cart
  const isItemInCart = useCallback(
    (itemId: string, variationLabel?: string) => {
      return items.some((ci) => {
        if (ci.id !== itemId) return false;
        if (variationLabel) return ci.variationLabel === variationLabel;
        return true;
      });
    },
    [items]
  );

  // Active category items
  const activeItems = useMemo(() => {
    const cat = categories.find((c) => c.id === activeCategory);
    return cat?.items || [];
  }, [categories, activeCategory]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-name gothic">Papazyner's</h1>
          <p className="loading-tagline script">Quality of Real Taste</p>
          <div className="loading-spinner" />
        </div>

        <style jsx>{`
          .loading-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: var(--color-bg, #0D0D0D);
          }
          .loading-content {
            text-align: center;
          }
          .loading-name {
            font-size: 2rem;
            color: var(--color-gold, #D4AF37);
            margin-bottom: 4px;
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          }
          .loading-tagline {
            font-size: 1.1rem;
            color: var(--color-text-secondary, #E0E0E0);
            margin-bottom: var(--space-xl, 32px);
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(212, 175, 55, 0.2);
            border-top-color: var(--color-gold, #D4AF37);
            border-radius: 50%;
            margin: 0 auto;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Papazyner's | Digital Menu</title>
      </Head>

      <div className="app">
        {/* Header */}
        <Header
          restaurantName={restaurant.name}
          tagline={restaurant.tagline}
          cartCount={totalItems}
          onCartClick={() => setCartOpen(true)}
        />

        {view === 'menu' && (
          <>
            {/* Category Navigation */}
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />

            {/* Menu Grid */}
            <main className="menu-grid container" style={{ opacity: menuVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              {activeCategory && (
                <div className="category-section">
                  <div className="category-header">
                    <h2 className="category-title gothic">{categories.find(c => c.id === activeCategory)?.name}</h2>
                    <div className="gold-divider" />
                  </div>

                  {activeItems.length === 0 && (
                    <div className="empty-category">
                      <p>No items in this category yet.</p>
                    </div>
                  )}

                  <div className="menu-items">
                    {activeItems.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        onAddToCart={handleAddToCart}
                        isInCart={isItemInCart(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Footer */}
            <Footer restaurant={restaurant} />
          </>
        )}

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={view === 'checkout'}
          onClose={handleCheckoutClose}
          cartItems={items}
          cartTotal={subtotal}
          onOrderComplete={handleOrderComplete}
          onClearCart={clearCart}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={items}
          subtotal={subtotal}
          totalItems={totalItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
        />

        {/* Floating Cart Button (mobile) */}
        {view === 'menu' && totalItems > 0 && !cartOpen && (
          <button
            className="floating-cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart with ${totalItems} items`}
          >
            <span className="floating-cart-icon">🛒</span>
            <span className="floating-cart-count">{totalItems}</span>
            <span className="floating-cart-total">{formatNaira(subtotal)}</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .menu-grid {
          flex: 1;
          padding-top: var(--space-md, 16px);
          padding-bottom: var(--space-2xl, 48px);
        }

        .category-section {
          margin-bottom: var(--space-lg, 24px);
        }

        .category-header {
          margin-bottom: var(--space-md, 16px);
        }

        .category-title {
          font-size: 1.3rem;
          color: var(--color-text-primary, #FFFFFF);
          margin-bottom: var(--space-sm, 8px);
          text-align: center;
        }

        .empty-category {
          text-align: center;
          padding: var(--space-xl, 32px);
          color: var(--color-text-muted, #999999);
          font-family: var(--font-body);
        }

        .menu-items {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md, 16px);
        }

        /* Floating Cart Button */
        .floating-cart-btn {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 250;
          background: var(--color-gold, #D4AF37);
          color: var(--color-bg, #0D0D0D);
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(212, 175, 55, 0.4);
          animation: slideUp 0.3s ease;
          transition: all var(--transition-fast, 150ms ease);
        }
        .floating-cart-btn:hover,
        .floating-cart-btn:focus-visible {
          background: var(--color-gold-light, #E8C84A);
          box-shadow: 0 6px 28px rgba(212, 175, 55, 0.6);
          outline: none;
          transform: translateX(-50%) translateY(-2px);
        }
        .floating-cart-btn:active {
          transform: translateX(-50%) scale(0.97);
        }
        .floating-cart-icon {
          font-size: 1.2rem;
        }
        .floating-cart-count {
          background: var(--color-bg, #0D0D0D);
          color: var(--color-gold, #D4AF37);
          border-radius: 50%;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
        .floating-cart-total {
          font-size: 0.85rem;
        }

        /* Responsive: 2-column grid on larger screens */
        @media (min-width: 600px) {
          .menu-items {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 900px) {
          .menu-items {
            grid-template-columns: repeat(3, 1fr);
          }
          .category-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </>
  );
}

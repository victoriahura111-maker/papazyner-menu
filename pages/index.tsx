// ============================================
// PAPAZYNER'S - MAIN PAGE (INDEX)
// Refined, mobile-first, design-aligned
// ============================================

import React, { useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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

  const activeItems = useMemo(() => {
    const cat = categories.find((c) => c.id === activeCategory);
    return cat?.items || [];
  }, [categories, activeCategory]);

  // --- Loading State ---
  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-name gothic">Papazyner's</h1>
          <p className="loading-tagline script">Quality of Real Taste</p>
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

  return (
    <>
      <Head>
        <title>Papazyner's | Digital Menu</title>
      </Head>

      <div className="app">
        {/* Header — cart icon navigates to /cart page */}
        <Header
          restaurantName={restaurant.name}
          tagline={restaurant.tagline}
          cartCount={totalItems}
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
            <main
              className="menu-grid container"
              style={{ opacity: menuVisible ? 1 : 0, transition: 'opacity 0.35s var(--transition-base)' }}
            >
              {activeCategory && (
                <div className="category-section">
                  <div className="category-header">
                    <h2 className="category-title gothic">
                      {categories.find((c) => c.id === activeCategory)?.name}
                    </h2>
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

        {/* Cart Drawer (quick view on mobile) */}
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

        {/* Floating Cart Button (mobile) — links to /cart */}
        {view === 'menu' && totalItems > 0 && !cartOpen && (
          <Link href="/cart" className="floating-cart-btn" aria-label={`View cart — ${totalItems} items, ${formatNaira(subtotal)}`}>
            <span className="floating-cart-icon">🛒</span>
            <span className="floating-cart-count">{totalItems}</span>
            <span className="floating-cart-total">{formatNaira(subtotal)}</span>
          </Link>
        )}
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: var(--z-base);
        }

        .menu-grid {
          flex: 1;
          padding-top: var(--space-4);
          padding-bottom: var(--space-12);
        }

        .category-section {
          margin-bottom: var(--space-6);
        }

        .category-header {
          margin-bottom: var(--space-4);
        }

        .category-title {
          font-size: var(--text-xl);
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
          text-align: center;
        }

        .empty-category {
          text-align: center;
          padding: var(--space-8);
          color: var(--color-text-muted);
        }

        .menu-items {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        /* Floating Cart Button */
        .floating-cart-btn {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: var(--z-dropdown);
          background: var(--color-gold);
          color: var(--color-text-inverse);
          border: none;
          border-radius: var(--radius-full);
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: var(--weight-bold);
          font-size: var(--text-sm);
          cursor: pointer;
          text-decoration: none;
          box-shadow: var(--shadow-gold-lg);
          animation: slideUp 0.3s var(--transition-base);
          transition: all var(--transition-fast);
          -webkit-tap-highlight-color: transparent;
        }
        .floating-cart-btn:hover,
        .floating-cart-btn:focus-visible {
          background: var(--color-gold-light);
          box-shadow: 0 6px 32px rgba(212, 175, 55, 0.55);
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
          background: var(--color-text-inverse);
          color: var(--color-gold);
          border-radius: var(--radius-full);
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
        }
        .floating-cart-total {
          font-size: var(--text-sm);
        }

        /* Responsive grid */
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
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </>
  );
}

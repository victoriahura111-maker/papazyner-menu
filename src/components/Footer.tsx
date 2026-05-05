// ============================================
// PAPAZYNER'S - FOOTER COMPONENT
// ============================================

import React from 'react';
import type { RestaurantInfo } from '@/utils/types';

interface FooterProps {
  restaurant: RestaurantInfo;
}

export default function Footer({ restaurant }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <h3 className="footer-name gothic">{restaurant.name}</h3>
          <p className="footer-tagline script">{restaurant.tagline}</p>
        </div>

        <div className="gold-divider" />

        <div className="footer-contact">
          <p className="contact-line">
            📍 {restaurant.address}
          </p>
          <p className="contact-line">
            📞 <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
          </p>
          <p className="contact-line">
            🌐 <a href={restaurant.website} target="_blank" rel="noopener noreferrer">papazyners.com</a>
          </p>
        </div>

        <div className="footer-social">
          <span className="social-label body-font">Follow us:</span>
          <div className="social-links">
            <a
              href={`https://instagram.com/${restaurant.social.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              Instagram
            </a>
            <a
              href={`https://facebook.com/${restaurant.social.facebook.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="social-link"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/${restaurant.social.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="social-link"
            >
              Twitter
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright body-font">
            &copy; {currentYear} {restaurant.name}. All rights reserved.
          </p>
          <p className="powered-by body-font">
            Made with 🔥 in Lagos
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--color-bg, #0D0D0D);
          border-top: 2px solid var(--color-gold, #D4AF37);
          padding: var(--space-2xl, 48px) 0 var(--space-lg, 24px);
          margin-top: var(--space-2xl, 48px);
        }
        .footer-inner {
          text-align: center;
        }
        .footer-brand {
          margin-bottom: var(--space-lg, 24px);
        }
        .footer-name {
          font-size: 1.4rem;
          color: var(--color-gold, #D4AF37);
          margin-bottom: 4px;
        }
        .footer-tagline {
          font-size: 0.9rem;
          color: var(--color-text-secondary, #E0E0E0);
        }
        .footer-contact {
          margin: var(--space-lg, 24px) 0;
        }
        .contact-line {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--color-text-secondary, #E0E0E0);
          margin: 8px 0;
        }
        .contact-line a {
          color: var(--color-gold, #D4AF37);
          text-decoration: none;
          transition: color var(--transition-fast, 150ms ease);
        }
        .contact-line a:hover {
          color: var(--color-gold-light, #E8C84A);
          text-decoration: underline;
        }
        .footer-social {
          margin: var(--space-lg, 24px) 0;
        }
        .social-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #999999);
          margin-bottom: var(--space-sm, 8px);
        }
        .social-links {
          display: flex;
          justify-content: center;
          gap: var(--space-md, 16px);
        }
        .social-link {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: var(--color-text-secondary, #E0E0E0);
          text-decoration: none;
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 6px 16px;
          border-radius: 20px;
          transition: all var(--transition-fast, 150ms ease);
        }
        .social-link:hover {
          border-color: var(--color-gold, #D4AF37);
          color: var(--color-gold, #D4AF37);
        }
        .footer-bottom {
          margin-top: var(--space-lg, 24px);
          padding-top: var(--space-md, 16px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .copyright {
          font-size: 0.75rem;
          color: var(--color-text-muted, #999999);
        }
        .powered-by {
          font-size: 0.7rem;
          color: var(--color-text-muted, #999999);
          margin-top: 4px;
        }
      `}</style>
    </footer>
  );
}

# Papazyner's Digital Menu & Ordering System

**Serverless, mobile-first QR-based canteen ordering system**

Built with Next.js, TypeScript, and pure client-side state management. No backend required.

---

## 📋 Features

- **Mobile-First Digital Menu** — Browse 50+ items across 6 categories with the premium "smoky BBQ" aesthetic
- **Smart Cart System** — Add/remove items, adjust quantities, localStorage persistence
- **WhatsApp Ordering** — One-tap checkout generates a formatted WhatsApp message via `wa.me`
- **Variation Support** — Items with size/option variations (e.g., Shawarma: Small/Large)
- **Platter Combo Display** — Platters show included items and pricing
- **QR-Ready** — Deploy to Vercel/Netlify and generate a QR code for customer access
- **Design System Compliant** — Strictly follows Papazyner's brand guidelines (colors, typography, UI patterns)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Install & Run

```bash
cd papazyner-menu
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

Static files are output to `out/` — deploy anywhere.

---

## 📁 Project Structure

```
papazyner-menu/
├── pages/
│   ├── _app.tsx              # App wrapper with meta tags, global CSS
│   └── index.tsx             # Main page — assembles all components
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Sticky header with branding + cart button
│   │   ├── CategoryNav.tsx   # Horizontal scrollable category chips
│   │   ├── MenuCard.tsx      # Food item card with price seal, variations modal
│   │   ├── PriceSeal.tsx     # SVG starburst price seal (design system)
│   │   ├── CartDrawer.tsx    # Slide-in cart with quantity controls
│   │   ├── CheckoutView.tsx  # Order review, customer details, WhatsApp preview
│   │   └── Footer.tsx        # Contact info, social links, copyright
│   ├── hooks/
│   │   └── useCart.ts        # Cart state management with localStorage persistence
│   ├── utils/
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── menuParser.ts     # Menu validation, fallback, formatting
│   │   └── whatsapp.ts       # WhatsApp message generation & link construction
│   ├── data/
│   │   └── menu.json         # Structured menu data (parsed from MENU.md)
│   └── styles/
│       └── globals.css       # Design system tokens, reset, animations
├── public/
│   └── images/               # Place food images here (see Image Guide below)
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 🎨 Design System

| Aspect | Specification |
|--------|--------------|
| **Background** | `#0D0D0D` (Deep Charcoal) |
| **Primary Accent** | `#D4AF37` (Papazyner Gold) |
| **Secondary Accent** | `#FFD700` (Warning Yellow) |
| **Primary Text** | `#FFFFFF` (Pure White) |
| **Headings** | UnifrakturMaguntia (Gothic/Blackletter) |
| **Item Names** | Satisfy (Elegant Script) |
| **Body Text** | Montserrat (Clean Sans-serif) |
| **Price Seal** | SVG starburst circle, gold background, black text |
| **Cards** | Semi-transparent black, thin gold border, 8px radius |
| **Buttons (Primary)** | Gold background, black text, uppercase, bold |
| **Buttons (Secondary)** | Transparent with gold border |

---

## 🖼️ Image Guide

Place food photos in `public/images/` using lowercase, hyphenated filenames:

| Menu Item | Expected Filename |
|-----------|------------------|
| Smokky Jollof Rice | `smokky-jollof-rice.jpg` |
| Fried Hake Fish | `fried-hake-fish.jpg` |
| Meaty Mix (Platter) | `meaty-mix.jpg` |
| Chicken & Chips | `chicken-chips.jpg` |

A `placeholder.svg` fallback is generated automatically when images are missing.

**Image specifications:**
- Format: JPG or WebP
- Aspect ratio: ~4:3 (landscape)
- Recommended size: 800×600px minimum
- Style: High-saturation, warm lighting, close-up shots with grill marks

---

## 📱 WhatsApp Order Flow

1. Customer browses menu and adds items to cart
2. Clicks cart → reviews order → clicks "Order via WhatsApp"
3. Enters name (optional) and special instructions (optional)
4. Preview of formatted WhatsApp message is shown
5. Taps "Order via WhatsApp" — WhatsApp opens with pre-filled message:

```
Hello Papazyner's, I'd like to order:

2x Smokky Jollof Rice (₦1,400)
1x Grilled Chicken (₦2,000)

Total: ₦3,400

Please confirm availability and delivery time.
```

- **Copy to clipboard** fallback available
- WhatsApp number: `+234 803 277 5719`

---

## 📲 QR Code Setup

### Option 1: Vercel + Built-in QR

1. Deploy to Vercel: `vercel --prod`
2. Get your deployment URL (e.g., `https://papazyner-menu.vercel.app`)
3. Generate QR code pointing to that URL using any QR generator
4. Print and display at your canteen

### Option 2: Table Number via Query Param

Append `?table=3` to the URL for table-specific ordering:
```
https://papazyner-menu.vercel.app/?table=3
```

The table number is available in the URL and can be included in the WhatsApp message.

### Option 3: Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `out`

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

Drag-and-drop the `out/` folder to Netlify's deploy UI, or:

```bash
npx netlify-cli deploy --prod --dir=out
```

### Static Hosting (Any Provider)

The `next.config.js` is configured with `output: 'export'` for full static export. Upload the `out/` directory to:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static file server

---

## 🛡️ Data Validation & Fallbacks

The system includes comprehensive validation:

| Scenario | Behavior |
|----------|----------|
| **Empty menu JSON** | Falls back to placeholder category |
| **Missing item field** | Item is skipped with console warning |
| **Invalid price** | Defaults to 0, displayed as ₦0 |
| **Missing image** | Shows gradient placeholder with first letter |
| **Empty cart checkout** | WhatsApp message still valid (no line items) |
| **Corrupted localStorage** | Clears corrupted cart, starts fresh |
| **WhatsApp not installed** | Falls back to WhatsApp Web |
| **Popup blocked** | Redirects current tab to WhatsApp |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (Pages Router) |
| **Language** | TypeScript |
| **Styling** | CSS (styled-jsx) with CSS custom properties |
| **State** | React useState + useReducer (cart) |
| **Persistence** | localStorage |
| **Fonts** | Google Fonts (UnifrakturMaguntia, Satisfy, Montserrat) |
| **Static Export** | `next export` (SSG) |
| **No Backend** | 100% client-side |

---

## 📄 License

Proprietary — Papazyner's Enterprise. All rights reserved.

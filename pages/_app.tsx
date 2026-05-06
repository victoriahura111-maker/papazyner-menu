// ============================================
// PAPAZYNER'S - NEXT.JS APP WRAPPER
// Mobile-optimized, accessible
// ============================================

import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0D0D0D" />
        <meta name="description" content="Papazyner's - Quality of Real Taste. Premium BBQ, grilled dishes, and Nigerian cuisine in Ikeja Lagos." />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>Papazyner's | Digital Menu</title>
        <meta property="og:title" content="Papazyner's Digital Menu" />
        <meta property="og:description" content="Order from Papazyner's premium BBQ and Nigerian cuisine menu." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/og-image.jpg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

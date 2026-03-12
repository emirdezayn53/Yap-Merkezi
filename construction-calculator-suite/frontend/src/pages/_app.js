/**
 * Next.js App Bileşeni
 * Tüm sayfaları global stil ile sarar
 */

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

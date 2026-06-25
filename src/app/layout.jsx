import '../index.css';
import { Cinzel, Cormorant_Garamond, Inter } from 'next/font/google';
import Providers from './providers';

// Web fonts exposed as CSS variables consumed by index.css. The Amharic
// font (Benaiah) is loaded locally via @font-face in index.css.
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Behere Tsige St. Mary | A Spiritual Home Rooted in Faith',
  description:
    'Mekane Selam Behere Tsige St. Mary Ethiopian Orthodox Tewahedo Church — worship, services, events, media, and fellowship.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

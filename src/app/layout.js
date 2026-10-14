import { Unbounded, Onest } from 'next/font/google';
import { site } from '@/data/site';
import './globals.css';

const display = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '800'],
  variable: '--font-display',
  display: 'swap',
});

const text = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-text',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
};

export const viewport = {
  themeColor: '#ff7a1f',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LanguageSchool',
  name: site.title,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
  },
  sameAs: [site.instagram, site.telegram],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

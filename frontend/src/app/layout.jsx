import './globals.css';
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/lib/i18n';
import { AudioProvider } from '@/components/audio/AudioContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AudioFloatingBar } from '@/components/layout/AudioFloatingBar';

export const metadata = {
  title: 'Vachanam (వచనం • Vachanam • वचन) — Multilingual Digital Bible with AI',
  description: 'A modern, reverent multilingual Bible platform with AI verse explanations, visual diagrams, verse artwork, audio bible, and offline reading in Telugu, English, and Hindi.',
  manifest: '/manifest.json'
};

export const viewport = {
  themeColor: '#0c1a38',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }) {
  return (
    <html lang="te" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-gold-300 selection:text-primary-950">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <I18nProvider>
            <AudioProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <AudioFloatingBar />
            </AudioProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

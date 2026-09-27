import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import { ReactQueryProvider } from '@/lib/providers/QueryProvider';
import { AudioProvider } from '@/components/audio/AudioContext';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { AudioFloatingBar } from '@/components/layout/AudioFloatingBar';
import { LiveJobToast } from '@/components/realtime/LiveJobToast';

export const metadata = {
  title: 'Vachanam (వచనం • Vachanam • वचन) — Multilingual Digital Bible',
  description: 'A clean, modern multilingual Bible reading platform with AI verse explanations, visual diagrams, and audio narration in Telugu, English, and Hindi.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
};

export const viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export default function RootLayout({ children }) {
  return (
    <html lang="te" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen min-h-[100dvh] bg-white text-[#171717] flex flex-col font-sans antialiased selection:bg-gold-100 selection:text-primary-950 overflow-x-hidden" suppressHydrationWarning>
        <ReactQueryProvider>
          <I18nProvider>
            <AudioProvider>
              <Navbar />
              <main className="flex-1 bg-white pb-16 md:pb-0">
                {children}
              </main>
              <Footer />
              <BottomNav />
              <AudioFloatingBar />
              <LiveJobToast />
            </AudioProvider>
          </I18nProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

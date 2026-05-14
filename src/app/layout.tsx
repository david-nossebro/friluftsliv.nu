import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'friluftsliv.nu — Välkommen till den svenska naturen',
    template: '%s — friluftsliv.nu',
  },
  description:
    'Hitta rutter, stugor och naturområden från Skåne till Lappland. Sveriges hem för friluftsliv.',
}

export const viewport: Viewport = {
  themeColor: '#2C4A3E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        {/* Warm the DNS + TLS handshake for Unsplash-hosted hero/card images. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  )
}

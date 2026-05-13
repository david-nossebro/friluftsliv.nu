import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'friluftsliv.nu — Hitta din nästa tur',
    template: '%s — friluftsliv.nu',
  },
  description:
    'Sveriges hem för friluftsliv. Utforska rutter, stugor och naturområden från Skåne till Lappland.',
}

export const viewport: Viewport = {
  themeColor: '#2C4A3E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}

import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'

const contentLinks = [
  { label: 'Utforska', href: '/utforska' },
  { label: 'Karta', href: '/karta' },
  { label: 'Vandring', href: '/utforska?tab=vandring' },
  { label: 'Stugor', href: '/utforska?tab=stugor' },
  { label: 'Naturområden', href: '/omraden' },
]

const aboutLinks = [
  { label: 'Om friluftsliv.nu', href: '/om' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Bidragsgivare', href: '/bidragsgivare' },
  { label: 'Personuppgifter', href: '/integritetspolicy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Hjälp', href: '/hjalp' },
]

export function SiteFooter() {
  return (
    <footer className="bg-pine text-snow/80">
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr] gap-8 md:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo variant="reversed" size="sm" />
            <p className="max-w-[200px] text-xs leading-relaxed text-snow/80 font-body font-light">
              Naturen väntar. Vi öppnar dörren.
            </p>
          </div>

          {/* Content links */}
          <div>
            <h2 className="text-xs font-body font-medium uppercase tracking-widest text-snow/70 mb-4">
              Innehåll
            </h2>
            <ul className="flex flex-col">
              {contentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2.5 text-sm text-snow/70 hover:text-snow transition-colors duration-[120ms] font-body font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About links */}
          <div>
            <h2 className="text-xs font-body font-medium uppercase tracking-widest text-snow/70 mb-4">
              Om oss
            </h2>
            <ul className="flex flex-col">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2.5 text-sm text-snow/70 hover:text-snow transition-colors duration-[120ms] font-body font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-body font-medium uppercase tracking-widest text-snow/70 mb-1">
              Sveriges hem
            </h2>
            <p className="text-sm text-snow/60 leading-relaxed font-body font-light">
              Hitta rutter, stugor och naturområden — från Skåne till Lappland.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-snow/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-snow/70 font-body font-light">
            © {new Date().getFullYear()} friluftsliv.nu — Upphovsrätt, där inget annat anges
          </p>
          <p className="text-xs text-snow/60 font-body font-light">
            Gjord för dig som vill ut.
          </p>
        </div>
      </div>
    </footer>
  )
}

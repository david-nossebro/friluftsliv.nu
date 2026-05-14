import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-snow px-6 py-20 text-center flex flex-col items-center justify-center">
      <Logo size="lg" />
      <p className="mt-10 font-body text-xs uppercase tracking-widest text-stone">
        404
      </p>
      <h1 className="mt-3 max-w-[480px] font-display text-3xl md:text-4xl font-light leading-tight text-pine">
        Stigen tar slut här
      </h1>
      <p className="mt-4 max-w-[420px] font-body text-base leading-relaxed text-ink-soft">
        Sidan finns inte — eller har aldrig funnits.
        Men det finns andra vägar att gå.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary" size="lg">
          <Link href="/">Tillbaka till start</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/utforska">Utforska turer</Link>
        </Button>
      </div>
    </main>
  )
}
import { cn } from '@/lib/utils'
import { HeaderSearchAdapter } from '@/components/organisms/HeaderSearchAdapter'
import { SiteFooter } from '@/components/organisms/SiteFooter'

export interface PageLayoutProps {
  children: React.ReactNode
  currentPath?: string
  className?: string
}

export function PageLayout({ children, currentPath, className }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <HeaderSearchAdapter currentPath={currentPath} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

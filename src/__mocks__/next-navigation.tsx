/**
 * Storybook-only mock for `next/navigation`.
 *
 * Components that depend on `useRouter`, `usePathname`, etc. throw
 * "invariant expected app router to be mounted" when rendered outside a
 * Next.js app. In Storybook we provide harmless implementations that log
 * intent so stories can render.
 */

type RouteAction = 'push' | 'replace' | 'back' | 'forward' | 'refresh' | 'prefetch'

function logCall(action: RouteAction, ...args: unknown[]) {
  if (typeof window !== 'undefined') {
    console.info(`[next/navigation mock] router.${action}`, ...args)
  }
}

export function useRouter() {
  return {
    push: (href: string) => logCall('push', href),
    replace: (href: string) => logCall('replace', href),
    back: () => logCall('back'),
    forward: () => logCall('forward'),
    refresh: () => logCall('refresh'),
    prefetch: (href: string) => logCall('prefetch', href),
  }
}

export function usePathname() {
  return '/'
}

class MockSearchParams {
  get(_key: string): string | null { return null }
  getAll(_key: string): string[] { return [] }
  has(_key: string): boolean { return false }
  entries(): IterableIterator<[string, string]> { return [][Symbol.iterator]() }
  keys(): IterableIterator<string> { return [][Symbol.iterator]() }
  values(): IterableIterator<string> { return [][Symbol.iterator]() }
  forEach(_cb: (value: string, key: string) => void) {}
  toString() { return '' }
  [Symbol.iterator](): IterableIterator<[string, string]> { return [][Symbol.iterator]() }
}

export function useSearchParams() {
  return new MockSearchParams() as unknown as URLSearchParams
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>(): T {
  return {} as T
}

export function useSelectedLayoutSegment() {
  return null
}

export function useSelectedLayoutSegments() {
  return []
}

export function notFound(): never {
  throw new Error('[next/navigation mock] notFound() called')
}

export function redirect(url: string): never {
  logCall('replace', url)
  throw new Error(`[next/navigation mock] redirect(${url}) called`)
}

export const RedirectType = { push: 'push', replace: 'replace' } as const

import * as React from 'react'

type Loader<P extends object> = () => Promise<{ default: React.ComponentType<P> } | React.ComponentType<P>>

interface DynamicOptions {
  ssr?: boolean
  loading?: React.ComponentType
}

/**
 * Storybook mock for next/dynamic.
 * Uses React.lazy so dynamic imports work in the Vite-based Storybook environment.
 */
export default function dynamic<P extends object>(
  loader: Loader<P>,
  options?: DynamicOptions
): React.ComponentType<P> {
  const LazyComponent = React.lazy(async () => {
    const mod = await loader()
    // Handle both ESM default exports and direct component returns
    if (typeof mod === 'function' || (typeof mod === 'object' && 'default' in mod)) {
      return 'default' in mod
        ? (mod as { default: React.ComponentType<P> })
        : { default: mod as React.ComponentType<P> }
    }
    return { default: mod as unknown as React.ComponentType<P> }
  })

  const Loading = options?.loading

  function DynamicWrapper(props: P) {
    return (
      <React.Suspense fallback={Loading ? <Loading /> : null}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }
  DynamicWrapper.displayName = 'Dynamic'
  return DynamicWrapper
}

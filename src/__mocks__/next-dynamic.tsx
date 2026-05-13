import * as React from 'react'

type Loader<P extends object> = () => Promise<{ default: React.ComponentType<P> } | React.ComponentType<P>>

interface DynamicOptions {
  ssr?: boolean
  loading?: React.ComponentType
}

function hasDefaultExport<P extends object>(
  mod: { default: React.ComponentType<P> } | React.ComponentType<P>
): mod is { default: React.ComponentType<P> } {
  return typeof mod === 'object' && mod !== null && 'default' in mod
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
    return hasDefaultExport(mod) ? mod : { default: mod }
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

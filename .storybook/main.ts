import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    return mergeConfig(config, {
      esbuild: {
        jsx: 'automatic',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          'next/image': path.resolve(__dirname, '../src/__mocks__/next-image.tsx'),
          'next/link': path.resolve(__dirname, '../src/__mocks__/next-link.tsx'),
          'next/dynamic': path.resolve(__dirname, '../src/__mocks__/next-dynamic.tsx'),
          'next/navigation': path.resolve(__dirname, '../src/__mocks__/next-navigation.tsx'),
        },
      },
    })
  },
}

export default config

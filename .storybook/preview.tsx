import type { Preview, Decorator } from '@storybook/react'
import React from 'react'
import '../src/app/globals.css'

const withFonts: Decorator = (Story) =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement('link', {
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap',
      rel: 'stylesheet',
    }),
    React.createElement('style', null, `
      :root {
        --font-fraunces: 'Fraunces';
        --font-dm-sans: 'DM Sans';
      }
    `),
    React.createElement(Story)
  )

const preview: Preview = {
  decorators: [withFonts],
  parameters: {
    backgrounds: {
      default: 'snow',
      values: [
        { name: 'snow', value: '#F8FAF7' },
        { name: 'mist', value: '#EFF4EC' },
        { name: 'pine', value: '#2C4A3E' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
    layout: 'centered',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
}

export default preview

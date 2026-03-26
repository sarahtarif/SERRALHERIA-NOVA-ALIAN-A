import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{vue,ts}',
    './server/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        // Cores dinâmicas via CSS variables (controladas pelo banco)
        'brand-primary': 'var(--color-primary)',
        'brand-secondary': 'var(--color-secondary)',
        'brand-surface': 'var(--color-surface)',
        'brand-on-surface': 'var(--color-on-surface)',
        'brand-whatsapp': 'var(--color-whatsapp)',

        // Cores principais do sistema
        'navy': '#1a2332',           // Azul escuro (header/footer)
        'bg-primary': '#f8f9fa',     // Fundo principal claro
        'accent': '#f5a623',         // Amarelo/laranja (CTAs e destaques)
        'text-primary': '#1f2937',   // Texto principal escuro
        'text-secondary': '#6b7280', // Texto secundário

        // Sistema de cores — primary/secondary/surface usam CSS variables para troca em runtime
        'primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'on-primary': '#422c00',
        'primary-container': '#261700',
        'on-primary-container': '#ad7900',
        'primary-fixed': '#ffdeac',
        'primary-fixed-dim': 'rgb(var(--color-primary) / <alpha-value>)',
        'secondary': 'rgb(var(--color-secondary) / <alpha-value>)',
        'on-secondary': '#ffffff',
        'secondary-container': '#114783',
        'on-secondary-container': '#8cb7fa',
        'surface': 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-dim': 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-bright': '#2d3a4a',
        'surface-container-lowest': '#020f1e',
        'surface-container-low': '#0f1c2c',
        'surface-container': '#132030',
        'surface-container-high': '#1e2b3b',
        'surface-container-highest': '#283646',
        'surface-variant': '#283646',
        'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
        'on-surface-variant': '#c4c6cc',
        'outline': '#8e9196',
        'outline-variant': '#44474c',
        'background': '#061423',
        'on-background': '#d6e4f9',
        'tertiary': '#c6c6c7',
        'tertiary-container': '#181a1a',
        'on-tertiary': '#2f3131',
        'on-tertiary-container': '#818383',
        'error': '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
        'inverse-surface': '#d6e4f9',
        'inverse-on-surface': '#243141',
        'inverse-primary': '#7e5700',
        'surface-tint': '#f5a623',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Inter', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        md: '0.375rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
    },
  },
  plugins: [],
} satisfies Config

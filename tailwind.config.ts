import type { Config } from 'tailwindcss';

// Tailwind é usado apenas no painel admin. O site público usa src/app/(site)/site.css.
const config: Config = {
  content: ['./src/components/admin/**/*.{ts,tsx}', './src/app/(admin)/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#d90f1a', light: '#ff2a35', dark: '#8f0a11' },
      },
    },
  },
  plugins: [],
};

export default config;

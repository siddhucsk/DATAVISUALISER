import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        amber: {
          600: '#d97706',
        },
      },
      gridTemplateColumns: {
        'bento-sm': 'repeat(2, minmax(0, 1fr))',
        'bento-md': 'repeat(3, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};

export default config; 
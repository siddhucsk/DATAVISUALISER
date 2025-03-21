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
        emerald: {
          50: '#ecfdf5',
          600: '#059669',
        },
        teal: {
          400: '#2dd4bf',
          800: '#115e59',
          900: '#134e4a',
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
import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.625rem',
      },

      colors: {
        primary: '#37B6FF',
        'dark-primary': '#238CC8',
        secondary: '#DD1717',
        'neutral-dark-gray': '#9C9CA4',
        'neutral-gray': '#DBDBDB',
        'neutral-black': '#141522',
      },
      lineHeight: {
        7.5: '1.875rem',
        3.5: '0.9375rem',
      },
      spacing: {
        4.5: '1.125rem',
      },
      width: {
        67.5: '16.875rem',
        556: '34.75rem',
      },
      height: {
        45: '11.25rem',
      },
      borderRadius: {
        10: '0.625rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui(), require('flowbite/plugin')],
};
export default config;

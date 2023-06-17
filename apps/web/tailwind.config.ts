import { type Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: '#39B9B6',
        orange: '#F39920',
      },
      keyframes: {
        sliding: {
          '0%': { transform: 'translateX(25)' },
          '10%': { transform: 'translateX(40)' },
          '20%': { transform: 'translateX(60)' },
          '30%': { transform: 'translateX(80)' },
          '40%': { transform: 'translateX(100)' },
          '50%': { transform: 'translateX(-80)' },
          '60%': { transform: 'translateX(-60)' },
          '70%': { transform: 'translateX(-40)' },
          '80%': { transform: 'translateX(-25)' },
          '90%': { transform: 'translateX(-10)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        sliding: 'sliding 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
} satisfies Config;

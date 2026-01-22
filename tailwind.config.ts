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
        space: {
          dark: '#0a0e27',
          purple: '#6366f1',
          blue: '#3b82f6',
          glow: '#818cf8',
        },
      },
      animation: {
        'warp-in': 'warp 2s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        warp: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8', filter: 'blur(10px)' },
          '100%': { transform: 'scale(0)', opacity: '0', filter: 'blur(20px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

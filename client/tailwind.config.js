/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        orion: {
          red: '#E22D1F',
          darkRed: '#B8150D',
          dark: '#0A0A0A',
          card: '#141414',
          border: '#282828',
          text: '#FFFFFF',
          muted: '#888888',
        },
        primary: {
          50:  '#EEEDFE',
          100: '#CECBF6',
          200: '#AFA9EC',
          400: '#7F77DD',
          600: '#534AB7',
          800: '#3C3489',
          900: '#26215C',
        },
        accent: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          400: '#1D9E75',
          600: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
        surface: {
          50:  '#F1EFE8',
          100: '#D3D1C7',
          200: '#B4B2A9',
          400: '#888780',
          600: '#5F5E5A',
          800: '#444441',
          900: '#2C2C2A',
        },
        danger: {
          50:  '#FCEBEB',
          200: '#F09595',
          400: '#E24B4A',
          600: '#A32D2D',
          800: '#791F1F',
        },
        warning: {
          50:  '#FAEEDA',
          200: '#EF9F27',
          400: '#BA7517',
          600: '#854F0B',
          800: '#633806',
        },
      },
    },
  },
  plugins: [],
};

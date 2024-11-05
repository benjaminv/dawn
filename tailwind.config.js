/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/theme/**/*.liquid', './src/frontend/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    fontFamily: {
      sans: ['"IBM Plex Sans"', 'sans-serif'],
      serif: ['"IBM Plex Serif"', 'serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
    },
    screens: {
      sm: '640px',
      md: '750px',
      lg: '990px',
      xl: '1300px',
      xxl: '1480px',
    },
    container: {
      sm: '100%',
      md: '100%',
      lg: '100%',
      xl: '160rem',
    },
    extend: {
      colors: {
        colorBackground: 'rgb(var(--color-background))',
        colorGradientBackground: 'var(--gradient-background)',
        colorForeground: 'rgb(var(--color-foreground))',
        colorForegroundLight: 'rgb(var(--color-foreground-light))',
        colorGreen: 'rgb(var(--color-green))',
        colorBrown: 'rgb(var(--color-brown))',
        colorButton: 'rgb(var(--color-button))',
        colorButtonText: 'rgb(var(--color-button-text))',
        colorSecondaryButtonText: 'rgb(var(--color-secondary-button-text))',
        colorLink: 'rgb(var(--color-link))',
        colorBone: 'rgb(var(--color-bone))',
        colorBadgeForeground: 'rgb(var(--color-badge-foreground))',
        colorBadgeBackground: 'rgb(var(--color-badge-background))',
        colorBadgeBorder: 'rgb(var(--color-badge-border))',
        colorBoneHex: 'var(--color-border-grey)',
        paymentTermsBackgroundColor:
          'rgb(var(--payment-terms-background-color))',
      },
      keyframes: {
        flicker: {
          '0%,50%': { visibility: 'hidden' },
          '100%': { visibility: 'visible' },
        },
      },
      spacing: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
      },
    },
  },
};

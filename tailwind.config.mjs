import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
  // Preflight is off: global.css already owns the base reset and essay
  // typography (see docs/design.md, Color section), and this integration
  // is scoped to the new structural/interactive chrome layered on top of it.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        // Built from the site's existing accent, not a new color chosen
        // independently (docs/design.md, decisions log, 2026-09-22).
        'umwayi-light': {
          primary: '#b5541f',
          'primary-content': '#faf6ef',
          secondary: '#6f6656',
          'secondary-content': '#faf6ef',
          accent: '#b5541f',
          'accent-content': '#faf6ef',
          neutral: '#201b14',
          'neutral-content': '#faf6ef',
          'base-100': '#faf6ef',
          'base-200': '#f1ece1',
          'base-300': '#e5ddcd',
          'base-content': '#201b14',
          info: '#6f6656',
          success: '#4c6b3f',
          warning: '#b5541f',
          error: '#a1332a',
        },
      },
      {
        'umwayi-dark': {
          primary: '#d9834a',
          'primary-content': '#17130e',
          secondary: '#a3967f',
          'secondary-content': '#17130e',
          accent: '#d9834a',
          'accent-content': '#17130e',
          neutral: '#ece4d6',
          'neutral-content': '#17130e',
          'base-100': '#17130e',
          'base-200': '#1f1a13',
          'base-300': '#332c22',
          'base-content': '#ece4d6',
          info: '#a3967f',
          success: '#7fa06a',
          warning: '#d9834a',
          error: '#c96455',
        },
      },
    ],
  },
};

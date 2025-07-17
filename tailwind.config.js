/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts,svx}'],
  theme: {
    extend: {
      fontFamily: {
        'tny': ['"TNY"'],
        'jws': ['"JWS"'],
        'crimson': ['"Crimson"'],
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
      },
      typography: {
        dark: {
          css: {
            '--tw-prose-body': '#E6E6E6',
            '--tw-prose-headings': '#E6E6E6',
            '--tw-prose-lead': '#E6E6E6',
            '--tw-prose-links': '#E6E6E6',
            '--tw-prose-bold': '#E6E6E6',
            '--tw-prose-counters': '#E6E6E6',
            '--tw-prose-bullets': '#E6E6E6',
            '--tw-prose-hr': '#E6E6E6',
            '--tw-prose-quotes': '#E6E6E6',
            '--tw-prose-quote-borders': '#E6E6E6',
            '--tw-prose-captions': '#E6E6E6',
            '--tw-prose-code': '#E6E6E6',
            '--tw-prose-pre-code': '#E6E6E6',
            '--tw-prose-pre-bg': '#E6E6E6',
            '--tw-prose-th-borders': '#E6E6E6',
            '--tw-prose-td-borders': '#E6E6E6',
          }
        },
        light: {
          css: {
            '--tw-prose-body': '#121212',
            '--tw-prose-headings': '#121212',
            '--tw-prose-lead': '#121212',
            '--tw-prose-links': '#121212',
            '--tw-prose-bold': '#121212',
            '--tw-prose-counters': '#121212',
            '--tw-prose-bullets': '#121212',
            '--tw-prose-hr': '#121212',
            '--tw-prose-quotes': '#121212',
            '--tw-prose-quote-borders': '#121212',
            '--tw-prose-captions': '#121212',
            '--tw-prose-code': '#121212',
            '--tw-prose-pre-code': '#121212',
            '--tw-prose-pre-bg': '#121212',
            '--tw-prose-th-borders': '#121212',
            '--tw-prose-td-borders': '#121212',
          }
        }
      }
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography')
  ],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vscode': {
          'bg': '#1e1e1e',
          'sidebar': '#252526',
          'activity': '#333333',
          'editor': '#1e1e1e',
          'selection': '#264f78',
          'border': '#3c3c3c',
          'text': '#cccccc',
          'text-muted': '#858585',
          'button': '#0e639c',
          'button-hover': '#1177bb',
          'input': '#3c3c3c',
          'panel': '#252526',
          'tab': '#2d2d2d',
          'tab-active': '#1e1e1e',
        }
      },
      fontFamily: {
        'mono': ['Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
}

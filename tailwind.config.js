module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'sunset': '#B24544',
        'blem': '#3F89D0',
        'orem': '#FF7D3F',
        'yem': '#FFB13F',
        'rem': '#F33C6A',
      },
      textColor: {
        'sunset': '#B24544',
        'blem': '#3F89D0',
        'orem': '#FF7D3F',
        'yem': '#FFB13F',
        'rem': '#F33C6A',
      },
      borderColor: {
        'sunset': '#B24544',
        'blem': '#3F89D0',
        'orem': '#FF7D3F',
        'yem': '#FFB13F',
        'rem': '#F33C6A',
      },
      minHeight: {
        'screen-4rem': 'calc(100vh - 64px)',
      },
      height: {
        'feed-screen': 'calc(100vh - 64px)',
        'screen-126': 'calc(100vh - 68px)',
        'screen-182': 'calc(100vh - 182px)',
      },
      maxHeight: {
        'feed-screen': 'calc(100vh - 64px)',
      },
      width: {
        'feed-screen': 'calc(100vw - 298px)',
      },
      maxWidth: {
        'feed-screen': 'calc(100vw - 556px)',
      }

    },
  },
    variants: {
    extend: {
      backgroundColor: ['focus'],
    },
  },
  plugins: [],
}

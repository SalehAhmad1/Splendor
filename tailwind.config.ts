import type { Config } from 'tailwindcss'
const flowbite = require("flowbite-react/tailwind");

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    flowbite.content(),
  ],
  theme: {
    extend: {
      textShadow: {
        'default': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        'md': '3px 3px 6px rgba(0, 0, 0, 0.5)',
        'lg': '4px 4px 8px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        SantaMonicaSans: ['SantaMonicaSans', 'sans-serif'],
        TheGlorious: ['TheGlorious'],
        Badmood: ['Badmood'],
        HeavenScent: ['HeavenScent'],
      },
      backgroundColor: {
        'Beige': '#CBC5BC',
        'DeepBrown': '#4A3F35',
        'MutedGold': '#C8A27C',
        'DustyRose': '#B58D82',
        'SlateGray': '#636363',
        'DeepGold': '#D4A373',
        'MutedOliveGreen': '#A8A77A',
        'LimelightLightGreen': '#f3f3f3'
      },
      backgroundImage: {
        'gradient-to-b-MutedGold-to-DustyRose': 'linear-gradient(to bottom, #C8A27C, #B58D82)',
        'gradient-to-b-DustyRose-to-MutedGold': 'linear-gradient(to bottom, #B58D82, #C8A27C)',
        'gradient-to-b-MutedGold-to-White': 'linear-gradient(to bottom, #C8A27C, #ffffff)',
      },
      textColor: {
        'Beige': '#CBC5BC',
        'DeepBrown': '#4A3F35',
        'MutedGold': '#C8A27C',
        'DustyRose': '#B58D82',
        'SlateGray': '#636363',
        'DeepGold': '#D4A373',
        'MutedOliveGreen': '#A8A77A'
      },
      borderColor: {
        'lightGrayDivider': '#e5e5e5',
      },
    },
      
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    flowbite.plugin(),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      addUtilities({
        '.text-shadow': {
          'text-shadow': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-md': {
          'text-shadow': '3px 3px 6px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          'text-shadow': '4px 4px 8px rgba(0, 0, 0, 0.5)',
        },
        '.stroke-black': {
          '-webkit-text-stroke': '2px black',
        },
        '.stroke-red': {
          '-webkit-text-stroke': '1px red',
        },
      })
    },
  ],
}
export default config

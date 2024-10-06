
import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			heading: ['var(--font-heading)', ...fontFamily.sans],
  			body: ['var(--font-body)', ...fontFamily.sans]
  		},
  		/* colors: {
  			title: '#F4F4F4',
  			text: '#e5e7ebf2',
  			input: '#151720',
  			background: '#121315',
  			foreground: '#141618',
  			primary: '#0A84FF',
  			secondary: '#191D20',
  			card: '#08070b'
  		}, */
  		/* borderRadius: {
  			xl: '`calc(var(--radius) + 4px)`',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}, */
		  colors: {
			title: '#F4F4F4',
  			text: '#e5e7ebf2',
			buttons: "#3399ff",
			primary: "#3399ff",
			buttonsSecondary: "#131315",
			muted: "#252527",
			card: "#111113",
			input: "#070708",
			sidebar: "#02040a",
			border: "#2a2a2c",
			background: "#070708",
			//muted: "#3E3E42",
		  },
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0px'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0px'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

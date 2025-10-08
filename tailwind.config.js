import { defineConfig } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import animate from 'tw-animate'

export default defineConfig({
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				background: 'oklch(var(--background) / <alpha-value>)',
				foreground: 'oklch(var(--foreground) / <alpha-value>)',
				border: 'oklch(var(--border) / <alpha-value>)',
				input: 'oklch(var(--input) / <alpha-value>)',
				ring: 'oklch(var(--ring) / <alpha-value>)',
				card: 'oklch(var(--card) / <alpha-value>)',
				'card-foreground': 'oklch(var(--card-foreground) / <alpha-value>)',
				primary: 'oklch(var(--primary) / <alpha-value>)',
				'primary-foreground':
					'oklch(var(--primary-foreground) / <alpha-value>)',
				secondary: 'oklch(var(--secondary) / <alpha-value>)',
				'secondary-foreground':
					'oklch(var(--secondary-foreground) / <alpha-value>)',
				destructive: 'oklch(var(--destructive) / <alpha-value>)',
				muted: 'oklch(var(--muted) / <alpha-value>)',
				'muted-foreground': 'oklch(var(--muted-foreground) / <alpha-value>)',
				accent: 'oklch(var(--accent) / <alpha-value>)',
				'accent-foreground': 'oklch(var(--accent-foreground) / <alpha-value>)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [animate],
})

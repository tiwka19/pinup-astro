import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import react from '@astrojs/react'
import netlify from '@astrojs/netlify/functions'

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), react(), image()],
	output: 'server',
	adapter: netlify(),
})

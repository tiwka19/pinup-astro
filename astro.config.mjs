import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
// import image from '@astrojs/image'
import react from '@astrojs/react'
import netlify from '@astrojs/netlify/edge-functions';
// https://astro.build/config
export default defineConfig({
	site: 'https://main--stunning-cajeta-06aaca.netlify.app',
	integrations: [tailwind(), react()],
})

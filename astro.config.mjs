import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import image from '@astrojs/image';
import netlify from '@astrojs/netlify/functions';
import robotsTxt from 'astro-robots-txt';
import sitemap from "@astrojs/sitemap";
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), image(), sitemap(), robotsTxt()],
	site: 'https://motion-mat.net',
  output: 'server',
	adapter: netlify(),
});
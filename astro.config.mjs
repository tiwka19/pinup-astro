import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import image from '@astrojs/image';
import netlify from '@astrojs/netlify/functions';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), image()],
  output: 'server',
  adapter: netlify(),
  // vite: {
  //   build: {
  //     rollupOptions: {
  //       external: 'astro-headless-ui',
  //     },
  //   },
  // },
});

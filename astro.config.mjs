import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';

// https://astro.build/config
export default defineConfig({
  site: 'https://d-futenma.github.io',
  base: '/webgl-school-report5',
  server: {
    host: true,
  },
  vite: {
    plugins: [glsl()],
  },
});

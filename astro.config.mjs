// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://adamgroenhout.github.io",
  base: "/wildwood/",
  vite: {
    plugins: [tailwindcss()]
  }
});
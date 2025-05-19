import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouter } from "@react-router/dev/vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import netlifyPlugin from '@netlify/vite-plugin-react-router'

const root = path.resolve(__dirname, './');

export default defineConfig({
  root,
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    netlifyPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    },
    devSourcemap: true
  },
  server: {
    hmr: {
      host: 'localhost',
      port: 3000,
      protocol: 'ws',
      clientPort: 3000,
      overlay: true,
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: path.resolve(root, 'index.html'),
      },
    },
  }
});

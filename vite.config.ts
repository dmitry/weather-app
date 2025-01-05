import { defineConfig } from "vite"
import { UserConfig as ViteConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ['**/*.test.tsx'],
    setupFiles: ["./src/test/setup.ts"],
  },
} as ViteConfig)

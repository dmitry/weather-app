import { defineConfig } from "vite"
import { UserConfig as ViteConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ['**/*.test.tsx'],
    setupFiles: ["./src/test/setup.ts"],
  },
} as ViteConfig)

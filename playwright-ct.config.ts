import { defineConfig, devices } from "@playwright/experimental-ct-react"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import path from "path"

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./",
  snapshotDir: "./src/test/__snapshots__",
  testMatch: "**/*.spec.tsx",
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    ctViteConfig: {
      resolve: {
        alias: {
          "@": path.resolve("./src")
        },
      },
      // Add this to include json files and handle glob imports
      assetsInclude: ['**/*.json'],
      // build: {
      //   rollupOptions: {
      //     input: {
      //       // Include your translation files
      //       translations: './components/**/translations/*.json'
      //     }
      //   }
      // },
      css: {
        postcss: {
          plugins: [
            tailwindcss,
            autoprefixer,
          ],
        },
      },
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    headless: true,
    ctPort: 3100,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
})

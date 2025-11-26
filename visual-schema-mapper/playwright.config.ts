import { defineConfig } from '@playwright/test'

const PLAYWRIGHT_PORT = process.env.PLAYWRIGHT_PORT ?? '4173'
const PLAYWRIGHT_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PLAYWRIGHT_PORT}/`

process.env.PLAYWRIGHT_BASE_URL = PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  globalSetup: './tests/e2e/global-setup.ts',
  webServer: {
    command: `npm run dev -- --host --port ${PLAYWRIGHT_PORT}`,
    url: PLAYWRIGHT_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

/// <reference types="vitest" />
import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig as ViteUserConfig } from 'vite'
import { configDefaults, type UserConfig as VitestUserConfig } from 'vitest/config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const appVersion = process.env.npm_package_version ?? '0.0.0'

const vitestConfig: VitestUserConfig['test'] = {
  environment: 'jsdom',
  setupFiles: ['./vitest.setup.ts'],
  exclude: [...configDefaults.exclude, 'e2e/**', 'tests/e2e/**'],
}

const config: ViteUserConfig & { test: VitestUserConfig['test'] } = {
  base: '/react-visual-schema-mapper/',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: vitestConfig,
}

// https://vite.dev/config/
export default defineConfig(config)

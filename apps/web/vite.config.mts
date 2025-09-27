import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@pustac/editor': resolve(__dirname, '../../packages/editor/src'),
    },
  },
})

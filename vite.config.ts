import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore - vitest types are only available in dev
import type { UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
}) as UserConfig

import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import restart from 'vite-plugin-restart'

// Detect if this is a production build
const isProduction = process.env.NODE_ENV === 'production'

export default {
  // Use base only for production (GitHub Pages), keep '/' for local dev
  base: isProduction ? '/ping-pong-with-r3f/' : '/',

  root: 'src/',
  publicDir: '../public/',
  plugins: [
    // Restart server when public files change
    restart({ restart: ['../public/**'] }),

    // React plugin
    react(),

    // Treat .js files as JSX automatically
    {
      name: 'load+transform-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
  ],

  server: {
    host: true, // Local network access
    open: true  // Auto-open browser
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
}

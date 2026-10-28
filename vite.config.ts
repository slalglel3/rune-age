import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'layout-sync-api',
      configureServer(server) {
        console.log('[layout-sync-api] configureServer hook registered!')
        server.middlewares.use((req, res, next) => {
          const url = req.url || ''
          console.log('[layout-sync-api] Request received:', req.method, url)

          if (url === '/api/save-layout' || url.startsWith('/api/save-layout')) {
            if (req.method === 'POST') {
              let body = ''
              req.on('data', chunk => { body += chunk })
              req.on('end', () => {
                try {
                  const dataDir = path.resolve(__dirname, 'src/data')
                  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
                  const filePath = path.join(dataDir, 'userLayout.json')
                  fs.writeFileSync(filePath, body, 'utf-8')
                  console.log('[layout-sync-api] Saved layout to', filePath)
                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: true, message: 'Saved to userLayout.json' }))
                } catch (e: any) {
                  console.error('[layout-sync-api] Save error:', e)
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: false, error: e.message }))
                }
              })
              return
            } else {
              res.writeHead(405)
              res.end()
              return
            }
          }

          if (url === '/api/get-layout' || url.startsWith('/api/get-layout')) {
            const filePath = path.resolve(__dirname, 'src/data/userLayout.json')
            if (fs.existsSync(filePath)) {
              const data = fs.readFileSync(filePath, 'utf-8')
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(data)
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'No saved layout file found' }))
            }
            return
          }

          next()
        })
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
})

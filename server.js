const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || (dev ? '127.0.0.1' : '0.0.0.0')
const port = process.env.PORT || 4000

// Don't pass hostname/port to Next.js to prevent it from starting its own server
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  
  // Explicitly bind to IPv4 only to avoid IPv6 permission issues
  server.listen(port, '127.0.0.1', (err) => {
    if (err) throw err
    console.log(`> Ready on http://127.0.0.1:${port}`)
  })
})

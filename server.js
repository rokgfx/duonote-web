const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'

// Set environment variables to indicate HTTPS and proper origin
process.env.HTTPS = 'true'
process.env.NEXT_PUBLIC_VERCEL_URL = 'duonote.com:3000'

const app = next({ 
  dev,
  turbo: true,
  hostname: '0.0.0.0',
  port: 3000
})
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('./duonote.com+3-key.pem'),
  cert: fs.readFileSync('./duonote.com+3.pem')
}

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err
    console.log('> Ready on https://duonote.com:3000')
  })
})
import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { askAnythingHandler, generateBundleHandler } from '../../lib/curio-api.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Vercel functions are the canonical API implementation. These routes only
// adapt them to the existing local Express development server.
app.post('/api/generate-bundle', generateBundleHandler)
app.post('/api/ask-anything', askAnythingHandler)

app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && Object.hasOwn(error, 'body')) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' })
  }

  return next(error)
})

app.listen(port, () => {
  console.log(`Curio API listening at http://localhost:${port}`)
})

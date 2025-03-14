import express from 'express'
import bodyParser from 'body-parser'
import { shortenUrlSchema } from './data/validation.mjs'
import { createShortUrl, getOriginalUrl } from './data/db.mjs'
import { logger, requestLogger } from './data/logging.mjs'
import cors from 'cors'
const app = express()
const port = process.env.API_PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(requestLogger)

app.post('/shorten', async (req, res) => {
  const result = shortenUrlSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors })
  }

  try {
    const { originalUrl } = result.data
    const { shortUrl } = await createShortUrl(originalUrl)
    res.json({ shortUrl })
  } catch (err) {
    logger.error({ err }, 'Failed to create short URL')
    res.status(500).json({ error: err.message })
  }
})

app.get('/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params
    const row = await getOriginalUrl(shortUrl)

    if (row) {
      res.redirect(row.original_url)
    } else {
      res.status(404).json({ error: 'URL not found' })
    }
  } catch (err) {
    logger.error({ err }, 'Failed to retrieve URL')
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  logger.info({ port }, 'URL shortener started')
}) 

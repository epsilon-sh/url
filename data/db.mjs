import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db.sqlite')

const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_url TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

function generateShortUrl() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let shortUrl = ''
  for (let i = 0; i < 6; i++) {
    shortUrl += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return shortUrl
}

export async function createShortUrl(originalUrl) {
  return new Promise((resolve, reject) => {
    const shortUrl = generateShortUrl()
    const stmt = db.prepare("INSERT INTO urls (original_url, short_url) VALUES (?, ?)")

    stmt.run(originalUrl, shortUrl, function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve({ shortUrl })
    })
    stmt.finalize()
  })
}

export async function getOriginalUrl(shortUrl) {
  return new Promise((resolve, reject) => {
    db.get("SELECT original_url FROM urls WHERE short_url = ?", [shortUrl], (err, row) => {
      if (err) {
        reject(err)
        return
      }
      resolve(row)
    })
  })
} 
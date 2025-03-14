# URL Shortener

A simple URL shortener service built with Express.js, SQLite, and Zod for validation.

## Features

- Shorten long URLs to unique short codes
- Validate URLs using Zod
- In-memory SQLite database
- Modern UI with error handling
- TypeScript support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

3. Open http://localhost:3000 in your browser

## API Endpoints

- `POST /shorten`
  - Body: `{ "originalUrl": "https://example.com" }`
  - Returns: `{ "shortUrl": "abc123" }`

- `GET /:shortUrl`
  - Redirects to the original URL
  - Returns 404 if URL not found

## Development

The project uses:
- Express.js for the server
- SQLite for data storage
- Zod for validation
- TypeScript for type definitions

## Deployment

See `nginx.conf` and `url-shortener.service` for inspiration on deployment config.

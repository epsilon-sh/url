import { shortenUrlSchema } from '../data/validation.mjs'

const form = document.getElementById('urlForm')
const result = document.getElementById('result')

const displayResult = (message = '', isError = false) => {
  if (!result) return

  console.log({ message })
  result.textContent = message
  result.className = isError ? 'error' : 'success'
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault()
  console.log(event)

  const input = document.getElementById('originalUrl') as HTMLInputElement
  const originalUrl = input?.value

  if (!originalUrl) {
    displayResult('Please enter a URL', true)
    return
  }

  try {
    const validation = shortenUrlSchema.safeParse({ originalUrl })
    if (!validation.success) {
      throw new Error('Invalid URL format')
    }

    const response = await fetch('/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    }).catch((error) => {
      throw new Error('Failed to fetch')
    })

    const data = await response.json().catch((error) => {
      throw new Error('Failed to parse server response')
    })

    if (response.ok) {
      const shortUrl = `${window.location.href}${data.shortUrl}`
      displayResult(shortUrl)
    } else {
      displayResult(data.error?.message ?? data.error, true)
    }
  } catch (error) {
    if (error instanceof Error) {
      displayResult(error.message, true)
    } else {
      displayResult('An unexpected error occurred', true)
    }
  }
})

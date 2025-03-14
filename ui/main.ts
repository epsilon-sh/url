import { shortenUrlSchema } from '../data/validation.mjs'

const API_URL = import.meta.env.VITE_API_URL
console.log({ API_URL })
const form = document.getElementById('urlForm')
const result = document.getElementById('result')

const displayResult = (message: string, isError = false, isHtml = false) => {
  if (!result) return
  result.className = isError ? 'error' : 'success'
  if (isHtml) {
    result.innerHTML = message
  } else {
    result.textContent = message
  }
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const input = document.getElementById('originalUrl') as HTMLInputElement
  const originalUrl = input?.value

  if (!originalUrl) {
    displayResult('Please enter a URL', true)
    return
  }

  try {
    const validation = shortenUrlSchema.safeParse({ originalUrl })
    if (!validation.success) {
      displayResult('Invalid URL format', true)
      return
    }

    const response = await fetch(`${API_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    })

    const data = await response.json()

    if (response.ok) {
      const baseUrl = API_URL || window.location.origin
      const shortUrl = `${baseUrl}/${data.shortUrl}`
      displayResult(`Shortened URL: <a href="${shortUrl}" target="_blank" rel="noopener">${shortUrl}</a>`, false, true)
    } else {
      displayResult(`Error: ${data.error}`, true)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      displayResult(error.message, true)
    } else {
      displayResult('An unexpected error occurred', true)
    }
  }
})

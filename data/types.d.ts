import { z } from 'zod'
import { shortenUrlSchema } from './validation.mjs'

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema> 
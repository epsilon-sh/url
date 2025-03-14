import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
})

// Request logging middleware
export function requestLogger(req, res, next) {
  const start = Date.now()
  const requestId = req.id || crypto.randomUUID()

  // Log incoming request at debug level
  logger.debug({
    requestId,
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
  }, 'incoming request')

  // Capture response using event listener
  res.on('finish', () => {
    const duration = Date.now() - start

    const logData = {
      requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
    }

    if (res.statusCode >= 400) {
      logger.error(logData, 'request error')
    } else {
      logger.info(logData, 'request completed')
    }
  })

  next()
} 
// src/config/swagger.js
import swaggerUi from 'swagger-ui-express'
import spec from './openapi.json' assert { type: 'json' }

export const swaggerMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(spec, {
    explorer: true,
    swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha', docExpansion: 'none' }
  })
]
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const swaggerUi = require('swagger-ui-express')

require('./config/mongodbConfig')
require('./config/redisConfig')
const route = require('./routes/index')
const response = require('./utils/response/response')
const { envConfig } = require('./config/envConfg')
const { logger } = require('./config/loggerConfig')
const limiter = require('./middleware/rateLimit')
const authentication = require('./middleware/authentication')
const corsMiddleware = require('./middleware/cors')
const swaggerSpec = require('./docs/swaggerConfig')
const BadReq = require('./utils/response/requestError')

const app = express()

app.use(limiter)
app.use(helmet())
app.use(corsMiddleware)
app.use(compression({ threshold: 100 * 1000 }))
app.use(express.json())
app.use('/swagger/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(authentication)

app.use(envConfig.BASE_URL, route)

app.use((req, res, next) => {
    console.log(req.path)
    next(response.notFound())
})
app.use((error, req, res, next) => {
    if (error instanceof BadReq) {
        return res.status(error.status).json(response.badRequest(error))
    }
    logger.error(error)
    return res.status(error.status || 500).json(response.serverError(error))
})

const port = envConfig.PORT
const server = app.listen(port, (error) => {
    if (error) {
        logger.error(`Error in setup server: ${error}`)
        process.exit(1)
    }
    logger.info(`Server listing at port ${port}`)
})

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        logger.info('HTTP server closed')
    })
})

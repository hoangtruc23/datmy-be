const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

require('./config/mongodbConfig')
require('./config/redisConfig')

const route = require('./routes/index')
const response = require('./utils/response/response')
const { envConfig } = require('./config/envConfg')
const { logger } = require('./config/loggerConfig')
const limiter = require('./middlewares/rateLimit')
const corsMiddleware = require('./middlewares/cors')
const swaggerSpec = require('./docs/swaggerConfig')
const BadReq = require('./utils/response/requestError')
const { checkPermission, authenticated } = require('./middlewares/auth')
const {DeleteTemporaryGoodsJob} = require('./middlewares/cron')

const app = express()
app.use(limiter)
app.use(helmet())
app.use(corsMiddleware)
app.use(compression({ threshold: 100 * 1000 }))
app.use(express.json())
app.use(envConfig.SWAGGER_URL, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(process.env.BASE_URL, express.static(path.join(__dirname, 'public')))
app.use(authenticated)
app.use(checkPermission)

app.use(envConfig.BASE_URL, route)
DeleteTemporaryGoodsJob.start()

app.use((req, res, next) => {
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

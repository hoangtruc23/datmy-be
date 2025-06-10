const mongoose = require('mongoose')

const { envConfig } = require('./envConfg')
const { logger } = require('./loggerConfig')

const DB_HOST = envConfig.DB_HOST,
    DB_PORT = envConfig.DB_PORT,
    DB_NAME = envConfig.DB_NAME,
    DB_USERNAME = envConfig.DB_USERNAME,
    DB_PASSWORD = encodeURIComponent(envConfig.DB_PASSWORD),
    LOGIN_DB =
        DB_USERNAME && DB_PASSWORD ? `${DB_USERNAME}:${DB_PASSWORD}@` : '',
    ATLAS_DB = envConfig.DB_HOST?.indexOf('mongodb') > 0
const connectMongoDB = async () => {
    let reconnectTime
    try {
        await mongoose.connect(
            `mongodb${ATLAS_DB ? '+srv' : ''}://${LOGIN_DB}${DB_HOST}${
                ATLAS_DB ? '' : `:${DB_PORT}`
            }/${DB_NAME}`,
        )
        logger.info('MongoDB connected!')
        clearTimeout(reconnectTime)
    } catch (error) {
        logger.error(`Error connect MongoDB: ${error}`)
        reconnectTime = setTimeout(() => {
            logger.info('Reconnect to mongodb')
            connectMongoDB()
        }, 10000)
    }
}
connectMongoDB()

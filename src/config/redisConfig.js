const redis = require('redis')
const { envConfig } = require('./envConfg')
const { logger } = require('./loggerConfig')
const clientRedis = new redis.createClient({
    url: envConfig?.REDIS_PASSWORD
        ? `redis://${envConfig?.REDIS_USERNAME}:${encodeURIComponent(envConfig?.REDIS_PASSWORD)}@${envConfig?.REDIS_HOST}:${envConfig?.REDIS_PORT}`
        : null,
})

clientRedis.on('error', (error) => logger.error('Redis error: ' + error))
clientRedis.on('connect', () => logger.info('Redis connected!'))
clientRedis.on('ready', () => logger.info('Redis ready!'))
clientRedis.on('reconnecting', () => logger.info('Redis reconnecting!'))

const connectRedis = async () => {
    await clientRedis.connect()
}
connectRedis()
module.exports = { clientRedis }

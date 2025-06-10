const { logger } = require('../config/loggerConfig')
const { clientRedis } = require('../config/redisConfig')
const constant = require('../utils/constant/constant')
const response = require('../utils/response/response')

const isAuthenticated = async (req, res, next) => {
    try {
        if (!req.userId) {
            return next(response.unauthorized('Không có token!'))
        }
        const token = await clientRedis.get(
            `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${req.userId}`,
        )
        if (!token) {
            return next(response.unauthorized('Không có token!'))
        }
        return next()
    } catch (error) {
        logger.error(error)
        next(response.serverError(error))
    }
}

module.exports = { isAuthenticated }

const jwt = require('jsonwebtoken')

const { logger } = require('../config/loggerConfig')
const { clientRedis } = require('../config/redisConfig')
const constant = require('../utils/constant/constant')
const response = require('../utils/response/response')
const { envConfig } = require('../config/envConfg')

const isAuthenticated = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) {
            return res
                .status(401)
                .json(response.unauthorized('Không có token!'))
        }
        const accessToken = authorization.split(' ')[1]
        let decoded
        try {
            decoded = jwt.verify(
                accessToken,
                envConfig.JWT_ACCESS_TOKEN_PRIVATE_KEY,
            )
        } catch (error) {
            return res.status(401).json(response.unauthorized(error.message))
        }
        const token = await clientRedis.get(
            `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${decoded.userId}_${decoded.ts}`,
        )
        if (!token) {
            return next(response.unauthorized('Không có token!'))
        }
        req.userId = decoded.userId
        next()
    } catch (error) {
        logger.error(error)
        next(response.serverError(error))
    }
}

module.exports = { isAuthenticated }

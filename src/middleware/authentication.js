const jwt = require('jsonwebtoken')
const response = require('../utils/response/response')
const { envConfig } = require('../config/envConfg')

const authentication = (req, res, next) => {
    try {
        if (req.path.endsWith('/auth/login')) {
            return next()
        }
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(401).json(response.unauthorized('Missing token'))
        }
        const accessToken = authorization.split(' ')[1]
        jwt.verify(
            accessToken,
            envConfig.JWT_ACCESS_TOKEN_PRIVATE_KEY,
            (error, decoded) => {
                if (error) {
                    return res
                        .status(401)
                        .json(response.unauthorized(error.message))
                }
                Object.assign(req, { userId: decoded.userId })
                return next()
            },
        )
    } catch (error) {
        next(error)
    }
}

module.exports = authentication

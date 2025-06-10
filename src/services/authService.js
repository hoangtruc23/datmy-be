const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserModel = require('../models/user')
const errorCode = require('../utils/response/errorCode')
const { envConfig } = require('../config/envConfg')
const { clientRedis } = require('../config/redisConfig')
const BadReq = require('../utils/response/requestError')
const constant = require('../utils/constant/constant')

const authService = {
    login: async (username, password) => {
        try {
            const user = await UserModel.findOne({ username })
            if (!user) {
                throw new BadReq(errorCode?.INCORRECT_USERNAME)
            }
            const comparePassword = await bcrypt.compare(
                password,
                user?.password,
            )
            if (!comparePassword) {
                throw new BadReq(errorCode?.INCORRECT_PASSWORD)
            }
            const accessToken = jwt.sign(
                { userId: user._id },
                envConfig?.JWT_ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: Number(envConfig?.JWT_ACCESS_TOKEN_EXPIRES) },
            )

            // set redis
            await clientRedis.set(
                `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${user._id}`,
                accessToken,
                {
                    EX: envConfig.JWT_ACCESS_TOKEN_EXPIRES,
                },
            )
            return accessToken
        } catch (error) {
            throw error
        }
    },
    getUserLoginDetail: async (userId) => {
        try {
            const user = await UserModel.findById(userId, {
                password: 0,
                __v: 0,
            })
            if (!user) {
                throw new BadReq(errorCode?.USER_NOT_FOUND)
            }
            return user
        } catch (error) {
            throw error
        }
    },
    changePassword: async (userId, newPassword) => {
        try {
            const user = await UserModel.findById(userId)
            if (!user) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            const hashPass = await bcrypt.hash(newPassword, 10)
            await UserModel.findByIdAndUpdate(userId, { password: hashPass })
            return null
        } catch (error) {
            throw error
        }
    },
    logout: async (userId) => {
        try {
            await clientRedis.del(
                `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${userId}`,
            )
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = authService

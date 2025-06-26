const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserModel = require('../models/user')
const errorCode = require('../utils/response/errorCode')
const { envConfig } = require('../config/envConfg')
const { clientRedis } = require('../config/redisConfig')
const BadReq = require('../utils/response/requestError')
const constant = require('../utils/constant/constant')
const RolePermissionModel = require('../models/rolePermission')
const ApiModel = require('../models/api')
const PermissionApiModel = require('../models/permissionApi')
const PermissionModel = require('../models/permission')

const authService = {
    login: async (username, password) => {
        try {
            const user = await UserModel.findOne({ username })
            if (!user) {
                throw new BadReq(errorCode.INCORRECT_USERNAME)
            }
            const comparePassword = await bcrypt.compare(
                password,
                user.password,
            )
            if (!comparePassword) {
                throw new BadReq(errorCode.INCORRECT_PASSWORD)
            }
            const ts = Date.now()
            const accessToken = jwt.sign(
                { userId: user._id, ts },
                envConfig.JWT_ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: Number(envConfig.JWT_ACCESS_TOKEN_EXPIRES) },
            )

            // set redis
            await clientRedis.set(
                `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${user._id}_${ts}`,
                accessToken,
                {
                    EX: envConfig.JWT_ACCESS_TOKEN_EXPIRES,
                },
            )

            let apis
            if (
                user.username == constant.USER_ROOT ||
                user.username == constant.USER_BGD
            ) {
                apis = await ApiModel.find()
                apis = apis.map((api) => api.api)
            } else {
                const permissions = await RolePermissionModel.find({
                    roleId: { $in: user.roleIds },
                })
                const permissonIds = permissions.map(
                    (permission) => permission.permissionId,
                )
                apis = await PermissionApiModel.find({
                    permissionId: { $in: permissonIds },
                }).populate('apiId')
                apis = apis.map((api) => api?.apiId?.api)
            }

            await clientRedis.set(
                `${constant.REDIS_PREFIX_PERMISSION}_${user.id}`,
                JSON.stringify(apis),
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
            }).lean()
            if (!user) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            
            // Lấy tất cả các permission
            const rolePermissions = await RolePermissionModel.find({roleId: {$in: user.roleIds}}).populate('permissionId', 'code')
            const permissionCodeList = new Set()
            rolePermissions.forEach(item => {
                permissionCodeList.add(item?.permissionId?.code)
            })
            user.permissionCodeList = [...permissionCodeList]
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
    logout: async (payloadToken) => {
        try {
            await clientRedis.del(
                `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${payloadToken.userId}_${payloadToken.ts}`,
            )
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = authService

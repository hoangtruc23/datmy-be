const TechnicianModel = require('../models/technician')
const WorkOrderModel = require('../models/workOrder')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { envConfig } = require('../config/envConfg')
const { clientRedis } = require('../config/redisConfig')
const PermissionApiModel = require('../models/permissionApi')
const UserModel = require('../models/user')
const PermissionModel = require('../models/permission')

const technicianService = {
    create: async (reqData) => {
        try {
            const { fullname, username, email, phoneNumber, password, area } =
                reqData
            const [checkUsername1, checkUsername2] = await Promise.all([
                TechnicianModel.findOne({ username }),
                UserModel.findOne({ username }),
            ])
            if (checkUsername1 || checkUsername2) {
                throw new BadReq(errorCode.USER_EXISTED)
            }
            const latestTechnician = await TechnicianModel.findOne()
                .sort({ code: -1 })
                .lean()
            const code = latestTechnician
                ? `TECH-${String(Number(latestTechnician.code.slice(5)) + 1).padStart(5, '0')}`
                : 'TECH-00001'
            const hashPass = await bcrypt.hash(password, 10)
            await TechnicianModel.create({
                fullname,
                username,
                email,
                phoneNumber,
                password: hashPass,
                area,
                code,
            })
            return null
        } catch (error) {
            throw error
        }
    },

    getAll: async (query) => {
        try {
            let { page = 1, limit = 10, search = '', status } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')

            const conditions = {
                $or: [{ fullname: search }, { code: search }],
                ...(status ? { status } : {}),
            }
            const [technicians, totalItems] = await Promise.all([
                TechnicianModel.find(conditions)
                    .select('-password')
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),
                TechnicianModel.countDocuments(conditions),
            ])
            for (let technician of technicians) {
                const totalWorkOrder = await WorkOrderModel.countDocuments({
                    $and: [
                        { technicianId: technician._id },
                        {
                            status: {
                                $ne: constant.WORK_REQUEST_STATUS.COMPLETED
                                    .value,
                            },
                        },
                    ],
                })
                technician.numOfWork = totalWorkOrder
            }
            return {
                technicians,
                page,
                totalItems,
                totalPage: Math.ceil(totalItems / limit),
            }
        } catch (error) {
            throw error
        }
    },

    getById: async (technicianId) => {
        try {
            const technician = await TechnicianModel.findById(technicianId, {
                password: 0,
            })
            if (!technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }
            return technician
        } catch (error) {
            throw error
        }
    },

    getOverall: async () => {
        try {
            const allTechnician = await TechnicianModel.countDocuments({})
            const countByStatus = await TechnicianModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ])
            const acc = Object.values(constant.TECHNICIAN_STATUS)
                .map((s) => s.value)
                .reduce((acc, cur) => {
                    acc[cur] = 0
                    return acc
                }, {})

            const result = countByStatus.reduce(
                (acc, cur) => {
                    acc[cur._id] = cur.count
                    return acc
                },
                { allTechnician, ...acc },
            )

            return result
        } catch (error) {
            throw error
        }
    },

    update: async (technicianId, reqData) => {
        try {
            const technician = await TechnicianModel.findById(technicianId)
            if (!technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }
            const { username, fullname, email, phoneNumber, area } = reqData

            const checkUsername = await TechnicianModel.findOne({
                username,
                _id: { $ne: technicianId },
            })
            if (checkUsername) {
                throw new BadReq(errorCode.TECHNICIAN_EXISTED)
            }
            await TechnicianModel.findByIdAndUpdate(technicianId, {
                username,
                fullname,
                email,
                phoneNumber,
                area,
            })
            return null
        } catch (error) {
            throw error
        }
    },

    changeActive: async (technicianId) => {
        const technician = await TechnicianModel.findById(technicianId)
        if (!technician) {
            throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
        }
        const workOrders = await WorkOrderModel.findOne({
            $and: [
                { technicianId },
                {
                    status: {
                        $ne: constant.WORK_REQUEST_STATUS.COMPLETED.value,
                    },
                },
            ],
        })

        if (workOrders) {
            throw new BadReq(errorCode.TECHNICIAN_CANNOT_LOCKED)
        }
        await TechnicianModel.findByIdAndUpdate(technicianId, {
            isActive: !technician.isActive,
        })
        return null
    },
    getAllTechnicianStatus: () => Object.values(constant.TECHNICIAN_STATUS),
    login: async (reqData) => {
        try {
            const { username, password } = reqData
            const technician = await TechnicianModel.findOne({
                username,
                isActive: true,
            })
            if (!technician) {
                throw new BadReq(errorCode.INCORRECT_USERNAME)
            }
            const checkPassword = await bcrypt.compare(
                password,
                technician.password,
            )
            if (!checkPassword) {
                throw new BadReq(errorCode.INCORRECT_PASSWORD)
            }

            const ts = Date.now()
            const accessToken = jwt.sign(
                { userId: technician._id, ts },
                envConfig.JWT_ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: Number(envConfig.JWT_ACCESS_TOKEN_EXPIRES) },
            )
            await clientRedis.set(
                `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${technician._id}_${ts}`,
                accessToken,
                { EX: envConfig.JWT_ACCESS_TOKEN_EXPIRES },
            )

            const apis = (
                await PermissionApiModel.find({
                    permissionId: {
                        $in: Object.values(constant.TECHNICIAN_PERMISSION_ID),
                    },
                }).populate('apiId')
            ).map((a) => a?.apiId?.api)

            await clientRedis.set(
                `${constant.REDIS_PREFIX_PERMISSION}_${technician._id}`,
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
    logout: async (token) => {
        try {
            const tokenData = jwt.verify(
                token,
                envConfig.JWT_ACCESS_TOKEN_PRIVATE_KEY,
            )
            await clientRedis.del(
                `${constant.REDIS_PREFIX_ACCESS_TOKEN}_${tokenData.userId}_${tokenData.ts}`,
            )
            return null
        } catch (error) {
            throw error
        }
    },
    changPassword: async (technicianId, reqData) => {
        try {
            const { newPassword } = reqData
            const technician = await TechnicianModel.findById(technicianId)
            if (!technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }

            const hashPass = await bcrypt.hash(newPassword, 10)
            await TechnicianModel.findByIdAndUpdate(technicianId, {
                password: hashPass,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    getTechnicianLoginDetail: async (technicianId) => {
        try {
            const technician = await TechnicianModel.findById(technicianId, {
                password: 0,
                __v: 0,
            }).lean()
            if (!technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }
            const permission = await PermissionModel.find({
                _id: { $in: Object.values(constant.TECHNICIAN_PERMISSION_ID) },
            })
            const permissionCodeList = new Set()
            permission.forEach((item) => {
                permissionCodeList.add(item?.code)
            })
            technician.permissionCodeList = [...permissionCodeList]
            return technician
        } catch (error) {
            throw error
        }
    },
}
module.exports = technicianService

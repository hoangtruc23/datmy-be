const TechnicianModel = require('../models/technician')
const UserModel = require('../models/user')
const WorkOrderModel = require('../models/workOrder')
const userService = require('../services/userService')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

const technicianService = {
    create: async (reqUserId, reqData) => {
        try {
            const { fullname, username, email, phoneNumber, password, area } =
                reqData
            await userService.create(reqUserId, {
                fullname,
                username,
                email,
                phoneNumber,
                password,
                department: constant.DEPARTMENT.TECHNICAL,
                roleIds: [constant.ROLES.technician],
            })
            const user = await UserModel.findOne({ username })
            const latestTechnician = await TechnicianModel.findOne()
                .sort({ code: -1 })
                .lean()
            const code = latestTechnician
                ? `TECH-${String(Number(latestTechnician.code.slice(5)) + 1).padStart(5, '0')}`
                : 'TECH-00001'
            await TechnicianModel.create({
                userId: user._id,
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

            const users = await UserModel.find({ fullname: search })
            const userIds = users ? users.map((user) => user._id) : []

            const conditions = {
                $or: [{ userId: { $in: userIds } }, { code: search }],
                ...(status ? { status } : {}),
            }
            const [technicians, totalItems] = await Promise.all([
                TechnicianModel.find(conditions)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('userId', 'fullname email phoneNumber username')
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
            const technician = await TechnicianModel.findById(
                technicianId,
            ).populate('userId', 'fullname email phoneNumber username')
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

    update: async (reqUserId, technicianId, reqData) => {
        try {
            const technician = await TechnicianModel.findById(technicianId)
            if (!technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }
            const user = await UserModel.findById(technician.userId)
            const { username, fullname, email, phoneNumber, area } = reqData
            await userService.update(reqUserId, user._id, {
                username,
                fullname,
                email,
                phoneNumber,
            })
            await TechnicianModel.findByIdAndUpdate(technician._id, {
                area,
            })
            return null
        } catch (error) {
            throw error
        }
    },
}
module.exports = technicianService

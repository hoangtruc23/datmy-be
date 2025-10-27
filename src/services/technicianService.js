const TechnicianModel = require('../models/technician')
const UserModel = require('../models/user')
const WorkOrderModel = require('../models/workOrder')
const userService = require('../services/userService')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const bcrypt = require('bcryptjs')

const technicianService = {
    create: async (reqData) => {
        try {
            const { fullname, username, email, phoneNumber, password, area } =
                reqData
            const checkUsername = await TechnicianModel.findOne({ username })
            if (checkUsername) {
                throw new BadReq(errorCode.TECHNICIAN_EXISTED)
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
                _id: { $ne: userId },
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
        const workOrders = WorkOrderModel.findOne({
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
            isActive: false,
        })
        return null
    },
}
module.exports = technicianService

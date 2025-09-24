const WorkOrderModel = require('../models/workOrder')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const CustomerModel = require('../models/customer')
const constant = require('../utils/constant/constant')

const workOrderService = {
    getAll: async (query) => {
        try {
            let { limit = 10, page = 1, search = '', status, type } = query
            limit = Number(limit)
            page = Number(page)
            search = new RegExp(search, 'i')

            const customers = await CustomerModel.find({ officialName: search })
            const customerIds = customers ? customers.map((c) => c._id) : []

            const conditions = {
                $or: [
                    { code: search },
                    { header: search },
                    { customerId: { $in: customerIds } },
                ],
                ...(status ? { status } : {}),
                ...(type ? { type } : {}),
            }
            const [workOrders, totalItems] = await Promise.all([
                WorkOrderModel.find(conditions)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('customerId', 'officialName representative.name')
                    .populate('technicianId', 'name'),
                WorkOrderModel.countDocuments(conditions),
            ])
            return {
                workOrders,
                totalItems,
                page,
                totalPage: Math.ceil(totalItems / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getById: async (workOrderId) => {
        try {
            const workOrder = await WorkOrderModel.findById(workOrderId)
                .populate('customerId', 'officialName representative.name')
                .populate('technicianId', 'name')
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            return workOrder
        } catch (error) {
            throw error
        }
    },
    getOverall: async () => {
        try {
            const countByStatus = await WorkOrderModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ])

            const acc = Object.values(constant.WORK_REQUEST_STATUS).reduce(
                (acc, cur) => {
                    acc[cur] = 0
                    return acc
                },
                {},
            )

            let result = countByStatus.reduce((acc, cur) => {
                acc[cur._id] = cur.count
                return acc
            }, acc)

            const dueNow = await WorkOrderModel.countDocuments({
                overDueTime: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            })

            result['dueNow'] = dueNow

            return result
        } catch (error) {
            throw error
        }
    },
    create: async (reqData) => {
        try {
            const {
                header,
                typeWork,
                customerId,
                contactName,
                contactPhone,
                contactEmail,
                address,
                description,
                priority,
                estimatedTime,
                overDueTime,
                requestSource,
            } = reqData
            const latestOrder = await WorkOrderModel.findOne()
                .sort({ code: -1 })
                .lean()
            const code = latestOrder
                ? `JOB-${String(Number(latestOrder.code.slice(4)) + 1).padStart(5, '0')}`
                : 'JOB-00001'

            await WorkOrderModel.create({
                code,
                customerId,
                typeWork,
                requestSource,
                header,
                description,
                priority,
                contactName,
                contactPhone,
                contactEmail,
                address,
                estimatedTime,
                overDueTime,
            })
            return null
        } catch (error) {
            throw error
        }
    },

    update: async (workOrderId, reqData) => {
        try {
            const {
                typeWork,
                type,
                requiredSkill,
                requestSource,
                header,
                description,
                priority,
                estimatedTime,
                overDueTime,
                status,
            } = reqData

            const checkWorkOrder = await WorkOrderModel.findById(workOrderId)
            if (!checkWorkOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            await WorkOrderModel.findByIdAndUpdate(workOrderId, {
                typeWork,
                type,
                requiredSkill,
                requestSource,
                header,
                description,
                priority,
                estimatedTime,
                overDueTime,
                status,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (workOrderId) => {
        try {
            const checkWorkOrder = await WorkOrderModel.findById(workOrderId)
            if (!checkWorkOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            await WorkOrderModel.findByIdAndDelete(workOrderId)
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = workOrderService

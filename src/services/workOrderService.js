const WorkOrderModel = require('../models/workOrder')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const CustomerModel = require('../models/customer')
const constant = require('../utils/constant/constant')
const TechnicianModel = require('../models/technician')
const UserModel = require('../models/user')

const workOrderService = {
    getAll: async (userId, query) => {
        try {
            let { limit = 10, page = 1, search = '', status, type } = query
            limit = Number(limit)
            page = Number(page)
            search = new RegExp(search, 'i')

            const technician = await TechnicianModel.findOne({ userId })

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
                ...(technician ? { technicianId: technician } : {}),
            }
            const [workOrders, totalItems] = await Promise.all([
                WorkOrderModel.find(conditions)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('customerId', 'officialName representative.name')
                    .populate({
                        path: 'technicianId',
                        populate: { path: 'userId', select: 'fullname' },
                    })
                    .lean(),
                WorkOrderModel.countDocuments(conditions),
            ])
            const result = workOrders.map((order) => {
                let technicianInfo = null
                if (order.technicianId) {
                    technicianInfo = {
                        technicianId: order.technicianId._id,
                        fullname: order.technicianId.userId.fullname,
                    }
                }
                return {
                    ...order,
                    technicianInfo,
                    technicianId: undefined,
                }
            })
            return {
                result,
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
                .populate({
                    path: 'technicianId',
                    populate: { path: 'userId', select: 'fullname' },
                })
                .lean()
            if (!workOrder) {
                throw new BadReq(errorCode.WORK_ORDER_NOT_FOUND)
            }
            let technicianInfo = null
            if (workOrder.technicianId) {
                technicianInfo = {
                    technicianId: workOrder.technicianId._id,
                    fullname: workOrder.technicianId.userId.fullname,
                }
            }
            return { ...workOrder, technicianInfo, technicianId: undefined }
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

            const acc = Object.values(constant.WORK_REQUEST_STATUS)
                .map((s) => s.value)
                .reduce((acc, cur) => {
                    acc[cur] = 0
                    return acc
                }, {})

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
                technicianId,
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

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            const technician = await TechnicianModel.findById(technicianId)
            if (technicianId && !technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }

            //gen workOrder code
            const latestOrder = await WorkOrderModel.findOne()
                .sort({ code: -1 })
                .lean()
            const code = latestOrder
                ? `JOB-${String(Number(latestOrder.code.slice(4)) + 1).padStart(5, '0')}`
                : 'JOB-00001'

            await WorkOrderModel.create({
                code,
                technicianId,
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
            //ktv có việc => status = working
            await TechnicianModel.findByIdAndUpdate(technicianId, {
                status: constant.TECHNICIAN_STATUS.WORKING,
            })
            return null
        } catch (error) {
            throw error
        }
    },

    update: async (workOrderId, reqData) => {
        try {
            const {
                technicianId,
                typeWork,
                type,
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

            const technician = await TechnicianModel.findById(technicianId)
            if (!technician) {
                throw new BadReq(errorCode.TECHNICIAN_NOT_FOUND)
            }

            await WorkOrderModel.findByIdAndUpdate(workOrderId, {
                technicianId,
                typeWork,
                type,
                requestSource,
                header,
                description,
                priority,
                estimatedTime,
                overDueTime,
                status,
            })

            //cập nhật ktv
            if (checkWorkOrder.technicianId !== technicianId) {
                // ktv cũ nếu hết việc => cập nhật trạng thái
                const othersWorkOrder = await WorkOrderModel.findOne({
                    technicianId: checkWorkOrder.technicianId,
                })
                if (!othersWorkOrder) {
                    await TechnicianModel.findByIdAndUpdate(
                        checkWorkOrder.technicianId,
                        {
                            status: constant.TECHNICIAN_STATUS.FREE,
                        },
                    )
                }
                // ktv mới cập nhật trạng thái
                await TechnicianModel.findByIdAndUpdate(technicianId, {
                    status: constant.TECHNICIAN_STATUS.WORKING,
                })
            }
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
            //cập nhật ktv
            // ktv cũ nếu hết việc => cập nhật trạng thái
            const othersWorkOrder = await WorkOrderModel.findOne({
                technicianId: checkWorkOrder.technicianId,
            })
            if (!othersWorkOrder) {
                await TechnicianModel.findByIdAndUpdate(
                    checkWorkOrder.technicianId,
                    {
                        status: constant.TECHNICIAN_STATUS.FREE,
                    },
                )
            }
            return null
        } catch (error) {
            throw error
        }
    },

    getAllState: () => Object.values(constant.WORK_REQUEST_STATUS),
    getAllPriority: () => Object.values(constant.WORK_REQUEST_PRIORITY),
}

module.exports = workOrderService

const { Types } = require('mongoose')
const ConfigDebtModel = require('../models/configDebt')
const CustomerModel = require('../models/customer')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

const configDebtService = {
    create: async (data) => {
        try {
            const {
                customerId,
                customerName,
                limitDebt,
                limitDue,
                limitOverdue,
                limitRemindDay,
                notes,
            } = data

            const customer = await CustomerModel.findById(customerId)
            if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)

            const existingConfig = await ConfigDebtModel.findOne({ customerId })
            if (existingConfig) throw new BadReq(errorCode.DEBT_CONFIG_EXISTS)

            await ConfigDebtModel.create({
                customerId,
                customerName,
                limitDebt,
                limitDue,
                limitOverdue,
                limitRemindDay,
                notes,
            })

            return null
        } catch (err) {
            throw err
        }
    },

    update: async (id, data) => {
        try {
            const config = await ConfigDebtModel.findById(id)
            if (!config) throw new BadReq(errorCode.DEBT_CONFIG_NOT_FOUND)

            if (data.customerId && data.customerId !== config.customerId) {
                if (!Types.ObjectId.isValid(data.customerId)) {
                    throw new BadReq(errorCode.INVALID_ID)
                }
                const customer = await CustomerModel.findById(data.customerId)
                if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            Object.assign(config, {
                customerId: data.customerId,
                customerName: data.customerName,
                limitDebt: data.limitDebt,
                limitDue: data.limitDue,
                limitOverdue: data.limitOverdue,
                limitRemindDay: data.limitRemindDay,
                notes: data.notes,
            })

            await config.save()
            return null
        } catch (err) {
            throw err
        }
    },

    getAll: async (page = 1, limit = 10, search = '') => {
        try {
            page = parseInt(page)
            limit = parseInt(limit)
            const skip = (page - 1) * limit

            const filter = {}
            if (search.trim()) {
                const research = new RegExp(search.trim(), 'i')
                filter.$or = [{ customerName: research }, { notes: research }]
            }

            const [items, total] = await Promise.all([
                ConfigDebtModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: 1 }),
                ConfigDebtModel.countDocuments(filter),
            ])

            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages }
        } catch (err) {
            throw err
        }
    },

    getById: async (id) => {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadReq(errorCode.INVALID_ID)
            }
            const config = await ConfigDebtModel.findById(id)
            if (!config) throw new BadReq(errorCode.DEBT_CONFIG_NOT_FOUND)
            return config
        } catch (err) {
            throw err
        }
    },

    delete: async (id) => {
        try {
            const config = await ConfigDebtModel.findByIdAndDelete(id)
            if (!config) throw new BadReq(errorCode.DEBT_CONFIG_NOT_FOUND)
            return null
        } catch (err) {
            throw err
        }
    },
}

module.exports = configDebtService
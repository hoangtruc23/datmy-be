const { Types } = require('mongoose')
const PaymentHistoryModel = require('../models/paymentHistory')
const InvoiceModel = require('../models/invoice')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

const paymentHistoryService = {
    create: async (data) => {
        try {
            const {
                invoiceId,
                customerName,
                paymentDate,
                amount,
                content,
                status,
                method,
                notes,
            } = data

            const invoice = await InvoiceModel.findById(invoiceId)
            if (!invoice) throw new BadReq(errorCode.INVOICE_NOT_FOUND)

            await PaymentHistoryModel.create({
                invoiceId,
                customerName,
                paymentDate,
                amount,
                content,
                status,
                method,
                notes,
            })

            return null
        } catch (err) {
            throw err
        }
    },

    update: async (id, data) => {
        try {
            const payment = await PaymentHistoryModel.findById(id)
            if (!payment) throw new BadReq(errorCode.PAYMENT_NOT_FOUND)

            if (data.invoiceId && data.invoiceId !== payment.invoiceId) {
                if (!Types.ObjectId.isValid(data.invoiceId)) {
                    throw new BadReq(errorCode.INVALID_ID)
                }
                const invoice = await InvoiceModel.findById(data.invoiceId)
                if (!invoice) throw new BadReq(errorCode.INVOICE_NOT_FOUND)
            }

            Object.assign(payment, {
                invoiceId: data.invoiceId,
                customerName: data.customerName,
                paymentDate: data.paymentDate,
                amount: data.amount,
                content: data.content,
                status: data.status,
                method: data.method,
                notes: data.notes,
            })

            await payment.save()
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
                filter.$or = [{ customerName: research }, { content: research }]
            }

            const [items, total] = await Promise.all([
                PaymentHistoryModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: 1 })
                    .populate('invoiceId', 'invoiceCode'),
                PaymentHistoryModel.countDocuments(filter),
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
            const payment = await PaymentHistoryModel.findById(id).populate(
                'invoiceId',
                'invoiceCode customerName',
            )
            if (!payment) throw new BadReq(errorCode.PAYMENT_NOT_FOUND)
            return payment
        } catch (err) {
            throw err
        }
    },

    delete: async (id) => {
        try {
            const payment = await PaymentHistoryModel.findByIdAndDelete(id)
            if (!payment) throw new BadReq(errorCode.PAYMENT_NOT_FOUND)
            return null
        } catch (err) {
            throw err
        }
    },
}

module.exports = paymentHistoryService

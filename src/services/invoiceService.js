const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const ConfigDebtModel = require('../models/configDebt')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

const invoiceService = {
    create: async (data) => {
        try {
            const {
                customerId,
                customerName,
                invoiceCode,
                totalAmount,
                orderBy,
                accountant,
                reminderContact,
                notes,
            } = data

            const existed = await InvoiceModel.findOne({ invoiceCode })
            if (existed) throw new BadReq(errorCode.INVOICE_CODE_EXISTED)

            const config = await ConfigDebtModel.findOne().sort({
                createdAt: -1,
            })
            const limitDue = config?.limitDue ?? 30
            const exportDate = new Date()
            const dueDate = new Date(exportDate)
            dueDate.setDate(dueDate.getDate() + limitDue)

            await InvoiceModel.create({
                customerId,
                customerName,
                invoiceCode,
                totalAmount,
                dueDate,
                orderBy,
                accountant,
                reminderContact,
                notes,
            })

            return null
        } catch (err) {
            throw err
        }
    },

    update: async (id, data) => {
        try {
            const invoice = await InvoiceModel.findById(id)
            if (!invoice) throw new BadReq(errorCode.INVOICE_NOT_FOUND)

            if (data.invoiceCode && data.invoiceCode !== invoice.invoiceCode) {
                const conflict = await InvoiceModel.findOne({
                    invoiceCode: data.invoiceCode,
                })
                if (conflict) throw new BadReq(errorCode.INVOICE_CODE_EXISTED)
            }

            Object.assign(invoice, {
                customerId: data.customerId,
                customerName: data.customerName,
                invoiceCode: data.invoiceCode,
                totalAmount: data.totalAmount,
                orderBy: data.orderBy,
                accountant: data.accountant,
                status: data.status,
                reminderContact: data.reminderContact,
                notes: data.notes,
            })

            await invoice.save()
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
                filter.$or = [
                    { invoiceCode: research },
                    { customerName: research },
                ]
            }

            const [items, total] = await Promise.all([
                InvoiceModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: 1 }),
                //.populate('customerId', 'name code'),
                InvoiceModel.countDocuments(filter),
            ])

            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages }
        } catch (err) {
            throw err
        }
    },

    getById: async (id) => {
        try {
            if (!Types.ObjectId.isValid(id))
                throw new BadReq(errorCode.INVALID_ID)
            const invoice = await InvoiceModel.findById(id)
            //.populate('customerId', 'name code')
            if (!invoice) throw new BadReq(errorCode.INVOICE_NOT_FOUND)
            return invoice
        } catch (err) {
            throw err
        }
    },

    delete: async (id) => {
        try {
            const invoice = await InvoiceModel.findByIdAndDelete(id)
            if (!invoice) throw new BadReq(errorCode.INVOICE_NOT_FOUND)
            return null
        } catch (err) {
            throw err
        }
    },
}

module.exports = invoiceService

const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const CustomerModel = require('../models/customer')
// const PaymentHistoryModel = require('../models/paymentHistory')
const BadReq = require('../utils/response/requestError')
const constant = require('../utils/constant/constant')
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
                invoiceDate = new Date(),
                notes,
                invoiceDetails,
                invoiceLink,
                paymentBy,
                dueDate,
            } = data

            const customer = await CustomerModel.findById(customerId)
            if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)

            const existed = await InvoiceModel.findOne({ invoiceCode })
            if (existed) throw new BadReq(errorCode.INVOICE_CODE_EXISTED)

            
            const limitDue = Math.ceil((new Date(dueDate) - new Date(invoiceDate)) / (1000 * 60 * 60 * 24))


            const invoice = await InvoiceModel.create({
                customerId,
                customerName,
                invoiceCode,
                totalAmount,
                dueDate,
                limitDue,
                orderBy,
                invoiceDate,
                invoiceDetails,
                accountant,
                reminderContact,
                invoiceLink,
                paymentBy,
                notes,
            })

            return invoice
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
            if(data.dueDate && data.dueDate !== invoice.dueDate) {
                const dueDate = new Date(data.dueDate)
                const exportDate = invoice.createdAt
                const limitDue = Math.ceil((dueDate - exportDate) / (1000 * 60 * 60 * 24))
                invoice.limitDue = limitDue
            }
            Object.assign(invoice, {
                customerId: data.customerId,
                customerName: data.customerName,
                invoiceCode: data.invoiceCode,
                orderBy: data.orderBy,
                accountant: data.accountant,
                limitDue: invoice.limitDue,
                invoiceDetails: data.invoiceDetails,
                invoiceLink: data.invoiceLink,
                reminderContact: data.reminderContact,
                notes: data.notes,
            })

            await invoice.save()
            return null
        } catch (err) {
            throw err
        }
    },

    getAll: async (page = 1, limit = 10, search = '', status = '') => {
        try {
            page = parseInt(page)
            limit = parseInt(limit)
            const skip = (page - 1) * limit
            const currentDate = new Date()
            const matchCond = []
            if (search.trim()) {
                matchCond.push({
                    $or: [
                        {
                            invoiceCode: {
                                $regex: search.trim(),
                                $options: 'i',
                            },
                        },
                        {
                            customerName: {
                                $regex: search.trim(),
                                $options: 'i',
                            },
                        },
                    ],
                })
            }
            const pipeline = [
                ...(matchCond.length > 0 ? [{ $match: matchCond[0] }] : []),
                {
                    $lookup: {
                        from: 'paymenthistories',
                        let: { invoiceId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$invoiceId', '$$invoiceId'],
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    paidAmount: { $sum: '$amount' },
                                },
                            },
                        ],
                        as: 'payments',
                    },
                },
                {
                    $addFields: {
                        totalPaid: {
                            $ifNull: [
                                { $arrayElemAt: ['$payments.paidAmount', 0] },
                                0,
                            ],
                        },
                        remainingDebt: {
                            $subtract: [
                                '$totalAmount',
                                {
                                    $ifNull: [
                                        {
                                            $arrayElemAt: [
                                                '$payments.paidAmount',
                                                0,
                                            ],
                                        },
                                        0,
                                    ],
                                },
                            ],
                        },
                        status: {
                            $cond: {
                                if: {
                                    $eq: [
                                        '$totalAmount',
                                        {
                                            $arrayElemAt: [
                                                '$payments.paidAmount',
                                                0,
                                            ],
                                        },
                                    ],
                                },
                                then: constant.INVOICE_STATUS.PAID,
                                else: {
                                    $cond: {
                                        if: { $lt: ['$dueDate', currentDate] },
                                        then: constant.INVOICE_STATUS.OVERDUE,
                                        else: {
                                            $cond: {
                                                if: {
                                                    $gt: [
                                                        {
                                                            $ifNull: [
                                                                {
                                                                    $arrayElemAt:
                                                                        [
                                                                            '$payments.paidAmount',
                                                                            0,
                                                                        ],
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                        0,
                                                    ],
                                                },
                                                then: constant.INVOICE_STATUS
                                                    .PARTIALLY_PAID,
                                                else: constant.INVOICE_STATUS
                                                    .PENDING,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                ...(status ? [{ $match: { status: { $eq: status } } }] : []),
                {
                    $sort: { createdAt: 1 },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customer',
                    },
                },
                {
                    $unwind: {
                        path: '$customer',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        invoiceCode: 1,
                        customerName: 1,
                        totalAmount: 1,
                        totalPaid: 1,
                        remainingDebt: 1,
                        dueDate: 1,
                        status: 1,
                        orderBy: 1,
                        accountant: 1,
                        reminderContact: 1,
                        notes: 1,
                    },
                },
            ]

            const totalPipeline = [
                ...(matchCond.length > 0 ? [{ $match: matchCond[0] }] : []),
                {
                    $lookup: {
                        from: 'paymenthistories',
                        let: { invoiceId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$invoiceId', '$$invoiceId'],
                                    },
                                    status: constant.PAYMENT_STATUS.PAID,
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    paidAmount: { $sum: '$amount' },
                                },
                            },
                        ],
                        as: 'payments',
                    },
                },
                {
                    $addFields: {
                        totalPaid: {
                            $ifNull: [
                                { $arrayElemAt: ['$payments.paidAmount', 0] },
                                0,
                            ],
                        },
                        status: {
                            $cond: {
                                if: {
                                    $eq: [
                                        '$totalAmount',
                                        {
                                            $ifNull: [
                                                {
                                                    $arrayElemAt: [
                                                        '$payments.paidAmount',
                                                        0,
                                                    ],
                                                },
                                                0,
                                            ],
                                        },
                                    ],
                                },
                                then: constant.INVOICE_STATUS.PAID,
                                else: {
                                    $cond: {
                                        if: { $lt: ['$dueDate', currentDate] },
                                        then: constant.INVOICE_STATUS.OVERDUE,
                                        else: {
                                            $cond: {
                                                if: {
                                                    $gt: [
                                                        {
                                                            $ifNull: [
                                                                {
                                                                    $arrayElemAt:
                                                                        [
                                                                            '$payments.paidAmount',
                                                                            0,
                                                                        ],
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                        0,
                                                    ],
                                                },
                                                then: constant.INVOICE_STATUS
                                                    .PARTIALLY_PAID,
                                                else: constant.INVOICE_STATUS
                                                    .PENDING,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                ...(status ? [{ $match: { status: { $eq: status } } }] : []),
                { $count: 'count' },
            ]
            const [result, totalResult] = await Promise.all([
                InvoiceModel.aggregate(pipeline),
                InvoiceModel.aggregate(totalPipeline),
            ])

            const items = result || []
            const total = totalResult[0]?.count || 0
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

    getSummary: async () => {
        try {
            const currentDate = new Date()

            const pipeline = [
                {
                    $lookup: {
                        from: 'paymenthistories',
                        let: { invoiceId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$invoiceId', '$$invoiceId'],
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    paidAmount: { $sum: '$amount' },
                                },
                            },
                        ],
                        as: 'payments',
                    },
                },
                {
                    $addFields: {
                        totalPaid: {
                            $ifNull: [
                                { $arrayElemAt: ['$payments.paidAmount', 0] },
                                0,
                            ],
                        },
                        remainingDebt: {
                            $subtract: [
                                '$totalAmount',
                                {
                                    $ifNull: [
                                        {
                                            $arrayElemAt: [
                                                '$payments.paidAmount',
                                                0,
                                            ],
                                        },
                                        0,
                                    ],
                                },
                            ],
                        },
                        status: {
                            $cond: {
                                if: {
                                    $eq: [
                                        '$totalAmount',
                                        {
                                            $arrayElemAt: [
                                                '$payments.paidAmount',
                                                0,
                                            ],
                                        },
                                    ],
                                },
                                then: constant.INVOICE_STATUS.PAID,
                                else: {
                                    $cond: {
                                        if: { $lt: ['$dueDate', currentDate] },
                                        then: constant.INVOICE_STATUS.OVERDUE,
                                        else: {
                                            $cond: {
                                                if: {
                                                    $gt: [
                                                        {
                                                            $ifNull: [
                                                                {
                                                                    $arrayElemAt:
                                                                        [
                                                                            '$payments.paidAmount',
                                                                            0,
                                                                        ],
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                        0,
                                                    ],
                                                },
                                                then: constant.INVOICE_STATUS
                                                    .PARTIALLY_PAID,
                                                else: constant.INVOICE_STATUS
                                                    .PENDING,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalInvoices: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                        paidInvoices: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            '$status',
                                            constant.INVOICE_STATUS.PAID,
                                        ],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        paidAmount: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            '$status',
                                            constant.INVOICE_STATUS.PAID,
                                        ],
                                    },
                                    then: '$totalPaid',
                                    else: 0,
                                },
                            },
                        },
                        pendingInvoices: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            '$status',
                                            constant.INVOICE_STATUS.PENDING ||
                                                constant.INVOICE_STATUS
                                                    .PARTIALLY_PAID,
                                        ],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        pendingAmount: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $in: [
                                            '$status',
                                            [
                                                constant.INVOICE_STATUS.PENDING,
                                                constant.INVOICE_STATUS
                                                    .PARTIALLY_PAID,
                                            ],
                                        ],
                                    },
                                    then: '$remainingDebt',
                                    else: 0,
                                },
                            },
                        },
                        overdueInvoices: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            '$status',
                                            constant.INVOICE_STATUS.OVERDUE,
                                        ],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        overdueAmount: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: [
                                            '$status',
                                            constant.INVOICE_STATUS.OVERDUE,
                                        ],
                                    },
                                    then: '$remainingDebt',
                                    else: 0,
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalInvoices: 1,
                        totalAmount: 1,
                        paidInvoices: 1,
                        paidAmount: 1,
                        pendingInvoices: 1,
                        pendingAmount: 1,
                        overdueInvoices: 1,
                        overdueAmount: 1,
                    },
                },
            ]

            const [result] = await InvoiceModel.aggregate(pipeline)
            return {
                totalInvoices: result?.totalInvoices || 0,
                totalAmount: result?.totalAmount || 0,
                paidInvoices: result?.paidInvoices || 0,
                paidAmount: result?.paidAmount || 0,
                pendingInvoices: result?.pendingInvoices || 0,
                pendingAmount: result?.pendingAmount || 0,
                overdueInvoices: result?.overdueInvoices || 0,
                overdueAmount: result?.overdueAmount || 0,
            }
        } catch (err) {
            throw err
        }
    },
}

module.exports = invoiceService

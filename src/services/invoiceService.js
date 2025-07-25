const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const ConfigDebtModel = require('../models/configDebt')
const CustomerModel = require('../models/customer')
const PaymentHistoryModel = require('../models/paymentHistory')
const BadReq = require('../utils/response/requestError')
const constant = require('../utils/constant/constant')
const errorCode = require('../utils/response/errorCode')

const invoiceService = {
    create: async (data) => {
        try {
            const config = await ConfigDebtModel.findOne().sort({
                createdAt: -1,
            })


            const {
                customerId,
                customerName,
                invoiceCode,
                totalAmount,
                orderBy,
                accountant,
                reminderContact,
                notes,
                limitDue = config?.limitDue ?? 30
            } = data

            const customer = await CustomerModel.findById(customerId)
            if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)

            const existed = await InvoiceModel.findOne({ invoiceCode })
            if (existed) throw new BadReq(errorCode.INVOICE_CODE_EXISTED)


            //const limitDue = config?.limitDue ?? 30
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
            
            if(data.limitDue) {
                const limitDue = data.limitDue
                const exportDate = invoice.createdAt
                const dueDate = new Date(exportDate)
                dueDate.setDate(dueDate.getDate() + limitDue)
                invoice.dueDate = dueDate
            }
            Object.assign(invoice, {
                customerId: data.customerId,
                customerName: data.customerName,
                invoiceCode: data.invoiceCode,
                totalAmount: data.totalAmount,
                orderBy: data.orderBy,
                accountant: data.accountant,
                //status: data.status,
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
            page = parseInt(page);
            limit = parseInt(limit);
            const skip = (page - 1) * limit;
            const currentDate = new Date();

            const pipeline = [
                {
                    $match: {
                        $or: [
                            { invoiceCode: { $regex: search.trim(), $options: 'i' } },
                            { customerName: { $regex: search.trim(), $options: 'i' } },
                        ],
                    },
                },
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
                        totalPaid:  {
                             $ifNull: [{ $arrayElemAt: ['$payments.paidAmount', 0] }, 0] 
                        },
                        remainingDebt: {
                            $subtract: [
                                '$totalAmount',
                                { $ifNull: [{ $arrayElemAt: ['$payments.paidAmount', 0] }, 0] },
                            ],
                        },
                        status: {
                            $cond: {
                                if: { $eq: ['$totalAmount', { $arrayElemAt: ['$payments.paidAmount', 0] }] },
                                then: constant.INVOICE_STATUS.PAID,
                                else: {
                                     $cond: {
                                        if: { $lt: ['$dueDate', currentDate] },
                                        then: constant.INVOICE_STATUS.OVERDUE,
                                        else: {
                                            $cond: {
                                                if: {
                                                    $gt: [
                                                        { $ifNull: [{ $arrayElemAt: ['$payments.paidAmount', 0] }, 0] },
                                                        0,
                                                    ],
                                                },
                                                then: constant.INVOICE_STATUS.PARTIALLY_PAID,
                                                else: constant.INVOICE_STATUS.PENDING,
                                            },
                                        },
                                    },
                                }
                            },
                            
                        },
                    },
                },
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
                        customerId: 1,
                        totalPaid: 1,
                        remainingDebt: 1,
                        status: 1,
                        'customer.name': 1,
                        'customer.code': 1,
                        createdAt: 1,
                        totalAmount: 1,
                        dueDate: 1, 
                    },
                },
            ];

            const [result] = await InvoiceModel.aggregate([
                {
                    $facet: {
                        items: pipeline,
                        total: [{ $match: pipeline[0].$match }, { $count: 'count' }],
                    },
                },
            ]);

            const items = result.items || [];
            const total = result.total[0]?.count || 0;
            const totalPages = Math.ceil(total / limit);

            return { items, total, page, limit, totalPages };
        } catch (err) {
            throw err;
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

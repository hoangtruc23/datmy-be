const BadReq = require('../utils/response/requestError')
const constant = require('../utils/constant/constant')
const errorCode = require('../utils/response/errorCode')
const { Types } = require('mongoose')

const DiscountRequestModel = require('../models/discountRequest')
const InvoiceModel = require('../models/invoice')

const discountService = {
    create: async (reqData) => {
        try {
            const { invoiceId, type, value } = reqData

            const checkInvoice = await InvoiceModel.findById(invoiceId)
            if (!checkInvoice) {
                throw new BadReq(errorCode.INVOICE_NOT_FOUND)
            }

            const discountAmount =
                type === constant.DISCOUNT_TYPE.AMOUNT
                    ? value
                    : (value * checkInvoice.totalAmount) / 100

            await DiscountRequestModel.create({ ...reqData, discountAmount })
            return null
        } catch (error) {
            throw error
        }
    },

    joinDiscountAndInvoice: () => {
        return [
            {
                $lookup: {
                    from: 'invoices',
                    localField: 'invoiceId',
                    foreignField: '_id',
                    as: 'invoiceInfo',
                },
            },
            {
                $unwind: '$invoiceInfo',
            },
        ]
    },

    getAll: async (query) => {
        try {
            let { page = 1, limit = 10, search, status } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')

            const statusCondition = {}
            if (status) {
                statusCondition.status = status
            }
            const match = [
                {
                    $match: {
                        ...statusCondition,
                        $or: [
                            { 'invoiceInfo.customerName': search },
                            { 'invoiceInfo.invoiceCode': search },
                        ],
                    },
                },
            ]

            const [results, totalResults] = await Promise.all([
                DiscountRequestModel.aggregate([
                    ...discountService.joinDiscountAndInvoice(),
                    ...match,
                    {
                        $project: {
                            _id: 1,
                            invoiceId: 1,
                            requestDate: 1,
                            type: 1,
                            value: 1,
                            discountAmount: 1,
                            content: 1,
                            status: 1,
                            'invoiceInfo.customerName': 1,
                            'invoiceInfo.totalAmount': 1,
                            'invoiceInfo.invoiceCode': 1,
                        },
                    },
                    {
                        $skip: (page - 1) * limit,
                    },
                    {
                        $limit: limit,
                    },
                ]),
                DiscountRequestModel.aggregate([
                    ...discountService.joinDiscountAndInvoice(),
                    ...match,
                    {
                        $count: 'total',
                    },
                ]),
            ])

            const totalItem = totalResults[0] ? totalResults[0].total : 0
            return {
                results,
                page,
                totalItem,
                totalPage: Math.ceil(totalItem / limit),
            }
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            const result = await DiscountRequestModel.aggregate([
                ...discountService.joinDiscountAndInvoice(),
                {
                    $match: { _id: new Types.ObjectId(id) },
                },
                {
                    $project: {
                        _id: 1,
                        invoiceId: 1,
                        requestDate: 1,
                        type: 1,
                        value: 1,
                        content: 1,
                        'invoiceInfo.customerName': 1,
                        'invoiceInfo.totalAmount': 1,
                        'invoiceInfo.invoiceCode': 1,
                    },
                },
            ])
            if (!result) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            return result
        } catch (error) {
            throw error
        }
    },

    getHistory: async (query) => {
        try {
            let { page = 1, limit = 10, search, refundStatus } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')

            const refundStatusCondition = {}
            if (refundStatus) {
                refundStatusCondition.refundStatus = refundStatus
            }
            const match = [
                {
                    $match: {
                        ...refundStatusCondition,
                        $or: [
                            { 'invoiceInfo.customerName': search },
                            { 'invoiceInfo.invoiceCode': search },
                        ],
                    },
                },
            ]

            const [results, totalResults] = await Promise.all([
                DiscountRequestModel.aggregate([
                    ...discountService.joinDiscountAndInvoice(),
                    ...match,
                    {
                        $project: {
                            _id: 1,
                            invoiceId: 1,
                            requestDate: 1,
                            discountAmount: 1,
                            content: 1,
                            refundStatus: 1,
                            'invoiceInfo.customerName': 1,
                            'invoiceInfo.invoiceCode': 1,
                        },
                    },
                    {
                        $skip: (page - 1) * limit,
                    },
                    {
                        $limit: limit,
                    },
                ]),

                DiscountRequestModel.aggregate([
                    ...discountService.joinDiscountAndInvoice(),
                    ...match,
                    {
                        $count: 'total',
                    },
                ]),
            ])

            const totalItem = totalResults[0] ? totalResults[0].total : 0
            return {
                results,
                page,
                totalItem,
                totalPage: Math.ceil(totalItem / limit),
            }
        } catch (error) {
            throw error
        }
    },

    getOverview: async () => {
        try {
            const [
                totalRequest,
                totalWaitingApproval,
                totalApproved,
                totalRejected,
                totalDiscount,
            ] = await Promise.all([
                DiscountRequestModel.countDocuments({}),
                DiscountRequestModel.countDocuments({
                    status: constant.APPROVAL_STATUS.NULL,
                }),
                DiscountRequestModel.countDocuments({
                    status: constant.APPROVAL_STATUS.APPROVED,
                }),
                DiscountRequestModel.countDocuments({
                    status: constant.APPROVAL_STATUS.REJECTED,
                }),
                DiscountRequestModel.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$discountAmount' },
                        },
                    },
                ]).then((res) => (res[0] ? res[0].total : 0)),
            ])
            return {
                totalRequest,
                totalWaitingApproval,
                totalApproved,
                totalRejected,
                totalDiscount,
            }
        } catch (error) {
            throw error
        }
    },

    approved: async (id) => {
        try {
            const request = await DiscountRequestModel.findByIdAndUpdate(id, {
                status: constant.APPROVAL_STATUS.APPROVED,
            })
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            return null
        } catch (error) {
            throw error
        }
    },

    rejected: async (id) => {
        try {
            const request = await DiscountRequestModel.findByIdAndUpdate(id, {
                status: constant.APPROVAL_STATUS.REJECTED,
            })
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            return null
        } catch (error) {
            throw error
        }
    },
    setRefund: async (id) => {
        try {
            const request = await DiscountRequestModel.findByIdAndUpdate(id, {
                refundStatus: constant.REFUND_STATUS.PAID,
            })
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
                return null
            }
        } catch (error) {
            throw error
        }
    },

    update: async (id, reqData) => {
        try {
            const request = await DiscountRequestModel.findById(id)
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            const invoice = await InvoiceModel.findById(request.invoiceId)

            const { requestDate, type, value, content } = reqData
            const discountAmount =
                type === constant.DISCOUNT_TYPE.AMOUNT
                    ? value
                    : (value * invoice.totalAmount) / 100

            await DiscountRequestModel.findByIdAndUpdate(id, {
                requestDate,
                type,
                value,
                discountAmount,
                content,
            })
            return null
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            const request = await DiscountRequestModel.findByIdAndDelete(id)
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = discountService

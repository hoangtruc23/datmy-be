const BadReq = require('../utils/response/requestError')
const constant = require('../utils/constant/constant')
const errorCode = require('../utils/response/errorCode')
const { Types } = require('mongoose')

const DiscountRequestModel = require('../models/discountRequest')
const InvoiceModel = require('../models/invoice')
const CustomerModel = require('../models/customer')
const ProductModel = require('../models/product')
const DiscountHistoryModel = require('../models/discountHistory')

const discountService = {
    // discount
    create: async (reqData) => {
        try {
            const { customerId, productId, amount, requestDate, content } =
                reqData
            const [checkCustomer, checkProduct, checkDiscountRequest] =
                await Promise.all([
                    CustomerModel.findById(customerId),
                    ProductModel.findById(productId),
                    DiscountRequestModel.findOne({
                        customerId,
                        productId,
                        isEffect: true,
                    }),
                ])
            if (!checkCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            if (checkDiscountRequest) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_EXISTED)
            }

            await DiscountRequestModel.create({
                customerId,
                productId,
                discounts: [{ amount, requestDate }],
                content,
            })
            return null
        } catch (error) {
            throw error
        }
    },

    findLastDiscountInfo: [
        {
            $lookup: {
                from: 'customers',
                localField: 'customerId',
                foreignField: '_id',
                as: 'customerInfo',
            },
        },
        { $unwind: '$customerInfo' },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productInfo',
            },
        },
        { $unwind: '$productInfo' },
        {
            $addFields: {
                lastDiscount: { $arrayElemAt: ['$discounts', -1] },
            },
        },
        {
            $project: {
                _id: 1,
                customerInfo: { _id: 1, officialName: 1 },
                productInfo: { _id: 1, name: 1, code: 1 },
                discountAmount: '$lastDiscount.amount',
                requestDate: '$lastDiscount.requestDate',
                content: 1,
                createdAt: 1,
            },
        },
        { $sort: { createdAt: -1 } },
    ],

    getAll: async function (query) {
        try {
            let {
                page = 1,
                limit = 10,
                search = '',
                customerId,
                productId,
            } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')

            //handle search
            const customers = await CustomerModel.find({
                officialName: search,
            })
            const customerIds = customers.map((cus) => cus._id)
            const products = await ProductModel.find({
                $or: [{ name: search }, { code: search }],
            })
            const productIds = products.map((product) => product._id)
            let filters = {}
            if (customerIds.length && productIds.length) {
                filters = {
                    $or: [
                        { customerId: { $in: customerIds } },
                        { productId: { $in: productIds } },
                    ],
                }
            } else if (customerIds.length) {
                filters = { customerId: { $in: customerIds } }
            } else if (productIds.length) {
                filters = { productId: { $in: productIds } }
            }
            if (customerId) {
                filters.customerId = new Types.ObjectId(customerId)
            }
            if (productId) {
                filters.productId = new Types.ObjectId(productId)
            }

            const [items, totalItems] = await Promise.all([
                DiscountRequestModel.aggregate([
                    {
                        $match: { ...filters, isEffect: true },
                    },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    ...this.findLastDiscountInfo,
                ]),
                DiscountRequestModel.countDocuments({
                    ...filters,
                    isEffect: true,
                }),
            ])

            return {
                items,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            }
        } catch (error) {
            throw error
        }
    },

    getById: async function (id) {
        try {
            const result = await DiscountRequestModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(id),
                        isEffect: true,
                    },
                },
                ...this.findLastDiscountInfo,
            ])
            if (!result) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            return result
        } catch (error) {
            throw error
        }
    },

    update: async (id, reqData) => {
        try {
            const request = await DiscountRequestModel.findOne({
                _id: id,
                isEffect: true,
            })
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }

            const { customerId, productId, amount, requestDate, content } =
                reqData
            const [checkCustomer, checkProduct] = await Promise.all([
                CustomerModel.findById(customerId),
                ProductModel.findById(productId),
            ])
            if (!checkCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }

            //update customerId hoặc productId => tạo cài đặt mới
            //update cả amount và requestDate => push thêm vào cuối
            //update amount hoặc requestDate => update lại phân tử cuối cùng
            if (
                !request.customerId.equals(customerId) ||
                !request.productId.equals(productId)
            ) {
                await discountService.create({
                    customerId,
                    productId,
                    amount,
                    requestDate,
                    content,
                })
                await DiscountRequestModel.findByIdAndUpdate(id, {
                    isEffect: false,
                })
            } else {
                const discounts = request.discounts
                const lastDiscount =
                    request.discounts[request.discounts.length - 1]
                if (amount === lastDiscount.amount) {
                    discounts[discounts.length - 1].requestDate = new Date(
                        requestDate,
                    )
                    await DiscountRequestModel.findByIdAndUpdate(id, {
                        discounts,
                        content,
                    })
                } else if (
                    new Date(requestDate).getTime() ===
                    new Date(lastDiscount.requestDate).getTime()
                ) {
                    discounts[discounts.length - 1].amount = amount
                    await DiscountRequestModel.findByIdAndUpdate(id, {
                        discounts,
                        content,
                    })
                } else {
                    await DiscountRequestModel.findByIdAndUpdate(id, {
                        $push: {
                            discounts: {
                                $each: [{ amount, requestDate }],
                                $sort: { requestDate: 1 },
                            },
                        },
                        content,
                    })
                }
            }
            return null
        } catch (error) {
            throw error
        }
    },
    setRefund: async (reqData) => {
        try {
            const { discountRequestId, invoiceId, paymentDate } = reqData
            const [request, invoice] = await Promise.all([
                DiscountRequestModel.findById(discountRequestId),
                InvoiceModel.findById(invoiceId),
            ])
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            if (!invoice) {
                throw new BadReq(errorCode.INVOICE_NOT_FOUND)
            }

            const checkProduct = invoice.invoiceDetails.some((d) =>
                d.productId.equals(request.productId),
            )
            const checkDay =
                invoice.createdAt >= request.discounts[0].requestDate
            if (
                request.customerId.toString() !==
                    invoice.customerId.toString() ||
                !checkProduct ||
                !checkDay
            ) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_MATCH)
            }

            const history = await DiscountHistoryModel.findOne({
                discountRequestId,
                invoiceId,
            })
            if (!history) {
                await DiscountHistoryModel.create({
                    discountRequestId,
                    invoiceId,
                    refundStatus: constant.REFUND_STATUS.PAID,
                    paymentDate: paymentDate ? new Date(paymentDate) : null,
                })
            } else {
                await DiscountHistoryModel.findByIdAndUpdate(history._id, {
                    refundStatus:
                        history.refundStatus === constant.REFUND_STATUS.PAID
                            ? constant.REFUND_STATUS.UNPAID
                            : constant.REFUND_STATUS.PAID,
                    paymentDate:
                        history.refundStatus === constant.REFUND_STATUS.PAID
                            ? null // nếu hủy thanh toán → xóa ngày
                            : paymentDate
                              ? new Date(paymentDate)
                              : null,
                })
            }
            return null
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            const request = await DiscountRequestModel.findOne({
                _id: id,
                isEffect: true,
            })
            if (!request) {
                throw new BadReq(errorCode.DISCOUNT_REQUEST_NOT_FOUND)
            }
            await DiscountRequestModel.findByIdAndUpdate(id, {
                isEffect: false,
            })

            return null
        } catch (error) {
            throw error
        }
    },

    //history discount
    getHistory: async (query) => {
        try {
            let { page = 1, limit = 10, search, refundStatus } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')

            //handle search
            const customers = await CustomerModel.find({
                officialName: search,
            })
            const customerIds = customers.map((cus) => cus._id)
            const products = await ProductModel.find({
                $or: [{ name: search }, { code: search }],
            })
            const productIds = products.map((product) => product._id)
            let filters = {}
            if (customerIds.length && productIds.length) {
                filters = {
                    $or: [
                        { customerId: { $in: customerIds } },
                        { productId: { $in: productIds } },
                    ],
                }
            } else if (customerIds.length) {
                filters = { customerId: { $in: customerIds } }
            } else if (productIds.length) {
                filters = { productId: { $in: productIds } }
            }

            const discountRequest = await DiscountRequestModel.aggregate([
                { $match: filters },
                { $skip: (page - 1) * limit },
                { $limit: limit },                
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerInfo',
                    },
                },
                { $unwind: '$customerInfo' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productInfo',
                    },
                },
                { $unwind: '$productInfo' },
                {
                    $sort: {
                        'customerInfo.officialName': 1,
                        'productInfo.name': 1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        customerInfo: { _id: 1, officialName: 1 },
                        productInfo: { _id: 1, name: 1, code: 1 },
                        content: 1,
                        discounts: 1,
                    },
                },
            ])
            for (let req of discountRequest) {
                const discounts = req.discounts
                for (let i = 0; i < discounts.length; ++i) {
                    const dis = discounts[i]
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    const startDate = new Date(dis.requestDate)
                    const endDate =
                        i + 1 < discounts.length
                            ? new Date(discounts[i + 1].requestDate)
                            : tomorrow
                    let invoices = await InvoiceModel.aggregate([
                        {
                            $match: {
                                customerId: new Types.ObjectId(
                                    req.customerInfo._id,
                                ),
                                'invoiceDetails.productId': new Types.ObjectId(
                                    req.productInfo._id,
                                ),
                                createdAt: { $gte: startDate, $lt: endDate },
                            },
                        },
                        { $unwind: '$invoiceDetails' },
                        {
                            $match: {
                                'invoiceDetails.productId': new Types.ObjectId(
                                    req.productInfo._id,
                                ),
                            },
                        },
                        {
                            $project: {
                                invoiceCode: 1,
                                createdAt: 1,
                                'invoiceDetails.quantity': 1,
                            },
                        },
                    ])
                    invoices = invoices.map((inv) => ({
                        _id: inv._id,
                        invoiceCode: inv.invoiceCode,
                        quantity: inv.invoiceDetails.quantity,
                        discountAmount: dis.amount,
                        totalDiscountAmount:
                            dis.amount * inv.invoiceDetails.quantity,
                    }))
                    dis.invoices = invoices
                }
            }

            for (let req of discountRequest) {
                req.discounts = req.discounts.map((dis) => dis.invoices).flat()
            }
            for (let req of discountRequest) {
                for (let dis of req.discounts) {
                    const history = await DiscountHistoryModel.findOne({
                        invoiceId: dis._id,
                        customerId: dis.customerId,
                        discountRequestId: req._id,
                    })
                    if (!history) {
                        dis.refundStatus = constant.REFUND_STATUS.UNPAID
                    } else {
                        dis.refundStatus = history.refundStatus
                        dis.paymentDate = history.paymentDate || null
                    }
                }
                if (refundStatus) {
                    req.discounts = req.discounts.filter(
                        (dis) => dis.refundStatus === refundStatus,
                    )
                }
            }

            const totalItems =
                await DiscountRequestModel.countDocuments(filters)

            return {
                discountRequest,
                page,
                totalItems,
                totalPage: Math.ceil(totalItems / limit),
            }
        } catch (error) {
            throw error
        }
    },

    getDiscountHistoryById: async function (id) {
        try {
            const result = await DiscountRequestModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(id),
                        isEffect: true,
                    },
                },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerInfo',
                    },
                },
                { $unwind: '$customerInfo' },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productInfo',
                    },
                },
                { $unwind: '$productInfo' },
                {
                    $project: {
                        _id: 1,
                        customerInfo: { _id: 1, officialName: 1 },
                        productInfo: { _id: 1, name: 1, code: 1 },
                        discounts: 1,
                        content: 1,
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
}

module.exports = discountService

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
            let { page = 1, limit = 10, search = '', refundStatus } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')

            // Tìm customer & product theo từ khóa
            const [customers, products] = await Promise.all([
                CustomerModel.find({ officialName: search }).select('_id'),
                ProductModel.find({
                    $or: [{ name: search }, { code: search }],
                }).select('_id'),
            ])

            const customerIds = customers.map((c) => c._id)
            const productIds = products.map((p) => p._id)

            //  Tạo bộ lọc
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

            //  Lấy danh sách customer duy nhất để phân trang
            const uniqueCustomers = await DiscountRequestModel.aggregate([
                { $match: filters },
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
                    $group: {
                        _id: '$customerInfo._id',
                        customerInfo: { $first: '$customerInfo' },
                    },
                },
                { $sort: { 'customerInfo.officialName': 1 } },
            ])

            const totalCustomers = uniqueCustomers.length
            const paginatedCustomers = uniqueCustomers.slice(
                (page - 1) * limit,
                page * limit,
            )
            const customerPageIds = paginatedCustomers.map((c) => c._id)

            // Lấy tất cả DiscountRequest của những customer trên trang hiện tại
            const discountRequestIds = await DiscountRequestModel.aggregate([
                {
                    $match: {
                        ...filters,
                        customerId: { $in: customerPageIds },
                    },
                },
                { $project: { _id: 1, createdAt: 1 } },
            ])

            // xử lí logic trả ra các records
            const discountRequest = await DiscountRequestModel.aggregate([
                {
                    $match: {
                        _id: { $in: discountRequestIds.map((i) => i._id) },
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

                //  Lookup invoices
                {
                    $lookup: {
                        from: 'invoices',
                        let: { cId: '$customerId', pId: '$productId' },
                        pipeline: [
                            { $unwind: '$invoiceDetails' },
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$customerId', '$$cId'] },
                                            {
                                                $eq: [
                                                    '$invoiceDetails.productId',
                                                    '$$pId',
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    invoiceCode: 1,
                                    createdAt: 1,
                                    quantity: '$invoiceDetails.quantity',
                                    productId: '$invoiceDetails.productId',
                                },
                            },
                        ],
                        as: 'invoiceList',
                    },
                },

                // Map lại các discount
                {
                    $addFields: {
                        discounts: {
                            $map: {
                                input: '$discounts',
                                as: 'dis',
                                in: {
                                    amount: '$$dis.amount',
                                    requestDate: '$$dis.requestDate',
                                    invoices: {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: '$invoiceList',
                                                    as: 'inv',
                                                    cond: {
                                                        $and: [
                                                            {
                                                                $gte: [
                                                                    '$$inv.createdAt',
                                                                    '$$dis.requestDate',
                                                                ],
                                                            },
                                                            {
                                                                $lt: [
                                                                    '$$inv.createdAt',
                                                                    {
                                                                        $ifNull:
                                                                            [
                                                                                {
                                                                                    $arrayElemAt:
                                                                                        [
                                                                                            '$discounts.requestDate',
                                                                                            {
                                                                                                $add: [
                                                                                                    {
                                                                                                        $indexOfArray:
                                                                                                            [
                                                                                                                '$discounts.requestDate',
                                                                                                                '$$dis.requestDate',
                                                                                                            ],
                                                                                                    },
                                                                                                    1,
                                                                                                ],
                                                                                            },
                                                                                        ],
                                                                                },
                                                                                new Date(),
                                                                            ],
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                },
                                            },
                                            as: 'inv',
                                            in: {
                                                _id: '$$inv._id',
                                                invoiceCode:
                                                    '$$inv.invoiceCode',
                                                quantity: '$$inv.quantity',
                                                discountAmount: '$$dis.amount',
                                                totalDiscountAmount: {
                                                    $multiply: [
                                                        '$$dis.amount',
                                                        '$$inv.quantity',
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },

                //  Gộp danh sách invoices
                {
                    $addFields: {
                        discounts: {
                            $reduce: {
                                input: '$discounts',
                                initialValue: [],
                                in: {
                                    $concatArrays: [
                                        '$$value',
                                        '$$this.invoices',
                                    ],
                                },
                            },
                        },
                    },
                },

                //  Lookup refund history
                {
                    $lookup: {
                        from: 'discounthistories',
                        let: { invoiceIds: '$discounts._id', drId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $in: [
                                                    '$invoiceId',
                                                    '$$invoiceIds',
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    '$discountRequestId',
                                                    '$$drId',
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'refundHistory',
                    },
                },

                // Gắn refundStatus
                {
                    $addFields: {
                        discounts: {
                            $map: {
                                input: '$discounts',
                                as: 'dis',
                                in: {
                                    $mergeObjects: [
                                        '$$dis',
                                        {
                                            $let: {
                                                vars: {
                                                    matched: {
                                                        $arrayElemAt: [
                                                            {
                                                                $filter: {
                                                                    input: '$refundHistory',
                                                                    as: 'ref',
                                                                    cond: {
                                                                        $eq: [
                                                                            '$$ref.invoiceId',
                                                                            '$$dis._id',
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                            0,
                                                        ],
                                                    },
                                                },
                                                in: {
                                                    refundStatus: {
                                                        $ifNull: [
                                                            '$$matched.refundStatus',
                                                            constant
                                                                .REFUND_STATUS
                                                                .UNPAID,
                                                        ],
                                                    },
                                                    paymentDate:
                                                        '$$matched.paymentDate',
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },

                // Lọc refundStatus nếu có
                ...(refundStatus
                    ? [
                          {
                              $addFields: {
                                  discounts: {
                                      $filter: {
                                          input: '$discounts',
                                          as: 'dis',
                                          cond: {
                                              $eq: [
                                                  '$$dis.refundStatus',
                                                  refundStatus,
                                              ],
                                          },
                                      },
                                  },
                              },
                          },
                          {
                              $match: {
                                  'discounts.0': { $exists: true },
                              },
                          },
                      ]
                    : []),
                { $sort: { 'customerInfo.officialName': 1 } },
                {
                    $group: {
                        _id: '$customerInfo._id',
                        customerInfo: { $first: '$customerInfo' },
                        discountOfCustomer: {
                            $push: {
                                _id: '$_id',
                                productInfo: {
                                    name: '$productInfo.name',
                                    code: '$productInfo.code',
                                },
                                content: '$content',
                                discounts: '$discounts',
                            },
                        },
                    },
                },

                {
                    $project: {
                        _id: 1,
                        customerInfo: { _id: 1, officialName: 1 },
                        discountOfCustomer: 1,
                    },
                },
            ])

            return {
                discountRequest,
                page,
                totalItems: totalCustomers,
                totalPage: Math.ceil(totalCustomers / limit),
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

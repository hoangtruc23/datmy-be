const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const CustomerModel = require('../models/customer')
const DiscountRequestModel = require('../models/discountRequest')
const PaymentHistoryModel = require('../models/paymentHistory')
const ConfigDebtModel = require('../models/configDebt')
const ProductModel = require('../models/product')
const BadReq = require('../utils/response/requestError')
const constant = require('../utils/constant/constant')
const errorCode = require('../utils/response/errorCode')
const path = require('path')
const ExcelJS = require('exceljs')
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

            const limitDue = Math.ceil(
                (new Date(dueDate) - new Date(invoiceDate)) /
                    (1000 * 60 * 60 * 24),
            )

            const totalAmountProducts = invoiceDetails.reduce((sum, detail) => {
                return sum + detail.totalAmountProduct
            }, 0)

            const VATAmount = totalAmount - totalAmountProducts
            const VATRate =
                totalAmountProducts > 0
                    ? Math.round(
                          (VATAmount / totalAmountProducts) * 100 * 100,
                      ) / 100 // tròn 2
                    : 10

            const notVATtotalAmount = totalAmountProducts

            const invoice = await InvoiceModel.create({
                customerId,
                customerName,
                invoiceCode,
                notVATtotalAmount,
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
                VATRate,
                VATAmount,
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
            if (data.dueDate && data.dueDate !== invoice.dueDate) {
                const dueDate = new Date(data.dueDate)
                const exportDate = invoice.createdAt
                const limitDue = Math.ceil(
                    (dueDate - exportDate) / (1000 * 60 * 60 * 24),
                )
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
                        notVATtotalAmount: 1,
                        totalAmount: 1,
                        totalPaid: 1,
                        VATRate: 1,
                        VATAmount: 1,
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
                .populate('invoiceDetails.productId', 'name shortName code')
            if (!invoice) throw new BadReq(errorCode.INVOICE_NOT_FOUND)
            return invoice
        } catch (err) {
            throw err
        }
    },

    delete: async (id) => {
        try {
            const invoice = await InvoiceModel.findById(id)
            if (!invoice) throw new BadReq(errorCode.INVOICE_NOT_FOUND)

            await Promise.all([
                PaymentHistoryModel.deleteMany({ invoiceId: id }),
                DiscountRequestModel.deleteMany({ invoiceId: id }),
            ])

            await InvoiceModel.findByIdAndDelete(id)

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
    importFromExcel: async (fileUrl) => {
        try {
            const baseUrl = process.env.BASE_URL
            const idx = fileUrl.indexOf(baseUrl)

            if (idx === -1) {
                throw new Error(
                    `Không tìm thấy BASE_URL (${baseUrl}) trong fileUrl: ${fileUrl}`,
                )
            }

            let relativeUrl = fileUrl.substring(idx + baseUrl.length)
            relativeUrl = relativeUrl.replace(/^\/+/, '')
            const filePath = path.join(__dirname, '..', 'public', relativeUrl)

            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.readFile(filePath)
            const worksheet = workbook.worksheets[0]

            if (!worksheet) throw new BadReq(errorCode.WORKSHEET_NOT_FOUND)
            //await InvoiceModel.deleteMany({})
            const invoiceMap = new Map()

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber <= 4) return

                const [
                    customerName,
                    customerCode,
                    invoiceCode,
                    invoiceDate,
                    taxCode,
                    productCode,
                    productName,
                    unit,
                    quantity,
                    price,
                    revenue,
                    vatAmount,
                    totalAmount,
                    address,
                ] = row.values.slice(1)

                if (!invoiceCode) return

                if (!invoiceMap.has(invoiceCode)) {
                    invoiceMap.set(invoiceCode, {
                        customerName,
                        taxCode,
                        invoiceCode,
                        invoiceDate,
                        invoiceDetails: [],
                        VATAmount: 0,
                        revenue: 0,
                        totalAmount: 0,
                    })
                }
                // trường hợp hóa đơn có nhiều invoice Details -> một số trường cần cộng dồn
                const inv = invoiceMap.get(invoiceCode)
                inv.VATAmount += Number(vatAmount) || 0
                inv.revenue += Number(revenue) || 0
                inv.totalAmount += Number(totalAmount) || 0

                inv.invoiceDetails.push({
                    productCode,
                    quantity: Number(quantity) || 0,
                    price: Number(price) || 0,
                    totalAmountProduct: Number(revenue) || 0,
                })
            })

            if (invoiceMap.size === 0) {
                throw new BadReq(errorCode.INVOICEMAP_EXCEL_INVALID)
            }

            const savedInvoices = []
            const failedInvoices = new Map()

            for (const inv of invoiceMap.values()) {
                try {
                    const errors = []

                    let customer = await CustomerModel.findOne({
                        $or: [
                            { taxCode: inv.taxCode },
                            { officialName: inv.customerName },
                            { name: inv.customerCode },
                        ],
                    })

                    if (!customer) {
                        errors.push(
                            `Không tìm được khách hàng với mã số thuế là ${inv.taxCode} có tên khách hàng là ${inv.customerName} mã khách hàng là ${inv.customerCode}`,
                        )
                    }

                    const existed = await InvoiceModel.findOne({
                        invoiceCode: inv.invoiceCode,
                    })
                    if (existed) {
                        errors.push(`Hóa đơn đã tồn tại trong hệ thống`)
                    }

                    if (errors.length > 0) {
                        failedInvoices.set(inv.invoiceCode, errors)
                        continue
                    }

                    let configDebt = await ConfigDebtModel.findOne({
                        customerId: customer._id,
                    })
                    let limitDue = configDebt ? configDebt.limitDue : 30
                    let dueDate = new Date(inv.invoiceDate)
                    dueDate.setDate(dueDate.getDate() + limitDue)

                    const details = []
                    const invalidProducts = []

                    for (const d of inv.invoiceDetails) {
                        const product = await ProductModel.findOne({
                            code: d.productCode,
                        })
                        if (!product) {
                            invalidProducts.push(d.productCode)
                            continue
                        }
                        details.push({
                            productId: product._id,
                            quantity: d.quantity,
                            price: d.price,
                            discount: 0,
                            totalAmountProduct: d.totalAmountProduct,
                        })
                    }

                    if (invalidProducts.length > 0) {
                        errors.push(
                            `Không tìm được sản phẩm với mã hàng là ${invalidProducts.join(', ')}`,
                        )
                    }

                    // Không nhập được sản phẩm, thì không tạo hóa đơn luôn, dù các sản phẩm khác vẫn nhập được
                    if (invalidProducts.length > 0) {
                        failedInvoices.set(inv.invoiceCode, errors)
                        continue
                    }

                    const VATRate =
                        inv.revenue > 0
                            ? Math.round(
                                  (inv.VATAmount / inv.revenue) * 100 * 100,
                              ) / 100
                            : 10

                    const invoice = await InvoiceModel.create({
                        customerId: customer._id,
                        customerName: customer.name,
                        invoiceCode: inv.invoiceCode,
                        notVATtotalAmount: inv.revenue,
                        totalAmount: inv.totalAmount,
                        VATAmount: inv.VATAmount,
                        VATRate,
                        invoiceDate: new Date(inv.invoiceDate),
                        dueDate,
                        limitDue,
                        isFullyPaid: false,
                        orderBy: null,
                        accountant: null,
                        reminderContact: null,
                        paymentBy: '',
                        invoiceLink: null,
                        invoiceDetails: details,
                        notes: '',
                    })

                    savedInvoices.push(invoice)
                } catch (err) {
                    console.error(
                        `Lỗi khi lưu invoice ${inv.invoiceCode}:`,
                        err.message,
                    )
                    const existingErrors =
                        failedInvoices.get(inv.invoiceCode) || []
                    existingErrors.push(`Lỗi hệ thống: ${err.message}`)
                    failedInvoices.set(inv.invoiceCode, existingErrors)
                }
            }

            const errorMessages = []
            for (const [invoiceCode, errors] of failedInvoices) {
                errorMessages.push(
                    `Hóa đơn số ${invoiceCode} lỗi do: ${errors.join('. ')}.`,
                )
            }

            return {
                totalInvoices: invoiceMap.size,
                successCount: savedInvoices.length,
                failedCount: failedInvoices.size,
                failedInvoices: errorMessages,
            }
        } catch (err) {
            throw err
        }
    },
}

module.exports = invoiceService

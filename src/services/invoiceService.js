const { Types, mongoose } = require('mongoose')
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
                VATAmount,
                notVATtotalAmount,
            } = data

            const customer = await CustomerModel.findById(customerId)
            if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)

            const existed = await InvoiceModel.findOne({ invoiceCode })
            if (existed) throw new BadReq(errorCode.INVOICE_CODE_EXISTED)

            const limitDue = Math.ceil(
                (new Date(dueDate) - new Date(invoiceDate)) /
                    (1000 * 60 * 60 * 24),
            )
            let checkNotVATtotalAmount = 0
            let checkVATAmount = 0
            let checkTotalAmount = 0
            for (let d of invoiceDetails) {
                checkNotVATtotalAmount += d.notVATtotalAmountProduct
                checkVATAmount += d.VATAmountProduct
                checkTotalAmount += d.totalAmountProduct
            }
            if (
                checkVATAmount !== VATAmount ||
                checkTotalAmount !== totalAmount ||
                checkNotVATtotalAmount !== notVATtotalAmount
            ) {
                throw new BadReq(errorCode.INVOICE_DATA_INVALID)
            }

            await InvoiceModel.create({
                customerId,
                customerName,
                invoiceCode,
                notVATtotalAmount,
                VATAmount,
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

            if (data.dueDate && data.dueDate !== invoice.dueDate) {
                const dueDate = new Date(data.dueDate)
                const invoiceDate = data.invoiceDate
                    ? new Date(data.invoiceDate)
                    : invoice.invoiceDate
                const limitDue = Math.ceil(
                    (dueDate - invoiceDate) / (1000 * 60 * 60 * 24),
                )
                invoice.limitDue = limitDue
            }

            let checkNotVATtotalAmount = 0
            let checkVATAmount = 0
            let checkTotalAmount = 0
            for (let d of data.invoiceDetails) {
                checkNotVATtotalAmount += d.notVATtotalAmountProduct
                checkVATAmount += d.VATAmountProduct
                checkTotalAmount += d.totalAmountProduct
            }
            if (
                checkVATAmount !== data.VATAmount ||
                checkTotalAmount !== data.totalAmount ||
                checkNotVATtotalAmount !== data.notVATtotalAmount
            ) {
                throw new BadReq(errorCode.INVOICE_DATA_INVALID)
            }

            Object.assign(invoice, {
                customerId: data.customerId ?? invoice.customerId,
                customerName: data.customerName ?? invoice.customerName,
                invoiceCode: data.invoiceCode ?? invoice.invoiceCode,
                notVATtotalAmount:
                    data.notVATtotalAmount ?? invoice.notVATtotalAmount,
                VATAmount: data.VATAmount ?? invoice.VATAmount,
                totalAmount: data.totalAmount ?? invoice.totalAmount,
                orderBy: data.orderBy ?? invoice.orderBy,
                accountant: data.accountant ?? invoice.accountant,
                invoiceDate: data.invoiceDate ?? invoice.invoiceDate,
                dueDate: data.dueDate ?? invoice.dueDate,
                invoiceDetails: data.invoiceDetails ?? invoice.invoiceDetails,
                invoiceLink: data.invoiceLink ?? invoice.invoiceLink,
                paymentBy: data.paymentBy ?? invoice.paymentBy,
                reminderContact:
                    data.reminderContact ?? invoice.reminderContact,
                notes: data.notes ?? invoice.notes,
                limitDue: invoice.limitDue,
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
                    $sort: { createdAt: -1 },
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
                        VATAmount: 1,
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
    importFromExcel: async (file) => {
        const session = await mongoose.startSession()
        await session.startTransaction()

        try {
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.load(file, { type: 'buffer' })
            const worksheet = workbook.worksheets[0]

            if (!worksheet) throw new BadReq(errorCode.WORKSHEET_NOT_FOUND)

            // --- Gom dữ liệu từ Excel vào Map theo invoiceCode ---
            const invoiceMap = new Map()
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber <= 4) return
                const [
                    code,
                    customerName,
                    invoiceCode,
                    invoiceDate,
                    taxCode,
                    productCode,
                    productName,
                    unit,
                    quantity,
                    price,
                    revenue,
                    vatRate,
                    vatAmount,
                    totalAmount,
                    address,
                ] = row.values.slice(1)

                if (!invoiceCode) return

                if (!invoiceMap.has(invoiceCode)) {
                    invoiceMap.set(invoiceCode, {
                        customerName,
                        code,
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
                    productName,
                    unit,
                    quantity: Number(quantity) || 0,
                    price: Number(price) || 0,
                    VATRateProduct: Number(vatRate),
                    notVATtotalAmountProduct: Number(revenue) || 0,
                    VATAmountProduct: Number(vatAmount) || 0,
                    totalAmountProduct: Number(totalAmount) || 0,
                })
            })

            if (invoiceMap.size === 0) {
                throw new BadReq(errorCode.INVOICEMAP_EXCEL_INVALID)
            }

            const savedInvoices = []
            const failedInvoices = new Map()

            for (const inv of invoiceMap.values()) {
                const errors = []

                // 1) Kiểm tra customer tồn tại
                const customer = await CustomerModel.findOne({
                    code: inv.code,
                }).session(session)

                if (!customer) {
                    errors.push(`Không tìm được khách hàng (MKH: ${inv.code})`)
                }

                // Kiểm tra invoice đã tồn tại chưa
                const existed = await InvoiceModel.findOne({
                    invoiceCode: inv.invoiceCode,
                }).session(session)
                if (existed) {
                    errors.push(
                        `Hóa đơn ${inv.invoiceCode} đã tồn tại trong hệ thống`,
                    )
                }

                //  Kiểm tra sản phẩm
                const invalidProducts = []
                const details = []
                for (const d of inv.invoiceDetails) {
                    const product = await ProductModel.findOne({
                        code: d.productCode,
                    }).session(session)
                    // if (!product) {
                    //     invalidProducts.push(d.productCode)
                    //     continue
                    // }
                    details.push({
                        productId: product?._id || null,
                        name: d.productName,
                        code: d.productCode,
                        unit: d.unit,
                        quantity: d.quantity,
                        price: d.price,
                        VATRateProduct: d.VATRateProduct,
                        notVATtotalAmountProduct: d.notVATtotalAmountProduct,
                        VATAmountProduct: d.VATAmountProduct,
                        totalAmountProduct: d.totalAmountProduct,
                    })
                }
                if (invalidProducts.length > 0) {
                    errors.push(
                        `Không tìm được sản phẩm: ${invalidProducts.join(', ')}`,
                    )
                }

                // Nếu có lỗi cho hóa đơn này -> lưu lỗi và bỏ qua tạo
                if (errors.length > 0) {
                    failedInvoices.set(inv.invoiceCode, errors)
                    continue
                }

                // Nếu hợp lệ, chuẩn bị object invoice (chưa save)
                const configDebt = await ConfigDebtModel.findOne({
                    customerId: customer._id,
                }).session(session)
                const limitDue = configDebt ? configDebt.limitDue : 30
                const dueDate = new Date(inv.invoiceDate)
                dueDate.setDate(dueDate.getDate() + limitDue)

                const invoiceDoc = new InvoiceModel({
                    customerId: customer._id,
                    customerName: customer.officialName,
                    invoiceCode: inv.invoiceCode,
                    notVATtotalAmount: inv.revenue,
                    totalAmount: inv.totalAmount,
                    VATAmount: inv.VATAmount,
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

                savedInvoices.push(invoiceDoc)
            } // end for invoiceMap

            // --- Sau khi duyệt hết file: nếu có lỗi -> rollback & trả lỗi 1 lần ---
            if (failedInvoices.size > 0) {
                await session.abortTransaction()
                session.endSession()

                const errorsArray = []
                for (const [code, errs] of failedInvoices.entries()) {
                    errorsArray.push({ invoiceCode: code, errors: errs })
                }

                // Trả về dưới dạng Error có message rõ ràng; controller có thể gửi errorsArray ra client
                const errMessage = errorsArray
                    .map(
                        (e) =>
                            `Hóa đơn ${e.invoiceCode}: ${e.errors.join('. ')}`,
                    )
                    .join(' \n ')
                throw new Error(errMessage)
            }

            // --- Nếu không có lỗi: lưu tất cả hóa đơn trong transaction ---
            for (const invDoc of savedInvoices) {
                await invDoc.save({ session })
            }

            await session.commitTransaction()
            session.endSession()

            return {
                success: true,
                totalInvoices: invoiceMap.size,
                successCount: savedInvoices.length,
            }
        } catch (err) {
            try {
                await session.abortTransaction()
            } catch (e) {
                // ignore
            }
            session.endSession()
            throw err
        }
    },
}
module.exports = invoiceService

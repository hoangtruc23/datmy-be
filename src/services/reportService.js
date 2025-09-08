const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const CustomerModel = require('../models/customer')
const ProductModel = require('../models/product')
const UnitModel = require('../models/unit')
const debtCalculationService = require('../services/debtCalculationService')
const ConfigDebtModel = require('../models/configDebt')
const convertNumberToVietnameseWords = require('../middlewares/numberToWords')
const PaymentHistoryModel = require('../models/paymentHistory')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const { ObjectId } = require('mongodb')
const reportService = {
    getSalesReport: async (
        startDate,
        endDate,
        customerId,
        page = 1,
        limit = 10,
    ) => {
        try {
            page = parseInt(page)
            limit = parseInt(limit)
            const formatDateToVietnamese = (dateString) => {
                const date = new Date(dateString)
                const day = date.getDate().toString().padStart(2, '0')
                const month = (date.getMonth() + 1).toString().padStart(2, '0')
                const year = date.getFullYear()
                return `${day}/${month}/${year}`
            }

            // Query hóa đơn
            let invoiceQuery = {
                invoiceDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            }

            if (customerId) {
                invoiceQuery.customerId = customerId
            }

            const totalInvoices =
                await InvoiceModel.countDocuments(invoiceQuery)

            const allInvoices = await InvoiceModel.find(invoiceQuery).lean()

            const invoices = await InvoiceModel.find(invoiceQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean()

            let customerName = ''
            if (customerId) {
                const customer = await CustomerModel.findById(customerId).lean()
                customerName = customer ? customer.name : ''
            }

            const createSalesData = async (invoicesList) => {
                const data = []
                for (const invoice of invoicesList) {
                    const customer = await CustomerModel.findById(
                        invoice.customerId,
                    ).lean()
                    for (const detail of invoice.invoiceDetails) {
                        const product = await ProductModel.findById(
                            detail.productId,
                        ).lean()
                        const unit = product
                            ? await UnitModel.findById(product.unit).lean()
                            : null

                        const totalAmount = detail.totalAmountProduct
                        const vatAmount = Math.round(totalAmount * 0.1)
                        const totalPayment = totalAmount + vatAmount

                        data.push({
                            customerName: customer
                                ? customer.name
                                : invoice.customerName,
                            invoiceCode: invoice.invoiceCode,
                            invoiceDate: formatDateToVietnamese(
                                invoice.invoiceDate,
                            ),
                            taxCode: customer ? customer.taxCode : '',
                            productId: detail.productId,
                            productCode: product ? product.code : '',
                            productName: product ? product.name : '',
                            unit: unit ? unit.name : '',
                            quantity: detail.quantity,
                            unitPrice: detail.price,
                            discount: detail.discount || 0,
                            totalAmount: totalAmount,
                            vatAmount: vatAmount,
                            totalPayment: totalPayment,
                            address: customer ? customer.billingAddress : '',
                        })
                    }
                }
                return data
            }

            const salesData = await createSalesData(invoices)

            const allSalesData = await createSalesData(allInvoices)

            const summary = allSalesData.reduce(
                (acc, item) => {
                    acc.totalQuantity += item.quantity
                    acc.totalSalesAmount += item.totalAmount
                    acc.totalVatAmount += item.vatAmount
                    acc.totalPaymentAmount += item.totalPayment
                    return acc
                },
                {
                    totalQuantity: 0,
                    totalSalesAmount: 0,
                    totalVatAmount: 0,
                    totalPaymentAmount: 0,
                },
            )

            return {
                startDate: formatDateToVietnamese(startDate),
                endDate: formatDateToVietnamese(endDate),
                customerName: customerName,
                page,
                limit,
                totalInvoices,
                salesData,
                summary,
            }
        } catch (error) {
            console.error('Lỗi khi tạo báo cáo chi tiết bán hàng:', error)
            throw error
        }
    },

    getDebtComparisonSummary: async (query) => {
        let { startDate, endDate, customerId, page, limit } = query
        page = Number(page) || 1
        limit = Number(limit) || 10

        const start = new Date(startDate)
        const end = new Date(endDate)
        const customerMatch = {}
        let allCustomers = []
        if (customerId) {
            customerMatch._id = new Types.ObjectId(String(customerId))
            allCustomers = await CustomerModel.find(customerMatch)
                .select('_id name')
                .lean()
            if (allCustomers.length === 0) {
                throw new BadReq(USER_NOT_FOUND)
            }
        } else {
            allCustomers = await CustomerModel.find(customerMatch)
                .select('_id name')
                .lean()
        }

        if (allCustomers.length === 0) {
            return {
                summary: {
                    totalOpeningBalance: 0,
                    totalIncurredCredit: 0,
                    totalIncurredDebit: 0,
                    totalClosingBalance: 0,
                },
                details: [],
                pagination: { page, limit, totalItems: 0, totalPages: 0 },
            }
        }

        const allCustomerDetails = await Promise.all(
            allCustomers.map(async (customer) => {
                const id = customer._id
                const openingBalance =
                    await debtCalculationService.getOpeningBalance(id, start) // Tính số nợ trước kì
                const incurredDebit =
                    await debtCalculationService.getIncurredDebitForPeriod(
                        id,
                        start,
                        end,
                    ) // Nợ phát sinh trong kì (= tổng totalamount trong hóa đơn)
                const incurredCredit =
                    await debtCalculationService.getIncurredCreditForPeriod(
                        id,
                        start,
                        end,
                    ) // tổng tiền thanh toán trong kì
                const closingBalance =
                    openingBalance + incurredDebit - incurredCredit // số dư cuối kì
                const configDebt = await ConfigDebtModel.findOne({
                    customerId: id,
                })

                return {
                    customerId: id,
                    customerName: customer.name,
                    openingBalance, // Số dư đầu kỳ
                    incurredCredit, // Phát sinh có (Tổng thanh toán)
                    incurredDebit, // Phát sinh nợ (Tổng phát sinh)
                    closingBalance, // Số dư cuối kỳ
                    creditLimit: configDebt?.limitDebt || 0,
                    status: 'Bình thường', // Placeholder for status logic
                }
            }),
        )

        // tổng các field
        const grandTotals = allCustomerDetails.reduce(
            (totals, item) => {
                totals.totalOpeningBalance += item.openingBalance
                totals.totalIncurredCredit += item.incurredCredit
                totals.totalIncurredDebit += item.incurredDebit
                totals.totalClosingBalance += item.closingBalance
                return totals
            },
            {
                totalOpeningBalance: 0,
                totalIncurredCredit: 0,
                totalIncurredDebit: 0,
                totalClosingBalance: 0,
            },
        )

        // 3. Create the paginated view of the details
        const totalItems = allCustomerDetails.length
        const paginatedDetails = allCustomerDetails.slice(
            (page - 1) * limit,
            page * limit,
        )

        return {
            summary: grandTotals,
            details: paginatedDetails,
            pagination: {
                page: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    },

    getDebtComparisonDetail: async (query) => {
        let { startDate, endDate, customerId, page, limit } = query
        page = Number(page) || 1
        limit = Number(limit) || 10

        const start = new Date(startDate)
        const end = new Date(endDate)
        const customerObjectId = new Types.ObjectId(String(customerId))

        const customer = await CustomerModel.findById(customerObjectId)
            .select('name')
            .lean()
        if (!customer) {
            throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
        }

        const openingBalance = await debtCalculationService.getOpeningBalance(
            customerObjectId,
            start,
        )

        const invoicesInPeriod = await InvoiceModel.find({
            customerId: customerObjectId,
            createdAt: { $gte: start, $lte: end },
        })
            .select('invoiceCode createdAt totalAmount')
            .lean()

        const paymentsInPeriod = await PaymentHistoryModel.aggregate([
            { $match: { paymentDate: { $gte: start, $lte: end } } },
            {
                $lookup: {
                    from: 'invoices',
                    localField: 'invoiceId',
                    foreignField: '_id',
                    as: 'invoice',
                },
            },
            { $unwind: '$invoice' },
            { $match: { 'invoice.customerId': customerObjectId } },
            {
                $project: {
                    _id: 1,
                    paymentDate: 1,
                    amount: 1,
                    content: 1,
                    invoiceCode: '$invoice.invoiceCode',
                },
            },
        ])

        const allTransactions = [
            ...invoicesInPeriod.map((inv) => ({
                date: inv.createdAt,
                documentCode: inv.invoiceCode,
                description: `Hóa đơn ${inv.invoiceCode}`,
                debit: inv.totalAmount,
                credit: 0,
            })),
            ...paymentsInPeriod.map((p) => ({
                date: p.paymentDate,
                documentCode: p.invoiceCode || 'N/A',
                description: p.content || 'Thanh toán',
                debit: 0,
                credit: p.amount,
            })),
        ].sort((a, b) => new Date(a.date) - new Date(b.date))

        // --- CALCULATE TOTALS FROM ALL TRANSACTIONS (BEFORE PAGINATION) ---
        const incurredDebit = allTransactions.reduce(
            (sum, t) => sum + t.debit,
            0,
        )
        const incurredCredit = allTransactions.reduce(
            (sum, t) => sum + t.credit,
            0,
        )
        const closingBalance = openingBalance + incurredDebit - incurredCredit

        // --- APPLY PAGINATION TO THE TRANSACTIONS LIST ---
        const totalItems = allTransactions.length
        const paginatedTransactions = allTransactions.slice(
            (page - 1) * limit,
            page * limit,
        )

        return {
            summary: {
                customerName: customer.name,
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
                openingBalance,
                incurredCredit, // Tổng thanh toán
                incurredDebit, // Tổng phát sinh
                closingBalance,
            },
            details: paginatedTransactions,
            pagination: {
                page: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    },

    getDebtComparisonDetail: async (query) => {
        let { startDate, endDate, customerId, page, limit } = query
        page = Number(page) || 1
        limit = Number(limit) || 10

        const start = new Date(startDate)
        const end = new Date(endDate)
        const customerObjectId = new Types.ObjectId(String(customerId))

        const customer = await CustomerModel.findById(customerObjectId)
            .select('name')
            .lean()
        if (!customer) {
            throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
        }

        const openingBalance = await debtCalculationService.getOpeningBalance(
            customerObjectId,
            start,
        )

        const invoicesInPeriod = await InvoiceModel.find({
            customerId: customerObjectId,
            createdAt: { $gte: start, $lte: end },
        })
            .select('invoiceCode createdAt totalAmount')
            .lean()

        const paymentsInPeriod = await PaymentHistoryModel.aggregate([
            { $match: { paymentDate: { $gte: start, $lte: end } } },
            {
                $lookup: {
                    from: 'invoices',
                    localField: 'invoiceId',
                    foreignField: '_id',
                    as: 'invoice',
                },
            },
            { $unwind: '$invoice' },
            { $match: { 'invoice.customerId': customerObjectId } },
            {
                $project: {
                    _id: 1,
                    paymentDate: 1,
                    amount: 1,
                    content: 1,
                    invoiceCode: '$invoice.invoiceCode',
                },
            },
        ])

        const allTransactions = [
            ...invoicesInPeriod.map((inv) => ({
                date: inv.createdAt,
                documentCode: inv.invoiceCode,
                description: `Hóa đơn ${inv.invoiceCode}`,
                debit: inv.totalAmount,
                credit: 0,
            })),
            ...paymentsInPeriod.map((p) => ({
                date: p.paymentDate,
                documentCode: p.invoiceCode || 'N/A',
                description: p.content || 'Thanh toán',
                debit: 0,
                credit: p.amount,
            })),
        ].sort((a, b) => new Date(a.date) - new Date(b.date))

        // --- CALCULATE TOTALS FROM ALL TRANSACTIONS (BEFORE PAGINATION) ---
        const incurredDebit = allTransactions.reduce(
            (sum, t) => sum + t.debit,
            0,
        )
        const incurredCredit = allTransactions.reduce(
            (sum, t) => sum + t.credit,
            0,
        )
        const closingBalance = openingBalance + incurredDebit - incurredCredit

        // --- APPLY PAGINATION TO THE TRANSACTIONS LIST ---
        const totalItems = allTransactions.length
        const paginatedTransactions = allTransactions.slice(
            (page - 1) * limit,
            page * limit,
        )

        return {
            summary: {
                customerName: customer.name,
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
                openingBalance,
                incurredCredit,
                incurredDebit,
                closingBalance,
            },
            details: paginatedTransactions,
            pagination: {
                page: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    },
    generateSalesDetailReport: async (fromDate, toDate, customerId) => {
        try {
            const formatDateToVietnamese = (dateString) => {
                const date = new Date(dateString)
                const day = date.getDate().toString().padStart(2, '0')
                const month = (date.getMonth() + 1).toString().padStart(2, '0')
                const year = date.getFullYear()
                return `${day}/${month}/${year}`
            }

            const invoiceQuery = {
                invoiceDate: {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                },
            }
            if (customerId) invoiceQuery.customerId = customerId

            const invoices = await InvoiceModel.find(invoiceQuery).lean()

            let customerName = ''
            if (customerId) {
                const customer = await CustomerModel.findById(customerId).lean()
                customerName = customer ? customer.name : ''
            }

            const customerCache = {}
            const productCache = {}
            const unitCache = {}

            const salesData = []

            for (const invoice of invoices) {
                let customer = null
                if (invoice.customerId) {
                    customer =
                        customerCache[invoice.customerId] ||
                        (await CustomerModel.findById(
                            invoice.customerId,
                        ).lean())
                    customerCache[invoice.customerId] = customer
                }

                for (const detail of invoice.invoiceDetails) {
                    let product = null
                    if (detail.productId) {
                        product =
                            productCache[detail.productId] ||
                            (await ProductModel.findById(
                                detail.productId,
                            ).lean())
                        productCache[detail.productId] = product
                    }

                    let unit = null
                    if (product && product.unit) {
                        unit =
                            unitCache[product.unit] ||
                            (await UnitModel.findById(product.unit).lean())
                        unitCache[product.unit] = unit
                    }
                    const vatRate = invoice.VATRate || 0
                    const totalAmount = detail.totalAmountProduct || 0
                    const vatAmount = Math.round(totalAmount * vatRate * 0.01)
                    const totalPayment = totalAmount + vatAmount

                    salesData.push({
                        customerName: customer
                            ? customer.name
                            : invoice.customerName,
                        invoiceCode: invoice.invoiceCode,
                        invoiceDate: formatDateToVietnamese(
                            invoice.invoiceDate,
                        ),
                        taxCode: customer ? customer.taxCode : '',
                        productId: detail.productId,
                        productCode: product ? product.code : '',
                        productName: product ? product.name : '',
                        unit: unit ? unit.name : '',
                        quantity: detail.quantity || 0,
                        unitPrice: detail.price || 0,
                        discount: detail.discount || 0,
                        totalAmount: totalAmount,
                        vatRate,
                        vatAmount,
                        totalPayment: totalPayment,
                        address: customer ? customer.billingAddress : '',
                    })
                }
            }

            const summary = salesData.reduce(
                (acc, item) => {
                    acc.totalQuantity += item.quantity
                    acc.totalSalesAmount += item.totalAmount
                    acc.totalVatAmount += item.vatAmount
                    acc.totalPaymentAmount += item.totalPayment
                    return acc
                },
                {
                    totalQuantity: 0,
                    totalSalesAmount: 0,
                    totalVatAmount: 0,
                    totalPaymentAmount: 0,
                },
            )

            return {
                fromDate: formatDateToVietnamese(fromDate),
                toDate: formatDateToVietnamese(toDate),
                customerName,
                salesData,
                summary,
            }
        } catch (error) {
            console.error('Lỗi khi tạo báo cáo chi tiết bán hàng:', error)
            throw error
        }
    },

    fileDebtReconciliation: async (startDate, endDate, customerId) => {
        try {
            const currentDate = new Date()
            const start = new Date(startDate)
            const end = new Date(endDate)

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            const pipeline = [
                {
                    $match: {
                        customerId: new ObjectId(customerId),
                        isFullyPaid: false,
                        createdAt: {
                            $lte: end,
                        },
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
                        remainingDebt: {
                            $subtract: [
                                '$totalAmount',
                                {
                                    $ifNull: [
                                        { $sum: '$payments.paidAmount' },
                                        0,
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: '$customerId',
                        totalDebt: { $sum: '$remainingDebt' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalDebt: 1,
                    },
                },
            ]

            const result = await InvoiceModel.aggregate(pipeline)
            const data = result[0] || {}
            const totalDebtInWords = convertNumberToVietnameseWords(
                data.totalDebt || 0,
            )
            const dataToWrite = {
                currentDate,
                officialName: customer.officialName,
                deliveryAddress: customer.deliveryAddresses || null,
                taxCode: customer.taxCode,
                representative: customer.representative || null,

                totalDebt: data.totalDebt || 0,
                totalDebtInWords,

                startDate: start,
                endDate: end,
            }
            return dataToWrite
        } catch (err) {
            throw err
        }
    },

    handleQueryInput: async (query, isPagination) => {
        try {
            let { startDate, endDate, customerIds } = query
            const start = new Date(startDate)
            const end = new Date(endDate)
            end.setDate(end.getDate() + 1)

            customerIds = customerIds ?? []
            customerIds = Array.isArray(customerIds)
                ? customerIds
                : [customerIds]

            if (customerIds.length) {
                const checkCustomer = await CustomerModel.find({
                    _id: { $in: customerIds },
                })
                if (checkCustomer.length !== customerIds.length) {
                    throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
                }
            } else {
                const customers = await CustomerModel.find()
                customerIds = customers.map((cus) => cus._id)
            }

            let pagination = {}
            if (isPagination) {
                let { page = 1, limit = 1 } = query
                page = Number(page)
                limit = Number(limit)
                const totalItems = customerIds.length
                const totalPages = Math.ceil(totalItems / limit)
                customerIds = customerIds.slice(
                    (page - 1) * limit,
                    page * limit,
                )
                pagination = {
                    page,
                    totalItems,
                    totalPages,
                }
            }
            return {
                startDate,
                endDate,
                start,
                end,
                customerIds,
                ...pagination,
            }
        } catch (error) {
            throw error
        }
    },

    getDebtConfigDetailByInvoice: async (query, isPagination = true) => {
        try {
            const {
                startDate,
                endDate,
                start,
                end,
                customerIds,
                page,
                totalItems,
                totalPages,
            } = await reportService.handleQueryInput(query, isPagination)
            let pagination = {}
            if (isPagination) {
                pagination = {
                    page,
                    totalItems,
                    totalPages,
                }
            }

            const customerData = await Promise.all(
                customerIds.map(async (customerId) => {
                    const customer = await CustomerModel.findById(customerId)
                    const invoicesInfo = await InvoiceModel.aggregate([
                        {
                            $match: {
                                customerId: new Types.ObjectId(customerId),
                                createdAt: {
                                    $gte: start,
                                    $lte: end,
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: 'paymenthistories',
                                localField: '_id',
                                foreignField: 'invoiceId',
                                as: 'paymentHistory',
                            },
                        },
                        {
                            $addFields: {
                                totalPaid: { $sum: '$paymentHistory.amount' },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                invoices: {
                                    $push: {
                                        postingDate: '$createdAt',
                                        invoiceCode: '$invoiceCode',
                                        description: {
                                            $concat: [
                                                'Bán hàng ',
                                                '$customerName',
                                                ' theo số hóa đơn ',
                                                '$invoiceCode',
                                            ],
                                        },
                                        dueDate: '$dueDate',
                                        totalAmount: '$totalAmount',
                                        totalPaid: '$totalPaid',
                                        remainingDebt: {
                                            $subtract: [
                                                '$totalAmount',
                                                '$totalPaid',
                                            ],
                                        },
                                    },
                                },
                                totalAmountAll: { $sum: '$totalAmount' },
                                totalPaidAll: { $sum: '$totalPaid' },
                                totalRemainingDebtAll: {
                                    $sum: {
                                        $subtract: [
                                            '$totalAmount',
                                            '$totalPaid',
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                            },
                        },
                    ])
                    const invoicesInfoReturn = invoicesInfo[0] ?? {
                        invoices: [],
                        totalAmountAll: 0,
                        totalPaidAll: 0,
                        totalRemainingDebtAll: 0,
                    }
                    return {
                        customerName: customer.officialName,
                        ...invoicesInfoReturn,
                    }
                }),
            )
            const {
                totalAmountAllCus,
                totalPaidAllCus,
                totalRemainingDebtAllCus,
            } = customerData.reduce(
                (acc, cur) => {
                    acc.totalAmountAllCus += cur.totalAmountAll
                    acc.totalPaidAllCus += cur.totalPaidAll
                    acc.totalRemainingDebtAllCus += cur.totalRemainingDebtAll
                    return acc
                },
                {
                    totalAmountAllCus: 0,
                    totalPaidAllCus: 0,
                    totalRemainingDebtAllCus: 0,
                },
            )
            const dataReturn = {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                customerData,
                totalAmountAllCus,
                totalPaidAllCus,
                totalRemainingDebtAllCus,
            }
            return isPagination
                ? { ...dataReturn, pagination }
                : { ...dataReturn }
        } catch (error) {
            throw error
        }
    },

    getCustomerReceivableDetail: async (query, isPagination = true) => {
        try {
            const {
                startDate,
                endDate,
                start,
                end,
                customerIds,
                page,
                totalItems,
                totalPages,
            } = await reportService.handleQueryInput(query, isPagination)
            let pagination = {}
            if (isPagination) {
                pagination = {
                    page,
                    totalItems,
                    totalPages,
                }
            }
            const customerData = await Promise.all(
                customerIds.map(async (customerId) => {
                    const customer = await CustomerModel.findById(customerId)

                    const invoicesBefore = await InvoiceModel.aggregate([
                        {
                            $match: {
                                customerId: new Types.ObjectId(customerId),
                                createdAt: { $lte: start },
                            },
                        },
                        {
                            $lookup: {
                                from: 'paymenthistories',
                                let: { id: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            '$$id',
                                                            '$invoiceId',
                                                        ],
                                                    },
                                                    {
                                                        $lte: [
                                                            '$paymentDate',
                                                            start,
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: 'payments',
                            },
                        },
                        {
                            $addFields: {
                                totalPaid: { $sum: '$payments.amount' },
                            },
                        },
                        {
                            $addFields: {
                                totalRemainingDebt: {
                                    $subtract: ['$totalAmount', '$totalPaid'],
                                },
                            },
                        },
                    ])
                    const totalAllDebtRemainingBefore = invoicesBefore.reduce(
                        (acc, cur) => acc + cur.totalRemainingDebt,
                        0,
                    )
                    const invoices = await InvoiceModel.aggregate([
                        {
                            $match: {
                                customerId: new Types.ObjectId(customerId),
                            },
                        },
                        {
                            $lookup: {
                                from: 'paymenthistories',
                                let: { id: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            '$$id',
                                                            '$invoiceId',
                                                        ],
                                                    },
                                                    {
                                                        $gte: [
                                                            '$paymentDate',
                                                            start,
                                                        ],
                                                    },
                                                    {
                                                        $lte: [
                                                            '$paymentDate',
                                                            end,
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: 'payments',
                            },
                        },
                        {
                            $addFields: {
                                totalPaid: { $sum: '$payments.amount' },
                                invoiceDetails: {
                                    $cond: [
                                        {
                                            $and: [
                                                { $gte: ['$createdAt', start] },
                                                { $lte: ['$createdAt', end] },
                                            ],
                                        },
                                        '$invoiceDetails',
                                        [],
                                    ],
                                },
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $not: {
                                        $and: [
                                            {
                                                $eq: [
                                                    {
                                                        $size: '$invoiceDetails',
                                                    },
                                                    0,
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    { $size: '$payments' },
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                invoices: {
                                    $push: {
                                        postingDate: '$createdAt',
                                        invoiceDate: '$invoiceDate',
                                        invoiceCode: '$invoiceCode',
                                        VATRate: '$VATRate',
                                        invoiceDetails: '$invoiceDetails',
                                        payments: '$payments',
                                        totalAmount: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        {
                                                            $size: '$invoiceDetails',
                                                        },
                                                        0,
                                                    ],
                                                },
                                                0,
                                                '$totalAmount',
                                            ],
                                        },
                                        totalPaid: '$totalPaid',
                                    },
                                },
                                totalAmountAll: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    {
                                                        $size: '$invoiceDetails',
                                                    },
                                                    0,
                                                ],
                                            },
                                            0,
                                            '$totalAmount',
                                        ],
                                    },
                                },
                                totalPaidAll: { $sum: '$totalPaid' },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                            },
                        },
                    ])

                    if (invoices[0]) {
                        invoices[0].invoices = await Promise.all(
                            invoices[0].invoices.map(async (inv) => {
                                const payments = inv.payments.map(
                                    (payment) => ({
                                        postingDate: payment.paymentDate,
                                        description: `Thu tiền khách hàng ${payment.customerName} theo hóa đơn ${inv.invoiceCode}`,
                                        debtAccount: '131',
                                        contraAccount:
                                            payment.method === 'cash'
                                                ? '111'
                                                : '1121',
                                        amountDebt: 0,
                                        amountPay: payment.amount,
                                    }),
                                )

                                const invoiceDetails = (
                                    await Promise.all(
                                        inv.invoiceDetails.map(
                                            async (detail) => {
                                                const product =
                                                    await ProductModel.findById(
                                                        detail.productId,
                                                    )
                                                const name = product
                                                    ? product.name
                                                    : ''
                                                return [
                                                    {
                                                        postingDate:
                                                            inv.postingDate,
                                                        invoiceDate:
                                                            inv.invoiceDate,
                                                        invoiceCode:
                                                            inv.invoiceCode,
                                                        description: `Phí mua sản phẩm: ${name}`,
                                                        debtAccount: '131',
                                                        contraAccount: '5111',
                                                        amountDebt:
                                                            detail.quantity *
                                                                detail.price -
                                                            detail.discount,
                                                        amountPay: 0,
                                                    },
                                                    {
                                                        postingDate:
                                                            inv.postingDate,
                                                        invoiceDate:
                                                            inv.invoiceDate,
                                                        invoiceCode:
                                                            inv.invoiceCode,
                                                        description: `Thuế GTGT - Phí mua sản phẩm: ${name}`,
                                                        debtAccount: '131',
                                                        contraAccount: '33311',
                                                        amountDebt: inv.VATRate
                                                            ? (detail.quantity *
                                                                  detail.price -
                                                                  detail.discount) *
                                                              (inv.VATRate /
                                                                  100)
                                                            : (detail.quantity *
                                                                  detail.price -
                                                                  detail.discount) *
                                                              0.1,
                                                        amountPay: 0,
                                                    },
                                                ]
                                            },
                                        ),
                                    )
                                ).flat()

                                return [...invoiceDetails, ...payments]
                            }),
                        )
                        invoices[0].invoices = invoices[0].invoices
                            .flat()
                            .sort((a, b) => a.postingDate - b.postingDate)
                    }

                    const data = invoices[0] ?? {
                        invoices: [],
                        totalAmountAll: 0,
                        totalPaidAll: 0,
                    }
                    return {
                        customerName: customer.officialName,
                        ...data,
                        totalAllDebtRemainingBefore,
                    }
                }),
            )

            const totalAmountAllCus = customerData.reduce(
                (acc, cur) => acc + cur.totalAmountAll,
                0,
            )
            const totalPaidAllCus = customerData.reduce(
                (acc, cur) => acc + cur.totalPaidAll,
                0,
            )

            const dataReturn = {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                customerData,
                totalAmountAllCus,
                totalPaidAllCus,
            }

            return isPagination
                ? { ...dataReturn, pagination }
                : { ...dataReturn }
        } catch (error) {
            throw error
        }
    },
}

module.exports = reportService

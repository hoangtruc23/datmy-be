const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const CustomerModel = require('../models/customer')
const ProductModel = require('../models/product')
const UnitModel = require('../models/unit')
const e = require('express')
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
        if (customerId) {
            customerMatch._id = new Types.ObjectId(String(customerId))
        }

        const allCustomers = await CustomerModel.find(customerMatch)
            .select('_id name')
            .lean()
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

        // 1. Calculate the detailed breakdown for ALL customers
        const allCustomerDetails = await Promise.all(
            allCustomers.map(async (customer) => {
                const id = customer._id
                const openingBalance =
                    await debtCalculationService.getOpeningBalance(id, start)
                const incurredDebit =
                    await debtCalculationService.getIncurredDebitForPeriod(
                        id,
                        start,
                        end,
                    )
                const incurredCredit =
                    await debtCalculationService.getIncurredCreditForPeriod(
                        id,
                        start,
                        end,
                    )
                const closingBalance =
                    openingBalance + incurredDebit - incurredCredit
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

                    const totalAmount = detail.totalAmountProduct || 0
                    const vatAmount = Math.round(totalAmount * 0.1)
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
                        vatAmount: vatAmount,
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
}

module.exports = reportService

const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const PaymentHistoryModel = require('../models/paymentHistory')
const CustomerModel = require('../models/customer')
const ConfigDebtModel = require('../models/configDebt')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

const reportService = {
    /**
     * Helper function to calculate total debt for a customer up to a certain date.
     * @param {Types.ObjectId} customerId - The ID of the customer.
     * @param {Date} date - The date to calculate the balance up to (exclusive).
     * @returns {Promise<number>} - The opening balance.
     */
    _getOpeningBalance: async (customerId, date) => {
        const invoicesBefore = await InvoiceModel.aggregate([
            { $match: { customerId, createdAt: { $lt: date } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ])

        const paymentsBefore = await PaymentHistoryModel.aggregate([
            {
                $match: { paymentDate: { $lt: date } },
            },
            {
                $lookup: {
                    from: 'invoices',
                    localField: 'invoiceId',
                    foreignField: '_id',
                    as: 'invoice',
                },
            },
            { $unwind: '$invoice' },
            {
                $match: { 'invoice.customerId': customerId },
            },
            {
                $group: { _id: null, total: { $sum: '$amount' } },
            },
        ])

        const totalDebit = invoicesBefore[0]?.total || 0
        const totalCredit = paymentsBefore[0]?.total || 0
        return totalDebit - totalCredit
    },
    //looix error still show result when no custumerid in swagger
    getDebtComparisonSummary: async (query) => {
        const { startDate, endDate, customerId } = query
        const start = new Date(startDate)
        const end = new Date(endDate)

        //customerMatch could be empty here (summary all)
        const customerMatch = {}
        if (customerId) {
            customerMatch._id = new Types.ObjectId(customerId)
        }

        const customers =
            await CustomerModel.find(customerMatch).select('_id name')
        if (customers.length === 0) return []

        return Promise.all(
            customers.map(async (customer) => {
                const id = customer._id
                const openingBalance = await reportService._getOpeningBalance(
                    id,
                    start,
                )

                const incurredDebitResult = await InvoiceModel.aggregate([
                    {
                        $match: {
                            customerId: id,
                            createdAt: { $gte: start, $lte: end },
                        },
                    },
                    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
                ])
                const incurredDebit = incurredDebitResult[0]?.total || 0

                const incurredCreditResult =
                    await PaymentHistoryModel.aggregate([
                        {
                            $match: { paymentDate: { $gte: start, $lte: end } },
                        },
                        {
                            $lookup: {
                                from: 'invoices',
                                localField: 'invoiceId',
                                foreignField: '_id',
                                as: 'invoice',
                            },
                        },
                        { $unwind: '$invoice' },
                        {
                            $match: { 'invoice.customerId': id },
                        },
                        {
                            $group: { _id: null, total: { $sum: '$amount' } },
                        },
                    ])
                const incurredCredit = incurredCreditResult[0]?.total || 0

                const closingBalance =
                    openingBalance + incurredDebit - incurredCredit
                const configDebt = await ConfigDebtModel.findOne({
                    customerId: id,
                })

                return {
                    customerName: customer.name,
                    openingBalance,
                    incurredCredit,
                    incurredDebit,
                    closingBalance,
                    creditLimit: configDebt?.limitDebt || 0, //hạn mức tín dụng
                    status: 'Bình thường',
                }
            }),
        )
    },

    getDebtComparisonDetail: async (query) => {
        const { startDate, endDate, customerId } = query
        const start = new Date(startDate)
        const end = new Date(endDate)
        const customerObjectId = new Types.ObjectId(customerId)

        const customer =
            await CustomerModel.findById(customerObjectId).select('name')
        if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)

        const openingBalance = await reportService._getOpeningBalance(
            customerObjectId,
            start,
        )

        const invoicesInPeriod = await InvoiceModel.find({
            customerId: customerObjectId,
            createdAt: { $gte: start, $lte: end },
        }).select('invoiceCode createdAt totalAmount')

        const paymentsInPeriod = await PaymentHistoryModel.aggregate([
            {
                $match: {
                    paymentDate: { $gte: start, $lte: end },
                },
            },
            {
                $lookup: {
                    from: 'invoices',
                    localField: 'invoiceId',
                    foreignField: '_id',
                    as: 'invoice',
                },
            },
            { $unwind: '$invoice' },
            {
                $match: {
                    'invoice.customerId': customerObjectId,
                },
            },
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

        const transactions = [
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

        const incurredDebit = transactions.reduce((sum, t) => sum + t.debit, 0)
        const incurredCredit = transactions.reduce(
            (sum, t) => sum + t.credit,
            0,
        )
        const closingBalance = openingBalance + incurredDebit - incurredCredit

        return {
            customerName: customer.name,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            openingBalance,
            incurredDuringPeriod: incurredDebit - incurredCredit,
            closingBalance,
            transactions,
        }
    },
}

module.exports = reportService

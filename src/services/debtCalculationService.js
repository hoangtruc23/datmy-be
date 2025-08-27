const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const PaymentHistoryModel = require('../models/paymentHistory')

const debtCalculationService = {
    /**
     * Calculates the total debt for a customer up to a certain date.
     * @param {Types.ObjectId} customerId - The ID of the customer.
     * @param {Date} date - The date to calculate the balance up to (exclusive).
     * @returns {Promise<number>} - The opening balance.
     */
    getOpeningBalance: async (customerId, date) => {
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

    getIncurredDebitForPeriod: async (customerId, startDate, endDate) => {
        const result = await InvoiceModel.aggregate([
            {
                $match: {
                    customerId: customerId,
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ])
        return result[0]?.total || 0
    },

    getIncurredCreditForPeriod: async (customerId, startDate, endDate) => {
        const result = await PaymentHistoryModel.aggregate([
            {
                $match: { paymentDate: { $gte: startDate, $lte: endDate } },
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
        return result[0]?.total || 0
    },
}

module.exports = debtCalculationService

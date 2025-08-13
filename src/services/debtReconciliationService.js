const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')
const PaymentHistoryModel = require('../models/paymentHistory')
const CustomerModel = require('../models/customer')
const ConfigDebtModel = require('../models/configDebt')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const debtCalculationService = require('./debtCalculationService')

const debtReconciliationService = {
    // getDebtComparisonSummary: async (query) => {
    //     const { startDate, endDate, customerId } = query
    //     const start = new Date(startDate)
    //     const end = new Date(endDate)

    //     //customerMatch could be empty here (summary all)
    //     const customerMatch = {}
    //     if (customerId) {
    //         customerMatch._id = new Types.ObjectId(customerId)
    //     }

    //     const customers =
    //         await CustomerModel.find(customerMatch).select('_id name')
    //     if (customers.length === 0) return []

    //     return Promise.all(
    //         customers.map(async (customer) => {
    //             const id = customer._id
    //             const openingBalance =
    //                 await debtCalculationService.getOpeningBalance(id, start)

    //             const incurredDebit =
    //                 await debtCalculationService.getIncurredDebitForPeriod(
    //                     id,
    //                     start,
    //                     end,
    //                 )

    //             const incurredCredit =
    //                 await debtCalculationService.getIncurredCreditForPeriod(
    //                     id,
    //                     start,
    //                     end,
    //                 )

    //             const closingBalance =
    //                 openingBalance + incurredDebit - incurredCredit
    //             const configDebt = await ConfigDebtModel.findOne({
    //                 customerId: id,
    //             })

    //             return {
    //                 customerName: customer.name,
    //                 openingBalance,
    //                 incurredCredit,
    //                 incurredDebit,
    //                 closingBalance,
    //                 creditLimit: configDebt?.limitDebt || 0, //hạn mức tín dụng
    //                 status: 'Bình thường',
    //             }
    //         }),
    //     )
    // },

    getDebtComparisonSummary: async (query) => {
        let { startDate, endDate, customerId, page, limit } = query
        page = Number(page) || 1;
        limit = Number(limit) || 10;
        
        const start = new Date(startDate);
        const end = new Date(endDate);

        const customerMatch = {};
        if (customerId) {
            customerMatch._id = new Types.ObjectId(String(customerId));
        }

        const allCustomers = await CustomerModel.find(customerMatch).select('_id name').lean();
        if (allCustomers.length === 0) {
            return {
                summary: { totalOpeningBalance: 0, totalIncurredCredit: 0, totalIncurredDebit: 0, totalClosingBalance: 0 },
                details: [],
                pagination: { page, limit, totalItems: 0, totalPages: 0 }
            };
        }

        // 1. Calculate the detailed breakdown for ALL customers
        const allCustomerDetails = await Promise.all(
            allCustomers.map(async (customer) => {
                const id = customer._id;
                const openingBalance = await debtCalculationService.getOpeningBalance(id, start);
                const incurredDebit = await debtCalculationService.getIncurredDebitForPeriod(id, start, end);
                const incurredCredit = await debtCalculationService.getIncurredCreditForPeriod(id, start, end);
                const closingBalance = openingBalance + incurredDebit - incurredCredit;
                const configDebt = await ConfigDebtModel.findOne({ customerId: id });

                return {
                    customerId: id,
                    customerName: customer.name,
                    openingBalance,       // Số dư đầu kỳ
                    incurredCredit,       // Phát sinh có (Tổng thanh toán)
                    incurredDebit,        // Phát sinh nợ (Tổng phát sinh)
                    closingBalance,       // Số dư cuối kỳ
                    creditLimit: configDebt?.limitDebt || 0,
                    status: 'Bình thường', // Placeholder for status logic
                };
            })
        );
        
        // tổng các field
        const grandTotals = allCustomerDetails.reduce((totals, item) => {
            totals.totalOpeningBalance += item.openingBalance;
            totals.totalIncurredCredit += item.incurredCredit;
            totals.totalIncurredDebit += item.incurredDebit;
            totals.totalClosingBalance += item.closingBalance;
            return totals;
        }, {
            totalOpeningBalance: 0,
            totalIncurredCredit: 0, 
            totalIncurredDebit: 0,  
            totalClosingBalance: 0,
        });

        // 3. Create the paginated view of the details
        const totalItems = allCustomerDetails.length;
        const paginatedDetails = allCustomerDetails.slice((page - 1) * limit, page * limit);

        return {
            summary: grandTotals,
            details: paginatedDetails,
            pagination: {
                page: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
            }
        };
    },

    // getDebtComparisonDetail: async (query) => {
    //     const { startDate, endDate, customerId } = query
    //     const start = new Date(startDate)
    //     const end = new Date(endDate)
    //     const customerObjectId = new Types.ObjectId(customerId)

    //     const customer =
    //         await CustomerModel.findById(customerObjectId).select('name')
    //     if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)

    //     const openingBalance =
    //         await debtCalculationService.getOpeningBalance(
    //             customerObjectId,
    //             start,
    //         )

    //     const invoicesInPeriod = await InvoiceModel.find({
    //         customerId: customerObjectId,
    //         createdAt: { $gte: start, $lte: end },
    //     }).select('invoiceCode createdAt totalAmount')

    //     const paymentsInPeriod = await PaymentHistoryModel.aggregate([
    //         {
    //             $match: {
    //                 paymentDate: { $gte: start, $lte: end },
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: 'invoices',
    //                 localField: 'invoiceId',
    //                 foreignField: '_id',
    //                 as: 'invoice',
    //             },
    //         },
    //         { $unwind: '$invoice' },
    //         {
    //             $match: {
    //                 'invoice.customerId': customerObjectId,
    //             },
    //         },
    //         {
    //             $project: {
    //                 _id: 1,
    //                 paymentDate: 1,
    //                 amount: 1,
    //                 content: 1,
    //                 invoiceCode: '$invoice.invoiceCode',
    //             },
    //         },
    //     ])

    //     const transactions = [
    //         ...invoicesInPeriod.map((inv) => ({
    //             date: inv.createdAt,
    //             documentCode: inv.invoiceCode,
    //             description: `Hóa đơn ${inv.invoiceCode}`,
    //             debit: inv.totalAmount,
    //             credit: 0,
    //         })),
    //         ...paymentsInPeriod.map((p) => ({
    //             date: p.paymentDate,
    //             documentCode: p.invoiceCode || 'N/A',
    //             description: p.content || 'Thanh toán',
    //             debit: 0,
    //             credit: p.amount,
    //         })),
    //     ].sort((a, b) => new Date(a.date) - new Date(b.date))

    //     const incurredDebit = transactions.reduce((sum, t) => sum + t.debit, 0)
    //     const incurredCredit = transactions.reduce(
    //         (sum, t) => sum + t.credit,
    //         0,
    //     )
    //     const closingBalance = openingBalance + incurredDebit - incurredCredit

    //     return {
    //         customerName: customer.name,
    //         startDate: start.toISOString().split('T')[0],
    //         endDate: end.toISOString().split('T')[0],
    //         openingBalance,
    //         incurredDuringPeriod: incurredDebit - incurredCredit,
    //         closingBalance,
    //         transactions,
    //     }
    // },
    
    getDebtComparisonDetail: async (query) => {
        let { startDate, endDate, customerId, page, limit } = query;
        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const customerObjectId = new Types.ObjectId(String(customerId));

        const customer = await CustomerModel.findById(customerObjectId).select('name').lean();
        if (!customer) {
            throw new BadReq(errorCode.CUSTOMER_NOT_FOUND);
        }

        const openingBalance = await debtCalculationService.getOpeningBalance(customerObjectId, start);

        const invoicesInPeriod = await InvoiceModel.find({
            customerId: customerObjectId,
            createdAt: { $gte: start, $lte: end },
        }).select('invoiceCode createdAt totalAmount').lean();

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
        ]);

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
        ].sort((a, b) => new Date(a.date) - new Date(b.date));

        // --- CALCULATE TOTALS FROM ALL TRANSACTIONS (BEFORE PAGINATION) ---
        const incurredDebit = allTransactions.reduce((sum, t) => sum + t.debit, 0);
        const incurredCredit = allTransactions.reduce((sum, t) => sum + t.credit, 0);
        const closingBalance = openingBalance + incurredDebit - incurredCredit;

        // --- APPLY PAGINATION TO THE TRANSACTIONS LIST ---
        const totalItems = allTransactions.length;
        const paginatedTransactions = allTransactions.slice((page - 1) * limit, page * limit);
        
        return {
            summary: {
                customerName: customer.name,
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
                openingBalance,
                incurredCredit, // Tổng thanh toán
                incurredDebit,  // Tổng phát sinh
                closingBalance,
            },
            details: paginatedTransactions,
            pagination: {
                page: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit),
            }
        };
    },
}

module.exports = debtReconciliationService
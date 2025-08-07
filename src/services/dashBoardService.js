const PaymentHistoryModel = require('../models/paymentHistory')
const InvoiceModel = require('../models/invoice')
const dashBoardService = {
    getSumaryDashBoard: async () => {
        try {
            const now = new Date()
            const startDate = new Date(
                Date.UTC(now.getFullYear(), now.getMonth() - 1, 1),
            )
            const endDate = new Date(
                Date.UTC(now.getFullYear(), now.getMonth(), 1),
            )

            // Doanh thu từ các paymentHistory trong khoảng
            const revenueResult = await PaymentHistoryModel.aggregate([
                {
                    $match: {
                        paymentDate: {
                            $gte: startDate,
                            $lt: endDate,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                    },
                },
            ])
            const monthRevenue = revenueResult[0]?.totalAmount || 0

            // Tổng totalAmount của invoice trong khoảng thời gian
            const invoiceResult = await InvoiceModel.aggregate([
                {
                    $match: {
                        invoiceDate: {
                            $gte: startDate,
                            $lt: endDate,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalInvoiceAmount: { $sum: '$totalAmount' },
                    },
                },
            ])
            const monthTotalInvoiceAmount =
                invoiceResult[0]?.totalInvoiceAmount || 0

            // Công nợ = Tổng invoice - doanh thu
            const monthTotalDept = monthTotalInvoiceAmount - monthRevenue

            // Số lượng khách hàng hoạt động trong tháng
            const activeCustomersInMonth = await InvoiceModel.aggregate([
                {
                    $match: {
                        invoiceDate: { $gte: startDate, $lt: endDate },
                    },
                },
                {
                    $group: {
                        _id: '$customerId',
                    },
                },
                {
                    $count: 'activeCustomerCount',
                },
            ])

            const activeCustomerCount =
                activeCustomersInMonth[0]?.activeCustomerCount || 0

            // Tổng số hóa đơn trong tháng
            const totalInvoicesInMonth = await InvoiceModel.aggregate([
                {
                    $match: {
                        invoiceDate: {
                            $gte: startDate,
                            $lt: endDate,
                        },
                    },
                },
                {
                    $count: 'invoiceCount',
                },
            ])

            const invoiceCount = totalInvoicesInMonth[0]?.invoiceCount || 0

            return {
                monthRevenue,
                monthTotalInvoiceAmount,
                monthTotalDept,
                activeCustomerCount,
                invoiceCount,
                startDate,
                endDate,
            }
        } catch (err) {
            throw err
        }
    },
}

module.exports = dashBoardService

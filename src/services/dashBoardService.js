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
            const activeCustomersInMonthInvoice = await InvoiceModel.aggregate([
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
            ])

            const activeCustomersInMonthPayment =
                await PaymentHistoryModel.aggregate([
                    {
                        $match: {
                            paymentDate: { $gte: startDate, $lt: endDate },
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
                    {
                        $unwind: '$invoice',
                    },
                    {
                        $group: {
                            _id: '$invoice.customerId',
                        },
                    },
                ])
            // Tìm khách hàng duy nhất từ cả hai mảng để lay ra số lượng khách hàng hoạt động
            const allActiveCustomers = new Set([
                ...activeCustomersInMonthInvoice.map((item) =>
                    item._id.toString(),
                ),
                ...activeCustomersInMonthPayment.map((item) =>
                    item._id.toString(),
                ),
            ]).size

            // Tổng số hóa đơn trong tháng   
            const totalInvoicesInMonth = await InvoiceModel.aggregate([
                {
                    $match: {
                        $or: [
                            { invoiceDate: { $gte: startDate, $lt: endDate } }, // Hóa đơn được tạo ra trong tháng
                            {
                                dueDate: { $gte: startDate, $lt: endDate }, // Hóa đơn còn công nợ
                                isFullyPaid: false,
                            },
                        ],
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
                allActiveCustomers,
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

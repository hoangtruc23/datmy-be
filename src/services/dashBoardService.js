const moment = require('moment');
const PaymentHistoryModel = require('../models/paymentHistory')
const InvoiceModel = require('../models/invoice')
const OrderDetailModel = require('../models/orderDetail')
const constant = require('../utils/constant/constant')

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
    getTopCustomersDebt: async () => {
        try {
            const customersWithDebt = await InvoiceModel.aggregate([
                {
                    $match: {
                        isFullyPaid: false,
                    },
                },
                {
                    $lookup: {
                        from: 'paymenthistories',
                        localField: '_id',
                        foreignField: 'invoiceId',
                        as: 'payments',
                    },
                },
                {
                    $addFields: {
                        totalPaid: { $sum: '$payments.amount' },
                    },
                },
                {
                    $group: {
                        _id: '$customerName',
                        totalDebt: {
                            $sum: { $subtract: ['$totalAmount', '$totalPaid'] },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        customerName: '$_id',
                        totalDebt: 1,
                    },
                },
                {
                    $sort: { totalDebt: -1 },
                },
                {
                    $limit: 5,
                },
            ])

            return customersWithDebt
        } catch (err) {
            throw err
        }
    },
    getRevenueMonthly: async (year = new Date().getFullYear()) => {
        try {
            const results = []

            for (let month = 0; month < 12; month++) {
                const startDate = new Date(Date.UTC(year, month, 1))
                const endDate = new Date(Date.UTC(year, month + 1, 1))

                // Tính doanh thu tháng: tổng amount trong paymentHistory
                const revenueResult = await PaymentHistoryModel.aggregate([
                    {
                        $match: {
                            paymentDate: { $gte: startDate, $lt: endDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$amount' },
                        },
                    },
                ])
                const revenue = revenueResult[0]?.totalRevenue || 0

                // Tổng amount trong invoices của tháng
                const invoiceResult = await InvoiceModel.aggregate([
                    {
                        $match: {
                            invoiceDate: { $gte: startDate, $lt: endDate },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalInvoiceAmount: { $sum: '$totalAmount' },
                        },
                    },
                ])
                const totalInvoiceAmount =
                    invoiceResult[0]?.totalInvoiceAmount || 0

                // Công nợ = Tổng hóa đơn - doanh thu
                const totalDept = totalInvoiceAmount - revenue

                results.push({
                    month: month + 1,
                    revenue,
                    totalDept,
                })
            }

            return results
        } catch (err) {
            throw err
        }
    },

    getRecentInvoices: async () => {
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
                { $sort: { invoiceDate: -1 } }, // mới nhất lên đầu
                { $limit: 4 }, // chỉ lấy 4 hóa đơn
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
                        totalAmount: 1,
                        totalPaid: 1,
                        remainingDebt: 1,
                        invoiceDate: 1,
                        dueDate: 1,
                        status: 1,
                        orderBy: 1,
                        accountant: 1,
                        reminderContact: 1,
                        notes: 1,
                    },
                },
            ]

            const recentInvoices = await InvoiceModel.aggregate(pipeline)
            return recentInvoices
        } catch (err) {
            throw err
        }
    },

    getTopCustomerRevenue: async (query) => {
        try {
            const { startTime, endTime } = query
            const startMomentLocal = moment(startTime).startOf('day');
            const startDateQuery = startMomentLocal.utc().toDate();

            const endMomentLocal = moment(endTime).endOf('day');
            const endDateQuery = endMomentLocal.utc().toDate();

            const result = await InvoiceModel.aggregate([
                {
                    $match: {
                        invoiceDate: {
                            $gte: new Date(startDateQuery),
                            $lte: new Date(endDateQuery)
                        }
                    }
                },
                {
                    $group: {
                        _id: '$customerId',
                        customerName: { $first: '$customerName' },
                        totalInvoiceAmount: { $sum: '$totalAmount' },
                        invoiceIds: { $push: '$_id' },
                    },
                },

                {
                    $lookup: {
                        from: 'paymenthistories',
                        localField: 'invoiceIds',
                        foreignField: 'invoiceId',
                        as: 'payments',
                    },
                },
                // Tính tổng tiền thanh toán của khách
                {
                    $addFields: {
                        totalPaid: { $sum: '$payments.amount' },
                        lastPaymentDate: { $max: '$payments.paymentDate' },
                    },
                },
                // Tính công nợ
                {
                    $addFields: {
                        totalDebt: {
                            $subtract: ['$totalInvoiceAmount', '$totalPaid'],
                        },
                    },
                },
                // Sắp xếp theo doanh thu (tổng thanh toán) giảm dần
                {
                    $sort: { totalPaid: -1 },
                },
                // Giới hạn lấy top 5 khách
                {
                    $limit: 4,
                },
                // Chọn trường cần trả về
                {
                    $project: {
                        _id: 0,
                        customerId: '$_id',
                        customerName: 1,
                        totalInvoiceAmount: 1,
                        lastPaymentDate: 1,
                        totalPaid: 1,
                        totalDebt: 1,
                    },
                },
            ])
            return result
        } catch (err) {
            throw err
        }
    },

    getBestSellingItems: async (query) => {
        try {
            const { startTime, endTime } = query

            const start = moment(startTime)
                .startOf('day')
                .subtract(7, 'hours')
                .toDate();

            const end = moment(endTime)
                .endOf('day')
                .subtract(7, 'hours')
                .toDate();


            const pineline = [
                {
                    $match: {
                        createdAt: {
                            $gte: start,
                            $lte: end,
                        }
                    }
                },
                {
                    $group: {
                        _id: "$productId",
                        totalQuantitySold: {
                            $sum: "$quantity"
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productInfo',
                    }
                },
                {
                    $unwind: '$productInfo',
                },
                {
                    $lookup: {
                        from: 'units',
                        localField: 'productInfo.unit',
                        foreignField: '_id',
                        as: 'unitInfo',
                    }
                },
                {
                    $unwind: '$unitInfo',
                },
                // Tổng số lượng giảm dần
                {
                    $sort: {
                        totalQuantitySold: -1
                    }
                },
                {
                    $limit: 5
                },
                {
                    $project: {
                        _id: 0,
                        productId: '$_id',
                        productName: '$productInfo.name',
                        productCode: '$productInfo.code',
                        unit: '$unitInfo.name',
                        totalQuantitySold: 1,
                    }
                },

            ]
            const result = await OrderDetailModel.aggregate(pineline)
            return result
        } catch (err) {
            throw err
        }
    },
}

module.exports = dashBoardService

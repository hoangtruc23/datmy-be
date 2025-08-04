const InvoiceModel = require('../models/invoice')

const constant = require('../utils/constant/constant')
const convertNumberToVietnameseWords = require('../middlewares/numberToWords')
const CustomerModel = require('../models/customer')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const { ObjectId } = require('mongodb')
const debtService = {
    getAll: async (page = 1, limit = 20, search = '', debtStatus = '') => {
        try {
            page = parseInt(page)
            limit = parseInt(limit)
            const skip = (page - 1) * limit
            const currentDate = new Date()

            const pipeline = [
                {
                    $match: {
                        isFullyPaid: false,
                        //dueDate: { $lt: currentDate },
                        ...(search.trim()
                            ? {
                                  customerName: {
                                      $regex: search.trim(),
                                      $options: 'i',
                                  },
                              }
                            : {}),
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
                                    status: 'partiallyPaid',
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
                        customerName: { $first: '$customerName' },
                        invoices: {
                            $push: {
                                _id: '$_id',
                                //invoiceCode: '$invoiceCode',
                                //totalAmount: '$totalAmount',
                                remainingDebt: '$remainingDebt',
                                dueDate: '$dueDate',
                                //status: '$status',
                            },
                        },
                        totalDebt: { $sum: '$remainingDebt' }, // Tổng nợ
                        minDueDate: { $min: '$dueDate' }, // dueDate nhỏ nhất
                    },
                },
                {
                    $lookup: {
                        from: 'configdebts',
                        localField: '_id',
                        foreignField: 'customerId',
                        as: 'debtConfig',
                    },
                },
                {
                    $addFields: {
                        limitOverdue: {
                            $ifNull: [
                                {
                                    $arrayElemAt: [
                                        '$debtConfig.limitOverdue',
                                        0,
                                    ],
                                },
                                7,
                            ],
                        },
                    },
                },
                {
                    $addFields: {
                        maxDebtDays: {
                            $divide: [
                                { $subtract: [currentDate, '$minDueDate'] },
                                1000 * 60 * 60 * 24,
                            ],
                        },
                        overdueDebt: {
                            $sum: {
                                $map: {
                                    input: '$invoices',
                                    as: 'invoice',
                                    in: {
                                        $cond: {
                                            if: {
                                                $lt: [
                                                    {
                                                        $add: [
                                                            '$$invoice.dueDate',
                                                            {
                                                                $multiply: [
                                                                    '$limitOverdue',
                                                                    1000 *
                                                                        60 *
                                                                        60 *
                                                                        24,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    currentDate,
                                                ],
                                            },
                                            then: '$$invoice.remainingDebt',
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        debtStatus: {
                            $cond: {
                                if: { $lte: ['$totalDebt', 0] },
                                then: constant.DEBT_STATUS.NO_DEBT,
                                else: {
                                    $cond: {
                                        if: {
                                            $gt: [
                                                '$maxDebtDays',
                                                {
                                                    $sum: [
                                                        '$limitOverdue',
                                                        constant
                                                            .DEBT_STATUS_PERIOD
                                                            .BAD_DEBT,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: constant.DEBT_STATUS.BAD_DEBT,
                                        else: {
                                            $cond: {
                                                if: {
                                                    $gt: [
                                                        '$maxDebtDays',
                                                        '$limitOverdue',
                                                    ],
                                                },
                                                then: constant.DEBT_STATUS
                                                    .OVERDUE,
                                                else: constant.DEBT_STATUS
                                                    .NORMAL,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'debtreminders',
                        let: { customerId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$customerId', '$$customerId'],
                                    },
                                    status: 'completed',
                                },
                            },
                            { $sort: { remindDate: -1 } },
                            { $limit: 1 },
                        ],
                        as: 'lastReminder',
                    },
                },
                {
                    $project: {
                        customerId: '$_id',
                        customerName: 1,
                        totalDebt: 1,
                        overdueDebt: 1,
                        //invoices: 1,
                        maxDebtDays: { $round: ['$maxDebtDays', 0] },
                        limitOverdue: 1,
                        debtStatus: 1,
                        lastReminder: {
                            $cond: {
                                if: { $gt: [{ $size: '$lastReminder' }, 0] },
                                then: {
                                    remindDate: {
                                        $arrayElemAt: [
                                            '$lastReminder.remindDate',
                                            0,
                                        ],
                                    },
                                },
                                else: null,
                            },
                        },
                        _id: 0,
                    },
                },
                ...(debtStatus
                    ? [{ $match: { debtStatus: { $eq: debtStatus } } }]
                    : []),

                { $sort: { customerName: 1 } },
                { $skip: skip },
                { $limit: limit },
            ]
            const totalPipeline = [
                {
                    $match: {
                        isFullyPaid: false,
                        //dueDate: { $lt: currentDate },
                        ...(search.trim()
                            ? {
                                  customerName: {
                                      $regex: search.trim(),
                                      $options: 'i',
                                  },
                              }
                            : {}),
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
                                    status: 'partiallyPaid',
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
                        minDueDate: { $min: '$dueDate' },
                    },
                },
                {
                    $lookup: {
                        from: 'configdebts',
                        localField: '_id',
                        foreignField: 'customerId',
                        as: 'debtConfig',
                    },
                },
                {
                    $addFields: {
                        limitOverdue: {
                            $ifNull: [
                                {
                                    $arrayElemAt: [
                                        '$debtConfig.limitOverdue',
                                        0,
                                    ],
                                },
                                7,
                            ],
                        },
                    },
                },
                {
                    $addFields: {
                        maxDebtDays: {
                            $divide: [
                                { $subtract: [currentDate, '$minDueDate'] },
                                1000 * 60 * 60 * 24,
                            ],
                        },
                    },
                },
                {
                    $addFields: {
                        debtStatus: {
                            $cond: {
                                if: { $lte: ['$totalDebt', 0] },
                                then: constant.DEBT_STATUS.NO_DEBT,
                                else: {
                                    $cond: {
                                        if: {
                                            $gt: [
                                                '$maxDebtDays',
                                                {
                                                    $sum: [
                                                        '$limitOverdue',
                                                        constant
                                                            .DEBT_STATUS_PERIOD
                                                            .BAD_DEBT,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: constant.DEBT_STATUS.BAD_DEBT,
                                        else: {
                                            $cond: {
                                                if: {
                                                    $gt: [
                                                        '$maxDebtDays',
                                                        '$limitOverdue',
                                                    ],
                                                },
                                                then: constant.DEBT_STATUS
                                                    .OVERDUE,
                                                else: constant.DEBT_STATUS
                                                    .NORMAL,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                ...(debtStatus
                    ? [{ $match: { debtStatus: { $eq: debtStatus } } }]
                    : []),
                { $count: 'total' },
            ]
            const [items, total] = await Promise.all([
                InvoiceModel.aggregate(pipeline),

                InvoiceModel.aggregate(totalPipeline),
            ])

            const totalCount = total[0]?.total || 0
            const totalPages = Math.ceil(totalCount / limit)

            return { items, total: totalCount, page, limit, totalPages }
        } catch (err) {
            throw err
        }
    },
    getSummary: async () => {
        try {
            const currentDate = new Date()
            // const oneMonthAgo = new Date(
            //     currentDate.getTime() - 30 * 24 * 60 * 60 * 1000,
            // )

            const pipeline = [
                {
                    $match: {
                        isFullyPaid: false,
                        //dueDate: { $lt: currentDate },
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
                                    status: 'partiallyPaid',
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
                        customerName: { $first: '$customerName' },
                        totalDebt: { $sum: '$remainingDebt' },
                        invoices: {
                            $push: {
                                remainingDebt: '$remainingDebt',
                                dueDate: '$dueDate',
                            },
                        },
                        minDueDate: { $min: '$dueDate' },
                    },
                },
                {
                    $lookup: {
                        from: 'configdebts',
                        localField: '_id',
                        foreignField: 'customerId',
                        as: 'debtConfig',
                    },
                },
                {
                    $addFields: {
                        limitOverdue: {
                            $ifNull: [
                                {
                                    $arrayElemAt: [
                                        '$debtConfig.limitOverdue',
                                        0,
                                    ],
                                },
                                7,
                            ],
                        },
                    },
                },
                {
                    $addFields: {
                        maxDebtDays: {
                            $divide: [
                                { $subtract: [currentDate, '$minDueDate'] },
                                1000 * 60 * 60 * 24,
                            ],
                        },
                        overdueDebt: {
                            $sum: {
                                $map: {
                                    input: '$invoices',
                                    as: 'invoice',
                                    in: {
                                        $cond: {
                                            if: {
                                                $lt: [
                                                    {
                                                        $add: [
                                                            '$$invoice.dueDate',
                                                            {
                                                                $multiply: [
                                                                    '$limitOverdue',
                                                                    1000 *
                                                                        60 *
                                                                        60 *
                                                                        24,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    currentDate,
                                                ],
                                            },
                                            then: '$$invoice.remainingDebt',
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        },

                        badDebt: {
                            $sum: {
                                $map: {
                                    input: '$invoices',
                                    as: 'invoice',
                                    in: {
                                        $cond: {
                                            if: {
                                                $lt: [
                                                    {
                                                        $add: [
                                                            '$$invoice.dueDate',
                                                            {
                                                                $multiply: [
                                                                    '$limitOverdue',
                                                                    1000 *
                                                                        60 *
                                                                        60 *
                                                                        24,
                                                                ],
                                                            },
                                                            {
                                                                $multiply: [
                                                                    constant
                                                                        .DEBT_STATUS_PERIOD
                                                                        .BAD_DEBT,
                                                                    1000 *
                                                                        60 *
                                                                        60 *
                                                                        24,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    currentDate,
                                                ],
                                            },
                                            then: '$$invoice.remainingDebt',
                                            else: 0,
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
                        totalDebt: { $sum: '$totalDebt' },
                        overdueDebt: { $sum: '$overdueDebt' },
                        badDebt: { $sum: '$badDebt' },
                        customerCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        totalDebt: 1,
                        overdueDebt: 1,
                        badDebt: 1,
                        customerCount: 1,
                        overdueDebtRatio: {
                            $cond: [
                                { $gt: ['$totalDebt', 0] },
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                '$overdueDebt',
                                                '$totalDebt',
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                        badDebtRatio: {
                            $cond: [
                                { $gt: ['$totalDebt', 0] },
                                {
                                    $multiply: [
                                        {
                                            $divide: ['$badDebt', '$totalDebt'],
                                        },
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                    },
                },
            ]

            const [currentStats] = await Promise.all([
                InvoiceModel.aggregate(pipeline),
                //InvoiceModel.aggregate(lastMonthPipeline),
            ])

            const stats = currentStats[0] || {}
            //const lastMonth = lastMonthStats[0] || { badDebtRatio: 0 }

            return {
                totalDebt: stats.totalDebt || 0,
                overdueDebt: stats.overdueDebt || 0,
                badDebt: stats.badDebt || 0,
                //tròn 2 sau phẩy
                overdueDebtRatio:
                    Math.round(stats.overdueDebtRatio * 100) / 100 || 0,

                //tròn 2 sau phẩy
                badDebtRatio: Math.round(stats.badDebtRatio * 100) / 100 || 0,

                customerCount: stats.customerCount || 0,
            }
        } catch (err) {
            throw err
        }
    },
    generateReport: async (startDate, endDate, customerId) => {
        try {
            const currentDate = new Date();
            const start = new Date(startDate);
            const end = new Date(endDate);

            const customer = await CustomerModel.findById(customerId)
            if (!customer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }
            const pipeline = [
                {
                    $match: {
                        customerId: new ObjectId(customerId),
                        isFullyPaid: false,
                    }
                },
                {
                    $lookup: {
                        from: 'paymenthistories',
                        let: { invoiceId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$invoiceId', '$$invoiceId'] },
                                    status: 'partiallyPaid'
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    paidAmount: { $sum: '$amount' }
                                }
                            }
                        ],
                        as: 'payments'
                    }
                },
                {
                    $addFields: {
                        remainingDebt: {
                            $subtract: [
                                '$totalAmount',
                                { $ifNull: [{ $sum: '$payments.paidAmount' }, 0] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: '$customerId',
                        totalDebt: { $sum: '$remainingDebt' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalDebt: 1
                    }
                }
            ];

            const result = await InvoiceModel.aggregate(pipeline);
            const data = result[0] || {};
            const totalDebtInWords = convertNumberToVietnameseWords(data.totalDebt || 0);
            const dataToWrite = {
                currentDate,
                officialName: customer.officialName,
                deliveryAddress: customer.deliveryAddresses|| null,
                taxCode: customer.taxCode,
                representative: customer.representative || null,

                totalDebt: data.totalDebt || 0,
                totalDebtInWords,

                startDate: start,
                endDate: end,
            };
            //console.log('dataToWrite', dataToWrite)
            return dataToWrite;
        } catch (err) {
            throw err;
        }
    },
}

module.exports = debtService

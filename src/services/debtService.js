// const { Types } = require('mongoose')
const InvoiceModel = require('../models/invoice')

// const PaymentHistoryModel = require('../models/paymentHistory')
// const DebtTaskModel = require('../models/configDebt')
// const DebtReminderModel = require('../models/debtReminder')

const constant = require('../utils/constant/constant')

const debtService = {
    getAll: async (page = 1, limit = 20, search = '') => {
        try {
            page = parseInt(page)
            limit = parseInt(limit)
            const skip = (page - 1) * limit
            const currentDate = new Date()

            const pipeline = [
                {
                    $match: {
                        isFullyPaid: false,
                        dueDate: { $lt: currentDate },
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
                { $sort: { customerName: 1 } },
                { $skip: skip },
                { $limit: limit },
            ]
            const [items, total] = await Promise.all([
                InvoiceModel.aggregate(pipeline),

                InvoiceModel.aggregate([
                    {
                        $match: {
                            isFullyPaid: false,
                            dueDate: { $lt: currentDate },
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
                    { $group: { _id: '$customerId' } },
                    { $count: 'total' },
                ]),
            ])

            const totalCount = total[0]?.total || 0
            const totalPages = Math.ceil(totalCount / limit)

            return { items, total: totalCount, page, limit, totalPages }
        } catch (err) {
            throw err
        }
    },
}

module.exports = debtService

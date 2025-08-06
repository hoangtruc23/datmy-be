const { Types } = require('mongoose')
const DebtReminderModel = require('../models/debtReminder')
const CustomerModel = require('../models/customer')
const constant = require('../utils/constant/constant')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')
const debtReminderService = {
    create: async (data) => {
        try {
            const {
                customerId,
                customerName,
                dueDate,
                method,
                tryCount,
                assignedTo,
                priority,
                status,
                result,
                contactDate,
                followUpDate,
                timeContact,
                notes,
            } = data

            if (!Types.ObjectId.isValid(customerId)) {
                throw new BadReq(errorCode.INVALID_CUSTOMER_ID)
            }
            const customer = await CustomerModel.findById(customerId)
            if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)

            await DebtReminderModel.create({
                customerId,
                customerName,
                dueDate,
                method,
                tryCount,
                assignedTo,
                priority,
                status,
                result,
                contactDate,
                followUpDate,
                timeContact,
                notes,
            })

            return null
        } catch (err) {
            throw err
        }
    },

    update: async (id, data) => {
        try {
            const reminder = await DebtReminderModel.findById(id)
            if (!reminder) throw new BadReq(errorCode.DEBT_REMINDER_NOT_FOUND)

            if (data.customerId && data.customerId !== reminder.customerId) {
                if (!Types.ObjectId.isValid(data.customerId)) {
                    throw new BadReq(errorCode.INVALID_CUSTOMER_ID)
                }
                const customer = await CustomerModel.findById(data.customerId)
                if (!customer) throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            Object.assign(reminder, {
                customerId: data.customerId,
                customerName: data.customerName,
                dueDate: data.dueDate,
                method: data.method,
                tryCount: data.tryCount,
                assignedTo: data.assignedTo,
                priority: data.priority,
                status: data.status,
                result: data.result,
                contactDate: data.contactDate,
                followUpDate: data.followUpDate,
                timeContact: data.timeContact,
                notes: data.notes,
            })

            await reminder.save()
            return null
        } catch (err) {
            throw err
        }
    },

    getAll: async (
        page = 1,
        limit = 10,
        search = '',
        status = '',
        priority = '',
    ) => {
        try {
            page = parseInt(page)
            limit = parseInt(limit)
            const skip = (page - 1) * limit
            const currentDate = new Date()
            const pipeline = [
                {
                    $match: {
                        ...(search.trim()
                            ? {
                                  customerName: {
                                      $regex: search.trim(),
                                      $options: 'i',
                                  },
                              }
                            : {}),

                        ...(status ? { status: status } : {}),
                        ...(priority ? { priority: priority } : {}),
                    },
                },
                {
                    $lookup: {
                        from: 'invoices',
                        let: { customerId: '$customerId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$customerId', '$$customerId'],
                                    },
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
                                                    $eq: [
                                                        '$invoiceId',
                                                        '$$invoiceId',
                                                    ],
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
                                                    {
                                                        $sum: '$payments.paidAmount',
                                                    },
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalDebt: { $sum: '$remainingDebt' },
                                    minDueDate: { $min: '$dueDate' },
                                },
                            },
                        ],
                        as: 'invoices',
                    },
                },
                {
                    $lookup: {
                        from: 'configdebts',
                        localField: 'customerId',
                        foreignField: 'customerId',
                        as: 'debtConfig',
                    },
                },
                {
                    $addFields: {
                        totalDebt: {
                            $ifNull: [
                                { $arrayElemAt: ['$invoices.totalDebt', 0] },
                                0,
                            ],
                        },
                        minDueDate: {
                            $arrayElemAt: ['$invoices.minDueDate', 0],
                        },
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
                            $cond: {
                                if: { $eq: ['$minDueDate', null] },
                                then: 0,
                                else: {
                                    $round: [
                                        {
                                            $divide: [
                                                {
                                                    $subtract: [
                                                        currentDate,
                                                        '$minDueDate',
                                                    ],
                                                },
                                                1000 * 60 * 60 * 24,
                                            ],
                                        },
                                        0,
                                    ],
                                },
                            },
                        },
                        overdueDebt: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $ne: ['$minDueDate', null] },
                                        {
                                            $lt: [
                                                {
                                                    $add: [
                                                        '$minDueDate',
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
                                    ],
                                },
                                then: '$totalDebt',
                                else: 0,
                            },
                        },
                    },
                },
                {
                    $project: {
                        customerName: 1,
                        totalDebt: 1,
                        overdueDebt: 1,
                        maxDebtDays: 1,
                        priority: 1,
                        assignedTo: 1,
                        dueDate: 1,
                        method: 1,
                        tryCount: 1,
                        status: 1,
                        _id: 1,
                    },
                },
                { $sort: { createdAt: 1 } },
                { $skip: skip },
                { $limit: limit },
            ]

            const totalPipeline = [
                {
                    $match: {
                        ...(search.trim()
                            ? {
                                  customerName: {
                                      $regex: search.trim(),
                                      $options: 'i',
                                  },
                              }
                            : {}),
                        ...(status ? { status: status } : {}),
                        ...(priority ? { priority: priority } : {}),
                    },
                },
                { $count: 'total' },
            ]

            const [items, total] = await Promise.all([
                DebtReminderModel.aggregate(pipeline),
                DebtReminderModel.aggregate(totalPipeline),
            ])

            const totalCount = total[0]?.total || 0
            const totalPages = Math.ceil(totalCount / limit)

            return { items, total: totalCount, page, limit, totalPages }
        } catch (err) {
            throw err
        }
    },

    getAllHistory: async (page = 1, limit = 10, search = '') => {
        try {
            const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

            const filter = {
                status: constant.DEBT_REMINDER_STATUS.COMPLETED,
            }

            if (search) {
                const regex = new RegExp(search.trim(), 'i')
                filter.customerName = regex
            }

            const [items, total] = await Promise.all([
                DebtReminderModel.find(filter)
                    .skip(skip)
                    .limit(parseInt(limit, 10))
                    .sort({ contactDate: -1 })
                    .select(
                        'customerName contactDate method timeContact result assignedTo followUpDate notes',
                    ),
                DebtReminderModel.countDocuments(filter),
            ])

            return {
                items,
                total,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getById: async (id) => {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadReq(errorCode.INVALID_ID)
            }
            const reminder = await DebtReminderModel.findById(id)

            if (!reminder) throw new BadReq(errorCode.DEBT_REMINDER_NOT_FOUND)
            return reminder
        } catch (err) {
            throw err
        }
    },

    delete: async (id) => {
        try {
            const reminder = await DebtReminderModel.findByIdAndDelete(id)
            if (!reminder) throw new BadReq(errorCode.DEBT_REMINDER_NOT_FOUND)
            return null
        } catch (err) {
            throw err
        }
    },
    checkCompleted: async (id) => {
        try {
            const reminder = await DebtReminderModel.findByIdAndUpdate(id, {
                status: constant.DEBT_REMINDER_STATUS.COMPLETED,
            })
            if (!reminder) throw new BadReq(errorCode.DEBT_REMINDER_NOT_FOUND)
            return null
        } catch (err) {
            throw err
        }
    },
    getSumHistory: async () => {
        try {
            const currentDate = new Date()
            const startOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1,
            )
            const endOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0,
                23,
                59,
                59,
                999,
            )

            const pipeline = [
                {
                    $match: {
                        status: constant.DEBT_REMINDER_STATUS.COMPLETED,
                        contactDate: {
                            $gte: startOfMonth,
                            $lte: endOfMonth,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalContacts: { $sum: 1 },
                        promisePaid: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$result',
                                            constant.DEBT_RESULT.PROMISE_PAID,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        partiallyPaid: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$result',
                                            constant.DEBT_RESULT.PARTIALLY_PAID,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        noResponse: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$result',
                                            constant.DEBT_RESULT.NO_RESPONSE,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        fullyPaid: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$result',
                                            constant.DEBT_RESULT.FULLY_PAID,
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalContacts: 1,
                        promisePaid: 1,
                        partiallyPaid: 1,
                        noResponse: 1,
                    },
                },
            ]

            const [summary] = await DebtReminderModel.aggregate(pipeline)

            return {
                totalContacts: summary?.totalContacts || 0,
                promisePaid: summary?.promisePaid || 0,
                partiallyPaid: summary?.partiallyPaid || 0,
                noResponse: summary?.noResponse || 0,
            }
        } catch (error) {
            throw error
        }
    },
}

module.exports = debtReminderService

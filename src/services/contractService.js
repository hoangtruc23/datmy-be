const { Types } = require('mongoose')
const ContractModel = require('../models/contract')
const contractService = {
    getOverview: async () => {
        try {
            const sumContract = await ContractModel.countDocuments({})
            const activeCount = await ContractModel.countDocuments({
                status: 'Đang hiệu lực',
            })
            const expireCount = await ContractModel.countDocuments({
                status: 'Sắp bảo trì',
            })
            const warningCount = await ContractModel.countDocuments({
                status: 'Cần bảo trì',
            })

            const result = {
                sumContract: sumContract,
                active: activeCount,
                expire: expireCount,
                warning: warningCount,
            }

            return result
        } catch (error) {
            throw error
        }
    },
    getAll: async (query) => {
        try {
            const { status } = query
            let pineline = []

            if (status) {
                pineline.push({
                    $match: { status: status },
                })
            }

            pineline.push(
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerInfo',
                    },
                },
                { $unwind: '$customerInfo' },
                // 2. Chuyển mảng 'maintenance' thành Date objects
                {
                    $addFields: {
                        maintenance: {
                            $map: {
                                input: '$maintenance',
                                as: 'item',
                                in: {
                                    month: '$$item.month',
                                    status: '$$item.status',
                                    // Chuyển chuỗi "dd/MM/yyyy" thành Date Object
                                    date: {
                                        $dateFromString: {
                                            dateString: '$$item.date',
                                            format: '%d/%m/%Y',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        // Tìm ngày nhỏ nhất có status: false
                        nextMaintenanceObject: {
                            $min: {
                                $map: {
                                    // Dùng $map để chỉ trích xuất trường 'date'
                                    input: {
                                        $filter: {
                                            input: '$maintenance',
                                            as: 'item',
                                            cond: {
                                                $eq: ['$$item.status', false],
                                            },
                                        },
                                    },
                                    as: 'filteredItem',
                                    in: '$$filteredItem.date', // Trích xuất Date Object
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        daysUntilMaintenance: {
                            $cond: {
                                if: '$nextMaintenanceObject', // Kiểm tra xem có lịch bảo trì pending không
                                then: {
                                    // (Ngày Next - Ngày Hiện tại) / 1 ngày. Dùng $ceil để làm tròn lên.
                                    $ceil: {
                                        $divide: [
                                            {
                                                $subtract: [
                                                    '$nextMaintenanceObject',
                                                    '$$NOW',
                                                ],
                                            },
                                            1000 * 60 * 60 * 24, // Số milliseconds trong 1 ngày
                                        ],
                                    },
                                },
                                else: null,
                            },
                        },
                    },
                },
                // 3. Tính nextMaintenance và Days Remaining
                {
                    $addFields: {
                        // Cập nhật Status
                        status: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $lte: ['$daysUntilMaintenance', 0],
                                        },
                                        then: 'Quá hạn bảo trì',
                                    },
                                    //1->7 ngày
                                    {
                                        case: {
                                            $and: [
                                                {
                                                    $gt: [
                                                        '$daysUntilMaintenance',
                                                        0,
                                                    ],
                                                },
                                                {
                                                    $lte: [
                                                        '$daysUntilMaintenance',
                                                        3,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: 'Cần bảo trì',
                                    },
                                    //7->10 ngày
                                    {
                                        case: {
                                            $and: [
                                                {
                                                    $gt: [
                                                        '$daysUntilMaintenance',
                                                        3,
                                                    ],
                                                },
                                                {
                                                    $lte: [
                                                        '$daysUntilMaintenance',
                                                        10,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: 'Sắp bảo trì',
                                    }, // { case: { $and: [{ $gt: ['$daysUntilMaintenance', 7] }, { $lte: ['$daysUntilMaintenance', 10] }] }, then: 'Cần bảo trì' }
                                ],
                                default: 'Đang hiệu lực',
                            },
                        },

                        completedMaintenance: {
                            $size: {
                                $filter: {
                                    input: '$maintenance',
                                    as: 'item',
                                    cond: { $eq: ['$$item.status', true] }, //cond -> "condition" (điều kiện)
                                },
                            },
                        },

                        totalMaintenance: { $size: '$maintenance' },

                        expirationDate: {
                            $dateAdd: {
                                startDate: '$dateOfSigning',
                                unit: 'month',
                                amount: '$duration',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        officialName: '$customerInfo.officialName',
                        name: '$customerInfo.name',
                        phone: '$customerInfo.phone',
                        billingAddress: '$customerInfo.billingAddress',
                        machineId: 1,
                        totalMaintenance: 1,
                        completedMaintenance: 1,
                        nextMaintenance: '$nextMaintenanceObject',
                        daysUntilMaintenance: 1,
                        dateOfSigning: 1,
                        status: 1,
                        expirationDate: 1,
                        numberOfContract: 1,
                    },
                },
            )
            const results = await ContractModel.aggregate(pineline)

            const updateStatusContract = results.map((result) => {
                const { _id, status } = result

                return ContractModel.findByIdAndUpdate(
                    _id,
                    {
                        status: status,
                    },
                    { new: false },
                ).exec()
            })

            await Promise.all(updateStatusContract)

            return results
        } catch (error) {
            throw error
        }
    },
    getById: async (params) => {
        try {
            const { maintenanceId } = params
            const pineline = [
                {
                    $match: { _id: new Types.ObjectId(maintenanceId) },
                },
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'customerInfo',
                    },
                },
                { $unwind: '$customerInfo' },
                // 2. Chuyển mảng 'maintenance' thành Date objects
                {
                    $addFields: {
                        maintenance: {
                            $map: {
                                input: '$maintenance',
                                as: 'item',
                                in: {
                                    month: '$$item.month',
                                    status: '$$item.status',
                                    // Chuyển chuỗi "dd/MM/yyyy" thành Date Object
                                    date: {
                                        $dateFromString: {
                                            dateString: '$$item.date',
                                            format: '%d/%m/%Y',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        // Tìm ngày nhỏ nhất có status: false
                        nextMaintenanceObject: {
                            $min: {
                                $map: {
                                    // Dùng $map để chỉ trích xuất trường 'date'
                                    input: {
                                        $filter: {
                                            input: '$maintenance',
                                            as: 'item',
                                            cond: {
                                                $eq: ['$$item.status', false],
                                            },
                                        },
                                    },
                                    as: 'filteredItem',
                                    in: '$$filteredItem.date', // Trích xuất Date Object
                                },
                            },
                        },
                    },
                },
                // 3. Tính nextMaintenance và Days Remaining
                {
                    $addFields: {
                        daysUntilMaintenance: {
                            $cond: {
                                if: '$nextMaintenanceObject', // Kiểm tra xem có lịch bảo trì pending không
                                then: {
                                    // (Ngày Next - Ngày Hiện tại) / 1 ngày. Dùng $ceil để làm tròn lên.
                                    $ceil: {
                                        $divide: [
                                            {
                                                $subtract: [
                                                    '$nextMaintenanceObject',
                                                    '$$NOW',
                                                ],
                                            },
                                            1000 * 60 * 60 * 24, // Số milliseconds trong 1 ngày
                                        ],
                                    },
                                },
                                else: null,
                            },
                        },

                        // Cập nhật Status
                        status: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $lte: ['$daysUntilMaintenance', 0],
                                        },
                                        then: 'Cần bảo trì',
                                    },
                                    {
                                        case: {
                                            $and: [
                                                {
                                                    $gt: [
                                                        '$daysUntilMaintenance',
                                                        0,
                                                    ],
                                                },
                                                {
                                                    $lte: [
                                                        '$daysUntilMaintenance',
                                                        7,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: 'Sắp bảo trì',
                                    },
                                    {
                                        case: {
                                            $and: [
                                                {
                                                    $gt: [
                                                        '$daysUntilMaintenance',
                                                        7,
                                                    ],
                                                },
                                                {
                                                    $lte: [
                                                        '$daysUntilMaintenance',
                                                        10,
                                                    ],
                                                },
                                            ],
                                        },
                                        then: 'Cần bảo trì',
                                    },
                                ],
                                default: 'Đang hiệu lực',
                            },
                        },

                        completedMaintenance: {
                            $size: {
                                $filter: {
                                    input: '$maintenance',
                                    as: 'item',
                                    cond: { $eq: ['$$item.status', true] }, //cond -> "condition" (điều kiện)
                                },
                            },
                        },

                        totalMaintenance: { $size: '$maintenance' },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        officialName: '$customerInfo.officialName',
                        name: '$customerInfo.name',
                        phone: '$customerInfo.phone',
                        billingAddress: '$customerInfo.billingAddress',
                        machineId: 1,
                        totalMaintenance: 1,
                        completedMaintenance: 1,
                        nextMaintenance: '$nextMaintenanceObject',
                        daysUntilMaintenance: 1,
                        dateOfSigning: 1,
                        status: 1,
                    },
                },
            ]
            const result = await ContractModel.aggregate(pineline)
            return result
        } catch (error) {
            throw error
        }
    },
    create: async (contract) => {
        try {
            const contractCount = await ContractModel.countDocuments()
            const nextContractNumber = contractCount + 1
            const paddedNumber = String(nextContractNumber).padStart(4, '0')
            contract.numberOfContract = 'HD' + paddedNumber
            await ContractModel.create(contract)
            return null
        } catch (error) {
            throw error
        }
    },
    update: async (contract) => {
        try {
            const contractId = contract.contractId
            if (!contractId) {
                return 'Không tìm thấy hợp đồng'
            }
            const result = await ContractModel.findByIdAndUpdate(
                contractId,
                contract,
                { new: true },
            )
            return result
        } catch (error) {
            throw error
        }
    },
}

module.exports = contractService

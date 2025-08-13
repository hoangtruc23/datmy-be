const ApiModel = require('../models/api')
const PermissionModel = require('../models/permission')

const systemServices = {
    getAllApi: async (query) => {
        try {
            let { page = 1, limit = 10, search } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')
            const [apis, totalApis] = await Promise.all([
                await ApiModel.find({
                    $or: [{ api: search }, { note: search }],
                })
                    .skip((page - 1) * limit)
                    .limit(limit),

                await ApiModel.countDocuments({
                    $or: [{ api: search }, { note: search }],
                }),
            ])
            return {
                apis,
                page,
                totalApis,
                totalPage: Math.ceil(totalApis / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getAllPermission: async (query) => {
        try {
            let { page = 1, limit = 10, search } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')
            const [permissions, totalParentPermissions, totalPermissions] =
                await Promise.all([
                    // await PermissionModel.find({
                    //     parentPermissionId: null,
                    //     $or: [{ name: search }, { code: search }],
                    // })
                    //     .skip((page - 1) * limit)
                    //     .limit(limit),

                    await PermissionModel.aggregate([
                        {
                            $match: {
                                parentPermissionId: null,
                                $or: [{ name: search }, { code: search }],
                            },
                        },
                        {
                            $lookup: {
                                from: 'permissions',
                                localField: '_id',
                                foreignField: 'parentPermissionId',
                                as: 'children',
                            },
                        },
                        {
                            $project: {
                                parentPermissionId: 0,
                                'children.parentPermissionId': 0,
                            },
                        },
                        {
                            $skip: (page - 1) * limit,
                        },
                        {
                            $limit: limit,
                        },
                    ]),
                    await PermissionModel.countDocuments({
                        parentPermissionId: null,
                        $or: [{ name: search }, { code: search }],
                    }),
                    await PermissionModel.countDocuments({
                        $or: [{ name: search }, { code: search }],
                    }),
                ])
            return {
                permissions,
                page,
                totalParentPermissions,
                totalPermissions,
                totalPage: Math.ceil(totalPermissions / limit),
            }
        } catch (error) {
            throw error
        }
    },
}

module.exports = systemServices

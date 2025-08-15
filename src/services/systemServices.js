const ApiModel = require('../models/api')
const PermissionModel = require('../models/permission')
const PermissionApiModel = require('../models/permissionApi')
const { Types } = require('mongoose')
const mongoose = require('mongoose')

const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

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
                totalPage: Math.ceil(totalParentPermissions / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getAllPermissionApi: async (query) => {
        try {
            let { page = 1, limit = 10 } = query
            page = Number(page)
            limit = Number(limit)
            const [
                groupPermissionApis,
                totalGroupPermissionApis,
                totalPermissionApis,
            ] = await Promise.all([
                PermissionApiModel.aggregate([
                    {
                        $group: {
                            _id: '$permissionId',
                            apiIds: { $push: '$apiId' },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            permissionId: '$_id',
                            apiIds: 1,
                        },
                    },
                    {
                        $skip: (page - 1) * limit,
                    },
                    {
                        $limit: limit,
                    },
                ]),
                PermissionApiModel.aggregate([
                    {
                        $group: {
                            _id: '$permissionId',
                        },
                    },
                    {
                        $count: 'total',
                    },
                ]),
                PermissionApiModel.countDocuments(),
            ])
            const totalGroup =
                totalGroupPermissionApis.length > 0
                    ? totalGroupPermissionApis[0].total
                    : 0
            return {
                groupPermissionApis,
                page,
                totalGroupPermissionApis: totalGroup,
                totalPermissionApis,
                totalPage: Math.ceil(totalGroup / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getPermissionApiById: async (permissionId) => {
        try {
            const permission = await PermissionModel.findById(permissionId)
            if (!permission) {
                throw new BadReq(errorCode.PERMISSION_NOT_FOUND)
            }
            const permissionApi = await PermissionApiModel.aggregate([
                {
                    $match: {
                        permissionId: new Types.ObjectId(permissionId),
                    },
                },
                {
                    $group: {
                        _id: '$permissionId',
                        apiIds: { $push: '$apiId' },
                    },
                },

                {
                    $project: {
                        _id: 0,
                        permissionId: '$_id',
                        apiIds: 1,
                    },
                },
            ])
            return permissionApi
        } catch (error) {
            throw error
        }
    },
    updatePermissionApi: async (permissionId, reqData) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { apiIds } = reqData
            const checkPermissionId =
                await PermissionModel.findById(permissionId)
            if (!checkPermissionId) {
                throw new BadReq(errorCode.PERMISSION_NOT_FOUND)
            }

            const apis = await ApiModel.find({ _id: { $in: apiIds } })
            if (apis.length !== apiIds.length) {
                throw new BadReq(errorCode.API_NOT_FOUND)
            }

            await PermissionApiModel.deleteMany({
                permissionId,
            })

            const dataInput = apiIds.map((apiId) => ({ permissionId, apiId }))
            await PermissionApiModel.insertMany(dataInput)
            session.endSession()
            return null
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    },
}

module.exports = systemServices

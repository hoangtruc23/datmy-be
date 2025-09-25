const ApiModel = require('../models/api')
const PermissionModel = require('../models/permission')
const PermissionApiModel = require('../models/permissionApi')
const RoleModel = require('../models/role')
const RolePermissionModel = require('../models/rolePermission')
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
            const checkPermissionId = await PermissionModel.findById(
                permissionId,
                null,
                { session },
            )
            if (!checkPermissionId) {
                throw new BadReq(errorCode.PERMISSION_NOT_FOUND)
            }

            const apis = await ApiModel.find({ _id: { $in: apiIds } }, null, {
                session,
            })
            if (apis.length !== apiIds.length) {
                throw new BadReq(errorCode.API_NOT_FOUND)
            }

            await PermissionApiModel.deleteMany(
                {
                    permissionId,
                },
                { session },
            )

            const dataInput = apiIds.map((apiId) => ({ permissionId, apiId }))
            await PermissionApiModel.insertMany(dataInput, { session })

            await session.commitTransaction()
            session.endSession()
            return null
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    },
    getAllRole: async (query) => {
        try {
            let { page = 1, limit = 10, search } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')

            const [roles, totalRoles] = await Promise.all([
                RoleModel.find({ name: search })
                    .skip((page - 1) * limit)
                    .limit(limit),
                RoleModel.countDocuments({ name: search }),
            ])

            return {
                roles,
                page,
                totalRoles,
                totalPage: Math.ceil(totalRoles / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getRoleById: async (id) => {
        try {
            const checkRole = await RoleModel.findById(id)
            if (!checkRole) {
                throw new BadReq(errorCode.ROLE_NOT_FOUND)
            }

            const role = await RoleModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'rolepermissions',
                        localField: '_id',
                        foreignField: 'roleId',
                        as: 'permissionIds',
                    },
                },
                {
                    $lookup: {
                        from: 'permissions',
                        localField: 'permissionIds.permissionId',
                        foreignField: '_id',
                        pipeline: [
                            {
                                $match: {
                                    parentPermissionId: null,
                                },
                            },
                        ],
                        as: 'parentPermissions',
                    },
                },
                {
                    $lookup: {
                        from: 'permissions',
                        localField: 'permissionIds.permissionId',
                        foreignField: '_id',
                        pipeline: [
                            {
                                $match: { parentPermissionId: { $ne: null } },
                            },
                        ],
                        as: 'childrenPermissions',
                    },
                },
                {
                    $addFields: {
                        permissions: {
                            $map: {
                                input: '$parentPermissions',
                                as: 'parent',
                                in: {
                                    $mergeObjects: [
                                        '$$parent',
                                        {
                                            children: {
                                                $filter: {
                                                    input: '$childrenPermissions',
                                                    as: 'child',
                                                    cond: {
                                                        $eq: [
                                                            '$$child.parentPermissionId',
                                                            '$$parent._id',
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        __v: 0,
                        permissionIds: 0,
                        parentPermissions: 0,
                        childrenPermissions: 0,
                        'permissions.parentPermissionId': 0,
                        'permissions.__v': 0,
                        'permissions.children.parentPermissionId': 0,
                        'permissions.children.__v': 0,
                    },
                },
            ])

            return role
        } catch (error) {
            throw error
        }
    },

    updateRoleById: async (id, reqData) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { parentPermissionIds, name, note } = reqData
            const checkRole = await RoleModel.findById(id, null, { session })
            if (!checkRole) {
                throw new BadReq(errorCode.ROLE_NOT_FOUND)
            }
            const updateFields = {}
            if (name !== undefined) updateFields.name = name
            if (note !== undefined) updateFields.note = note
            if (Object.keys(updateFields).length > 0) {
                await RoleModel.updateOne(
                    { _id: id },
                    { $set: updateFields },
                    { session },
                )
            }
            const data = parentPermissionIds
                .map((parent) => [parent._id, ...parent.childrenPermissionIds])
                .flat()

            const checkPermissionId = await PermissionModel.find(
                {
                    _id: { $in: data },
                },
                null,
                { session },
            )
            if (checkPermissionId.length !== data.length) {
                throw new BadReq(errorCode.PERMISSION_NOT_FOUND)
            }

            for (let parent of parentPermissionIds) {
                const checks = await Promise.all(
                    parent.childrenPermissionIds.map((child) =>
                        PermissionModel.findOne(
                            {
                                _id: child,
                                parentPermissionId: parent._id,
                            },
                            null,
                            { session },
                        ),
                    ),
                )

                if (checks.some((e) => !e)) {
                    throw new BadReq(errorCode.PERMISSION_NOT_SATISFIED)
                }
            }

            const inputData = data.map((permissionId) => ({
                roleId: id,
                permissionId: permissionId,
            }))
            await RolePermissionModel.deleteMany({ roleId: id }, { session })
            await RolePermissionModel.insertMany(inputData, { session })

            await session.commitTransaction()
            session.endSession()
            return null
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    },
    create: async (reqData) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { parentPermissionIds, name, note } = reqData

            const newRole = await RoleModel.create(
                [
                    {
                        name,
                        note,
                    },
                ],
                { session },
            )
            const role = newRole[0]
            const data = parentPermissionIds
                .map((parent) => [parent._id, ...parent.childrenPermissionIds])
                .flat()

            const checkPermissionId = await PermissionModel.find(
                {
                    _id: { $in: data },
                },
                null,
                { session },
            )
            if (checkPermissionId.length !== data.length) {
                throw new BadReq(errorCode.PERMISSION_NOT_FOUND)
            }

            for (let parent of parentPermissionIds) {
                const checks = await Promise.all(
                    parent.childrenPermissionIds.map((child) =>
                        PermissionModel.findOne(
                            {
                                _id: child,
                                parentPermissionId: parent._id,
                            },
                            null,
                            { session },
                        ),
                    ),
                )

                if (checks.some((e) => !e)) {
                    throw new BadReq(errorCode.PERMISSION_NOT_SATISFIED)
                }
            }

            const inputData = data.map((permissionId) => ({
                roleId: role._id,
                permissionId,
            }))
            await RolePermissionModel.insertMany(inputData, { session })

            await session.commitTransaction()
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

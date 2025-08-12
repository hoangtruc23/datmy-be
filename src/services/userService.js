const bcrypt = require('bcryptjs')

const UserModel = require('../models/user')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const RoleModel = require('../models/role')
const { pipeline } = require('winston-daily-rotate-file')

const userService = {
    getAll: async (query) => {
        try {
            let { search, page = 1, limit = 10 } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')
            const [items, totalItem] = await Promise.all([
                UserModel.aggregate([
                    {
                        $match: {
                            username: { $nin: ['root'] },
                            $or: [{ fullname: search }, { username: search }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'roleIds',
                            foreignField: '_id',
                            pipeline: [{ $project: { _id: 0, name: 1 } }],
                            as: 'rolesName',
                        },
                    },
                    {
                        $set: {
                            rolesName: {
                                $map: {
                                    input: '$rolesName',
                                    as: 'role',
                                    in: '$$role.name',
                                },
                            },
                        },
                    },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                ]),
                UserModel.countDocuments({
                    $or: [{ fullname: search }, { username: search }],
                }),
            ])
            return {
                items,
                page,
                totalItem,
                totalPage: Math.ceil(totalItem / limit),
            }
        } catch (error) {
            throw error
        }
    },
    getById: async (userId) => {
        try {
            const user = await UserModel.findById(userId, { password: 0 })
            if (!user) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            return user
        } catch (error) {
            throw error
        }
    },
    create: async (user) => {
        try {
            const {
                fullname,
                username,
                email,
                phoneNumber,
                password,
                roleIds,
            } = user
            const checkUsername = await UserModel.findOne({ username })
            if (checkUsername) {
                throw new BadReq(errorCode.USER_EXISTED)
            }
            const hashPass = await bcrypt.hash(password, 10)
            await UserModel.create({
                fullname,
                username,
                email,
                phoneNumber,
                password: hashPass,
                roleIds,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    update: async (userId, user) => {
        try {
            const { fullname, username, email, phoneNumber, roleIds } = user
            const checkUser = await UserModel.findById(userId)
            if (!checkUser) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            const checkUsername = await UserModel.findOne({
                username,
                _id: { $ne: userId },
            })
            if (checkUsername) {
                throw new BadReq(errorCode.USER_EXISTED)
            }
            await UserModel.findByIdAndUpdate(userId, {
                fullname,
                username,
                email,
                phoneNumber,
                roleIds,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    changePassword: async (userId, newPassowrd) => {
        try {
            const checkUser = await UserModel.findById(userId)
            if (!checkUser) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            const hashPass = await bcrypt.hash(newPassowrd, 10)
            await UserModel.findByIdAndUpdate(userId, {
                password: hashPass,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    changeActiveStatus: async (userId) => {
        try {
            const checkUser = await UserModel.findById(userId)
            if (!checkUser) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            await UserModel.findByIdAndUpdate(userId, {
                isActive: !checkUser.isActive,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    getAllRole: async () => {
        try {
            const roles = await RoleModel.find()
            return roles
        } catch (error) {
            throw error
        }
    },
}

module.exports = userService

const bcrypt = require('bcryptjs')

const UserModel = require('../models/user')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const RoleModel = require('../models/role')
const { pipeline } = require('winston-daily-rotate-file')
const constant = require('../utils/constant/constant')

const userService = {
    getAll: async (reqUserId, query) => {
        try {
            let { search, page = 1, limit = 10 } = query
            page = Number(page)
            limit = Number(limit)
            search = new RegExp(search, 'i')
            const reqUser = await UserModel.findById(reqUserId).lean()
            const reqUserRoleIds = (reqUser.roleIds || [])
                .filter(Boolean)
                .map((id) => id.toString())
            let departments = []
            if (
                reqUser.username !== constant.USER_ROOT &&
                !reqUserRoleIds.includes(constant.ROLES.BGD) &&
                !reqUserRoleIds.includes(constant.ROLES.admin)
            ) {
                if (reqUserRoleIds.includes(constant.ROLES.warehouseManager)) {
                    departments.push(constant.DEPARTMENT.WAREHOUSE)
                }
                if (reqUserRoleIds.includes(constant.ROLES.financeManager)) {
                    departments.push(constant.DEPARTMENT.FINANCE)
                }
                if (reqUserRoleIds.includes(constant.ROLES.technicalManager)) {
                    departments.push(constant.DEPARTMENT.TECHNICAL)
                }
            }
            const departmentFilter = departments.length
                ? { department: { $in: departments } }
                : {}
            const [items, totalItem] = await Promise.all([
                UserModel.aggregate([
                    {
                        $match: {
                            username: { $nin: ['root'] },
                            $or: [{ fullname: search }, { username: search }],
                            ...departmentFilter,
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
                    ...departmentFilter,
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
    checkForbidden: async (reqUserId, checkUser) => {
        try {
            const reqUser = await UserModel.findById(reqUserId).lean()
            if (!reqUser) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }
            const reqUserRoleIds = (reqUser.roleIds || [])
                .filter(Boolean)
                .map((id) => id.toString())
            if (
                reqUser.username === constant.USER_ROOT ||
                reqUserRoleIds.includes(constant.ROLES.BGD) ||
                reqUserRoleIds.includes(constant.ROLES.admin)
            ) {
                return false
            } else if (
                (checkUser.department === constant.DEPARTMENT.WAREHOUSE &&
                    !reqUserRoleIds.includes(
                        constant.ROLES.warehouseManager,
                    )) ||
                (checkUser.department === constant.DEPARTMENT.FINANCE &&
                    !reqUserRoleIds.includes(constant.ROLES.financeManager)) ||
                (checkUser.department === constant.DEPARTMENT.TECHNICAL &&
                    !reqUserRoleIds.includes(constant.ROLES.technicalManager))
            ) {
                return true
            }
            return false
        } catch (error) {
            throw error
        }
    },
    create: async (reqUserId, user) => {
        try {
            const {
                fullname,
                username,
                email,
                phoneNumber,
                password,
                department,
                roleIds,
            } = user
            const checkUsername = await UserModel.findOne({ username })
            if (checkUsername) {
                throw new BadReq(errorCode.USER_EXISTED)
            }

            //nếu người dùng không phải bgđ hoặc quản trị viên thì phải có department
            if (
                !roleIds.includes(constant.ROLES.BGD) &&
                !roleIds.includes(constant.ROLES.admin) &&
                !department
            ) {
                throw new BadReq(errorCode.DEPARTMENT_IS_REQUIRED_FOR_THIS_USER)
            }

            // root, bgđ, qtv được tạo tất cả người dùng
            //quản lý chỉ được tạo người dùng trong phòng ban của mình
            const forbidden = await userService.checkForbidden(reqUserId, user)
            if (forbidden) {
                throw new BadReq(
                    errorCode.CANNOT_CREATE_USER_IN_OTHER_DEPARTMENT,
                )
            }

            const hashPass = await bcrypt.hash(password, 10)
            await UserModel.create({
                fullname,
                username,
                email,
                phoneNumber,
                password: hashPass,
                department,
                roleIds,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    update: async (reqUserId, userId, user) => {
        try {
            const {
                fullname,
                username,
                email,
                phoneNumber,
                department,
                roleIds,
            } = user
            const checkUser = await UserModel.findById(userId)
            if (!checkUser) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }

            // root, bgđ, qtv chỉnh sửa tất cả người dùng
            //quản lý chỉ được chỉnh sửa người dùng trong phòng ban của mình
            const forbidden = await userService.checkForbidden(
                reqUserId,
                checkUser,
            )
            if (forbidden) {
                throw new BadReq(
                    errorCode.CANNOT_UPDATE_USER_IN_OTHER_DEPARTMENT,
                )
            }

            const checkUsername = await UserModel.findOne({
                username,
                _id: { $ne: userId },
            })
            if (checkUsername) {
                throw new BadReq(errorCode.USER_EXISTED)
            }

            //nếu không phải root, bgđ, qtv thì không thể chỉnh department của người dùng
            const reqUser = await UserModel.findById(reqUserId).lean()
            const reqUserRoleIds = (reqUser.roleIds || [])
                .filter(Boolean)
                .map((id) => id.toString())
            if (
                reqUser.username !== constant.USER_ROOT &&
                !reqUserRoleIds.includes(constant.ROLES.BGD) &&
                !reqUserRoleIds.includes(constant.ROLES.admin) &&
                department !== checkUser.department
            ) {
                throw new BadReq(errorCode.NO_PERMISSION_TO_CHANGE_DEPARTMENT)
            }

            await UserModel.findByIdAndUpdate(userId, {
                fullname,
                username,
                email,
                phoneNumber,
                department,
                roleIds,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    changePassword: async (reqUserId, userId, newPassowrd) => {
        try {
            const checkUser = await UserModel.findById(userId)
            if (!checkUser) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }

            // root, bgđ, qtv được đổi mật khẩu tất cả người dùng
            // quản lý chỉ được đổi mật khẩu các người dùng trong phòng ban của mình
            const forbidden = await userService.checkForbidden(
                reqUserId,
                checkUser,
            )
            if (forbidden) {
                throw new BadReq(
                    errorCode.CANNOT_UPDATE_USER_IN_OTHER_DEPARTMENT,
                )
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
    changeActiveStatus: async (reqUserId, userId) => {
        try {
            const checkUser = await UserModel.findById(userId)
            if (!checkUser) {
                throw new BadReq(errorCode.USER_NOT_FOUND)
            }

            const forbidden = await userService.checkForbidden(
                reqUserId,
                checkUser,
            )
            if (forbidden) {
                throw new BadReq(
                    errorCode.CANNOT_UPDATE_USER_IN_OTHER_DEPARTMENT,
                )
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

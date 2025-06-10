const bcrypt = require('bcryptjs')

const UserModel = require('../models/user')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const userService = {
    create: async (user) => {
        try {
            const { fullname, username, email, phoneNumber, password, roles } =
                user
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
                roles,
            })
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = userService

const userService = require('../services/userService')
const response = require('../utils/response/response')

const authController = {
    create: async (req, res, next) => {
        try {
            const user = await userService.create(req.body)
            return res.status(200).json(response.success(user))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = authController

const userService = require('../services/userService')
const response = require('../utils/response/response')

const userController = {
    getAll: async (req, res, next) => {
        try {
            const result = await userService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const { userId } = req.params
            const result = await userService.getById(userId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await userService.create(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { userId } = req.params
            const result = await userService.update(userId, req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            const { userId } = req.params
            const { newPassword } = req.body
            const result = await userService.changePassword(userId, newPassword)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changeActiveStatus: async (req, res, next) => {
        try {
            const { userId } = req.params
            const result = await userService.changeActiveStatus(userId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllRole: async (req, res, next) => {
        try {
            const result = await userService.getAllRole()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = userController

const response = require('../utils/response/response')
const technicianService = require('../services/technicianService')

const technicianController = {
    getAll: async (req, res, next) => {
        try {
            const result = await technicianService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await technicianService.getById(
                req.params.technicianId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getOverall: async (req, res, next) => {
        try {
            const result = await technicianService.getOverall()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await technicianService.create(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await technicianService.update(
                req.params.technicianId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changeActive: async (req, res, next) => {
        try {
            const result = await technicianService.changeActive(
                req.params.technicianId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllTechnicianStatus: (req, res, next) => {
        try {
            const result = technicianService.getAllTechnicianStatus()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    login: async (req, res, next) => {
        try {
            const result = await technicianService.login(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            const result = await technicianService.changPassword(
                req.userId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { technicianId } = req.params
            const result = await technicianService.resetPassword(
                technicianId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getTechnicianLoginDetail: async (req, res, next) => {
        try {
            const result = await technicianService.getTechnicianLoginDetail(
                req.userId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    logout: async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]
            const result = await technicianService.logout(token)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = technicianController

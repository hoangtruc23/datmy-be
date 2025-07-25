const configDebtService = require('../services/configDebtService')
const response = require('../utils/response/response')

const configDebtController = {
    create: async (req, res, next) => {
        try {
            const config = await configDebtService.create(req.body)
            return res.status(200).json(response.success(config))
        } catch (err) {
            next(err)
        }
    },

    update: async (req, res, next) => {
        try {
            const config = await configDebtService.update(
                req.params.id,
                req.body,
            )
            return res.status(200).json(response.success(config))
        } catch (err) {
            next(err)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const { page, limit, search } = req.query
            const data = await configDebtService.getAll(page, limit, search)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getById: async (req, res, next) => {
        try {
            const config = await configDebtService.getById(req.params.id)
            return res.status(200).json(response.success(config))
        } catch (err) {
            next(err)
        }
    },

    delete: async (req, res, next) => {
        try {
            await configDebtService.delete(req.params.id)
            return res.status(200).json(response.success(null))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = configDebtController
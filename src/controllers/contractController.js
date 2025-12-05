const contractService = require('../services/contractService')
const response = require('../utils/response/response')

const contractController = {
    getOverview: async (req, res, next) => {
        try {
            const result = await contractService.getOverview(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const result = await contractService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const result = await contractService.getById(req.params)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await contractService.create(req.body)
            return res.status(201).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await contractService.update(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = contractController

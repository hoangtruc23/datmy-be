const invoiceService = require('../services/invoiceService')
const response = require('../utils/response/response')

const invoiceController = {
    create: async (req, res, next) => {
        try {
            const inv = await invoiceService.create(req.body)
            return res.status(200).json(response.success(inv))
        } catch (err) {
            next(err)
        }
    },

    update: async (req, res, next) => {
        try {
            const inv = await invoiceService.update(req.params.id, req.body)
            return res.status(200).json(response.success(inv))
        } catch (err) {
            next(err)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const { page, limit, search, status } = req.query
            const data = await invoiceService.getAll(page, limit, search, status)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getById: async (req, res, next) => {
        try {
            const inv = await invoiceService.getById(req.params.id)
            return res.status(200).json(response.success(inv))
        } catch (err) {
            next(err)
        }
    },

    delete: async (req, res, next) => {
        try {
            await invoiceService.delete(req.params.id)
            return res.status(200).json(response.success(null))
        } catch (err) {
            next(err)
        }
    },
    getSummary: async (req, res, next) => {
        try {
            const summary = await invoiceService.getSummary()
            return res.status(200).json(response.success(summary))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = invoiceController

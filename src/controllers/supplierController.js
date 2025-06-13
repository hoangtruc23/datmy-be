const supplierService = require('../services/supplierService')
const response = require('../utils/response/response')

const supplierController = {
    create: async (req, res, next) => {
        try {
            const supplier = await supplierService.create(req.body)
            return res.status(200).json(response.success(supplier))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params
            const supplier = await supplierService.update(id, req.body)
            return res.status(200).json(response.success(supplier))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params
            await supplierService.delete(id)
            return res
                .status(200)
                .json(response.success(null, 'Xóa nhà cung cấp thành công'))
        } catch (error) {
            next(error)
        }
    },

    getById: async (req, res, next) => {
        try {
            const { id } = req.params
            const supplier = await supplierService.getById(id)
            return res.status(200).json(response.success(supplier))
        } catch (error) {
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const { page, limit, search } = req.query
            const suppliers = await supplierService.getAll(page, limit, search)
            return res.status(200).json(response.success(suppliers))
        } catch (error) {
            next(error)
        }
    },

    lockUnlock: async (req, res, next) => {
        try {
            const { id } = req.params
            const { isActive } = req.body
            const supplier = await supplierService.lockUnlock(id, isActive)
            return res.status(200).json(response.success(supplier))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = supplierController

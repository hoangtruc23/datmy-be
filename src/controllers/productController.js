const productService = require('../services/productService')
const response = require('../utils/response/response')

const productController = {
    create: async (req, res, next) => {
        try {
            const product = await productService.create(req.body)
            return res.status(200).json(response.success(product))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const product = await productService.update(req.params.id, req.body)
            return res.status(200).json(response.success(product))
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const { page, limit, search, categoryId } = req.query
            const products = await productService.getAll(
                page,
                limit,
                search,
                categoryId,
            )
            return res.status(200).json(response.success(products))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const product = await productService.getById(req.params.id)
            return res.status(200).json(response.success(product))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const product = await productService.delete(req.params.id)
            return res.status(200).json(response.success(product))
        } catch (error) {
            next(error)
        }
    },
    lockUnlock: async (req, res, next) => {
        try {
            const product = await productService.lockUnlock(req.params.id)
            return res.status(200).json(response.success(product))
        } catch (error) {
            next(error)
        }
    },
    getAllUnit: async (req, res, next) => {
        try {
            const units = await productService.getAllUnit()
            return res.status(200).json(response.success(units))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = productController

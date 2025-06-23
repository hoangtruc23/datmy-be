const productCategoryService = require('../services/productCategoryService')
const response = require('../utils/response/response')

const productCategoryController = {
    create: async (req, res, next) => {
        try {
            const productCategory = await productCategoryService.create(
                req.body,
            )
            return res.status(200).json(response.success(productCategory))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params
            const productCategory = await productCategoryService.update(
                id,
                req.body,
            )
            return res.status(200).json(response.success(productCategory))
        } catch (error) {
            next(error)
        }
    },

    getById: async (req, res, next) => {
        try {
            const { id } = req.params
            const productCategory = await productCategoryService.getById(id)
            return res.status(200).json(response.success(productCategory))
        } catch (error) {
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const { page, limit, search } = req.query
            const productCategory = await productCategoryService.getAll(
                page,
                limit,
                search,
            )
            return res.status(200).json(response.success(productCategory))
        } catch (error) {
            next(error)
        }
    },

    lockUnlock: async (req, res, next) => {
        try {
            const { id } = req.params
            const productCategory = await productCategoryService.lockUnlock(id)
            return res.status(200).json(response.success(productCategory))
        } catch (error) {
            next(error)
        }
    },
    getAllProductCategoryId: async (req, res, next) => {
        try {
            const productCategory =
                await productCategoryService.getAllProductCategoryId()
            return res.status(200).json(response.success(productCategory))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = productCategoryController

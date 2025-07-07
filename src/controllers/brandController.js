const brandService = require('../services/brandService')
const response = require('../utils/response/response')

const brandController = {
    create: async (req, res, next) => {
        try {
            const brand = await brandService.create(req.body)
            return res.status(200).json(response.success(brand))
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const brands = await brandService.getAll(req.query)
            return res.status(200).json(response.success(brands))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const brand = await brandService.getById(req.params.brandId)
            return res.status(200).json(response.success(brand))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const result = await brandService.update(
                req.params.brandId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changeActive: async (req, res, next) => {
        try {
            const result = await brandService.changeActive(req.params.brandId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const result = await brandService.delete(req.params.brandId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = brandController

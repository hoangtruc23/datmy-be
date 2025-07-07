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
    getTotalQuantityByProductId: async (req, res, next) => {
        try {
            const { productId, warehouseId, safetyQuantity } = req.query
            const totalQuantity =
                await productService.getTotalQuantityByProductId(
                    productId,
                    warehouseId,
                    safetyQuantity,
                )
            return res.status(200).json(response.success(totalQuantity))
        } catch (error) {
            next(error)
        }
    },
    getAllWithQuantity: async (req, res, next) => {
        try {
            const {
                page,
                limit,
                search,
                categoryId,
                warehouseId,
                isSafeFilter,
            } = req.query
            const products = await productService.getAllWithQuantity(
                page,
                limit,
                search,
                categoryId,
                warehouseId,
                isSafeFilter,
            )
            return res.status(200).json(response.success(products))
        } catch (error) {
            next(error)
        }
    },
    getProductStorages: async (req, res, next) => {
        try {
            const { productId, warehouseId, hasQuantity } = req.query

            const productStorages = await productService.getProductStorages({
                productId,
                warehouseId,
                hasQuantity,
            })

            return res.status(200).json(response.success(productStorages))
        } catch (error) {
            next(error)
        }
    },
    getReceiptByTrackingCode: async (req, res, next) => {
        try {
            const { trackingCode } = req.query
            const receipt =
                await productService.getReceiptByTrackingCode(trackingCode)
            return res.status(200).json(response.success(receipt))
        } catch (error) {
            next(error)
        }
    },
    getIssueByTrackingCode: async (req, res, next) => {
        try {
            const { trackingCode } = req.query
            const issue =
                await productService.getIssueByTrackingCode(trackingCode)
            return res.status(200).json(response.success(issue))
        } catch (error) {
            next(error)
        }
    },
    getAdvanceByTrackingCode: async (req, res, next) => {
        try {
            const { trackingCode } = req.query
            const goodsAdvance =
                await productService.getAdvanceByTrackingCode(trackingCode)
            return res.status(200).json(response.success(goodsAdvance))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = productController

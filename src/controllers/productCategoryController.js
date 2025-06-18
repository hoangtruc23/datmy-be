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
}

module.exports = productCategoryController

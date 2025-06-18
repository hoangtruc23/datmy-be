const ProductCategoryModel = require('../models/productCategory')
const productCategoryService = {
    create: async (productCategory) => {
        try {
            const {
                name,
                description,
                image,
                isActive = true,
            } = productCategory

            await ProductCategoryModel.create({
                name,
                description,
                image,
                isActive,
            })
            return null
        } catch (error) {
            throw error
        }
    },
}

module.exports = productCategoryService

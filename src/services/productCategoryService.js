const ProductCategoryModel = require('../models/productCategory')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

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

    update: async (id, productCategory) => {
        try {
            const current = await ProductCategoryModel.findById(id)
            if (!current) {
                throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            }
            current.set(productCategory)
            const updated = await current.save()
            return updated
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            const productCategory = await ProductCategoryModel.findById(id)
            if (!productCategory) {
                throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            }
            return productCategory
        } catch (error) {
            throw error
        }
    },

    getAll: async (page = 1, limit = 10, search = '') => {
        try {
            page = parseInt(page, 10)
            limit = parseInt(limit, 10)
            const skip = (page - 1) * limit

            const filter = {}
            if (search && typeof search === 'string' && search.trim() !== '') {
                const regex = new RegExp(search.trim(), 'i')
                filter.$or = [{ name: regex }]
            }

            const [items, total] = await Promise.all([
                ProductCategoryModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                ProductCategoryModel.countDocuments(filter),
            ])

            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages }
        } catch (error) {
            throw error
        }
    },

    lockUnlock: async (id) => {
        try {
            const productCateory = await ProductCategoryModel.findById(id)
            if (!productCateory) {
                throw new BadReq(errorCode.PRODUCT_CATEGORY_NOT_FOUND)
            }

            productCateory.isActive = !productCateory.isActive
            await productCateory.save()
            return productCateory.isActive
        } catch (error) {
            throw error
        }
    },
    getAllProductCategoryId: async () => {
        try {
            const productCategory = await ProductCategoryModel.find({}).select(
                '_id name',
            )
            return productCategory
        } catch (error) {
            throw error
        }
    },
}

module.exports = productCategoryService

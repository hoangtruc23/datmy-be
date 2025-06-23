const ProductModel = require('../models/product')
const UnitModel = require('../models/unit')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const { Types } = require('mongoose')

const productCategoryService = {
    create: async (product) => {
        try {
            const {
                managementType,
                categoryId,
                brand,
                name,
                shortName,
                code,
                unit,
                safetyQuantity,
                isWarranty = true,
                specification,
                description,
                image,
                isHasProduct = false,
                isActive = true,
            } = product
            const checkCode = await ProductModel.findOne({ code })
            if (checkCode) {
                throw new BadReq(errorCode.PRODUCT_CODE_EXISTED)
            }
            await ProductModel.create({
                managementType,
                categoryId,
                brand,
                name,
                shortName,
                code,
                unit,
                safetyQuantity,
                isWarranty,
                specification,
                description,
                image,
                isHasProduct,
                isActive,
            })

            return null
        } catch (error) {
            throw error
        }
    },

    update: async (id, product) => {
        try {
            const {
                managementType,
                categoryId,
                brand,
                name,
                shortName,
                code,
                unit,
                safetyQuantity,
                isWarranty = true,
                specification,
                description,
                image,
                isActive,
            } = product

            const currentProduct = await ProductModel.findById(id)

            if (!currentProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }

            if (code && code !== currentProduct.code) {
                const conflict = await ProductModel.findOne({
                    code: code,
                })
                if (conflict) {
                    throw new BadReq(errorCode.PRODUCT_CODE_EXISTED)
                }
            }

            if (
                currentProduct.isHasProduct &&
                managementType !== currentProduct.managementType
            ) {
                throw new BadReq(
                    errorCode.PRODUCT_CANNOT_CHANGE_MANAGEMENT_TYPE,
                )
            }

            await ProductModel.findByIdAndUpdate(id, {
                managementType,
                categoryId,
                brand,
                name,
                shortName,
                code,
                unit,
                safetyQuantity,
                isWarranty,
                specification,
                description,
                image,
                isActive,
            })

            return null
        } catch (error) {
            throw error
        }
    },

    getAll: async (page = 1, limit = 10, search = '', categoryId = '') => {
        try {
            page = parseInt(page, 10)
            limit = parseInt(limit, 10)
            const skip = (page - 1) * limit

            const filter = {}
            if (search && typeof search === 'string' && search.trim() !== '') {
                const regex = new RegExp(search.trim(), 'i')
                filter.$or = [
                    { name: regex },
                    { shortName: regex },
                    { code: regex },
                ]
            }

            if (categoryId && Types.ObjectId.isValid(categoryId)) {
                filter.categoryId = categoryId
            }
            const [items, total] = await Promise.all([
                ProductModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .select(' code name shortname image isActive'),
                ProductModel.countDocuments(filter),
            ])

            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages }
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            const product = await ProductModel.findById(id)
            if (!product) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            return product
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const product = await ProductModel.findByIdAndDelete(id)
            if (!product) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            return null
        } catch (error) {
            throw error
        }
    },
    lockUnlock: async (id) => {
        try {
            const product = await ProductModel.findById(id, '_id isActive')
            if (!product) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }

            product.isActive = !product.isActive
            await product.save()

            return null
        } catch (error) {
            throw error
        }
    },

    getAllUnit: async () => {
        try {
            const units = await UnitModel.find()
            return units
        } catch (error) {
            throw error
        }
    },
}

module.exports = productCategoryService

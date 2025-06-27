const ProductModel = require('../models/product')
const ProductStorageModel = require('../models/productStorage')
const WarehouseModel = require('../models/warehouses')
const GoodsReceiptDetailModel = require('../models/goodsReceiptDetail')
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
                    .select(
                        ' code name shortname image safetyQuantity isActive ',
                    ),
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

    getTotalQuantityByProductId: async (
        productId,
        warehouseId = '',
        safetyQuantity = 0,
    ) => {
        const filter = { productId }

        if (warehouseId) {
            filter.warehouseId = warehouseId
        }

        const productStorages = await ProductStorageModel.find(filter)

        const totalQuantity = productStorages.reduce((sum, item) => {
            return sum + (item.quantity || 0)
        }, 0)
        isSafe = totalQuantity >= safetyQuantity
        return {
            isSafe,
            totalQuantity,
        }
    },

    getAllWithQuantity: async (
        page = 1,
        limit = 10,
        search = '',
        categoryId = '',
        warehouseId = '',
        isSafeFilter = '',
    ) => {
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

            const [products, total] = await Promise.all([
                ProductModel.find(filter)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .select(
                        'code name shortName image safetyQuantity isActive',
                    ),
                ProductModel.countDocuments(filter),
            ])

            //đến đây, tạo ra được 1 danh sách như getAll
            const productIds = products.map((p) => p._id)

            const storageFilter = {
                productId: { $in: productIds },
            }

            if (warehouseId && Types.ObjectId.isValid(warehouseId)) {
                storageFilter.warehouseId = warehouseId
            }

            const productStorages =
                await ProductStorageModel.find(storageFilter)

            const quantityMap = {}
            for (let item of productStorages) {
                const id = item.productId.toString()
                quantityMap[id] = (quantityMap[id] || 0) + (item.quantity || 0)
            }

            const items = products
                .map((product) => {
                    const totalQuantity =
                        quantityMap[product._id.toString()] || 0
                    const isSafe = totalQuantity >= product.safetyQuantity

                    return {
                        _id: product._id,
                        code: product.code,
                        name: product.name,
                        shortName: product.shortName,
                        image: product.image,
                        isActive: product.isActive,
                        safetyQuantity: product.safetyQuantity,
                        totalQuantity,
                        isSafe,
                    }
                })
                .filter((item) => {
                    if (isSafeFilter === 'true') return item.isSafe
                    if (isSafeFilter === 'false') return !item.isSafe
                    return true
                })
            const totalPages = Math.ceil(total / limit)
            return { items, total, page, limit, totalPages }
        } catch (error) {
            throw error
        }
    },

    getProductStorages: async ({
        productId = '',
        warehouseId = '',
        hasQuantity = true,
    }) => {
        try {
            const filter = {}

            const [checkProduct] = await Promise.all([
                ProductModel.findById(productId),
            ])
            if (!checkProduct) {
                throw new BadReq(errorCode.PRODUCT_NOT_FOUND)
            }
            filter.productId = productId

            if (warehouseId) {
                const [checkWarehouse] = await Promise.all([
                    WarehouseModel.findById(warehouseId),
                ])
                if (!checkWarehouse) {
                    throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
                }
                filter.warehouseId = warehouseId
            }

            if (hasQuantity === false || hasQuantity === 'false') {
                filter.quantity = { $eq: 0 }
            } else {
                filter.quantity = { $gt: 0 }
            }

            const storages = await ProductStorageModel.find(filter).select(
                'trackingCode warehouseId quantity',
            )
            return storages
        } catch (error) {
            throw error
        }
    },

    getReceiptByTrackingCode: async (trackingCode) => {
        try {
            const goodsReceiptId = await GoodsReceiptDetailModel.findOne({
                'storages.trackingCode': trackingCode,
            }).select('goodsReceiptId')

            if (!goodsReceiptId) {
                throw new BadReq(errorCode.TRACKING_CODE_NOT_FOUND)
            }

            return goodsReceiptId
        } catch (error) {
            throw error
        }
    },
}

module.exports = productCategoryService

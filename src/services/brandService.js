const BrandModel = require('../models/brand')
const BadReq = require('../utils/response/requestError')
const errorCode = require('../utils/response/errorCode')

const brandService = {
    create: async (bodyData) => {
        try {
            const checkName = await BrandModel.findOne({ name: bodyData.name })
            if (checkName) {
                throw new BadReq(errorCode.BRAND_EXISTED)
            }
            const brand = await BrandModel.create({ ...bodyData })
            return brand
        } catch (error) {
            throw error
        }
    },
    getAll: async (query) => {
        try {
            let { search, page = 1, limit = 10 } = query
            search = RegExp(search, 'i')
            page = Number(page)
            limit = Number(limit)

            const [brands, totalBrands] = await Promise.all([
                BrandModel.find({ name: search })
                    .skip((page - 1) * limit)
                    .limit(limit),
                BrandModel.countDocuments({ name: search }),
            ])

            const res = {
                brands,
                page,
                totalBrands,
                totalPage: Math.ceil(totalBrands / limit),
            }
            return res
        } catch (error) {
            throw error
        }
    },
    getById: async (id) => {
        try {
            const brand = await BrandModel.findById(id)
            if (!brand) {
                throw new BadReq(errorCode.BRAND_NOT_FOUND)
            }
            return brand
        } catch (error) {
            throw error
        }
    },
    update: async (id, bodyData) => {
        try {
            const brand = await BrandModel.findById(id)
            if (!brand) {
                throw new BadReq(errorCode.BRAND_NOT_FOUND)
            }

            const checkName = await BrandModel.findOne({
                name: bodyData.name,
                _id: { $ne: id },
            })
            if (checkName) {
                throw new BadReq(errorCode.BRAND_EXISTED)
            }

            await BrandModel.findByIdAndUpdate(id, { ...bodyData })
            return null
        } catch (error) {
            throw error
        }
    },
    changeActive: async (id) => {
        try {
            const brand = await BrandModel.findById(id)
            if (!brand) {
                throw new BadReq(errorCode.BRAND_NOT_FOUND)
            }

            const oldState = brand.isActive
            await BrandModel.findByIdAndUpdate(id, { isActive: !oldState })
            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const brand = await BrandModel.findById(id)
            if (!brand) {
                throw new BadReq(errorCode.BRAND_NOT_FOUND)
            }

            await BrandModel.findByIdAndDelete(id)
            return null
        } catch (error) {
            throw error
        }
    },
}
module.exports = brandService

const WareHousesModel = require('../models/warehouses')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')
const warehousesService = {
    getAll: async (query) => {
        try {
            let { search, page = 1, limit = 10 } = query
            search = RegExp(search, 'i')
            page = Number(page)
            limit = Number(limit)

            const [items, totalItem] = await Promise.all([
                WareHousesModel.find({ name: search })
                    .skip((page - 1) * limit)
                    .limit(limit),
                WareHousesModel.countDocuments({ name: search }),
            ])

            return {
                items,
                page,
                totalItem,
                totalPage: Math.ceil(totalItem / limit),
            }
        } catch (error) {
            throw error
        }
    },
    create: async (warehouse) => {
        try {
            const { name, detail } = warehouse
            const checkName = await WareHousesModel.findOne({ name: name })
            if (checkName) {
                throw new BadReq(errorCode.WAREHOUSE_EXISTED)
            }
            const data = {
                name: name,
                detail: detail,
                isActive: true,
            }
            await WareHousesModel.create(data)
            return null
        } catch (error) {
            throw error
        }
    },
    getById: async (id) => {
        try {
            const warehouse = await WareHousesModel.findById(id)
            if (!warehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            return warehouse
        } catch (error) {
            throw error
        }
    },
}
module.exports = warehousesService

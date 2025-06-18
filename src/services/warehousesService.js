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
            const { name, description } = warehouse
            const checkName = await WareHousesModel.findOne({ name: name })
            if (checkName) {
                throw new BadReq(errorCode.WAREHOUSE_EXISTED)
            }
            const data = {
                name: name,
                description: description,
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
    update: async (id, reqData) => {
        try {
            const { name, description } = reqData
            const warehouse = await WareHousesModel.findById(id)
            if (!warehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            const checkName = await WareHousesModel.findOne({
                name: name,
                _id: { $ne: id },
            })
            if (checkName) {
                throw new BadReq(errorCode.WAREHOUSE_EXISTED)
            }

            await WareHousesModel.findByIdAndUpdate(id, {
                name,
                description,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const warehouse = await WareHousesModel.findById(id)
            if (!warehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            await WareHousesModel.findByIdAndDelete(id)
            return null
        } catch (error) {
            throw error
        }
    },
    changeActive: async (id) => {
        try {
            const warehouse = await WareHousesModel.findById(id)
            if (!warehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            const oldState = warehouse.isActive
            await WareHousesModel.findByIdAndUpdate(id, { isActive: !oldState })
            return null
        } catch (error) {
            throw error
        }
    },
}
module.exports = warehousesService

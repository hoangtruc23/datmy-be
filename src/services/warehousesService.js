const WarehouseModel = require('../models/warehouses')
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
                WarehouseModel.find({ name: search })
                    .skip((page - 1) * limit)
                    .limit(limit),
                WarehouseModel.countDocuments({ name: search }),
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
            const { name, description, address } = warehouse
            const checkName = await WarehouseModel.findOne({ name: name })
            if (checkName) {
                throw new BadReq(errorCode.WAREHOUSE_EXISTED)
            }
            const data = {
                name: name,
                description: description,
                address: address,
            }
            await WarehouseModel.create(data)
            return null
        } catch (error) {
            throw error
        }
    },
    getById: async (id) => {
        try {
            const warehouse = await WarehouseModel.findById(id)
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
            const { name, description, address } = reqData
            const warehouse = await WarehouseModel.findById(id)
            if (!warehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            const checkName = await WarehouseModel.findOne({
                name: name,
                _id: { $ne: id },
            })
            if (checkName) {
                throw new BadReq(errorCode.WAREHOUSE_EXISTED)
            }

            await WarehouseModel.findByIdAndUpdate(id, {
                name,
                description,
                address,
            })
            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const warehouse = await WarehouseModel.findById(id)
            if (!warehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            await WarehouseModel.findByIdAndDelete(id)
            return null
        } catch (error) {
            throw error
        }
    },
    changeActive: async (id) => {
        try {
            const warehouse = await WarehouseModel.findById(id)
            if (!warehouse) {
                throw new BadReq(errorCode.WAREHOUSE_NOT_FOUND)
            }
            const oldState = warehouse.isActive
            await WarehouseModel.findByIdAndUpdate(id, { isActive: !oldState })
            return null
        } catch (error) {
            throw error
        }
    },
}
module.exports = warehousesService

const warehouseService = require('../services/warehousesService')
const response = require('../utils/response/response')

const warehouseController = {
    getAll: async (req, res, next) => {
        try {
            const warehouses = await warehouseService.getAll(req.query)
            return res.status(200).json(response.success(warehouses))
        } catch (error) {
            next(error)
        }
    },
    create: async (req, res, next) => {
        try {
            const warehouse = await warehouseService.create(req.body)
            return res.status(200).json(response.success(warehouse))
        } catch (error) {
            next(error)
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = req.params.warehouseID
            const warehouse = await warehouseService.getById(id)
            return res.status(200).json(response.success(warehouse))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.warehouseID
            const result = await warehouseService.update(id, req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.warehouseID
            const result = await warehouseService.delete(id)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changeActive: async (req, res, next) => {
        try {
            const id = req.params.warehouseID
            const result = await warehouseService.changeActive(id)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = warehouseController

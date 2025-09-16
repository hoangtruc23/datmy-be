const productTransferHistoryService = require('../services/productTranferHistoryService')
const response = require('../utils/response/response')

const productTransferHistoryController = {
    getAll: async (req, res, next) => {
        try {
            const histories = await productTransferHistoryService.getAll(req.query)
            return res.status(200).json(response.success(histories))
        } catch (error) {
            next(error)
        }
    },
    transferProduct: async (req, res, next) => {
        try {
            const result = await productTransferHistoryService.transferProduct(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = productTransferHistoryController

  
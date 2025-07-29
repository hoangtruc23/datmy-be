const debtService = require('../services/debtService')
const response = require('../utils/response/response')

const debtController = {
    getAll: async (req, res, next) => {
        try {
            const { page, limit, search, debtStatus } = req.query
            const data = await debtService.getAll(
                page,
                limit,
                search,
                debtStatus,
            )
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
    getSummary: async (req, res, next) => {
        try {
            const data = await debtService.getSummary()
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = debtController

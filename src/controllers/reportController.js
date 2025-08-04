const reportService = require('../services/reportService')
const response = require('../utils/response/response')

const reportController = {
    getDebtComparisonSummary: async (req, res, next) => {
        try {
            const data = await reportService.getDebtComparisonSummary(req.query)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getDebtComparisonDetail: async (req, res, next) => {
        try {
            const data = await reportService.getDebtComparisonDetail(req.query)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = reportController
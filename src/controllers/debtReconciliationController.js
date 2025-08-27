const debtReconciliationService = require('../services/debtReconciliationService')
const response = require('../utils/response/response')

const debtReconciliationController = {
    getDebtComparisonSummary: async (req, res, next) => {
        try {
            const data =
                await debtReconciliationService.getDebtComparisonSummary(
                    req.query,
                )
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getDebtComparisonDetail: async (req, res, next) => {
        try {
            const data =
                await debtReconciliationService.getDebtComparisonDetail(
                    req.query,
                )
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = debtReconciliationController

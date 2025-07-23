const debtService = require('../services/debtService')
const response = require('../utils/response/response')

const debtController = {
    getAll: async (req, res, next) => {
        try {
            const { page, limit, search } = req.query
            const data = await debtService.getAll(page, limit, search)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = debtController

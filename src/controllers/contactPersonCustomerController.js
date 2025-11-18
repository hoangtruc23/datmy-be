const contactPersonCustomerServices = require('../services/contactPersonCustomerService')
const response = require('../utils/response/response')

const contactPersonCustomerController = {
    getAll: async (req, res, next) => {
        try {
            const result = await contactPersonCustomerServices.getAll(
                req.params.customerId,
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const result = await contactPersonCustomerServices.delete(
                req.params.customerId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}
module.exports = contactPersonCustomerController

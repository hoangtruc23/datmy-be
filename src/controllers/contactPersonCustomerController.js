const contactPersonCustomerServices = require('../services/contactPersonCustomerService')
const response = require('../utils/response/response')

const contactPersonCustomerController = {
    getAllPerson: async (req, res, next) => {
        try {
            const result = await contactPersonCustomerServices.getAllPerson(
                req.params.customerId,
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllAddress: async (req, res, next) => {
        try {
            const result = await contactPersonCustomerServices.getAllAddress(
                req.params.customerId,
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    deletePerson: async (req, res, next) => {
        try {
            const result = await contactPersonCustomerServices.deletePerson(
                req.params.customerId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    deleteAddress: async (req, res, next) => {
        try {
            const result = await contactPersonCustomerServices.deleteAddress(
                req.params.customerId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getSerialNumber: async (req, res, next) => {
        try {
            const result = await contactPersonCustomerServices.getSerialNumber(req.params, req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    }
}
module.exports = contactPersonCustomerController

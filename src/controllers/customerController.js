// src/controllers/cusController.js

const customerService = require('../services/customerService')
const response = require('../utils/response/response')

const customerController = {
    create: async (req, res, next) => {
        try {
            const result = await customerService.create(req.body)
            // On successful creation, we return a 201 status code
            return res.status(201).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params
            const result = await customerService.update(id, req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = customerController

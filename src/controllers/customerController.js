// src/controllers/partnerController.js

const partnerService = require('../services/customerService')
const response = require('../utils/response/response')

const partnerController = {
    create: async (req, res, next) => {
        try {
            const result = await partnerService.create(req.body)
            // On successful creation, we return a 201 status code
            return res.status(201).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = partnerController
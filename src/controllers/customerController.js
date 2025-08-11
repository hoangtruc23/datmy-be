// src/controllers/customerController.js

const { error } = require('winston')
const customerService = require('../services/customerService')
const response = require('../utils/response/response')
const { getAllDistricts } = require('./supplierController')

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
    getById: async (req, res, next) => {
        try {
            const { id } = req.params
            const result = await customerService.getById(id, req.userId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const result = await customerService.getAll(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllCities: async (req, res, next) => {
        try {
            const result = await customerService.getAllCities()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },

    getAllDistricts: async (req, res, next) => {
        try {
            const result = await customerService.getAllDistricts()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    changeActiveStatus: async (req, res, next) => {
        try {
            const { id } = req.params
            const result = await customerService.changeActiveStatus(id)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params
            await customerService.delete(id)
            return res
                .status(200)
                .json(response.success(null, 'Xóa khách hàng thành công'))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = customerController

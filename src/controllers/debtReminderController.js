const debtReminderService = require('../services/debtReminderService')
const response = require('../utils/response/response')
const constant = require('../utils/constant/constant')
const debtReminderController = {
    create: async (req, res, next) => {
        try {
            const reminder = await debtReminderService.create(req.body)
            return res.status(200).json(response.success(reminder))
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try {
            const reminder = await debtReminderService.update(
                req.params.id,
                req.body,
            )
            return res.status(200).json(response.success(reminder))
        } catch (err) {
            next(err)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const { page, limit, search, status, priority } = req.query
            const data = await debtReminderService.getAll(
                page,
                limit,
                search,
                status,
                priority,
            )
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getAllHistory: async (req, res, next) => {
        try {
            const { page, limit, search } = req.query
            const data = await debtReminderService.getAllHistory(
                page,
                limit,
                search,
            )
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
    getById: async (req, res, next) => {
        try {
            const reminder = await debtReminderService.getById(req.params.id)
            return res.status(200).json(response.success(reminder))
        } catch (err) {
            next(err)
        }
    },
    delete: async (req, res, next) => {
        try {
            await debtReminderService.delete(req.params.id)
            return res.status(200).json(response.success(null))
        } catch (err) {
            next(err)
        }
    },

    getDebtReminderPriority: async (req, res) => {
        try {
            res.status(200).json(constant.DEBT_REMINDER_PRIORITY)
        } catch (err) {
            next(err)
        }
    },

    getDebtResult: async (req, res) => {
        try {
            res.status(200).json(constant.DEBT_RESULT)
        } catch (err) {
            next(err)
        }
    },

    getDebtReminderMethod: async (req, res) => {
        try {
            res.status(200).json(constant.DEBT_REMINDER_METHOD)
        } catch (err) {
            next(err)
        }
    },
    checkCompleted: async (req, res, next) => {
        try {
            await debtReminderService.checkCompleted(req.params.id)
            return res.status(200).json(response.success(null))
        } catch (err) {
            next(err)
        }
    },
    getSumHistory: async (req, res, next) => {
        try {
            const data = await debtReminderService.getSumHistory()
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getSummary: async (req, res, next) => {
        try {
            const summary = await debtReminderService.getSummary()
            return res.status(200).json(response.success(summary))
        } catch (err) {
            next(err)
        }
    },
}

module.exports = debtReminderController

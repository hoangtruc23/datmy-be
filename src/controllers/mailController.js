const mailService = require('../services/mailService')
const response = require('../utils/response/response')

const mailController = {
    configMailServer: async (req, res, next) => {
        try {
            const result = await mailService.configMailServer(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    configMailReceiver: async (req, res, next) => {
        try {
            const result = await mailService.configMailReceiver(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    sendMail: async (req, res, next) => {
        try {
            const result = await mailService.sendMail(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getInfo: async (req, res, next) => {
        try {
            const result = await mailService.getInfo()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = mailController

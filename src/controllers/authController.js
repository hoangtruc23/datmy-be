const authService = require('../services/authService')
const response = require('../utils/response/response')

const authController = {
    login: async (req, res, next) => {
        try {
            const { username, password } = req.body
            const accessToken = await authService.login(username, password)
            return res.status(200).json(response.success(accessToken))
        } catch (error) {
            next(error)
        }
    },
    getUserLoginDetail: async (req, res, next) => {
        try {
            const user = await authService.getUserLoginDetail(req.userId)
            return res.status(200).json(response.success(user))
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            const { newPassword } = req.body
            const changePassword = await authService.changePassword(
                req.userId,
                newPassword,
            )
            return res.status(200).json(response.success(changePassword))
        } catch (error) {
            next(error)
        }
    },
    logout: async (req, res, next) => {
        try {
            const logout = await authService.logout(req.userId)
            return res.status(200).json(response.success(logout))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = authController

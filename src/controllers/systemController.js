const systemService = require('../services/systemServices')
const response = require('../utils/response/response')

const systemController = {
    getAllApi: async (req, res, next) => {
        try {
            const result = await systemService.getAllApi(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPermission: async (req, res, next) => {
        try {
            const result = await systemService.getAllPermission(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPermissionApi: async (req, res, next) => {
        try {
            const result = await systemService.getAllPermissionApi(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getPermissionApiById: async (req, res, next) => {
        try {
            const result = await systemService.getPermissionApiById(
                req.params.permissionId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    updatePermissionApi: async (req, res, next) => {
        try {
            const result = await systemService.updatePermissionApi(
                req.params.permissionId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllRole: async (req, res, next) => {
        try {
            const result = await systemService.getAllRole(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getRoleById: async (req, res, next) => {
        try {
            const result = await systemService.getRoleById(req.params.roleId)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    updateRoleById: async (req, res, next) => {
        try {
            const result = await systemService.updateRoleById(
                req.params.roleId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    createRole: async (req, res, next) => {
        try {
            const result = await systemService.createRole(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    createPermission: async (req, res, next) => {
        try {
            const result = await systemService.createPermission(req.body)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllParentPermission: async (req, res, next) => {
        try {
            const result = await systemService.getAllParentPermission()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.roleId
            const result = await systemService.delete(id)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
}

module.exports = systemController

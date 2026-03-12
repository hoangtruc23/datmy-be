const response = require('../utils/response/response')
const workOrderDetailService = require('../services/workOrderDetailService')

const workOrderDetailController = {
    getByWorkOrderId: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getByWorkOrderId(
                req.params.workOrderId,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    updateMachineTypeId: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.updateMachineTypeId(
                req.params.workOrderId,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    updateData: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.updateData(
                req.params.workOrderId,
                req.query,
                req.body,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllRepairFault: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllRepairFault(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPrintHeaderFault: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllPrintHeaderFault(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllInkSystemFault: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllInkSystemFault(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllElectricalSystemFault: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllElectricalSystemFault(
                    req.query,
                )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllResolution: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllResolution(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllMaintainOperations: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllMaintainOperations(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPowerControl: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllPowerControl(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPrintProgramming: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllPrintProgramming(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPrintSetting: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllPrintSetting(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllSaveProgram: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllSaveProgram(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllViewSpecifications: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllViewSpecifications(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllInkReplace: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllInkReplace(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllErrorMessage: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllErrorMessage(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllTechnicianFeedback: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllTechnicianFeedback(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllCustomerFeedback: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getAllCustomerFeedback(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllSamplePrintingMethodName: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllSamplePrintingMethodName()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllSamplePrintingInformationFrom: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllSamplePrintingInformationFrom()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllRepairAResolutionState: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllRepairAResolutionState()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getMachineByWorkOrderId: async (req, res, next) => {
        try {
            const result = await workOrderDetailService.getMachineByWorkOrderId(
                req.params.workOrderId,
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            throw error
        }
    },
    getAllIncludeAccessories: async (req, res, next) => {
        try {
            const result =
                await workOrderDetailService.getAllIncludeAccessories(req.query)
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllSyncSignal: (req, res, next) => {
        try {
            const result = workOrderDetailService.getAllSyncSignal()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllSyncMode: (req, res, next) => {
        try {
            const result = workOrderDetailService.getAllSyncMode()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    getAllPurposeTest: (req, res, next) => {
        try {
            const result = workOrderDetailService.getAllPurposeTest()
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    generatePdf: async (req, res, next) => {
        try {
            const { workOrderId } = req.params
            const { pdfBuffer, typeWorkLabel } =
                await workOrderDetailService.generatePdf(workOrderId)

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=phieu_${typeWorkLabel}.pdf`,
            )
            res.send(pdfBuffer)
        } catch (err) {
            next(err)
        }
    },

}
module.exports = workOrderDetailController

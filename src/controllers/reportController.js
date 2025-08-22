const reportService = require('../services/reportService')
const response = require('../utils/response/response')
const excelService = require('../services/excelService')
const pdfService = require('../services/pdfService')

const reportController = {
    getSalesReport: async (req, res, next) => {
        try {
            const { startDate, endDate, customerId, page, limit } = req.query

            const data = await reportService.getSalesReport(
                startDate,
                endDate,
                customerId,
                page,
                limit,
            )
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getDebtComparisonSummary: async (req, res, next) => {
        try {
            const data = await reportService.getDebtComparisonSummary(req.query)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },

    getDebtComparisonDetail: async (req, res, next) => {
        try {
            const data = await reportService.getDebtComparisonDetail(req.query)
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
    generateSalesDetailReport: async (req, res, next) => {
        try {
            const { fromDate, toDate, customerId } = req.query

            const data = await reportService.generateSalesDetailReport(
                fromDate,
                toDate,
                customerId,
            )

            const buffer = await excelService.createSalesDetailExcel(data)
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            )
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=So-chi-tiet-ban-hang.xlsx',
            )
            res.send(buffer)
        } catch (err) {
            console.error('Lỗi trong generateSalesDetailReport:', err)
            next(err)
        }
    },

    fileDebtReconciliation: async (req, res, next) => {
        try {
            const { startDate, endDate, customerId } = req.body
            const data = await reportService.fileDebtReconciliation(
                startDate,
                endDate,
                customerId,
            )
            const pdfBuffer = await pdfService.debtReconciliationForm(data)

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="Doi-chieu-cong-no".pdf',
            )
            res.send(pdfBuffer)
        } catch (err) {
            next(err)
        }
    },
}

module.exports = reportController

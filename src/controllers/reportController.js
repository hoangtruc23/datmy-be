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
            const { startDate, endDate, customerId } = req.query

            const data = await reportService.generateSalesDetailReport(
                startDate,
                endDate,
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
    getDebtConfigDetailByInvoice: async (req, res, next) => {
        try {
            const result = await reportService.getDebtConfigDetailByInvoice(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    generateDebtConfigDetailByInvoice: async (req, res, next) => {
        try {
            const data = await reportService.getDebtConfigDetailByInvoice(
                req.query,
                false,
            )
            const buffer =
                await excelService.createDebtConfigDetailByInvoiceExcel(data)
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            )
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=Bao-cao-chi-tiet-cong-no-phai-thu-theo-hoa-don.xlsx',
            )
            res.send(buffer)
        } catch (error) {
            next(error)
        }
    },
    getCustomerReceivableDetail: async (req, res, next) => {
        try {
            const result = await reportService.getCustomerReceivableDetail(
                req.query,
            )
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    },
    generateCustomerReceivableDetail: async (req, res, next) => {
        try {
            const data = await reportService.getCustomerReceivableDetail(
                req.query,
                false,
            )
            const buffer =
                await excelService.createCustomerReceivableDetailExcel(data)
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            )
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=Bao-cao-chi-tiet-cong-no-phai-thu-cua-khach-hang.xlsx',
            )
            res.send(buffer)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = reportController

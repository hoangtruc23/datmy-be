const debtService = require('../services/debtService')
const response = require('../utils/response/response')
const pdfService = require('../services/pdfService')
const excelService = require('../services/excelService')
const debtController = {
    getAll: async (req, res, next) => {
        try {
            const { page, limit, search, debtStatus } = req.query
            const data = await debtService.getAll(
                page,
                limit,
                search,
                debtStatus,
            )
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
    getSummary: async (req, res, next) => {
        try {
            const data = await debtService.getSummary()
            return res.status(200).json(response.success(data))
        } catch (err) {
            next(err)
        }
    },
    generateReport: async (req, res, next) => {
        try {
            const { startDate, endDate, customerId } = req.body
            const data = await debtService.generateReport(
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
    generatePaymentRequest: async (req, res, next) => {
        try {
            const { customerId, invoiceId, accountName } = req.body
            const data = await debtService.generatePaymentRequest(
                customerId,
                invoiceId,
                accountName,
            )
            const pdfBuffer = await pdfService.paymentRequestForm(data)

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="De-nghi-thanh-toan".pdf',
            )
            res.send(pdfBuffer)
        } catch (err) {
            next(err)
        }
    },

    generateSalesDetailReport: async (req, res, next) => {
        try {
            const { fromDate, toDate, customerId } = req.query;

            const data = await debtService.generateSalesDetailReport(fromDate, toDate, customerId);


            const buffer = await excelService.createSalesDetailExcel(data);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=So-chi-tiet-ban-hang.xlsx');
            res.send(buffer);


        } catch (err) {
            console.error('Lỗi trong generateSalesDetailReport:', err);
            next(err);
        }
    },

}

module.exports = debtController

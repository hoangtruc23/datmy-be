const dashBoardService = require('../services/dashBoardService')
const response = require('../utils/response/response')

const dashBoardController = {
    getSumaryDashBoard: async (req, res, next) => {
        try {
            const summary = await dashBoardService.getSumaryDashBoard()

            return res.status(200).json(
                response.success({
                    monthRevenue: summary.monthRevenue,
                    monthTotalInvoiceAmount: summary.monthTotalInvoiceAmount,
                    monthTotalDept: summary.monthTotalDept,
                    allActiveCustomers: summary.allActiveCustomers,
                    invoiceCount: summary.invoiceCount,
                    startDate: summary.startDate,
                    endDate: summary.endDate,
                }),
            )
        } catch (err) {
            next(err)
        }
    },
    getTopCustomersDebt: async (req, res, next) => {
        try {
            const result = await dashBoardService.getTopCustomersDebt()

            return res.status(200).json(
                response.success({
                    result,
                }),
            )
        } catch (err) {
            next(err)
        }
    },
    getRevenueMonthly: async (req, res, next) => {
        try {
            const year = req.query.year
                ? parseInt(req.query.year, 10)
                : new Date().getFullYear()
            const result = await dashBoardService.getRevenueMonthly(year)
            return res.status(200).json(
                response.success({
                    monthRevenue: result,
                }),
            )
        } catch (err) {
            next(err)
        }
    },
    getRecentInvoices: async (req, res, next) => {
        try {
            const result = await dashBoardService.getRecentInvoices()

            return res.status(200).json(
                response.success({
                    result,
                }),
            )
        } catch (err) {
            next(err)
        }
    },

    getTopCustomerRevenue: async (req, res, next) => {
        try {
            const result = await dashBoardService.getTopCustomerRevenue(req.query)
            return res.status(200).json(
                response.success({
                    result,
                }),
            )
        } catch (err) {
            next(err)
        }
    },

    getBestSellingItems: async (req, res, next) => {
        try {
            const result = await dashBoardService.getBestSellingItems(req.query)

            return res.status(200).json(
                response.success({
                    result,
                }),
            )
        } catch (err) {
            next(err)
        }
    },
}
module.exports = dashBoardController

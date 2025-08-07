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
                    activeCustomerCount: summary.activeCustomerCount,
                    invoiceCount: summary.invoiceCount,
                    startDate: summary.startDate,
                    endDate: summary.endDate,
                }),
            )
        } catch (err) {
            next(err)
        }
    },
}
module.exports = dashBoardController

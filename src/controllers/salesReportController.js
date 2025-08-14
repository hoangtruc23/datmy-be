const salesReportService = require('../services/salesReportService');
const response = require('../utils/response/response');
const pick = require('../utils/helper/pick');

const salesReportController = {
    getSalesReport: async (req, res, next) => {
        try {
            const filters = pick(req.query, ['startDate', 'endDate', 'productId', 'page', 'limit']);
            const data = await salesReportService.getSalesReport(filters); 
            return res.status(200).json(response.success(data));
        } catch (err) {
            next(err);
        }
    }
};

module.exports = salesReportController;
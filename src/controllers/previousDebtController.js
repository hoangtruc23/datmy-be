const previousDebtService = require('../services/previousDebtService')
const response = require('../utils/response/response')

const previousDebtController = {
    importFile: async (req, res, next) => {
        try {
            const data = {
                preMonth: req.body.preMonth,
                file: req.file.buffer //buffer
            };

            const result = await previousDebtService.importFile(data)
            if (result.success === false) {
                // Thiết lập Header để trình duyệt hiểu đây là file Excel
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=' + `Error_Report_Import.xlsx`);
                return res.send(result.errorFile)
            }
            return res.status(200).json(response.success(result))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = previousDebtController
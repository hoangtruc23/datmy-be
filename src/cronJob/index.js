const DeleteTemporaryGoodsJob = require('./deleteTemporaryGoodsJob')
const SendOverdueDebtReminder = require('./sendOverdueDebtReminder')

DeleteTemporaryGoodsJob.start()
SendOverdueDebtReminder.start()

module.exports = {
    DeleteTemporaryGoodsJob,
    SendOverdueDebtReminder,
}

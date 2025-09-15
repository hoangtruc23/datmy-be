const { CronJob } = require('cron')
const debtService = require('../services/debtService')
const CustomerModel = require('../models/customer')
const mailService = require('../services/mailService')
const { formatDate } = require('../utils/helper/excelReportHelper')

const sendOverdueDebtReminder = async () => {
    try {
        const numOfCus = await CustomerModel.countDocuments()

        const cus = await debtService.getAll(1, numOfCus, '', '')
        const mailCus = cus.items.filter(
            (item) =>
                item.debtStatus === 'overdue' ||
                item.debtStatus === 'badDebtCus' ||
                (item.debtStatus === 'normal' &&
                    item.limitOverdue - item.maxDebtDays <= 5),
        )

        const subject = `Danh sách công nợ theo ngày ${formatDate(new Date())}`
        const html = `
        <p>Quản trị viên xin gửi danh sách khách hàng hiện đang còn nợ để phòng đòi nợ theo dõi và xử lý. Chi tiết như sau:</p>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th>Tên khách hàng</th>
                    <th>Tổng số tiền nợ</th>
                    <th>Số ngày nợ</th>
                    <th>Hạn nợ</th>
                </tr>
            </thead>
            <tbody>
                ${mailCus
                    .map(
                        (item) =>
                            `<tr>
                        <td>${item.customerName}</td>
                        <td>${Number(item.totalDebt).toLocaleString('vi-VN').replace(/\./g, ' ')}</td>
                        <td>${item.maxDebtDays}</td>
                        <td>${item.limitOverdue}</td>
                    </tr>`,
                    )
                    .join('')}
            </tbody>
        </table>
        `
        const mail = { subject, html }

        await mailService.sendMail(mail)
    } catch (error) {
        console.error('[CRON] Cleanup failed:', error)
    }
}
const SendOverdueDebtReminder = new CronJob(
    '0 37 10 * * *',
    sendOverdueDebtReminder,
    null,
    'Asia/Ho_Chi_Minh',
)

module.exports = SendOverdueDebtReminder

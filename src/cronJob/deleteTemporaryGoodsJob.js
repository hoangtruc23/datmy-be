const { CronJob } = require('cron')

const GoodsAdvanceModel = require('../models/goodsAdvance')
const GoodsAdvanceDetailModel = require('../models/goodsAdvanceDetail')
const GoodsAdvanceProcessModel = require('../models/goodsAdvanceProcess')

const GoodsReceiptModel = require('../models/goodsReceipt')
const GoodsReceiptDetailModel = require('../models/goodsReceiptDetail')
const GoodsReceiptApprovalModel = require('../models/goodsReceiptApproval')

const GoodsIssueModel = require('../models/goodsIssue')
const GoodsIssueDetailModel = require('../models/goodsIssueDetail')
const GoodsIssueApprovalModel = require('../models/goodsIssueApproval')

const deleteTemporaryGoods = async () => {
    try {
        const tempAdvances = await GoodsAdvanceModel.find({ isTemporary: true })
        const tempAdvanceIds = tempAdvances.map((doc) => doc._id)
        await GoodsAdvanceModel.deleteMany({ _id: { $in: tempAdvanceIds } })
        await GoodsAdvanceDetailModel.deleteMany({
            goodsAdvanceId: { $in: tempAdvanceIds },
        })
        await GoodsAdvanceProcessModel.deleteMany({
            goodsAdvanceId: { $in: tempAdvanceIds },
        })

        const tempReceipts = await GoodsReceiptModel.find({ isTemporary: true })
        const tempReceiptIds = tempReceipts.map((doc) => doc._id)
        await GoodsReceiptModel.deleteMany({ _id: { $in: tempReceiptIds } })
        await GoodsReceiptDetailModel.deleteMany({
            goodsReceiptId: { $in: tempReceiptIds },
        })
        await GoodsReceiptApprovalModel.deleteMany({
            goodsReceiptId: { $in: tempReceiptIds },
        })

        const tempIssues = await GoodsIssueModel.find({ isTemporary: true })
        const tempIssueIds = tempIssues.map((doc) => doc._id)
        await GoodsIssueModel.deleteMany({ _id: { $in: tempIssueIds } })
        await GoodsIssueDetailModel.deleteMany({
            goodsIssueId: { $in: tempIssueIds },
        })
        await GoodsIssueApprovalModel.deleteMany({
            goodsIssueId: { $in: tempIssueIds },
        })

        //console.log('[CRON] Cleanup complete.');
    } catch (err) {
        console.error('[CRON] Cleanup failed:', err)
    }
}

const DeleteTemporaryGoodsJob = new CronJob(
    '0 0 0 * * *',
    deleteTemporaryGoods,
    null,
    'Asia/Ho_Chi_Minh',
)

module.exports = DeleteTemporaryGoodsJob

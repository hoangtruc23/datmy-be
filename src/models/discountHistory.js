const { model, Schema, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const discountHistorySchema = new Schema({
    discountRequestId: {
        type: Types.ObjectId,
        required: true,
        ref: 'discountrequests',
    },
    invoiceId: {
        type: Types.ObjectId,
        required: true,
        ref: 'invoices',
    },
    refundStatus: {
        type: String,
        enum: Object.values(constant.REFUND_STATUS),
    },
})

const DiscountHistoryModel = model('discounthistory', discountHistorySchema)
module.exports = DiscountHistoryModel

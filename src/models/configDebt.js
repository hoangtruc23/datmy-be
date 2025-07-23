const { Schema, model, Types } = require('mongoose')

const debtSchema = new Schema(
    {
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
        },
        customerName: { type: String, required: true, trim: true },
        //giới hạn tiền cho nợ
        limitDebt: { type: Number, required: true },
        //hạn trả tiền
        limitDue: { type: Number, default: 30 },
        //hạn cho phép nợ
        limitOverdue: { type: Number, default: 7 },
        //limitRemindDay ngày trước khi hết hạn trả tiền, dùng để nhắc nợ
        limitRemindDay: { type: Number, required: true },
        notes: { type: String },
    },
    { timestamps: true },
)

const ConfigDebtModel = model('configdebt', debtSchema)
module.exports = ConfigDebtModel

const { Schema, model, Types } = require('mongoose')

const debtSchema = new Schema(
    {
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
        },
        customerName: { type: String, required: true, trim: true },
        limitDebt: { type: Number, required: true },
        limitDue: { type: Number, default: 30 },
        //giới hạn ngày nhắc nợ, giới hạn số ngày cho phép quá hạn
        limitOverdue: { type: Number, default: 7 },
        //số ngày trước thời limitDue để nhân viên nhắc nợ
        limitRemindDay: { type: Number, required: true },
        notes: { type: String },
    },
    { timestamps: true },
)

const DebtTaskModel = model('debt', debtSchema)
module.exports = DebtTaskModel

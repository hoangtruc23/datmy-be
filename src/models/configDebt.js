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
        limitRemindDay: { type: Number, required: true },
        notes: { type: String },
    },
    { timestamps: true },
)

const DebtTaskModel = model('debt', debtSchema)
module.exports = DebtTaskModel

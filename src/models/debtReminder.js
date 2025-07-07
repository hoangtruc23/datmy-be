const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')
const { required } = require('joi')

const contactPersonSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
)
const debtReminderSchema = new Schema(
    {
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
        },

        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        remindDate: { type: Date, required: true },
        method: {
            type: String,
            enum: Object.values(constant.DEBT_REMINDER_METHOD),
            required: true,
            default: constant.DEBT_REMINDER_METHOD.NULL,
        },
        assignedTo: contactPersonSchema,
        status: {
            type: String,
            enum: Object.values(constant.DEBT_REMINDER_STATUS),
            default: constant.DEBT_REMINDER_STATUS.NULL,
        },
        notes: { type: String },
    },
    { timestamps: true },
)

const DebtReminderModel = model('debt_reminders', debtReminderSchema)
module.exports = DebtReminderModel

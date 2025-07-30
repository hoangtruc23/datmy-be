const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const contactPersonSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
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
        // remindDate: -> dueDate
        dueDate: { type: Date, required: true },
        method: {
            type: String,
            enum: Object.values(constant.DEBT_REMINDER_METHOD),
            required: true,
            default: constant.DEBT_REMINDER_METHOD.NULL,
        },

        tryCount: { type: Number, default: 1 },
        assignedTo: contactPersonSchema,
        priority: {
            type: String,
            enum: Object.values(constant.DEBT_REMINDER_PRIORITY),
            default: constant.DEBT_REMINDER_PRIORITY.MEDIUM,
        },
        status: {
            type: String,
            enum: Object.values(constant.DEBT_REMINDER_STATUS),
            default: constant.DEBT_REMINDER_STATUS.NULL,
        },

        // result of the reminder
        result: {
            type: String,
            enum: Object.values(constant.DEBT_RESULT),
            default: constant.DEBT_RESULT.NULL,
        },
        contactDate: {
            type: Date,
            default: () => null,
        },
        followUpDate: {
            type: Date,
            default: () => null,
        },
        timeContact: {
            type: String,
            default: 'null',
        },
        notes: {
            type: String,
            default: 'null',
        },
    },
    { timestamps: true },
)

const DebtReminderModel = model('debtreminders', debtReminderSchema)
module.exports = DebtReminderModel

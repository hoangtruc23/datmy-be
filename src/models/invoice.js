const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

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
const invoiceSchema = new Schema(
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
        invoiceCode: {
            type: String,
            required: true,
            unique: true,
        },
        totalAmount: { type: Number, required: true },
        //đã có từ timeStamp
        //exportDate: { type: Date, required: true },
        //Cộng từ createdAt và  limitDue trong confgiDebt
        dueDate: { type: Date },
        isFullyPaid: { type: Boolean, default: false },
        //người đặt hàng
        orderBy: contactPersonSchema,
        //kế toán
        accountant: contactPersonSchema,
        status: {
            type: String,
            enum: Object.values(constant.INVOICE_STATUS),
            default: constant.INVOICE_STATUS.NULL,
        },
        //nguời nhắc
        reminderContact: contactPersonSchema,

        notes: { type: String },
    },
    { timestamps: true },
)

const InvoiceModel = model('invoices', invoiceSchema)
module.exports = InvoiceModel

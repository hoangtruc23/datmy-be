const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const contactPersonSchema = new Schema(
    {
        name: {
            type: String,
            // required: true,
            trim: true,
        },
        phone: {
            type: String,
            // required: true,
            trim: true,
        },
    },
    { _id: false },
)

const invoiceDetail = new Schema(
    {
        productId: {
            type: Types.ObjectId,
            ref: 'products',
            //required: true,
        },
        // tên sản phẩm
        name: {
            type: String,
        },
        // mã sản phẩm
        code: {
            type: String,
        },
        unit: {
            type: String,
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        VATRateProduct: {
            type: Number,
            default: 10,
        },
        notVATtotalAmountProduct: {
            type: Number,
            required: true,
        },
        VATAmountProduct: {
            type: Number,
            required: true,
        },
        totalAmountProduct: {
            type: Number,
            required: true,
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
        invoiceLink: {
            type: String,
        },
        invoiceCode: {
            type: String,
            required: true,
            unique: true,
        },
        notVATtotalAmount: { type: Number, required: true },
        VATAmount: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        invoiceDate: { type: Date },
        //Cộng từ createdAt và  limitDue trong configDebt
        dueDate: { type: Date },
        limitDue: { type: Number, default: 0 },
        isFullyPaid: { type: Boolean, default: false },
        //người đặt hàng
        orderBy: contactPersonSchema,
        //kế toán
        accountant: contactPersonSchema,
        paymentBy: {
            type: String,
            enum: Object.values(constant.CONDITION_PAYMENT),
            default: constant.CONDITION_PAYMENT.TRANSFER,
        },
        //nguời nhắc
        reminderContact: contactPersonSchema,
        invoiceDetails: [invoiceDetail],
        notes: { type: String },
    },
    { timestamps: true },
)
const InvoiceModel = model('invoices', invoiceSchema)
InvoiceModel.createIndexes({ totalAmount: 1, dueDate: 1 })

module.exports = InvoiceModel

const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const discountRequestSchema = new Schema(
    {
        invoice: {
            type: Types.ObjectId,
            ref: 'invoices',
            required: true,
        },
        requestDate: { type: Date, required: true },
        type: {
            type: String,
            enum: Object.values(constant.DISCOUNT_TYPE),
            required: true,
        },
        value: { type: Number, required: true, min: 0 },
        // tính toán từ value và type
        discountAmount: { type: Number },
        content: { type: String },
        status: {
            type: String,
            enum: Object.values(constant.APPROVAL_STATUS),
            default: constant.APPROVAL_STATUS.NULL,
        },
    },
    { timestamps: true },
)

const DiscountRequestModel = model('discount_requests', discountRequestSchema)
module.exports = DiscountRequestModel

const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const discountSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        requestDate: {
            type: Date,
            required: true,
        },
    },
    { _id: false },
)

const discountRequestSchema = new Schema(
    {
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
        },
        productId: {
            type: Types.ObjectId,
            ref: 'products',
        },
        discounts: [discountSchema],
        refundStatus: {
            type: String,
            enum: Object.values(constant.REFUND_STATUS),
            default: constant.REFUND_STATUS.UNPAID,
        },
        content: {
            type: String,
        },
        isEffect: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
)

const DiscountRequestModel = model('discount_requests', discountRequestSchema)
module.exports = DiscountRequestModel

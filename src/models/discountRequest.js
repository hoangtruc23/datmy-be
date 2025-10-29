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

const DiscountRequestModel = model('discountrequests', discountRequestSchema)
module.exports = DiscountRequestModel

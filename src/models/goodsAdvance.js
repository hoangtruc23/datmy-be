const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const goodsAdvanceSchema = new Schema(
    {
        advanceNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
        },
        advanceRequester: {
            type: String,
        },
        advanceBy: {
            type: String,
        },
        expectedReturnDate: {
            type: Date,
        },
        returnDate: {
            type: Date,
        },
        customer: {
            type: String,
        },
        borrowContent: {
            type: String,
        },
        deliveryAddresses: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(constant.GOODS_STATUS),
        },
        isTemporary: {
            type: Boolean,
            default: true,
            required: true,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'users',
            required: true,
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    { timestamps: true },
)

const GoodsAdvanceModel = model('goodsAdvances', goodsAdvanceSchema)

module.exports = GoodsAdvanceModel

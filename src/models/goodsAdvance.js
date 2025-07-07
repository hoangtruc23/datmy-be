const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose
const constant = require('../utils/constant/constant')
const autoIncrement = require('mongoose-sequence')(mongoose)

const goodsAdvanceSchema = new Schema(
    {
        advanceNumber: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            // required: true,
        },
        borrower: {
            type: String,
        },
        returner: {
            type: String,
        },
        // advanceBy: {
        //     type: String,
        // },
        expectedReturnDate: {
            type: Date,
        },
        extendedReturnDate: {
            type: Date,
        },
        returnDate: {
            type: Date,
        },
        borrowContent: {
            type: String,
        },
        customer: {
            type: String,
        },
        deliveryAddresses: {
            type: String,
        },
        status: {
            type: String,
            // required: true,
            enum: Object.values(constant.GOODS_ADVANCE_STATUS),
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
            default: null,
        },
    },
    { timestamps: true },
)

goodsAdvanceSchema.plugin(autoIncrement, {
    inc_field: 'advanceNumber',
    id: 'advanceNumber',
})
const GoodsAdvanceModel = model('goodsAdvances', goodsAdvanceSchema)

module.exports = GoodsAdvanceModel

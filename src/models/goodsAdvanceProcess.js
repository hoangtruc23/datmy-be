const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const goodsAdvanceProcessSchema = new Schema(
    {
        goodsAdvanceId: {
            type: Types.ObjectId,
            ref: 'goodsAdvances',
            required: true,
        },
        title: {
            type: String,
            enum: Object.values(constant.GOODS_ADVANCE_PROCESS_TITLE),
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'users',
        },
        status: {
            type: Boolean,
        },
        note: {
            type: String,
        },
    },
    { timestamps: true },
)

const GoodsAdvanceProcessModel = model(
    'goodsAdvancePrcesses',
    goodsAdvanceProcessSchema,
)

module.exports = GoodsAdvanceProcessModel

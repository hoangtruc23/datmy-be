const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const storagesSchema = new Schema({
    trackingCode: {
        type: String,
    },
    quantity: {
        type: Number,
        min: 1,
    },
})

const goodsAdvanceDetailSchema = new Schema({
    goodsAdvanceId: {
        type: Types.ObjectId,
        ref: 'goodsAdvances',
        required: true,
    },
    productId: {
        type: Types.ObjectId,
        ref: 'products',
    },
    warehouseId: {
        type: Types.ObjectId,
        ref: 'warehouses',
        required: true,
    },
    productCode: {
        type: String,
    },
    productName: {
        type: String,
    },
    managementType: {
        type: String,
        enum: Object.values(constant.PRODUCT_MANAGEMENT_TYPE),
    },
    unit: {
        type: String,
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
    },
    productStatus: {
        type: String,
    },
    usageContent: {
        type: String,
        required: true,
    },
    warehouseName: {
        type: String,
    },
    storages: [storagesSchema],
    note: {
        type: String,
    },
    isTemporary: {
        type: Boolean,
        default: true,
        required: true,
    },
})

const GoodsAdvanceDetaileModel = model(
    'goodsAdvanceDetails',
    goodsAdvanceDetailSchema,
)

module.exports = GoodsAdvanceDetaileModel

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
    usageContent: {
        type: String,
        required: true,
    },
    borrowWarehouseId: {
        type: Types.ObjectId,
        ref: 'warehouses',
        required: true,
    },
    returnWarehouseId: {
        type: Types.ObjectId,
        ref: 'warehouses',
        required: true,
    },
    borrowedQuantity: {
        type: Number,
        min: 1,
        required: true,
    },
    returnedQuantity: {
        type: Number,
        min: 1,
        required: true,
    },
    borrowStatus: {
        type: String,
    },
    returnStatus: {
        type: String,
    },
    borrowWarehouseName: {
        type: String,
    },
    returnWarehouseName: {
        type: String,
    },
    borrowStorages: [storagesSchema],
    returnStorages: [storagesSchema],
    note: {
        type: String,
    },
    lostReason: {
        type: String,
    },
    lostStorages: [storagesSchema],
    purchaseReason: {
        type: String,
    },
    purchaseStorages: [storagesSchema],
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

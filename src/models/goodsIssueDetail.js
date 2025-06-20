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

const goodsIssueDetailSchema = new Schema({
    goodsIssueId: {
        type: Types.ObjectId,
        ref: 'goodsIssues',
        required: true,
    },
    productId: {
        type: Types.ObjectId,
        ref: 'products',
        required: true,
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
        required: true,
        enum: Object.values(constant.PRODUCT_MANAGEMENT_TYPE),
    },
    unit: {
        type: String,
    },
    origin: {
        type: String,
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    totalAmount: {
        type: Number,
        min: 0,
        required: true,
    },
    warehouseName: {
        type: String,
    },
    storages: [storagesSchema],
    note: {
        type: String,
    },
})

const GoodsIssueDetaileModel = model(
    'goodsIssueDetails',
    goodsIssueDetailSchema,
)

module.exports = GoodsIssueDetaileModel

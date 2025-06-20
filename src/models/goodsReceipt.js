const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const goodsReceiptSchema = new Schema(
    {
        receiptNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
        },
        invoiceFile: {
            type: String,
        },
        invoiceOrContractNumber: {
            type: String,
        },
        estimatedDeliveryDate: {
            type: Date,
        },
        warehouseId: {
            type: Types.ObjectId,
            ref: 'warehouses',
            required: true,
        },
        provider: {
            type: String,
        },
        billingAddress: {
            type: String,
            required: true,
        },
        deliveryAddresses: {
            type: String,
        },
        note: {
            type: String,
        },
        isTemporary: {
            type: Boolean,
            required: true,
            default: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(constant.GOODS_RECEIPT_STATUS),
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

const GoodsReceiptModel = model('goodsReceipts', goodsReceiptSchema)

module.exports = GoodsReceiptModel

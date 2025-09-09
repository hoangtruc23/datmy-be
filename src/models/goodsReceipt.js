const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose
const constant = require('../utils/constant/constant')
const autoIncrement = require('mongoose-sequence')(mongoose)

const goodsReceiptSchema = new Schema(
    {
        receiptNumber: {
            type: Number,
            unique: true,
        },
        supplierId: {
            type: Types.ObjectId,
            ref: 'suppliers',
            // required: true,
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
        // warehouseId: {
        //     type: Types.ObjectId,
        //     ref: 'warehouses',
        //     // required: true,
        // },
        supplier: {
            type: String,
        },
        billingAddress: {
            type: String,
            // required: true,
        },
        deliveryAddresses: {
            type: String,
        },
        note: {
            type: String,
        },
        isTemporary: {
            type: Boolean,
            default: true,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(constant.GOODS_RECEIPT_STATUS),
            // required: true,
            default: constant.GOODS_RECEIPT_STATUS.NULL,
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
        createdAt: { type: Date },
    },
    // { timestamps: true },
)

goodsReceiptSchema.plugin(autoIncrement, {
    inc_field: 'receiptNumber',
    id: 'receiptNumber',
})

const GoodsReceiptModel = model('goodsReceipts', goodsReceiptSchema)

module.exports = GoodsReceiptModel

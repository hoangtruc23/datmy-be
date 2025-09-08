const mongoose = require('mongoose')
const { Schema, model, Types } = mongoose
const constant = require('../utils/constant/constant')
const autoIncrement = require('mongoose-sequence')(mongoose)

const contactPersonSchema = new Schema({
    _id: false,
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
})

const goodsIssueSchema = new Schema(
    {
        issueNumber: {
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
        invoiceFile: {
            type: String,
        },
        invoiceNumber: {
            type: String,
        },
        invoiceOrContractNumber: {
            type: String,
        },
        estimatedDeliveryDate: {
            type: Date,
        },
        customer: {
            type: String,
        },
        goodsissueDate: { type: Date },
        billingAddress: {
            type: String,
            // required: true,
        },
        deliveryAddresses: {
            type: String,
        },
        garageAddress: {
            type: String,
        },
        orderedBy: contactPersonSchema, // người đặt hàng là người liên hệ bán hàng trong khách hàng
        recipient: contactPersonSchema, // người nhận hàng là người liên hệ kho trong khách hàng
        note: {
            type: String,
        },
        isDraft: {
            type: Boolean,
            required: true,
            default: true,
        },
        isTemporary: {
            type: Boolean,
            default: true,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(constant.GOODS_ISSUE_STATUS),
            default: constant.GOODS_ISSUE_STATUS.NULL,
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

goodsIssueSchema.plugin(autoIncrement, {
    inc_field: 'issueNumber',
    id: 'issueNumber',
})

const GoodsIssueModel = model('goodsIssues', goodsIssueSchema)

module.exports = GoodsIssueModel

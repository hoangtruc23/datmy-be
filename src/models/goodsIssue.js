const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

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
        },
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
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
        // warehouseId: {
        //     type: Types.ObjectId,
        //     ref: 'warehouses',
        //     required: true,
        // },
        customer: {
            type: String,
        },
        billingAddress: {
            type: String,
            required: true,
        },
        deliveryAddresses: {
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
            required: true,
            enum: Object.values(constant.GOODS_ISSUE_STATUS),
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

const GoodsIssueModel = model('goodsIssues', goodsIssueSchema)

module.exports = GoodsIssueModel

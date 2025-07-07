const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const approvalContent = new Schema({
    _id: false,
    approvedBy: {
        type: String,
    },
    approvedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: Object.values(constant.APPROVAL_STATUS),
        default: constant.APPROVAL_STATUS.NULL,
    },
    content: {
        type: String,
    },
})

const goodsReceiptApprovalSchema = new Schema(
    {
        goodsReceiptId: {
            type: Types.ObjectId,
            ref: 'goodsReceipts',
            required: true,
        },
        createdBy: approvalContent,
        warehouseStaffApproval: approvalContent,
        nextApprovalRoleId: {
            type: String,
            default: constant.ROLES.warehouseStaff,
        },
    },
    { timestamps: true },
)

const GoodsReceiptApprovalModel = model(
    'goodsReceiptApprovals',
    goodsReceiptApprovalSchema,
)

module.exports = GoodsReceiptApprovalModel

const { Schema, model, Types } = require('mongoose')

const goodsIssueApprovalSchema = new Schema(
    {
        goodsIssueId: {
            type: Types.ObjectId,
            ref: 'goodsIssues',
            required: true,
        },
        warehouseStaffApproval: approvalContent,
        warehouseAccountantApproval: approvalContent,
        receivableAccountantApproval: approvalContent,
        invoiceAccountantApproval: approvalContent,
        nextApprovalRoleId: {
            type: String,
            default: 'Id role quản lý kho',
        },
    },
    { timestamps: true },
)

const approvalContent = new Schema({
    _id: false,
    approvedBy: {
        type: Types.ObjectId,
        ref: 'users',
    },
    approvedAt: {
        type: Date,
        default: Date.now,
    },
    note: {
        type: String,
    },
})

const GoodsIssueApprovalModel = model(
    'goodsIssueApprovals',
    goodsIssueApprovalSchema,
)

module.exports = GoodsIssueApprovalModel

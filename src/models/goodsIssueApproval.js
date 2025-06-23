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
    content: {
        type: String,
    },
})

const goodsIssueApprovalSchema = new Schema(
    {
        goodsIssueId: {
            type: Types.ObjectId,
            ref: 'goodsIssues',
            required: true,
        },
        warehouseStaffApproval: approvalContent,
        warehouseAccountantApproval: approvalContent,
        debtAccountantApproval: approvalContent,
        billAccountantApproval: approvalContent,
        nextApprovalRoleId: {
            type: String,
            default: constant.ROLES.warehouseStaff,
        },
    },
    { timestamps: true },
)

const GoodsIssueApprovalModel = model(
    'goodsIssueApprovals',
    goodsIssueApprovalSchema,
)

module.exports = GoodsIssueApprovalModel

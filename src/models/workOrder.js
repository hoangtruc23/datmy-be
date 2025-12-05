const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const contactPersonSchema = new Schema({
    _id: false,
    contactName: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
})

const workOrderSchema = new Schema(
    {
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
        },
        technicianId: {
            type: Types.ObjectId,
            ref: 'technicians',
        },
        code: {
            type: String,
            required: true,
        },
        typeWork: {
            type: String,
            enum: Object.values(constant.WORK_ORDER_TYPE).map((s) => s.value),
            default: constant.WORK_ORDER_TYPE.NULL.value,
        },
        type: {
            type: String,
            enum: Object.values(constant.WORK_ORDER_DETAIL_TYPE).map(
                (s) => s.value,
            ),
            default: constant.WORK_ORDER_DETAIL_TYPE.NULL.value,
        },
        requestSource: {
            type: String,
            enum: Object.values(constant.WORK_REQUEST_SOURCE).map(
                (s) => s.value,
            ),

            default: constant.WORK_REQUEST_SOURCE.WAREHOUSE.value,
        },
        header: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(constant.WORK_REQUEST_STATUS).map(
                (s) => s.value,
            ),
            default: constant.WORK_REQUEST_STATUS.PENDING.value,
        },
        priority: {
            type: String,
            required: true,
            enum: Object.values(constant.WORK_REQUEST_PRIORITY).map(
                (s) => s.value,
            ),
        },
        contactPerson: contactPersonSchema,
        address: {
            type: String,
            required: true,
        },
        assignedTime: {
            type: Date,
        },
        estimatedTime: {
            //hour
            type: Number,
            required: true,
        },
        overDueTime: {
            type: Date,
            required: true,
        },
        result: {
            type: String,
        },
        note: {
            type: String,
        },
    },
    { timestamps: true },
)

const WorkOrderModel = model('workOrders', workOrderSchema)
module.exports = WorkOrderModel

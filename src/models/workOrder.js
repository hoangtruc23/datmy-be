const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const contactPersonSchema = new Schema({
    _id: false,
    contactName: {
        type: String,
        required: false,
    },
    contactPhone: {
        type: String,
        required: false,
    },
    contactEmail: {
        type: String,
        required: false,
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
            required: false,
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
        requestSource: {
            type: String,
            // enum: Object.values(constant.WORK_REQUEST_SOURCE).map(
            //     (s) => s.value,
            // ),
            // default: constant.WORK_REQUEST_SOURCE.WAREHOUSE.value,
            required: false,
        },
        header: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
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
            required: false,
            // enum: Object.values(constant.WORK_REQUEST_PRIORITY).map(
            //     (s) => s.value,
            // ),
        },
        contactPerson: contactPersonSchema,
        // type: { //Loại máy
        //     type: String,
        //     enum: Object.values(constant.WORK_ORDER_DETAIL_TYPE).map(
        //         (s) => s.value,
        //     ),
        //     default: constant.WORK_ORDER_DETAIL_TYPE.NULL.value,
        // },
        type: { //Code của máy machine -> Ví dụ: A100
            type: String,
            required: false,
        },
        serialNumber: {
            type: String,
        },
        address: {
            provinceCity: {
                type: String,
                required: false,
            },
            ward: {
                type: String,
                required: false,
            },
            specificAddress: {
                type: String,
                required: false,
            }
        },
        assignedTime: {
            type: Date,
        },
        estimatedTime: { //hour
            type: Number,
            required: false,
        },
        overDueTime: {
            type: Date,
            required: false,
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

const { model, Types, Schema } = require('mongoose')
const constant = require('../utils/constant/constant')

const workOrderTestBaseSchema = new Schema(
    {
        testDate: {
            type: Date,
        },
        purposeTest: {
            type: String,
            enum: Object.values(constant.PURPOSE_TEST),
        },
        receiptDate: {
            type: Date,
        },
    },
    { _id: false },
)

const workOrderTestVSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    baseInfo: workOrderTestBaseSchema,
    machineType: {
        type: String,
    },
    ribbonType: {
        type: String,
    },
    machineSerialNumber: {
        type: String,
    },
    printHeadMeters: {
        type: String,
    },
    printerMode: {
        type: String,
    },
    softwareVersion: {
        type: String,
    },
    printHeadType: {
        type: Number,
    },
    printHeadResistance: {
        type: String,
    },
    contrast: {
        type: String,
    },
    printHeadTemperature: {
        type: String,
    },
    retractLimit: {
        type: Number,
    },
    printSpeed: {
        type: Number,
    },
    image: {
        type: String,
    },
})

const WorkOrderTestVModel = model('workOrderTestV', workOrderTestVSchema)
module.exports = WorkOrderTestVModel

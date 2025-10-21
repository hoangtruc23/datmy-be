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

const workOrderTestMSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    baseInfo: workOrderTestBaseSchema,
    machineType: {
        type: String,
    },
    machineSerialNumber: {
        type: String,
    },
    controllerSerialNumber: {
        type: String,
    },
    applicatorType: {
        type: String,
    },
    ribbonType: {
        type: String,
    },
    labelSize: {
        type: String,
    },
    padSize: {
        type: String,
    },
    printHeadType: {
        type: String,
    },
    printSpeed: {
        level: {
            type: String,
            enum: Object.values(constant.PRINT_SPEED_LEVEL),
        },
        speed: {
            type: Number,
        },
    },
    ACCfirwareVersion: {
        type: String,
    },
    ACCBootloaderVersion: {
        type: String,
    },
    otherFeatures: {
        type: [String],
    },
    image: {
        type: String,
    },
})

const WorkOrderTestMModel = model('workOrderTestM', workOrderTestMSchema)
module.exports = WorkOrderTestMModel

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

const workOrderTestDSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    baseInfo: workOrderTestBaseSchema,
    machineType: {
        type: String,
    },
    controllerSerialNumber: {
        type: String,
    },
    controllerTime: {
        type: Number,
    },
    laserHeadSerialNumber: {
        type: String,
    },
    laserTime: {
        type: Number,
    },
    laserPower: {
        type: String,
    },
    markSpeed: {
        type: String,
    },
    codingSpeed: {
        type: String,
    },
    maxVectorLength: {
        type: String,
    },
    software: {
        softwareType: {
            type: String,
        },
        version: {
            type: String,
        },
    },
    scanHeadType: {
        type: String,
    },
    focus: {
        type: String,
    },
    laserCoolingType: {
        type: String,
    },
    image: {
        type: String,
    },
})

const WorkOrderTestDModel = model('workOrderTestD', workOrderTestDSchema)
module.exports = WorkOrderTestDModel

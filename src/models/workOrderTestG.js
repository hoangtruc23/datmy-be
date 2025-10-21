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

const printHeadSchema = new Schema(
    {
        serialNumber: {
            type: String,
        },
        leftImage: {
            type: String,
        },
        rightImage: {
            type: String,
        },
    },
    { _id: false },
)

const workOrderTestGSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    baseInfo: workOrderTestBaseSchema,
    machineType: {
        type: String,
    },
    inkType: {
        type: String,
    },
    controllerSerialNumber: {
        type: String,
    },
    printHeadType: {
        type: String,
    },
    singleHeadQuantity: {
        type: Number,
    },
    coupledHeadQuantity: {
        type: Number,
    },
    printHeads: [printHeadSchema],
})

const WorkOrderTestGModel = model('workOrderTestG', workOrderTestGSchema)
module.exports = WorkOrderTestGModel

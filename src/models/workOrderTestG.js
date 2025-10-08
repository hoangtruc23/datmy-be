const { model, Types, Schema } = require('mongoose')
const constant = require('../utils/constant/constant')

const workOrderTestBaseSchema = new Schema({
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
})
const printHeadImageSchema = new Schema(
    {
        left: {
            type: String,
        },
        right: {
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
    printHeadQuantity: {
        type: Number,
    },
    printHeadType: {
        type: String,
    },
    printHeadSerialNumber: {
        type: [String],
    },
    singleHeadQuantity: {
        type: Number,
    },
    coupledHeadQuantity: {
        type: Number,
    },
    image: [printHeadImageSchema],
})

const WorkOrderTestGModel = model('workOrderTestG', workOrderTestGSchema)
module.exports = WorkOrderTestGModel

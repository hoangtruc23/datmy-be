const { model, Types, Schema } = require('mongoose')
const {
    workOrderAMachineSchema,
    workOrderASpecsSchema,
} = require('./workOrderA')

const workOrderTestASchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    testDate: {
        type: Date,
    },
    machineInfo: workOrderAMachineSchema,
    machineSpecs: workOrderASpecsSchema,
    injectionPipeLength: {
        type: Number,
    },
    pumpType: {
        type: String,
    },
    language: {
        type: String,
    },
    note: {
        type: String,
    },
})

const WorkOrderTestAModel = model('workOrderTestA', workOrderTestASchema)
module.exports = WorkOrderTestAModel

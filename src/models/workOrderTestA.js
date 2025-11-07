const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderTestASchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    testDate: {
        type: Date,
    },
    testerId: {
        type: Types.ObjectId,
        ref: 'technicians',
    },
    machineTypeId: {
        type: Types.ObjectId,
        ref: 'products',
    },
    language: {
        type: String,
    },
    props: [propSchema],
})

const WorkOrderTestAModel = model('workOrderTestA', workOrderTestASchema)
module.exports = WorkOrderTestAModel

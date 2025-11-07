const { model, Types, Schema } = require('mongoose')
const {propSchema} = require('./workOrderDetailHelp')

const workOrderRepairASchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    maintainContract: {
        type: Boolean,
    },
    repairDate: {
        type: Date,
    },
    arrivalTime: {
        type: String,
    },
    departureTime: {
        type: String,
    },
    machineTypeId: {
        type: Types.ObjectId,
        ref: 'products',
    },
    props: [propSchema],
})

const WorkOrderRepairAModel = model('workOrderRepairA', workOrderRepairASchema)
module.exports = WorkOrderRepairAModel

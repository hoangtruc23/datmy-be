const { Types, model, Schema } = require('mongoose')
const {propSchema} = require('./workOrderDetailHelp')

const workOrderRepairDSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    machineTypeId: {
        type: Types.ObjectId,
        ref: 'products',
    },
    props: [propSchema],
})

const WorkOrderRepairDModel = model('workOderRepairD', workOrderRepairDSchema)
module.exports = WorkOrderRepairDModel

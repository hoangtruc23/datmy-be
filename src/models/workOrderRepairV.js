const { Types, model, Schema } = require('mongoose')
const {propSchema} = require('./workOrderDetailHelp')

const workOrderRepairVSchema = new Schema({
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

const WorkOrderRepairVModel = model('workOderRepairV', workOrderRepairVSchema)
module.exports = WorkOrderRepairVModel

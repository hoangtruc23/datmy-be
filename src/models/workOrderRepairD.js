const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

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
    repairDFault: [
        {
            fault: {
                type: String,
                required: true,
            },
            resolution: {
                type: String,
                required: true,
            },
        },
    ],
    technicalFeedback: [String],
    customerFeedback: [String],
})

const WorkOrderRepairDModel = model('workOrderRepairD', workOrderRepairDSchema)
module.exports = WorkOrderRepairDModel

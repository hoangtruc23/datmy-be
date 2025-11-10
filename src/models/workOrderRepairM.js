const { Types, model, Schema } = require('mongoose')
const {propSchema} = require('./workOrderDetailHelp')

const workOrderRepairMSchema = new Schema({
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
    repairMFault: [
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

const WorkOrderRepairMModel = model('workOderRepairM', workOrderRepairMSchema)
module.exports = WorkOrderRepairMModel
